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
#include <stdio.h>
#include <string.h>
#include <di/program.h>
#include <cpptype/hash-obj.h>
#include <cpptype/list-obj.h>

/*
 * ----------------------------------------------------------------------------------
 * Module methods.
 * ----------------------------------------------------------------------------------
 */
Module::Module() :
    m_index(-1),
    m_dep_cnt(0),
    m_dep_siz(0),
    m_state(0),
    m_id_link(nullptr),
    m_dep_idx(nullptr),
    m_name_tab(nullptr),
    m_nr_lock(0),
    m_nr_queue(0),
    m_queue(nullptr),
    m_locks(nullptr)
{
    pthread_mutexattr_t attr;

    pthread_mutexattr_init(&attr);
    pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
    pthread_mutex_init(&m_mod_mtx, &attr);
}

Module::Module(int size) : Module()
{
    m_name_tab = new DHashObj(size);
}

Module::Module(Module::ptr subs[]) : Module()
{
    int dep_cnt;

    for (dep_cnt = 0; subs[dep_cnt] != nullptr; dep_cnt++);

    m_dep_siz = dep_cnt * 2;
    m_dep_idx = new Module::ptr [m_dep_siz];
    m_name_tab = new DHashObj(m_dep_siz * 2);  /* hold both name and index lookup */

    for (int i = 0; subs[i] != nullptr; i++) {
        assert(i < dep_cnt);
        mod_register(subs[i]);
    }
}

Module::~Module()
{
    if (m_dep_idx != nullptr) {
        for (int i = 0; i < m_dep_cnt; i++) {
            mod_unregister(m_dep_idx[i]);
            m_dep_idx[i] = nullptr;
        }
        delete [] m_dep_idx;
    }
    if (m_name_tab != nullptr) {
        delete m_name_tab;
    }
    if (m_queue != nullptr) {
        for (int i = 0; i < m_nr_queue; i++) {
            verify(m_queue[i].dl_empty());
        }
        delete [] m_queue;
    }
    if (m_locks != nullptr) {
        delete [] m_locks;
    }
}

/**
 * module_start
 * ------------
 */
void
Module::module_start()
{
    mod_init();
    mod_resolve();
    mod_startup();
    mod_enable_service();
}

/**
 * module_shutdown
 * ---------------
 */
void
Module::module_shutdown()
{
    if ((m_state & st_stop_svc) == 0) {
        Module::mod_disable_service();
        mod_disable_service();
    }
    if ((m_state & st_shutdown) == 0) {
        Module::mod_shutdown();
        mod_shutdown();
    }
    if ((m_state & st_cleanup) == 0) {
        Module::mod_cleanup();
        mod_cleanup();
    }
}

/**
 * obj_compare_dlink
 * -----------------
 */
int
Module::obj_compare_dlink(const ODlink *p) const
{
    Object::cptr rhs = p->obj_cptr();

    assert(rhs != nullptr);
    return obj_compare64(rhs->obj_id());
}

/**
 * obj_hash_dlink
 * --------------
 */
int
Module::obj_hash_dlink(int size, const ODlink *p) const
{
    Object::cptr elm = p->obj_cptr();

    verify(this == object_cast<Module>(elm));
    return obj_hash64(size, obj_id());
}

/**
 * obj_key64
 * ---------
 */
uint64_t
Module::obj_key64() const
{
    return obj_id();
}

/**
 * Common module startup sequence.
 *
 * mod_init
 * --------
 */
void
Module::mod_init()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_init) != 0)) {
        m_state |= st_init;
        return;
    }
    m_state |= st_init;
    for (int i = 0; i < m_dep_cnt; i++) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_init();
            m_dep_idx[i]->Module::mod_init();
        }
    }
}

/**
 * mod_resolve
 * -----------
 */
void
Module::mod_resolve()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_resolve) != 0)) {
        m_state |= st_resolve;
        return;
    }
    m_state |= st_resolve;
    for (int i = 0; i < m_dep_cnt; i++) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_resolve();
            m_dep_idx[i]->Module::mod_resolve();
        }
    }
}

/**
 * mod_startup
 * -----------
 */
void
Module::mod_startup()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_startup) != 0)) {
        m_state |= st_startup;
        return;
    }
    m_state |= st_startup;
    for (int i = 0; i < m_dep_cnt; i++) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_startup();
            m_dep_idx[i]->Module::mod_startup();
        }
    }
}

/**
 * mod_enable_service
 * ------------------
 */
void
Module::mod_enable_service()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_start_svc) != 0)) {
        m_state |= st_start_svc;
        return;
    }
    m_state |= st_start_svc;
    for (int i = 0; i < m_dep_cnt; i++) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_enable_service();
            m_dep_idx[i]->Module::mod_enable_service();
        }
    }
}

/**
 * mod_disable_service
 * -------------------
 */
void
Module::mod_disable_service()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_stop_svc) != 0)) {
        m_state |= st_stop_svc;
        return;
    }
    m_state |= st_stop_svc;
    for (int i = m_dep_cnt - 1; i >= 0; i--) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_disable_service();
            m_dep_idx[i]->Module::mod_disable_service();
        }
    }
}

/**
 * mod_shutdown
 * ------------
 */
void
Module::mod_shutdown()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_shutdown) != 0)) {
        m_state |= st_shutdown;
        return;
    }
    m_state |= st_shutdown;
    for (int i = m_dep_cnt - 1; i >= 0; i--) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_shutdown();
            m_dep_idx[i]->Module::mod_shutdown();
        }
    }
}

/**
 * mod_cleanup
 * -----------
 */
void
Module::mod_cleanup()
{
    if ((m_dep_idx == nullptr) || ((m_state & st_cleanup) != 0)) {
        return;
    }
    m_state |= st_cleanup;
    for (int i = m_dep_cnt - 1; i >= 0; i--) {
        if (m_dep_idx[i] != nullptr) {
            m_dep_idx[i]->mod_cleanup();
            m_dep_idx[i]->Module::mod_cleanup();
        }
    }
}

/**
 * Register submodule.
 *
 * mod_register
 * ------------
 */
void
Module::mod_register(Module::ptr mod)
{
    if (mod->m_state & st_register) {
        return;
    }
    mod->m_state |= st_register;
    pthread_mutex_lock(&m_mod_mtx);

    /* Index the name and module id. */
    m_name_tab->insert_keystr(mod);
    m_name_tab->insert_chain(mod, &mod->m_id_link);

    if ((m_dep_cnt + 1) == m_dep_siz) {
        m_dep_siz = m_dep_siz * 2;
        Module::ptr *arr = new Module::ptr [m_dep_siz];
        for (int i = 0; i < m_dep_cnt; i++) {
            arr[i]       = m_dep_idx[i];
            m_dep_idx[i] = nullptr;
        }
        delete [] m_dep_idx;
        m_dep_idx = arr;
    }
    mod->m_index = m_dep_cnt;
    m_dep_idx[m_dep_cnt++] = mod;
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * mod_register_index
 * ------------------
 */
void
Module::mod_register_index(Module::ptr mod, int idx)
{
    assert((idx < m_dep_cnt) && (m_dep_idx != nullptr));
    assert((m_dep_idx[idx] == nullptr) || (m_dep_idx[idx] == mod));

    pthread_mutex_lock(&m_mod_mtx);
    mod->m_index   = idx;
    m_dep_idx[idx] = mod;
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * Unregister submodule.
 */
void
Module::mod_unregister(Module::ptr mod)
{
    if (m_name_tab != nullptr) {
        pthread_mutex_lock(&m_mod_mtx);
        m_name_tab->remove_obj(mod);
        m_name_tab->remove_chain(mod, &mod->m_id_link);

        if (mod->m_index != -1) {
            assert((mod->m_index < m_dep_cnt) && (m_dep_idx[mod->m_index] == mod));
            m_dep_idx[mod->m_index] = nullptr;
        }
        pthread_mutex_unlock(&m_mod_mtx);
    }
}

/**
 * Lookup submodule by name or id.
 */
Module::ptr
Module::mod_get(uint32_t id) const
{
    if (m_name_tab != nullptr) {
        return object_cast<Module>(m_name_tab->lookup(id));
    }
    return nullptr;
}

Module::ptr
Module::mod_get(const char *name) const
{
    if (m_name_tab != nullptr) {
        return object_cast<Module>(m_name_tab->lookup(name));
    }
    return nullptr;
}

/**
 * Lockstep execution API.
 */
Module::ptr
Module::mod_exec_lckstep(int id, uint32_t exec, int cnt, const ModTask steps[], ...)
{
    return this;
}

Module::ptr
Module::mod_wait_exec(int id)
{
    return this;
}

/**
 * Submit a request to this module executed by ThreadPool/ExeEvLoop.
 * The base class method only adds the request to a queue for tracking.
 */
void
Module::mod_exec(Request::ptr req)
{
    assert((req->rq_mod_qno >= 0) && (req->rq_mod_qno < m_nr_queue));
    enqueue(req, req->rq_mod_qno);
}

void
Module::mod_schedule(ThreadPool::ptr thp,
                     Request::ptr    req,
                     int             mod_qno,
                     int             thp_qno,
                     int             ms_now)
{
    req->rq_mod_qno = mod_qno;
    thp->schedule(this, req, thp_qno, ms_now);
}

void
Module::mod_schedule(ExeEvLoop::ptr evl, Request::ptr req, int qno)
{
}

/**
 * Tracking objects/requests using this module.
 */
void
Module::mod_enqueue(Object::ptr obj, int qno)
{
    assert((qno < m_nr_queue) && (m_queue != nullptr));
    m_queue[qno].dl_add_back(obj);
}

void
Module::mod_front_queue(Object::ptr obj, int qno)
{
    assert((qno < m_nr_queue) && (m_queue != nullptr));
    m_queue[qno].dl_add_front(obj);
}

Object::ptr
Module::mod_dequeue(int qno)
{
    assert((qno < m_nr_queue) && (m_queue != nullptr));
    return m_queue[qno].dl_rm_front();
}

void
Module::mod_swap_queue(Object::ptr obj, int qno)
{
    assert((qno < m_nr_queue) && (m_queue != nullptr));
    obj->obj_rm();
    m_queue[qno].dl_add_back(obj);
}

pthread_mutex_t * const
Module::mod_get_lock(int idx)
{
    assert((m_locks != nullptr) && (idx >= 0));
    return &m_locks[idx % m_nr_lock];
}

pthread_mutex_t * const
Module::mod_get_lock(const void *ptr)
{
    assert(m_locks != nullptr);
    return &m_locks[((uint64_t)(ptr) >> 4) % m_nr_lock];
}

/**
 * Allocate number of shared locks used for this module.  This method must be called
 * during the single threaded init. time.
 */
void
Module::mod_alloc_locks(int num)
{
    assert(m_locks == nullptr);
    m_locks   = new pthread_mutex_t [num];
    m_nr_lock = num;

    for (int i = 0; i < num; i++) {
        pthread_mutexattr_t attr;

        pthread_mutexattr_init(&attr);
        pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
        pthread_mutex_init(&m_locks[i], &attr);
    }
}

/**
 * Allocate number of queues for the module.  This method must be called during
 * singled threaded init. time.
 */
void
Module::mod_alloc_queue(int num)
{
    assert(m_queue == nullptr);
    m_queue    = new DListObj [num];
    m_nr_queue = num;
}

/**
 * Return raw program arguments.
 */
char **
Module::prog_args(int *argc)
{
    return Program::prog_args(argc);
}

/**
 * Allocate max. number of sub modules.
 */
void
Module::mod_alloc_depmod(int max)
{
    assert((m_dep_cnt == 0) && (m_dep_siz == 0) && (m_dep_idx == nullptr));

    m_dep_siz = max * 2;
    m_dep_idx = new Module::ptr [m_dep_siz];
    for (int i = 0; i <= m_dep_siz; i++) {
        m_dep_idx[i] = nullptr;
    }
}

/**
 * to_string
 * ---------
 */
size_t
Module::to_string(char *str, size_t len) const
{
    size_t off = snprintf(str, len,
                   "\tModule %p [%03d, nr_lock %02d, nr_queue %02d] %s\n",
                   this, m_dep_cnt, m_nr_lock, m_nr_queue, obj_keystr());
    if (off >= len) {
        return len;
    }
    for (int i = 0; i < m_dep_cnt; i++) {
        if (m_dep_idx[i] != nullptr) {
            auto lim = len - off;
            auto ret = m_dep_idx[i]->to_string(str + off, lim);

            off += ret;
            if (ret >= lim) {
                return len;
            }
        }
    }
    return off;
}

/*
 * ----------------------------------------------------------------------------------
 * Resource & Container
 *
 * A resource object can be identified by:
 * - Name (max).
 * - 64-bit id (uuid).
 * - Direct index to the container.
 *
 * A resource object also has:
 * - State that would work with the generic HSM state machine.
 * ----------------------------------------------------------------------------------
 */
Resource::~Resource() {}
Resource::Resource() :
    rs_idx(-1), rs_id(0), rs_id_link(nullptr)
{
    rs_name[0] = '\0';
}

Resource::Resource(uint64_t id) : Resource()
{
    rs_id = id;
}

Resource::Resource(const char *name) : Resource()
{
    memcpy(rs_name, name, rs_name_max);
}
Resource::Resource(uint64_t id, const char *name) : Resource()
{
    rs_id = id;
    memcpy(rs_name, name, rs_name_max);
}

/**
 * Use this method when the object was added to the container, it hasn't been
 * assigned the id.
 */
void
Resource::rs_update_id(uint64_t id)
{
    assert((rs_id == 0) && (rs_idx != -1));
    rs_id = id;

}

/**
 * Use this method when the object was added to the container, it hasn't been
 * assigned with the name.
 */
void
Resource::rs_update_name(const char *name)
{
    assert((rs_name[0] == '\0') && (rs_idx != -1));
}

/**
 * Generic container managing resources.
 */
RsContainer::~RsContainer()
{
    delete [] rs_array;
}

RsContainer::RsContainer(int max) :
    Module(max == 0 ? 67 : max),
    rs_cnt(0),
    rs_arr_elm(max),
    rs_array(nullptr),
    rs_iter_end(*this)
{
    if (max > 0) {
        rs_array = new Resource::ptr [max];
        for (int i = 0; i <= max; i++) {
            rs_array[i] = nullptr;
        }
        rs_iter_end.rs_curr = rs_array + max;
    }
}

/**
 * rs_resize_container
 * -------------------
 */
void
RsContainer::rs_resize_container(int max)
{
    if (max <= rs_arr_elm) {
        return;
    }
    int            i;
    Resource::ptr *arr = new Resource::ptr [max];

    pthread_mutex_lock(&m_mod_mtx);
    for (i = 0; i < rs_arr_elm; i++) {
        arr[i] = rs_array[i];
    }
    for (; i < max; i++) {
        arr[i] = nullptr;
    }
    Resource::ptr *tmp = rs_array;

    rs_array   = arr;
    rs_arr_elm = max;
    arr        = tmp;
    rs_iter_end.rs_curr = rs_array + max;
    pthread_mutex_unlock(&m_mod_mtx);

    delete [] rs_array;
}

/**
 * rs_add
 * ------
 */
void
RsContainer::rs_add(Resource::ptr rs)
{
    assert(m_name_tab != nullptr);
    pthread_mutex_lock(&m_mod_mtx);
    assert(rs_cnt < rs_arr_elm);

    if (rs->obj_keystr()[0] != '\0') {
        m_name_tab->insert_keystr(rs);
    }
    if (rs->obj_key64() != 0) {
        m_name_tab->insert_chain(rs, &rs->rs_id_link);
    }
    rs->rs_idx = -1;
    for (int i = 0; i < rs_arr_elm; i++) {
        if (rs_array[i] == nullptr) {
            rs_cnt++;
            rs->rs_idx  = i;
            rs_array[i] = rs;
            break;
        }
    }
    assert(rs->rs_idx != -1);
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * rs_add_index
 * ------------
 */
void
RsContainer::rs_add_index(Resource::ptr rs, int idx)
{
    assert((m_name_tab != nullptr) && (idx < rs_arr_elm));
    assert((rs_array[idx] == nullptr) || (rs_array[idx] == rs));

    pthread_mutex_lock(&m_mod_mtx);
    if (rs->obj_keystr()[0] != '\0') {
        m_name_tab->insert_keystr(rs);
    }
    if (rs->obj_key64() != 0) {
        m_name_tab->insert_chain(rs, &rs->rs_id_link);
    }
    rs->rs_idx    = idx;
    rs_array[idx] = rs;
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * rs_remove
 * ---------
 */
void
RsContainer::rs_remove(Resource::ptr rs)
{
    assert(m_name_tab != nullptr);
    assert((rs->rs_idx != -1) && (rs_array[rs->rs_idx] == rs));

    pthread_mutex_lock(&m_mod_mtx);
    m_name_tab->remove_obj(rs);
    m_name_tab->remove_chain(rs, &rs->rs_id_link);

    rs_cnt--;
    rs_array[rs->rs_idx] = nullptr;
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * rs_query
 * --------
 */
Resource::ptr
RsContainer::rs_query(uint64_t id)
{
    assert(m_name_tab != nullptr);
    pthread_mutex_lock(&m_mod_mtx);
    Object::ptr obj = m_name_tab->lookup(id);
    pthread_mutex_unlock(&m_mod_mtx);

    if (obj != nullptr) {
        return object_cast<Resource>(obj);
    }
    return nullptr;
}

Resource::ptr
RsContainer::rs_query(const char *name)
{
    assert(m_name_tab != nullptr);
    pthread_mutex_lock(&m_mod_mtx);
    Object::ptr obj = m_name_tab->lookup(name);
    pthread_mutex_unlock(&m_mod_mtx);

    if (obj != nullptr) {
        return object_cast<Resource>(obj);
    }
    return nullptr;
}

/**
 * rs_snapshot
 * -----------
 */
void
RsContainer::rs_snapshot(RsIterator &it)
{
    assert((rs_array != nullptr) && (it.rs_snap == nullptr));

    it.rs_size = rs_arr_elm;
    it.rs_snap = new Resource::ptr [it.rs_size];
    it.rs_curr = it.rs_snap;

    pthread_mutex_lock(&m_mod_mtx);
    for (int i = 0; i < it.rs_size; i++) {
        it.rs_snap[i] = rs_array[i];
    }
    pthread_mutex_unlock(&m_mod_mtx);
}

/*
 * -----------------------------------------------------------------------------------
 * Container Iterator
 * -----------------------------------------------------------------------------------
 */
RsIterator::~RsIterator()
{
    rs_curr = nullptr;
    if (rs_snap != nullptr) {
        assert(rs_size != 0);
        for (int i = 0; i < rs_size; i++) {
            rs_snap[i] = nullptr; /* deref to avoid memory leak. */
        }
        delete [] rs_snap;
    }
}

RsIterator::RsIterator() : rs_size(0), rs_curr(nullptr), rs_snap(nullptr) {}
RsIterator::RsIterator(RsContainer &ct) :
    rs_size(0), rs_curr(ct.rs_array), rs_snap(nullptr) {}
