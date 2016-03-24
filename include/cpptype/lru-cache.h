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
#ifndef _INCLUDE_CPPTYPE_LRU_CACHE_H_
#define _INCLUDE_CPPTYPE_LRU_CACHE_H_

#include <string>
#include <cpptype/list-obj.h>
#include <cpptype/hash-obj.h>

class LruTable;
class LruTabIter;

class LruObj : public Object
{
  public:
    OBJECT_COMMON_DEFS(LruObj);

    inline void ref_lru();

  protected:
    friend class LruTable;
    friend class LruTabIter;
    ODlink                   m_lru;
    LruTable                *m_tab;

    LruObj() : m_lru(nullptr) {}

    /*
     * Override obj_key64() or obj_keystr() for better hash lookup.
     * If using std::string as type, override obj_compare_str() method.
     */
};

class LruTabIter : public DHashObjIter
{
  public:
    LruTabIter(DHashObj &h) : DHashObjIter(h) {}

    const std::string *key();
    LruObj::ptr        value();
    uint64_t           key_u64();

    inline LruObj::ptr operator *() {
        return value();
    }
    bool operator ==(const LruTabIter &rhs) const;
    inline bool operator !=(const LruTabIter &rhs) const {
        return !(*this == rhs);
    }
    inline LruTabIter &operator ++()
    {
        dhash_iter_next(&m_iter);
        return *this;
    }
    inline LruTabIter operator ++(int)
    {
        LruTabIter ret = *this;
        dhash_iter_next(&m_iter);
        return ret;
    }
    inline LruObj::ptr iter_takeout()
    {
        dlist_t *cur = dhash_iter_rm_curr(&m_iter);
        if (cur != nullptr) {
            auto obj = ODlink::obj_detach(cur);
            auto elm = object_cast<LruObj>(obj.get());
            elm->m_lru.obj_rm();
            return elm;
        }
        return nullptr;
    }

    template <typename T>
    inline boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }
};

class LruTable
{
  public:
    typedef std::function<void(LruTable *, LruObj::ptr, uint64_t)>            lru_u64_cb;
    typedef std::function<void(LruTable *, LruObj::ptr, const std::string &)> lru_str_cb;

    explicit LruTable(int max_elm);
    virtual ~LruTable();

    bool insert_key64(LruObj::ptr obj);
    bool insert_keystr(LruObj::ptr obj);
    bool remove_obj(LruObj::ptr obj);
    void clear();
    void ref_obj(LruObj::ptr obj);

    LruObj::ptr lookup(uint64_t key);
    LruObj::ptr lookup(const char *key);
    LruObj::ptr lookup(const std::string &key);

    void lookup(uint64_t key, lru_u64_cb cb);
    void lookup(const char *key, lru_str_cb cb);
    void lookup(const std::string &key, lru_str_cb cb);

    virtual LruObj::ptr lookup_missed(uint64_t key) = 0;
    virtual LruObj::ptr lookup_missed(const std::string &key) = 0;

    virtual void lookup_missed(uint64_t key, lru_u64_cb cb) = 0;
    virtual void lookup_missed(const std::string &key, lru_str_cb cb) = 0;

    inline LruTabIter begin() {
        return LruTabIter(m_hash);
    }
    inline LruTabIter &end() {
        return m_hash_end;
    }
    inline void acquire_mtx() {
        pthread_mutex_lock(&m_lock);
    }
    inline void release_mtx() {
        pthread_mutex_unlock(&m_lock);
    }

    void dump_stat();

  protected:
    int                      m_max_elm;
    int                      m_hit_cnt;
    int                      m_miss_cnt;
    int                      m_kick_cnt;
    DHashObj                 m_hash;
    DListObj                 m_lru;
    LruTabIter               m_hash_end;
    pthread_mutex_t          m_lock;

    void ref_obj_nolock(LruObj::ptr obj);
};

/**
 * ref_lru
 * -------
 */
inline void
LruObj::ref_lru()
{
    m_tab->ref_obj(this);
}

#endif /* _INCLUDE_CPPTYPE_LRU_CACHE_H_ */
