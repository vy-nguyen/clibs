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
#include <stdlib.h>
#include <di/request.h>
#include <di/program.h>
#include "request-impl.h"

Request::~Request()
{
    rq_mod = nullptr;
    if (rq_evfd != -1) {
        close(rq_evfd);
    }
}

Request::Request() :
    rq_evfd(-1), rq_mod_qno(0), rq_done_flgs(waiting), rq_cv(nullptr), rq_mod(nullptr) {}

Request::Request(int fd) :
    rq_evfd(fd), rq_mod_qno(0), rq_done_flgs(waiting), rq_cv(nullptr), rq_mod(nullptr) {}

/**
 * req_wait
 * --------
 */
void
Request::req_wait()
{
    assert((rq_mod != nullptr) && (rq_cv == nullptr));

    pthread_cond_t   cv  = PTHREAD_COND_INITIALIZER;
    pthread_mutex_t *mtx = rq_mod->mod_get_lock((void *)this);

    pthread_mutex_lock(mtx);
    while (rq_done_flgs == waiting) {
        rq_cv = &cv;
        pthread_cond_wait(&cv, mtx);
    }
    pthread_mutex_unlock(mtx);
    rq_cv = nullptr;
}

/**
 * req_done
 * --------
 */
void
Request::req_done(uint32_t flags)
{
    if (rq_mod != nullptr) {
        pthread_mutex_t *mtx = rq_mod->mod_get_lock((void *)this);

        pthread_mutex_lock(mtx);
        rq_done_flgs = complete | flags;
        if (rq_cv != nullptr) {
            pthread_cond_signal(rq_cv);
        }
        pthread_mutex_unlock(mtx);
    }
    assert(!obj_is_chained());
    req_done_notif();
}

void
Request::req_reschedule()
{
}

void Request::req_done_notif() {}
void Request::req_exec_task()
{
    assert(!obj_is_chained());

    if (rq_mod != nullptr) {
        rq_mod->mod_exec(this);
    }
    if (!obj_is_chained()) {
        req_done(0);
    }
}

/**
 * task_submit
 * -----------
 */
void
Task::task_submit()
{
    if (tsk_pend.fetch_add(1, bo::memory_order_acquire) == 0) {
        assert(!obj_is_chained());
        tsk_pool->schedule(nullptr, this, ThreadPool::fast_queue, 0);
    }
}

/**
 * req_exec_task
 * -------------
 */
void
Task::req_exec_task()
{
    int pending, loop = 0;
    do {
        pending = tsk_pend.load();
        assert(pending > 0);
        task_handler();

        loop++;
        assert(loop < 1000);
    } while (tsk_pend.fetch_sub(pending, bo::memory_order_release) != pending);
}

/*
 * -----------------------------------------------------------------------------------
 * ThreadPool
 * -----------------------------------------------------------------------------------
 */
ThreadPool::ThreadPool(const char *name, int min, int max, int idle, int maxq) :
    thp_name(name),
    thp_shutdown(false),
    thp_min(min),
    thp_max(max),
    thp_idle(idle),
    thp_maxq(maxq),
    thp_barrier_cnt(0),
    thp_sched_req(0),
    thp_run_thds(0),
    thp_cv(PTHREAD_COND_INITIALIZER),
    thp_queue(new DListObj [max_thrq]),
    thp_workers(new WorkerThread::ptr [thp_max]),
    thp_exe_shutdown(0)
{
    assert(name != nullptr);
    assert((min <= max) && (min > 0));

    for (int i = 0; i < thp_max; i++) {
        thp_workers[i] = nullptr;
    }
    memset(thp_stat_beg, 0, (thp_stat_end - thp_stat_beg) * sizeof(int));
}

ThreadPool::~ThreadPool()
{
    delete [] thp_workers;
}

void
ThreadPool::mod_init()
{
    int i;

    mod_alloc_locks(thp_max);
    mod_alloc_queue(max_reqq);

    for (i = 0; i < thp_max; i++) {
        thp_workers[i] = WorkerThread::alloc(this, mod_get_lock(i));
        if (i >= thp_min) {
            thp_swap_queue(thp_workers[i], ThreadPool::dorman_thr);
        }
    }
    for (i = 0; i < thp_min; i++) {
        thp_workers[i]->worker_spawn_thr();
    }
}

void
ThreadPool::mod_shutdown()
{
    thp_stop();
    verify(thp_shutdown == true);

    thp_dump_stat(true);
    for (int i = 0; i < thp_max; i++) {
        thp_workers[i]->obj_rm();
        thp_workers[i] = nullptr;
    }
    for (int i = 0; i < max_thrq; i++) {
        verify(thp_queue[i].dl_empty());
    }
    delete [] thp_queue;
}

/**
 * thp_dump_stat
 * -------------
 */
void
ThreadPool::thp_dump_stat(bool audit)
{
    int thr_spawn      = 0;
    int thr_exit       = 0;
    int wrk_sched      = 0;
    int wrk_direct     = 0;
    int wrk_comm_work  = 0;
    int wrk_comm_sleep = 0;
    int sched_fast     = 0;
    int sched_slow     = 0;
    int sched_idle     = 0;
    int sched_dorman   = 0;
    int sched_shutdown = thp_exe_shutdown.load(bo::memory_order_relaxed);

    for (int i = 0; i < thp_max; i++) {
        WorkerThread::ptr wrk = thp_workers[i];
        thr_spawn      += wrk->wrk_thr_spawned;
        thr_exit       += wrk->wrk_thr_exit;
        wrk_sched      += wrk->wrk_sched;
        sched_fast     += wrk->wrk_sched_fast;
        sched_slow     += wrk->wrk_sched_slow;
        sched_idle     += wrk->wrk_sched_idle;
        sched_dorman   += wrk->wrk_sched_dorman;
        wrk_direct     += wrk->wrk_sched_direct;
        wrk_comm_work  += wrk->wrk_idle_comm_work;
        wrk_comm_sleep += wrk->wrk_idle_comm_sleep;
    }
    if (Program::p_verbose == 0) {
        return;
    }
    printf("Stat %s\n"
           "Total schedule calls....................... %d\n"
           "Total schedule serviced.................... %d\n"
           "Total serviced during shutdown............. %d\n"
           "Attempted round-robin sched................ %d\n"
           "Success round-robin sched.................. %d\n"
           "Dynamic thread spawned..................... %d\n"
           "Dynamic thread exited...................... %d\n"
           "Schedule in fast queue..................... %d\n"
           "Schedule in slow queue..................... %d\n"
           "Schedule in idle state..................... %d\n"
           "Schedule in dorman state................... %d\n"
           "Worker serves private request.............. %d\n"
           "Worker serves common request non-block..... %d\n"
           "Worker serves common request block idle.... %d\n"
           "Worker thread spawn failed................. %d\n"
           "Total barrier request...................... %d\n"
           "Request deferred due to barrier............ %d\n"
           "Request resumed after barrier.............. %d\n",
           thp_name, stat_sched, wrk_sched, sched_shutdown,
           stat_attemp_rr, stat_success_rr, thr_spawn, thr_exit,
           sched_fast, sched_slow, sched_idle, sched_dorman,
           wrk_direct, wrk_comm_work, wrk_comm_sleep, stat_spawn_fail,
           stat_barrier_req, stat_barrier_pause, stat_barrier_resume);

    if (audit == true) {
        verify(thr_spawn == thr_exit);
        verify(stat_sched == wrk_sched);
        verify((wrk_direct + wrk_comm_work) == stat_sched);
        verify((sched_shutdown + sched_fast + sched_slow) == stat_sched);
        printf("All audit numbers match!\n");
    }
}

/**
 * thp_swap_queue_lock
 * -------------------
 * Swap a worker thread's queue to maintain its state based on request's queue..
 */
void
ThreadPool::thp_swap_queue_lock(WorkerThread::ptr wrk, int qnum)
{
    pthread_mutex_lock(&m_mod_mtx);
    thp_swap_queue(wrk, qnum);
    pthread_mutex_unlock(&m_mod_mtx);
}

void
ThreadPool::thp_swap_queue(WorkerThread::ptr wrk, int qnum)
{
    assert(qnum < ThreadPool::max_thrq);

    wrk->worker_update_state(qnum);
    wrk->obj_rm();
    thp_queue[qnum].dl_add_back(wrk);
}

/**
 * thp_dequeue
 * -----------
 */
WorkerThread::ptr
ThreadPool::thp_dequeue(int qnum)
{
    assert(qnum < max_thrq);
    return object_cast<WorkerThread>(thp_queue[qnum].dl_rm_front());    
}

/**
 * thp_stop
 * --------
 */
void
ThreadPool::thp_stop()
{
    pthread_mutex_lock(&m_mod_mtx);
    thp_shutdown = true;
    for (int i = 0; i < thp_max; i++) {
        thp_workers[i]->wrk_state = WorkerThread::terminate;
        pthread_cond_signal(&thp_workers[i]->wrk_cv);
    }
    while (thp_run_thds > 0) {
        pthread_cond_wait(&thp_cv, &m_mod_mtx);
    }
    pthread_mutex_unlock(&m_mod_mtx);

    verify(thp_run_thds == 0);
    for (int i = 0; i < thp_max; i++) {
        verify(thp_workers[i]->wrk_state == WorkerThread::terminate);
        verify(thp_workers[i]->wrk_queue.dl_empty());
    }
    for (int i = 0; i < max_reqq; i++) {
        verify(m_queue[i].dl_empty());
    }
}

/**
 * thp_thread_terminate
 * --------------------
 */
void
ThreadPool::thp_thread_terminate(WorkerThread::ptr wrk)
{
    pthread_mutex_lock(&m_mod_mtx);
    thp_run_thds--;
    thp_swap_queue(wrk, dorman_thr);

    for (auto it : thp_queue[idle_thr]) {
        WorkerThread::ptr wrk = object_cast<WorkerThread>(it);
        pthread_cond_signal(&wrk->wrk_cv);
    }

    verify(thp_run_thds >= 0);
    if ((thp_shutdown == true) && (thp_run_thds == 0)) {
        pthread_cond_signal(&thp_cv);
    }
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * schedule
 * --------
 */
void
ThreadPool::schedule(Module::ptr mod, Request::ptr req, int qno, int ms_now)
{
    int               thp;
    bool              noq, dorman;
    WorkerThread::ptr wrk;

    assert((req->rq_mod == nullptr) || (req->rq_mod == mod));
    assert((qno < max_reqq) && !req->obj_is_chained());

    thp         = idle_thr;
    noq         = false;
    dorman      = false;
    req->rq_mod = mod;

    pthread_mutex_lock(&m_mod_mtx);
    stat_sched++;

    /* Check if we must be pending in the barrier queue. */
    if (thp_barrier_cnt > 0) {
        thp_barrier_cnt++;
        stat_barrier_pause++;
        mod_enqueue(req, barrier);
        pthread_mutex_unlock(&m_mod_mtx);
        return;
    }
    thp_sched_req++;
    if (qno == fast_queue) {
        thp = fast_thr;
        wrk = thp_dequeue(fast_thr);
    } else if (qno == slow_queue) {
        thp = slow_thr;
        wrk = thp_dequeue(slow_thr);
    } else {
        if (qno == time_wait) {
            mod_enqueue(req, time_wait);
        } else {
            mod_enqueue(req, suspend);
        }
        pthread_mutex_unlock(&m_mod_mtx);
        return;
    }
    if (wrk == nullptr) {
        wrk = thp_dequeue(idle_thr);
        if (wrk == nullptr) {
            if (thp_shutdown == false) {
                dorman = true;
                mod_enqueue(req, qno);
                wrk = thp_dequeue(dorman_thr);
            } else {
                noq = true;
            }
        } else {
            wrk->wrk_sched_idle++;
        }
    } else {
        /* Put the worker at the tail of the list. */
        thp_swap_queue(wrk, thp);
        if (wrk->wrk_reqcnt > req_max_rr) {
            stat_attemp_rr++;
            WorkerThread::ptr sav = wrk;

            /* Dequeue the front, hope that we can round-robin workers. */
            wrk = thp_dequeue(thp);
            if (wrk != sav) {
                assert((wrk != nullptr) && !thp_queue[thp].dl_empty());

                stat_success_rr++;
                if (wrk->wrk_reqcnt < req_max_rr) {
                    thp_queue[thp].dl_add_front(wrk);
                }
                /* Else, take it out of tracking lists so that it can finish up. */
            } else {
                assert(thp_queue[thp].dl_empty());
            }
        }
    }
    pthread_mutex_unlock(&m_mod_mtx);

    if (wrk == nullptr) {
        if (noq == true) {
            assert(thp_shutdown == true);
            thp_exe_shutdown++;
            req->req_exec_task();
        }
        return;
    }
    if (dorman == false) {
        wrk->worker_enqueue(req);
    } else if (thp_shutdown == false && wrk->wrk_state == WorkerThread::terminate) {
        wrk->worker_spawn_thr();
    } else {
        thp_exe_shutdown++;
        req->req_exec_task();
    }
}

/**
 * schedule_barrier
 * ----------------
 */
void
ThreadPool::schedule_barrier(Module::ptr mod, Request::ptr req, int qno, int ms_now)
{
    pthread_mutex_lock(&m_mod_mtx);
    stat_barrier_req++;
    int active = thp_num_sched_req();
    if (active >= 1) {
        stat_sched++;
        thp_barrier_cnt++;
        req->rq_done_flgs |= Request::barrier;
        mod_enqueue(req, barrier);
        req = nullptr;
    }
    pthread_mutex_unlock(&m_mod_mtx);

    if (req != nullptr) {
        /* Ok to submit as a regular request. */
        schedule(mod, req, qno, ms_now);
    }
}

/**
 * get_req_or_put_idle
 * -------------------
 * Get spill-over request queued in the common queue or put the worker thread back
 * to the idle list.
 */
Request::ptr
ThreadPool::get_req_or_put_idle(WorkerThread::ptr wrk)
{
    pthread_mutex_lock(&m_mod_mtx);
    Request::ptr req = object_cast<Request>(mod_dequeue(fast_queue));
    if (req == nullptr) {
        req = object_cast<Request>(mod_dequeue(slow_queue));
        if (req != nullptr) {
            wrk->wrk_sched_slow++;
            wrk->wrk_idle_comm_work++;
            thp_swap_queue(wrk, slow_thr);
        } else {
            int active = thp_num_sched_req();
            if ((thp_barrier_cnt == 0) || (active > 0)) {
                wrk->wrk_idle_comm_sleep++;
                thp_swap_queue(wrk, idle_thr);
            } else {
                req = object_cast<Request>(mod_dequeue(barrier));
                verify(req != nullptr);

                thp_sched_req++;
                thp_barrier_cnt--;
                thp_promote_barrier_lck();
            }
        }
    } else {
        wrk->wrk_sched_fast++;
        wrk->wrk_idle_comm_work++;
        thp_swap_queue(wrk, fast_thr);
    }
    pthread_mutex_unlock(&m_mod_mtx);
    return req;
}

/**
 * thp_promote_barrier_lck
 * -----------------------
 */
void
ThreadPool::thp_promote_barrier_lck()
{
    while (thp_barrier_cnt > 0) {
        Request::ptr rq = object_cast<Request>(mod_dequeue(barrier));
        verify(rq != nullptr);

        if ((rq->rq_done_flgs & Request::barrier) == 0) {
            thp_sched_req++;
            stat_barrier_resume++;
            thp_barrier_cnt--;
            mod_enqueue(rq, fast_queue);
            WorkerThread::ptr wrk = thp_dequeue(idle_thr);

            if (wrk != nullptr) {
                thp_swap_queue(wrk, fast_thr);
                pthread_cond_signal(&wrk->wrk_cv);
            }
        } else {
            /* Put back to front of queue. */
            mod_front_queue(rq, barrier);
            break;
        }
    }
}

/*
 * -----------------------------------------------------------------------------------
 * WorkerThread
 * -----------------------------------------------------------------------------------
 */
const wrk_qmap_s WorkerThread::wrk_qmap[] =
{
    { WorkerThread::idle,          ThreadPool::idle_thr },
    { WorkerThread::fast_thread,   ThreadPool::fast_thr },
    { WorkerThread::slow_thread,   ThreadPool::slow_thr },
    { WorkerThread::terminate,     ThreadPool::dorman_thr },
    { WorkerThread::spawning,      ThreadPool::max_thrq }
};

WorkerThread::~WorkerThread()
{
    wrk_mtx   = nullptr;
    wrk_owner = nullptr;
}

WorkerThread::WorkerThread(ThreadPool::ptr owner, pthread_mutex_t *mtx) :
    wrk_state(terminate),
    wrk_qno(ThreadPool::dorman_thr),
    wrk_reqcnt(0),
    wrk_thr_id(0),
    wrk_owner(owner),
    wrk_mtx(mtx)
{
    pthread_cond_init(&wrk_cv, nullptr);
    memset(wrk_stat_beg, 0, (wrk_stat_end - wrk_stat_beg) * sizeof(int));
}

/**
 * worker_update_state
 * -------------------
 */
void
WorkerThread::worker_update_state(int qno)
{
    assert(qno < ThreadPool::max_thrq);
    assert(qno == wrk_qmap[qno].wrk_queue);

    wrk_qno = wrk_qmap[qno].wrk_queue;
    if (wrk_state != terminate) {
        wrk_state = wrk_qmap[qno].wrk_state;
    }
}

/**
 * worker_spawn_thr
 * ----------------
 */
void
WorkerThread::worker_spawn_thr()
{
    assert(wrk_owner != nullptr);
    if ((wrk_thr_id != 0) || (wrk_state != terminate)) {
        return;
    }
    int            rt;
    pthread_attr_t attr;

    verify(wrk_state == terminate);
    wrk_state = spawning;

    rt = pthread_attr_init(&attr);
    assert(rt == 0);

    rt = pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
    assert(rt == 0);

    wrk_sched_dorman++;
    wrk_owner->thp_run_thds++;
    rt = pthread_create(&wrk_thr_id, &attr, &WorkerThread::worker_loop, (void *)this);

    if (rt != 0) {
        /* The swap queue call also updates the worker's state. */
        wrk_thr_id = 0;

        wrk_owner->thp_run_thds--;
        wrk_owner->stat_spawn_fail++;
        wrk_owner->thp_swap_queue_lock(this, ThreadPool::dorman_thr);
    }
    pthread_attr_destroy(&attr);
}

/**
 * worker_enqueue
 * --------------
 */
void
WorkerThread::worker_enqueue(Request::ptr req)
{
    verify(!req->obj_is_chained());

    pthread_mutex_lock(wrk_mtx);
    if (wrk_state != terminate) {
        wrk_sched_direct++;
        if (wrk_state == fast_thread) {
            wrk_sched_fast++;
        } else {
            wrk_sched_slow++;
        }
        wrk_reqcnt++;
        wrk_queue.dl_add_back(req);
        pthread_cond_signal(&wrk_cv);
        pthread_mutex_unlock(wrk_mtx);
        return;
    }
    pthread_mutex_unlock(wrk_mtx);

    wrk_owner->thp_exe_shutdown++;
    req->req_exec_task();
}

/**
 * worker_loop
 * -----------
 * Main worker thread loop.
 */
void
WorkerThread::worker_loop()
{
    Request::ptr req;

    assert((wrk_mtx != nullptr) && ((wrk_state == spawning) || (wrk_state == terminate)));
    wrk_owner->thp_swap_queue_lock(this, ThreadPool::fast_thr);

    pthread_mutex_lock(wrk_mtx);
    wrk_thr_spawned++;
    while (!wrk_can_terminate()) {
        req = object_cast<Request>(wrk_queue.dl_rm_front());
        if (req == nullptr) {
            /* Look for the common queue for any requests. */
            req = wrk_owner->get_req_or_put_idle(this);
            if (req == nullptr) {
                if (wrk_can_terminate()) {
                    break;
                }
                verify((wrk_state == idle) || (wrk_state == terminate));
                pthread_cond_wait(&wrk_cv, wrk_mtx);
                continue;
            }
        } else {
            wrk_reqcnt--;
        }
        wrk_sched++;
        verify(wrk_owner->thp_sched_req >= 0);
        pthread_mutex_unlock(wrk_mtx);

        req->req_exec_task();
        wrk_owner->thp_sched_req--;
        pthread_mutex_lock(wrk_mtx);
    }
    wrk_thr_id = 0;
    wrk_thr_exit++;
    pthread_mutex_unlock(wrk_mtx);

    /* Must be the last line. */
    wrk_owner->thp_thread_terminate(this);
}

/**
 * worker_terminate_thr
 * --------------------
 * Send signal to terminate idle thread or ask thread to shutdown.
 */
void
WorkerThread::worker_terminate_thr()
{
    pthread_mutex_lock(wrk_mtx);
    wrk_owner->swap_queue(this, ThreadPool::dorman_thr);
    pthread_cond_signal(&wrk_cv);
    pthread_mutex_unlock(wrk_mtx);
}

void *
WorkerThread::worker_loop(void *arg)
{
    WorkerThread *worker = reinterpret_cast<WorkerThread *>(arg);

    assert(worker != nullptr);
    worker->worker_loop();
    return nullptr;
}

/*
 * -----------------------------------------------------------------------------------
 * EventLoop
 * -----------------------------------------------------------------------------------
 */
ExeEvLoop::~ExeEvLoop() {}
ExeEvLoop::ExeEvLoop(int nrcpu) {}
