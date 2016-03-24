/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
#include <sys/mman.h>
#include <limits.h>
#include <unistd.h>
#include <util/pagelock.h>

PageLock::ptr    PageLock::m_singleton = nullptr;
boost::once_flag PageLock::m_init_flag = BOOST_ONCE_INIT;

PageLock::PageLock()
{
#ifdef PAGESIZE
    pg_size = PAGESIZE;
#else
    pg_size = sysconf(_SC_PAGESIZE);
#endif
    assert(!(pg_size & (pg_size - 1)));
    pg_mask = ~(pg_size - 1);

    pthread_mutexattr_t attr;
    pthread_mutexattr_init(&attr);
    pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
    pthread_mutex_init(&pg_mtx, &attr);
    pthread_mutexattr_destroy(&attr);
}

/**
 * pg_lock_range
 * -------------
 */
bool
PageLock::pg_lock_range(const void *p, size_t size)
{
    if ((p == nullptr) || (size == 0)) {
        return false;
    }
    bool ret = true;
    uint64_t base  = reinterpret_cast<uint64_t>(p);
    uint64_t start = base & pg_mask;
    uint64_t endp  = (base + size - 1) & pg_mask;

    pthread_mutex_lock(&pg_mtx);
    for (uint64_t pg = start; pg <= endp; pg += pg_size) {
        adr_map_t::iterator it = pg_locked.find(pg);
        if (it == pg_locked.end()) {
            if (lock(pg, pg_size) == true) {
                pg_locked.insert(std::make_pair(pg, 1));
            } else {
                ret = false;
            }
        } else {
            /* Found the locked record, inc the ref counter. */
            it->second += 1;
        }
    }
    pthread_mutex_unlock(&pg_mtx);
    return ret;
}

/**
 * pg_unlock_range
 * ---------------
 */
void
PageLock::pg_unlock_range(const void *p, size_t size)
{
    if ((p == nullptr) || (size == 0)) {
        return;
    }
    uint64_t base  = reinterpret_cast<uint64_t>(p);
    uint64_t start = base & pg_mask;
    uint64_t endp  = (base + size - 1) & pg_mask;

    pthread_mutex_lock(&pg_mtx);
    for (uint64_t pg = start; pg <= endp; pg += pg_size) {
        adr_map_t::iterator it = pg_locked.find(pg);
        verify(it != pg_locked.end());
        if (it->second == 0) {
            /* Refcnt reaches 0, unlock it. */
            bool ret = unlock(pg, pg_size);
            verify(ret == 0);
            pg_locked.erase(it);
        }
    }
    pthread_mutex_unlock(&pg_mtx);
}

/**
 * lock
 * ----
 */
bool
PageLock::lock(uint64_t p, size_t size)
{
    return mlock(reinterpret_cast<void *>(p), size) == 0;
}

/**
 * unlock
 * ------
 */
bool
PageLock::unlock(uint64_t p, size_t size)
{
    return munlock(reinterpret_cast<void *>(p), size) == 0;
}
