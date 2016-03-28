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
#ifndef _DI_FDRW_H_
#define _DI_FDRW_H_

#include <sys/uio.h>
#include <pthread.h>
#include <cpptype/object.h>

class FdRW : public Object
{
  public:
    OBJECT_PTR_DEFS(FdRW);

    static const int iov_max  = 16;

    virtual void fd_read();
    virtual void fd_write();
    virtual void fd_handle_error();

    virtual void io_prepare_read() = 0;
    virtual void io_read_complete() = 0;

    virtual void io_prepare_write() = 0;
    virtual void io_write_complete() = 0;

    void io_wait(pthread_mutex_t *mtx, pthread_cond_t *cv);
    void io_wakeup(pthread_mutex_t *mtx, pthread_cond_t *cv);

  protected:
    int                      io_fd;
    int                      io_cnt;
    struct iovec             io_vec[FdRW::iov_max];
};

#endif /* _DI_FDRW_H_ */
