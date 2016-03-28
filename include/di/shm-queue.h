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
#ifndef _DI_SHM_QUEUE_H_
#define _DI_SHM_QUEUE_H_

#include <pthread.h>
#include <di/request.h>

/**
 * Layout in shared-memory.
 */
typedef struct shq_1p_nc shq_1p_nc_t;
struct shq_1p_nc
{
    int                  shq_1p_idx;
    int                  shq_nc_cnt;
    int                  shq_nc_idx[0];
};

typedef struct shq_np_1c shq_np_1c_t;
struct shq_np_1c
{
    int                  shq_1c_idx;
    int                  shq_np_idx;
};

/**
 * Synchronization data structure in shared memory.
 */
typedef struct shq_sync shq_sync_t;
struct shq_sync
{
    pthread_mutex_t      shq_mtx;
    pthread_cond_t       shq_con_cv;
    pthread_cond_t       shq_prd_cv;
};

/**
 * Request header through shm producer-consumer queue.
 */
typedef struct shq_hdr shq_hdr_t;
struct shq_hdr
{
    uint32_t             shq_code     : 16;
    uint32_t             shq_msg_size : 16;

    uint32_t             shq_sender_idx : 8;
    uint32_t             shq_msg_id     : 24;

    uint32_t             shq_rsvd[6];
};

class ShmRecv : public Request
{
  public:
    OBJECT_COMMON_DEFS(ShmRecv);

    virtual void shq_recv(const shq_hdr_t *in, size_t size);

  protected:
    shq_hdr             *req_in;
};

class ShmSend : public Request
{
  public:
    OBJECT_COMMON_DEFS(ShmRecv);

  protected:
};

/**
 * Consumer/producer queue in shared memory.
 */
class ShmQueue : public Module
{
  public:
    OBJECT_COMMON_DEFS(ShmRecv);

  protected:
};

#endif /* _DI_SHM_QUEUE_H_ */
