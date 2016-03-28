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
#ifndef _CPPTYPE_HASH_OBJ_H_
#define _CPPTYPE_HASH_OBJ_H_

#include <iterator>
#include <ctype/hash.h>
#include <cpptype/object.h>

class DHashObj;
class SHashObj;

/**
 * Iterator for hash map using double embeded links.
 * Example of hash iterator usage is in json-obj.cpp
 */
class DHashObjIter : public std::iterator<std::input_iterator_tag, Object>
{
  public:
    DHashObjIter(DHashObj &h);

    const char *key();
    Object::ptr value();
    inline Object::ptr operator *() { return value(); }

    bool operator ==(const DHashObjIter &rhs);

    inline bool operator !=(const DHashObjIter &rhs) {
        return !(*this == rhs);
    }
    inline DHashObjIter &operator ++() {
        dhash_iter_next(&m_iter);
        return *this;
    }
    inline DHashObjIter operator ++(int) {
        DHashObjIter ret = *this;
        dhash_iter_next(&m_iter);
        return ret;
    }
    inline Object::ptr iter_takeout() {
        dlist_t *cur = dhash_iter_rm_curr(&m_iter);
        if (cur != NULL) {
            return ODlink::obj_detach(cur);
        }
        return NULL;
    }
    template <typename T>
    inline boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }

  protected:
    dhash_iter_t             m_iter;

    friend class DHashObj;
    DHashObjIter();
};

/**
 * Iterator for hash map using single embeded link.
 */
class SHashObjIter : public std::iterator<std::input_iterator_tag, Object>
{
  public:
    SHashObjIter(SHashObj &h);

    const char *key();
    Object::ptr value();
    inline Object::ptr operator *() { return value(); }

    bool operator ==(const SHashObjIter &rhs);

    inline bool operator !=(const SHashObjIter &rhs) {
        return !(*this == rhs);
    }
    inline SHashObjIter &operator ++(int) {
        shash_iter_next(&m_iter);
        return *this;
    }
    inline SHashObjIter operator ++() {
        SHashObjIter ret = *this;
        shash_iter_next(&m_iter);
        return ret;
    }
    inline Object::ptr iter_takeout() {
        slink_t *cur = shash_iter_rm_curr(&m_iter);
        if (cur != NULL) {
            return OSlink::obj_detach(cur);
        }
        return NULL;
    }
    template <typename T>
    boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }

  protected:
    shash_iter_t             m_iter;

    friend class SHashObj;
    SHashObjIter();
};

/**
 * ----------------------------------------------------------------------------------
 * Hash table with double embeded links.
 * ----------------------------------------------------------------------------------
 */
class DHashObj
{
  public:
    DHashObj(int size);
    virtual ~DHashObj();

    int insert_key64(Object::ptr obj);
    int insert_keystr(Object::ptr obj);
    int insert_chain(Object::ptr obj, ODlink *p);

    int remove_obj(Object::ptr obj);
    int remove_chain(Object::ptr obj, ODlink *p);

    Object::ptr lookup(uint64_t key);
    Object::ptr lookup(const char *key);
    Object::ptr lookup(const ODlink *p);

    template <class T>
    inline T lookup(ODlink *p) {
        return object_cast<T>(lookup(p));
    }

    void clear();

    inline int size() {
        return m_tab.dh_elm_cnt;
    }

    /**
     * Standard C++ iterator functions.
     */
    inline DHashObjIter  begin() {
        return DHashObjIter(*this);
    }
    inline DHashObjIter &end() {
        return m_end;
    }

  private:
    friend class DHashObjIter;

    dhash_t                  m_tab;
    DHashObjIter             m_end;

    /**
     * C-lib plugin functions.
     */
    static int dh_hash_key64(int, const dhash_elm_t *);
    static int dh_hash_cmp_key64(const dhash_elm_t *, const dhash_elm_t *);

    static int dh_hash_keystr(int, const dhash_elm_t *);
    static int dh_hash_cmp_keystr(const dhash_elm_t *, const dhash_elm_t *);

    static int dh_hash_chain(int, const dhash_elm_t *);
    static int dh_hash_cmp_chain(const dhash_elm_t *, const dhash_elm_t *);
};

/**
 * ----------------------------------------------------------------------------------
 * Hash table with single embeded link.
 * ----------------------------------------------------------------------------------
 */
class SHashObj
{
  public:
    SHashObj(int size);
    virtual ~SHashObj();

    int insert_chain(Object::ptr obj, OSlink *p);
    int remove_chain(Object::ptr obj, OSlink *p);
    Object::ptr lookup(const OSlink *p);
    void clear();

    template <class T>
    inline T lookup(const OSlink *p) {
        return object_cast<T>(lookup(p));
    }
    inline SHashObjIter begin() {
        return SHashObjIter(*this);
    }
    inline SHashObjIter &end() {
        return m_end;
    }

  private:
    friend class SHashObjIter;

    shash_t                  m_tab;
    SHashObjIter             m_end;

    /**
     * C-lib plugin functions.
     */
    static int sh_hash_chain(int, const shash_elm_t *);
    static int sh_hash_cmp_chain(const shash_elm_t *, const shash_elm_t *);
};

/**
 * ----------------------------------------------------------------------------------
 * Hash table for string key/void *value
 * ----------------------------------------------------------------------------------
 */
typedef struct string_kv string_kv_t;
struct string_kv
{
    shash_elm_t              s_link;
    const char              *s_key;
    void                    *s_value;
    Object::ptr              s_obj;
    char                     s_keyspace[0];
};

class StringKvMap;
class StringKvIter : public std::iterator<std::input_iterator_tag, Object>
{
  public:
    StringKvIter(StringKvMap &h);

    void *value();
    Object::ptr operator *();
    bool operator ==(const StringKvIter &rhs);

    const char *key();
    Object::ptr iter_takeout(void **val);

    inline bool operator !=(const StringKvIter &rhs) {
        return !(*this == rhs);
    }
    inline StringKvIter &operator ++(int) {
        shash_iter_next(&m_iter);
        return *this;
    }
    inline StringKvIter operator ++() {
        StringKvIter ret = *this;
        shash_iter_next(&m_iter);
        return ret;
    }
    template <typename T>
    boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }

  protected:
    shash_iter_t             m_iter;

    friend class StringKvMap;
    StringKvIter();
};

/**
 * String key/value hash map
 */
class StringKvMap
{
  public:
    StringKvMap(int size);
    virtual ~StringKvMap();

    int insert(const char *key, void *value, bool cpy = false);
    int insert(const char *key, Object::ptr value, bool cpy = false);
    Object::ptr remove(const char *key, void **val);

    void *value(const char *key);
    Object::ptr object(const char *key);

    void clear();

    inline StringKvIter begin() {
        return StringKvIter(*this);
    }
    inline StringKvIter &end() {
        return m_end;
    }

  protected:
    virtual string_kv_t *alloc(size_t size, const char *key, void *val);
    virtual string_kv_t *alloc(size_t size, const char *key, Object::ptr val);

  private:
    friend class StringKvIter;

    shash_t                  m_tab;
    StringKvIter             m_end;

    /**
     * C-lib plugin functions.
     */
    static int sh_hash_chain(int, const shash_elm_t *);
    static int sh_hash_cmp_chain(const shash_elm_t *, const shash_elm_t *);
};

/**
 * ----------------------------------------------------------------------------------
 * Hash table for 64-bit key/void *value
 * ----------------------------------------------------------------------------------
 */
typedef struct uint64_kv uint64_kv_t;
struct uint64_kv
{
    shash_elm_t              s_link;
    uint64_t                 s_key;
    void                    *s_value;
    Object::ptr              s_obj;
};

class Uint64KvMap;
class Uint64KvIter : public StringKvIter
{
  public:
    explicit Uint64KvIter(Uint64KvMap &h);

    void *value();
    Object::ptr operator *();
    bool operator ==(const StringKvIter &rhs);

    uint64_t key();
    Object::ptr iter_takeout(void **val);

  protected:
    friend class Uint64KvMap;
    Uint64KvIter();
};

/**
 * Uint64 key/value hash map
 */
class Uint64KvMap
{
  public:
    Uint64KvMap(int size);
    virtual ~Uint64KvMap();

    int insert(uint64_t key, void *value);
    int insert(uint64_t key, Object::ptr value);
    Object::ptr remove(uint64_t key, void **val);

    void *value(uint64_t key);
    Object::ptr object(uint64_t key);

    void clear();

    inline Uint64KvIter begin() {
        return Uint64KvIter(*this);
    }
    inline Uint64KvIter &end() {
        return m_end;
    }

  protected:
    virtual uint64_kv_t *alloc(size_t size, uint64_t key, void *val);
    virtual uint64_kv_t *alloc(size_t size, uint64_t key, Object::ptr val);

  private:
    friend class Uint64KvIter;

    shash_t                  m_tab;
    Uint64KvIter             m_end;

    /**
     * C-lib plugin functions.
     */
    static int sh_hash_chain(int, const shash_elm_t *);
    static int sh_hash_cmp_chain(const shash_elm_t *, const shash_elm_t *);
};

#endif /* _CPPTYPE_HASH_OBJ_H_ */
