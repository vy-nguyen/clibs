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
#ifndef _DI_LOG_H_
#define _DI_LOG_H_

#include <stdio.h>
#include <pthread.h>
#include <di/module.h>

typedef struct trace_rec trace_rec_t;
struct trace_rec
{
    const char     *tr_decode;
    uint64_t        tr_tstamp;
    uint32_t        tr_thrid;
    uint16_t        tr_cpu;
    uint16_t        tr_mask;
    uint64_t        tr_a1;
    uint64_t        tr_a2;
    uint64_t        tr_a3;
    uint64_t        tr_a4;
};

class Trace : public Module
{
  public:
    OBJECT_COMMON_DEFS(Trace);

    static uint64_t u32_u64(uint32_t lo, uint32_t hi) {
        return ((uint64_t)hi << 32) | lo;
    }
    static uint64_t ptr2u64(void *ptr) {
        return reinterpret_cast<uint64_t>(ptr);
    }
    static uint64_t bin2u64(const void *a) {
        return *(reinterpret_cast<const uint64_t *>(a));
    }
    static uint64_t str2u64(const char *a)
    {
        uint64_t  ret = *(reinterpret_cast<const uint64_t *>(a));
        char     *str = reinterpret_cast<char *>(&ret);

        str[sizeof(ret) - 1] = '\0';
        return ret;
    }
    void dump_trace();
    void trace(const char *fmt, int mask,
               uint64_t a1, uint64_t a2, uint64_t a3, uint64_t a4);

  protected:
    int                      tr_idx;
    int                      tr_rec_mask;
    FILE                    *tr_log_file;
    const char              *tr_log_name;
    trace_rec_t             *tr_rec;
    pthread_mutex_t          tr_mtx;

    explicit Trace(int entries);
    virtual ~Trace();

    void mod_resolve() override;
    void mod_cleanup() override;
    const char *obj_keystr() const override;

    virtual void openlog();
    virtual void closelog();
    virtual void dump_rec(const trace_rec_t *rec);
};

#endif /* _DI_LOG_H_ */
