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
#ifndef _DI_REQUEST_H_
#define _DI_REQUEST_H_

#include <setjmp.h>
#include <pthread.h>
#include <boost/atomic.hpp>

#include <di/module.h>
#include <cpptype/list-obj.h>

class WorkerThread;
class ThreadPool;
class ExeEvLoop;

/**
 * Request flow:
 *
 * Thread A                          Thread B (or A)                   
 * Request::ptr rq = ...
 * Module:ptr   m = ...
 * m->mod_submit_req(rq);            m->mod_exec_req(req) is called.
 * ... non blocking call             ...
 * ... wait for the result           req->req_done();
 *
 * m->req_done_notif() is called or
 * m->req_wait()
 * ...
 * Module::ptr  m2 = ...
 * m2->mod_submit_req(req);
 */
class Request : public Object
{
  public:
    OBJECT_COMMON_DEFS(Request);
    enum {
        waiting      = 0x0000,
        complete     = 0x0001,
        abort        = 0x0002,
        barrier      = 0x8000
    };

    /**
     * Block the caller until req_done() is called.
     */
    void req_wait();

    /**
     * Called by the thread pool to signal the completion of this request.
     */
    void req_done(uint32_t flags);

    inline void req_reset(Module::ptr mod = NULL, int fd = -1)
    {
        rq_evfd      = -1;
        rq_cv        = NULL;
        rq_mod       = mod;
        rq_done_flgs = waiting;
    }

    /**
     * The same function as Java's call() method.
     */
    virtual void req_exec_task();
    virtual void req_done_notif();

  protected:
    friend class Module;
    friend class ThreadPool;

    int                      rq_evfd;
    int                      rq_mod_qno;
    uint32_t                 rq_done_flgs;
    pthread_cond_t          *rq_cv;
    Module::ptr              rq_mod;

    Request();
    explicit Request(int evtfd);
    virtual ~Request();

    void req_reschedule();
};

/**
 * Light weight task, bound to a threadpool to reduce thread overhead.
 */
class Task : public Request
{
  public:
    OBJECT_PTR_DEFS(Task);

    void task_submit();
    virtual void task_handler() = 0;

  protected:
    bo::intrusive_ptr<ThreadPool>    tsk_pool;
    bo::atomic_int                   tsk_pend;

    Task(bo::intrusive_ptr<ThreadPool> pool) : tsk_pool(pool), tsk_pend(0) {}
    void req_exec_task() override;
};

/**
 * Threadpool
 */
class ThreadPool : public Module
{
  public:
    OBJECT_COMMON_DEFS(ThreadPool);

    static const int req_max_rr   = 8;

    /* Queues tracking request::ptr. */
    static const int fast_queue   = 0;
    static const int slow_queue   = 1;
    static const int time_wait    = 2;
    static const int suspend      = 3;
    static const int barrier      = 4;
    static const int max_reqq     = 5;

    /* Queues tracking worker thread's states. */
    static const int idle_thr     = 0;
    static const int fast_thr     = 1;
    static const int slow_thr     = 2;
    static const int dorman_thr   = 3;
    static const int max_thrq     = 4;

    void thp_stop();
    void thp_dump_stat(bool audit = false);
    void schedule(Module::ptr mod, Request::ptr req, int qno, int ms_now);
    void schedule_barrier(Module::ptr mod, Request::ptr req, int qno, int ms_now);

    inline void schedule(Request::ptr req, int qno, int ms_now) {
        schedule(NULL, req, qno, ms_now);
    }
    inline void schedule_barrier(Request::ptr req, int qno, int ms_now) {
        schedule_barrier(NULL, req, qno, ms_now);
    }

  protected:
    friend class WorkerThread;

    const char *const                 thp_name;
    bool                              thp_shutdown;
    int                               thp_min;
    int                               thp_max;
    int                               thp_idle;
    int                               thp_maxq;
    int                               thp_barrier_cnt;
    mutable bo::atomic<int>           thp_sched_req;
    mutable bo::atomic<int>           thp_run_thds;
    pthread_cond_t                    thp_cv;
    DListObj                         *thp_queue;
    bo::intrusive_ptr<WorkerThread>  *thp_workers;

    /* Stat counters */
    mutable bo::atomic<int>           thp_exe_shutdown;
    int                               thp_stat_beg[0];
    int                               stat_sched;
    int                               stat_spawn_fail;
    int                               stat_attemp_rr;
    int                               stat_success_rr;
    int                               stat_barrier_req;
    int                               stat_barrier_pause;
    int                               stat_barrier_resume;
    int                               thp_stat_end[0];

    ~ThreadPool();
    ThreadPool(const char *name, int min, int max, int idle_min, int max_q);

    void mod_init() override;
    void mod_shutdown() override;
    void thp_swap_queue(bo::intrusive_ptr<WorkerThread> wrk, int qnum);
    void thp_swap_queue_lock(bo::intrusive_ptr<WorkerThread> wrk, int qnum);
    void thp_thread_terminate(bo::intrusive_ptr<WorkerThread> wrk);
    void thp_promote_barrier_lck();

    bo::intrusive_ptr<WorkerThread> thp_dequeue(int qnum);
    Request::ptr get_req_or_put_idle(bo::intrusive_ptr<WorkerThread> wrk);

    /**
     *
     */
    inline int thp_num_sched_req() {
        return thp_sched_req;
    }

    /**
     * Override default so that we can locate thread pool based on custome name.
     */
    const char *obj_keystr() const override {
        return thp_name;
    }
};

class ExeEvLoop : public Module
{
  public:
    OBJECT_COMMON_DEFS(ExeEvLoop);

  protected:
    ~ExeEvLoop();
    ExeEvLoop(int nr_cpu);
};

#endif /* _DI_REQUEST_H_ */
