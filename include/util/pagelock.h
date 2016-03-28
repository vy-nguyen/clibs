/*
 * Copyright (c) 2009-2010 Satoshi Nakamoto
 * Copyright (c) 2009-2013 The Bitcoin Core developers
 *
 * Adopt from Bitcoin lib.
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
#ifndef _UTIL_PAGELOCK_H_
#define _UTIL_PAGELOCK_H_

#include <stdlib.h>
#include <pthread.h>

#include <map>
#include <vector>
#include <string>
#include <util/singleton.h>
#include <cpptype/object.h>

class PageLock : public Object
{
  public:
    OBJECT_COMMON_DEFS(PageLock);

    bool pg_lock_range(const void *p, size_t size);
    void pg_unlock_range(const void *p, size_t size);

    inline int pg_get_lock_cnt()
    {
        int val;

        pthread_mutex_lock(&pg_mtx);
        val = pg_locked.size();
        pthread_mutex_unlock(&pg_mtx);
        return val;
    }

    template <typename T>
    static void lock_obj(const T &t)
    {
        PageLock::ptr mgr = PageLock::getInstance();
        mgr->pg_lock_range(static_cast<void *>(&t), sizeof(T));
    }

    template <typename T>
    static void unlock_obj(const T &t)
    {
        memset((void *)(&t), 0, sizeof(T));
        PageLock::ptr mgr = PageLock::getInstance();
        mgr->pg_unlock_range(static_cast<void *>(&t), sizeof(T));
    }

  protected:
    typedef std::map<uint64_t, int> adr_map_t;
    adr_map_t                pg_locked;
    size_t                   pg_size;
    size_t                   pg_mask;
    pthread_mutex_t          pg_mtx;

    explicit PageLock();

    virtual bool lock(uint64_t addr, size_t len);
    virtual bool unlock(uint64_t addr, size_t len);

    SINGLETON_DEF(PageLock);
};

/**
 * Custom allocator to lock down the memory from swapping out and clear its contents
 * before deletion.
 */
template <typename T>
struct LockPageAllocator : public std::allocator<T>
{
    typedef std::allocator<T> base;
    typedef typename base::size_type size_type;
    typedef typename base::difference_type difference_type;
    typedef typename base::pointer pointer;
    typedef typename base::const_pointer const_pointer;
    typedef typename base::reference reference;
    typedef typename base::const_reference const_reference;
    typedef typename base::value_type value_type;

    template <typename U>
    struct rebind {
        typedef LockPageAllocator<U> other;
    };

    ~LockPageAllocator() throw() {}
    LockPageAllocator() throw() {}
    LockPageAllocator(const LockPageAllocator &a) throw() : base(a) {}

    template <typename S>
    LockPageAllocator(const LockPageAllocator<S> &a) throw() : base(a) {}

    /**
     * allocate
     * --------
     */
    T *allocate(size_t n)
    {
        T *p = std::allocator<T>::allocate(n);
        if (p != NULL) {
            PageLock::getInstance()->pg_lock_range(p, sizeof(T) * n);
        }
        return p;
    }

    /**
     * deallocate
     * ----------
     */
    void deallocate(T *p, size_t n) override
    {
        if (p != NULL) {
            PageLock::getInstance()->pg_unlock_range(p, sizeof(T) * n);
        }
        std::allocator<T>::deallocate(p, n);
    }
};

/**
 * Custom allocator to clear memory before deletion.
 */
template <typename T>
struct SecAllocator : public std::allocator<T>
{
    typedef std::allocator<T> base;
    typedef typename base::size_type size_type;
    typedef typename base::difference_type difference_type;
    typedef typename base::pointer pointer;
    typedef typename base::const_pointer const_pointer;
    typedef typename base::reference reference;
    typedef typename base::const_reference const_reference;
    typedef typename base::value_type value_type;

    template <typename U>
    struct rebind {
        typedef LockPageAllocator<U> other;
    };

    ~SecAllocator() throw() {}
    SecAllocator() throw() {}
    SecAllocator(const SecAllocator &a) throw() : base(a) {}

    template <typename S>
    SecAllocator(const SecAllocator<S> &a) throw() : base(a) {}

    void deallocate(T *p, size_t n) override
    {
        if (p != NULL) {
            memset(p, sizeof(T) * n);
        }
        std::allocator<T>::deallocate(p, n);
    }
};

/**
 * Secure String type.
 */
typedef std::basic_string<char,
        std::char_traits<char>, LockPageAllocator<char>> SecString;

/**
 * Byte vector that clears its content before deletion.
 */
typedef std::vector<char, SecAllocator<char>> SecVector;

#endif /* _UTIL_PAGELOCK_H_ */
