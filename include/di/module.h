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
#ifndef _DI_MODULE_H_
#define _DI_MODULE_H_

#include <pthread.h>
#include <cpptype/object.h>

class Module;
class Program;
class DHashObj;
class SHashObj;
class Request;
class DListObj;
class RsContainer;
class ExeEvLoop;
class ThreadPool;
struct ModTask;

#define MODULE_GET_INSTANCE(Type, name)                                         \
    static inline Type::ptr getInstance(const char *mod) {                      \
        return object_cast<Type>(Program::singleton()->module(mod));            \
    }                                                                           \
    static inline Type::ptr getInstance() {                                     \
        return object_cast<Type>(Program::singleton()->module(name));           \
    }

#define MODULE_COMMON_DEFS(Type, name)                                          \
  protected:                                                                    \
    const char *const mod_name;                                                 \
    const char *obj_keystr() const override {                                   \
        return mod_name;                                                        \
    }                                                                           \
  public:                                                                       \
    MODULE_GET_INSTANCE(Type, name)

class Module : public Object
{
  public:
    OBJECT_COMMON_DEFS(Module);

    /**
     * Start the module w/out hooking up to program.
     */
    void module_start();
    void module_shutdown();

    /**
     * Submodule support.
     */
    virtual void mod_register(Module::ptr obj);
    virtual void mod_register_index(Module::ptr mod, int idx);
    virtual void mod_unregister(Module::ptr mod);

    Module::ptr  mod_get(uint32_t id) const;
    Module::ptr  mod_get(const char *name) const;

    inline Module::ptr mod_get_index(int idx) const
    {
        assert((idx < m_dep_cnt) && (m_dep_idx[idx] != NULL));
        assert(m_dep_idx[idx]->m_index == idx);
        return m_dep_idx[idx];
    }

    /**
     * Locking support.
     * Avoid using too many locks, each module owns shared locks hashed to client
     * objects using the module.  See ThreadPool for example usage.
     *
     * The module has its own internal lock to proect its data such as shared queue.
     * The most simple lock ordering rule:
     * - mod_acquire_mtx is final, can't acquire any other lock.
     * - No nested lock between locks hashed among objects using the module.
     * - Holding a shared lock can acquire the module lock.
     */
    pthread_mutex_t *const mod_get_lock(int idx);
    pthread_mutex_t *const mod_get_lock(const void *ptr);
    inline void mod_acquire_mtx() { pthread_mutex_lock(&m_mod_mtx); }
    inline void mod_release_mtx() { pthread_mutex_unlock(&m_mod_mtx); }

    /**
     * Generic request API.
     * Called when the module has CPU to exec the request.  Required override; call
     * the base to add request to the mod_qno queue in module for tracking.  When this
     * method returns, if the request doesn't chained to any link, it's assumed to
     * be completed.
     */
    virtual void mod_exec(boost::intrusive_ptr<Request> req);

    /**
     * Wrapper to submit a request to this module executed by ThreadPool/ExeEvLoop.
     * Typical code flow is:
     * ...
     * mod->mod_schedule(threadPool, req, ...);
     * threadPool->schedule(...); - non blocking call.
     * ...
     * req->req_wait();           - block to wait for result
     * ...
     * ... same thread or a thread in threadpool
     * req->req_exec_task();      - base class method.
     * mod->mod_exec(req);        - override class method.
     *   Module::mod_exec(req);   - add req to a queue to track long task.
     *   ...
     * ... a completion callback thread
     * mod->dequeue(req);         - remove req out of the tracking queue.
     * req->req_done();           - wake up the waiting thread with results.
     */
    virtual void
    mod_schedule(boost::intrusive_ptr<ThreadPool> thp,
                 boost::intrusive_ptr<Request>    req,
                 int mod_qno = 0,
                 int thp_qno = 0,
                 int ms_now  = 0);

    virtual void
    mod_schedule(boost::intrusive_ptr<ExeEvLoop>  evl,
                 boost::intrusive_ptr<Request>    req,
                 int mod_qno = 0);

    /**
     * Add a request to module's queue or move it to different queue for tracking.
     * These methods only chain the request to module's queue.
     */
    inline void enqueue(Object::ptr obj, int qno = 0)
    {
        mod_acquire_mtx();
        mod_enqueue(obj, qno);
        mod_release_mtx();
    }
    inline void dequeue(Object::ptr obj)
    {
        mod_acquire_mtx();
        obj->obj_rm();
        mod_release_mtx();
    }
    inline void swap_queue(Object::ptr obj, int qno)
    {
        mod_acquire_mtx();
        mod_swap_queue(obj, qno);
        mod_release_mtx();
    }

    /**
     * Lockstep coordination.
     * Example call:
     * mod->mod_exec_lckstep(10, Pool::obj_id(), 2,
     *      {
     *          { mod_a, req_a, &ModuleA::task1 },
     *          { mod_b, req_b, &ModuleB::task1 },
     *          { mod_c, req_c, &ModuleC::task1 },
     *          { NULL,  NULL,  NULL }
     *          // execute in parallel, wait before running the next lockstep.
     *      }, {
     *          { mod_a, req_a, &ModuleA::task2 },
     *          { mod_d, req_d, &ModuleD::task2 },
     *          { mod_e, req_e, &ModuleE::task2 },
     *          { NULL,  NULL,  NULL }
     *      })
     *    ->mod_wait_exec(10);
     */
    Module::ptr
    mod_exec_lckstep(int id, uint32_t exec, int cnt, const ModTask steps[], ...);

    Module::ptr mod_wait_exec(int id);
    size_t      to_string(char *str, size_t len) const;

  protected:
    friend class Program;

    const static uint32_t st_init      = 0x0001;
    const static uint32_t st_resolve   = 0x0002;
    const static uint32_t st_startup   = 0x0004;
    const static uint32_t st_start_svc = 0x0008;
    const static uint32_t st_stop_svc  = 0x1000;
    const static uint32_t st_shutdown  = 0x2000;
    const static uint32_t st_cleanup   = 0x4000;
    const static uint32_t st_register  = 0x8000;

    int                      m_index;         /**< index of this module in parent.   */
    int                      m_dep_cnt;       /**< number of active sub mods.        */
    int                      m_dep_siz;       /**< allocated size of m_dep_idx array */
    uint32_t                 m_state;         /**< keep track of module's state.     */
    ODlink                   m_id_link;       /**< for id hash lookup.               */
    Module::ptr             *m_dep_idx;
    DHashObj                *m_name_tab;
    pthread_mutex_t          m_mod_mtx;

    /* Lock and queueing support. */
    int                      m_nr_lock;
    int                      m_nr_queue;
    DListObj                *m_queue;
    pthread_mutex_t         *m_locks;

    Module();
    explicit Module(int size);
    explicit Module(Module::ptr subs[]);
    virtual ~Module();

    /**
     * Standard startup/shutdown sequence.
     */
    virtual void mod_init();
    virtual void mod_resolve();
    virtual void mod_startup();
    virtual void mod_enable_service();

    virtual void mod_disable_service();
    virtual void mod_shutdown();
    virtual void mod_cleanup();

    /**
     * The caller must call mod_acquire_mtx() before calling these functions for
     * thread-safe.
     */
    virtual void mod_enqueue(Object::ptr obj, int qno);
    virtual void mod_front_queue(Object::ptr obj, int qno);
    virtual void mod_swap_queue(Object::ptr obj, int qnum);
    virtual boost::intrusive_ptr<Object> mod_dequeue(int qno);

    /**
     * Override method obj_keystr() if want to create multiple instances of the
     * same module with different names.  See ThreadPool for example.
     */
    uint64_t obj_key64() const override;
    int obj_compare_dlink(const ODlink *p) const override;
    int obj_hash_dlink(int size, const ODlink *p) const override;

    void mod_alloc_locks(int num);
    void mod_alloc_queue(int num);
    void mod_alloc_depmod(int max);
    char **prog_args(int *argc);
};

struct ModTask
{
    Module::ptr                   tsk_mod;
    boost::intrusive_ptr<Request> tsk_req;

    void  (*tsk_execfn)(Module::ptr, boost::intrusive_ptr<Request>);
};

/**
 * -------------------------------------------------------------------------------------
 * Resource Container
 * Extend Module as a container that could index objects using name, or 64-bit id, or
 * direct index.
 * -------------------------------------------------------------------------------------
 */
class Resource : public Object
{
  public:
    OBJECT_COMMON_DEFS(Resource);
    enum {
        rs_name_max        = 16
    };

    const char *obj_keystr() const override { return rs_name; }
    uint64_t    obj_key64() const override { return rs_id; }

    void        rs_update_id(uint64_t id);
    void        rs_update_name(const char *name);

  protected:
    friend class RsContainer;

    int                      rs_idx;
    uint64_t                 rs_id;
    char                     rs_name[rs_name_max];
    ODlink                   rs_id_link;

    explicit Resource(uint64_t id);
    explicit Resource(const char *name);

    Resource();
    Resource(uint64_t id, const char *name);
    virtual ~Resource();
};

class RsIterator : public std::iterator<std::input_iterator_tag, Resource>
{
  public:
    virtual ~RsIterator();
    explicit RsIterator(RsContainer &ct);
    RsIterator();

    inline bool end() {
        return rs_curr == rs_snap + rs_size;
    }
    inline Resource::ptr operator *() {
        return (rs_curr != NULL) ? *rs_curr : NULL;
    }
    inline bool operator ==(const RsIterator &rhs) {
        return rs_curr == rhs.rs_curr;
    }
    inline bool operator !=(const RsIterator &rhs) {
        return !(*this == rhs);
    }
    RsIterator &operator ++() {
        rs_curr++;
        return *this;
    }
    RsIterator operator ++(int) {
        RsIterator ret = *this;
        rs_curr++;
        return ret;
    }
    template <typename T>
    inline boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }

  protected:
    friend class RsContainer;

    int                      rs_size;
    Resource::ptr           *rs_curr;
    Resource::ptr           *rs_snap;
};

class RsContainer : public Module
{
  public:
    OBJECT_COMMON_DEFS(RsContainer);

    void rs_resize_container(int max);

    /**
     * Use Module as a container indexing name, id or direct index.
     */
    virtual void   rs_add(Resource::ptr rs);
    virtual void   rs_add_index(Resource::ptr rs, int idx);
    virtual void   rs_remove(Resource::ptr rs);

    Resource::ptr  rs_query(uint64_t id);
    Resource::ptr  rs_query(const char *name);

    inline Resource::ptr rs_query_index(int idx) const {
        assert((idx < rs_cnt) && (rs_array != NULL));
        return rs_array[idx];
    }

    /**
     * Standard C++ iterator.
     */
    inline RsIterator begin() {
        return RsIterator(*this);
    }
    inline RsIterator &end() {
        return rs_iter_end;
    }
    void rs_snapshot(RsIterator &it);

  protected:
    friend class RsIterator;

    int                      rs_cnt;
    int                      rs_arr_elm;
    Resource::ptr           *rs_array;
    RsIterator               rs_iter_end;

    virtual ~RsContainer();
    RsContainer(int max = 0);
};

#endif  // _DI_MODULE_H_
