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
#ifndef _OSDEP_OSDEP_H_
#define _OSDEP_OSDEP_H_

#include <time.h>
#include <pthread.h>
#include <stdint.h>
#include <ctype/assert.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#define print_attr    __attribute__((format(printf, 1, 2)))
#define sprintf_attr  __attribute__((format(printf, 2, 3)))
#define snprintf_attr __attribute__((format(printf, 3, 4)))

static inline void
pthread_mutex_adaptive(pthread_mutex_t *mtx)
{
    pthread_mutexattr_t attr;

    pthread_mutexattr_init(&attr);
    pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
    pthread_mutex_init(mtx, &attr);
    pthread_mutexattr_destroy(&attr);
}

static inline uint64_t gettime_ns(void)
{
    struct timespec tv;

    (void)clock_gettime(CLOCK_MONOTONIC_COARSE, &tv);
    return (uint64_t)tv.tv_nsec;
}

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _OSDEP_OSDEP_H_ */
