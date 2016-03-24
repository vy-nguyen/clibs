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
#include <syslog.h>
#include <sched.h>
#include <inttypes.h>
#include <di/log.h>
#include <di/program.h>
#include <osdep/osdep.h>

Trace::Trace(int entries) :
    tr_idx(0),
    tr_rec_mask(entries - 1),
    tr_log_file(nullptr),
    tr_log_name(nullptr),
    tr_rec(new trace_rec_t [entries])
{
    assert((entries & tr_rec_mask) == 0);
    pthread_mutex_adaptive(&tr_mtx);
    for (int i = 0; i < entries; i++) {
        tr_rec[i].tr_decode = nullptr;
    }
}

Trace::~Trace()
{
    delete [] tr_rec;
}

const char *
Trace::obj_keystr() const
{
    return MOD_TRACE;
}

void
Trace::mod_resolve()
{
    tr_log_name = Program::singleton()->p_logfile;
}

void
Trace::mod_cleanup()
{
    dump_trace();
}

void
Trace::trace(const char *fmt, int mask,
                uint64_t a1, uint64_t a2, uint64_t a3, uint64_t a4)
{
    trace_rec_t *ptr;

    pthread_mutex_lock(&tr_mtx);
    ptr    = tr_rec + tr_idx;
    tr_idx = (tr_idx + 1) & tr_rec_mask;
    pthread_mutex_unlock(&tr_mtx);

    ptr->tr_decode = fmt;
    ptr->tr_tstamp = gettime_ns();
    ptr->tr_thrid  = pthread_self();
    ptr->tr_cpu    = sched_getcpu();
    ptr->tr_mask   = mask;
    ptr->tr_a1     = a1;
    ptr->tr_a2     = a2;
    ptr->tr_a3     = a3;
    ptr->tr_a4     = a4;
}

void
Trace::dump_trace()
{
    int sidx, cidx;

    if (tr_log_name == nullptr) {
        return;
    }
    openlog();
    sidx = cidx = tr_idx;
    do {
        cidx = (cidx - 1) & tr_rec_mask;
        dump_rec(tr_rec + cidx);
    } while (cidx != sidx);
    closelog();
}

void
Trace::openlog()
{
    assert(tr_log_name != nullptr);
    if (tr_log_file != nullptr) {
        fclose(tr_log_file);
    }
    tr_log_file = fopen(tr_log_name, "w+");
}

void
Trace::dump_rec(const trace_rec_t *rec)
{
    FILE *log = tr_log_file;
   
    if (rec->tr_decode == nullptr) {
        return;
    }
    if (log == nullptr) {
        log = stderr;
    }
    fprintf(log, "0x%" PRIu64 " [CPU %2d] [0x%8x] ",
           rec->tr_tstamp, rec->tr_cpu, rec->tr_thrid);

    fprintf(log, "%s: [0x%" PRIu64 " 0x%" PRIu64 " 0x%" PRIu64 " 0x%" PRIu64 "]\n",
            rec->tr_decode, rec->tr_a1, rec->tr_a2, rec->tr_a3, rec->tr_a4);
    fprintf(log, "\n");
}

void
Trace::closelog()
{
    if (tr_log_file != nullptr) {
        fclose(tr_log_file);
        tr_log_file = nullptr;
    }
}
