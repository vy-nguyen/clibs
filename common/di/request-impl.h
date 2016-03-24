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
#ifndef _DI_REQUEST_IMPL_H_
#define _DI_REQUEST_IMPL_H_

#include <di/request.h>

struct wrk_qmap_s;
class WorkerThread : public Object
{
  public:
    enum thp_state_e {
        idle        = 0,
        spawning    = 1,
        fast_thread = 2,
        slow_thread = 3,
        terminate   = 4
    };

    OBJECT_COMMON_DEFS(WorkerThread);

  protected:
    friend class ThreadPool;
    static const wrk_qmap_s   wrk_qmap[];

    thp_state_e               wrk_state;
    int                       wrk_qno;
    int                       wrk_reqcnt;
    pthread_t                 wrk_thr_id;
    DListObj                  wrk_queue;
    ThreadPool::ptr           wrk_owner;
    pthread_cond_t            wrk_cv;
    pthread_mutex_t          *wrk_mtx;

    /* Stat counters. */
    int                       wrk_stat_beg[0];
    int                       wrk_sched;
    int                       wrk_sched_fast;
    int                       wrk_sched_slow;
    int                       wrk_sched_idle;
    int                       wrk_sched_dorman;
    int                       wrk_sched_direct;
    int                       wrk_idle_comm_work;
    int                       wrk_idle_comm_sleep;
    int                       wrk_thr_spawned;
    int                       wrk_thr_exit;
    int                       wrk_stat_end[0];

    WorkerThread(ThreadPool::ptr owner, pthread_mutex_t *mtx);
    virtual ~WorkerThread();

    void worker_enqueue(Request::ptr req);
    void worker_spawn_thr();
    void worker_terminate_thr();
    void worker_update_state(int qno);

    inline bool wrk_can_terminate()
    {
        return ((wrk_state == terminate) && wrk_queue.dl_empty() &&
                (wrk_owner->thp_barrier_cnt == 0) && (wrk_owner->thp_sched_req == 0));
    }

  private:
    static void *worker_loop(void *arg);
    void worker_loop();
};

struct wrk_qmap_s
{
    WorkerThread::thp_state_e wrk_state;
    int                       wrk_queue;
};

#endif /* _DI_REQUEST_IMPL_H_ */
