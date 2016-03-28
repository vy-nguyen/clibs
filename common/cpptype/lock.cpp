/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
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
#include <di/logger.h>
#include <cpptype/lock.h>

LOGGER_STATIC_DECL(s_log);

SpinLock::SpinLock()
{
    pthread_mutexattr_t attr;

    pthread_mutexattr_init(&attr);
    pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
    pthread_mutex_init(&spin_mtx, &attr);
}

SyncLock::SyncLock(int count) : sync_count(count), sync_notif(0), sync_cv(nullptr)
{
    pthread_mutexattr_t attr;

    pthread_mutexattr_init(&attr);
    pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
    pthread_mutex_init(&sync_lock, &attr);
}

/**
 * sync_wait
 * ---------
 */
void
SyncLock::sync_wait()
{
    pthread_cond_t cv = PTHREAD_COND_INITIALIZER;

    pthread_mutex_lock(&sync_lock);
    sync_cv = &cv;
    while (sync_count != sync_notif) {
        pthread_cond_wait(sync_cv, &sync_lock);
    }
    sync_cv    = nullptr;
    sync_notif = 0;
    pthread_mutex_unlock(&sync_lock);
}

/**
 * sync_done
 * ---------
 */
void
SyncLock::sync_done()
{
    pthread_mutex_lock(&sync_lock);
    sync_notif++;
    if (sync_count == sync_notif) {
        if (sync_cv != nullptr) {
            pthread_cond_signal(sync_cv);
        }
    }
    pthread_mutex_unlock(&sync_lock);
}

/**
 * sync_adjust_wait
 * ----------------
 * Must be called before sync_wait().
 */
void
SyncLock::sync_adjust_wait(int count)
{
    s_log.info("Adjust sync wait [%d, %d], new val %d", sync_count, sync_notif, count);

    pthread_mutex_lock(&sync_lock);
    assert(count >= sync_notif);
    sync_count = count;
    pthread_mutex_unlock(&sync_lock);
}
