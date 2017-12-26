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
#include <string.h>
#include <cpptype/hash-obj.h>
#include <cpptype/list-obj.h>

/*
 * ------------------------------------------------------------------------------------
 *  Embeded Double Linked List Hash
 * ------------------------------------------------------------------------------------
 */
DHashObj::DHashObj(int size) : m_end()
{
    dhash_init(&m_tab, size, dh_hash_keystr, dh_hash_cmp_keystr);
    m_end.m_iter.dh_tab  = &m_tab;
    m_end.m_iter.dh_curr = nullptr;
    m_end.m_iter.dh_iter = nullptr;
}

DHashObj::~DHashObj()
{
    dhash_free(&m_tab, nullptr, m_tab.dh_bk_size);
}

/**
 * remove_obj
 * ----------
 */
int
DHashObj::remove_obj(Object::ptr obj)
{
    assert(obj != nullptr);
    assert(obj->m_chain.obj_ptr() == obj);
    dhash_takeout_elm(&m_tab, &obj->m_chain.ol_link);

    dlist_init(&obj->m_chain.ol_link);
    obj->m_chain.obj_deref(obj);
    return 0;
}

/**
 * dl_hash_key64
 * -------------
 * Use obj->obj_key64 method to insert the object into this hash table.
 */
int
DHashObj::dh_hash_key64(int bk_size, const dhash_elm_t *elm)
{
    const Object::ptr obj = Object::obj_cptr(elm);

    verify(obj != nullptr);
    assert((&obj->m_chain.ol_link == elm) || (obj->m_chain.obj_ptr() == obj));

    return obj->obj_hash64(bk_size, obj->obj_key64());
}

/**
 * dl_hash_cmp_key64
 * -----------------
 */
int
DHashObj::dh_hash_cmp_key64(const dhash_elm_t *elm1, const dhash_elm_t *elm2)
{
    const Object::ptr obj = Object::obj_cptr(elm1);
    const Object::ptr cmp = Object::obj_cptr(elm2);

    verify((obj != nullptr) && (cmp != nullptr));
    assert((&obj->m_chain.ol_link == elm1) || (obj->m_chain.obj_ptr() == obj));
    assert((&cmp->m_chain.ol_link == elm2) || (cmp->m_chain.obj_ptr() == cmp));

    return obj->obj_compare64(cmp->obj_key64());;
}

/**
 * insert_key64
 * ------------
 */
int
DHashObj::insert_key64(Object::ptr obj)
{
    verify(obj->m_chain.ol_ptr == nullptr);
    obj->m_chain.ol_ptr = obj;

    return dhash_insert_elm(&m_tab, &obj->m_chain.ol_link, dh_hash_key64);
}

/**
 * lookup
 * ------
 */
Object::ptr
DHashObj::lookup(uint64_t key)
{
    ObjKeyFind   seed(key, true);
    dhash_elm_t *ret;

    ret = dhash_find_elm(&m_tab,
                         &seed.m_chain.ol_link,
                         dh_hash_key64, dh_hash_cmp_key64);
    if (ret == nullptr) {
        return nullptr;
    }
    return Object::obj_ptr(ret);
}

/**
 * dh_hash_keystr
 * --------------
 * Use obj->obj_keystr method to insert the object into this hash table.
 */
int
DHashObj::dh_hash_keystr(int bk_size, const dhash_elm_t *elm)
{
    const Object::ptr obj = Object::obj_cptr(elm);

    verify(obj != nullptr);
    assert((&obj->m_chain.ol_link == elm) || (obj->m_chain.obj_ptr() == obj));

    return obj->obj_hash_str(bk_size, obj->obj_keystr());
}

/**
 * dh_hash_cmp_keystr
 * ------------------
 */
int
DHashObj::dh_hash_cmp_keystr(const dhash_elm_t *elm1, const dhash_elm_t *elm2)
{
    const Object::ptr obj = Object::obj_cptr(elm1);
    const Object::ptr cmp = Object::obj_cptr(elm2);

    verify((obj != nullptr) && (cmp != nullptr));
    assert((&obj->m_chain.ol_link == elm1) || (obj->m_chain.obj_ptr() == obj));
    assert((&cmp->m_chain.ol_link == elm2) || (cmp->m_chain.obj_ptr() == cmp));

    return obj->obj_compare_str(cmp->obj_keystr());
}

/**
 * insert_keystr
 * -------------
 */
int
DHashObj::insert_keystr(Object::ptr obj)
{
    verify(obj->m_chain.ol_ptr == nullptr);
    obj->m_chain.ol_ptr = obj;

    return dhash_insert(&m_tab, &obj->m_chain.ol_link);
}

/**
 * lookup
 * ------
 */
Object::ptr
DHashObj::lookup(const char *key)
{
    ObjKeyFind   seed(key, true);
    dhash_elm_t *ret;
    
    ret = dhash_find_elm(&m_tab,
                         &seed.m_chain.ol_link,
                         dh_hash_keystr, dh_hash_cmp_keystr);
    if (ret == nullptr) {
        return nullptr;
    }
    return Object::obj_ptr(ret);
}

/**
 * dh_hash_chain
 * -------------
 * Use obj->obj_keychain method to insert the object into this hash table.
 */
int
DHashObj::dh_hash_chain(int bk_size, const dhash_elm_t *elm)
{
    const Object::ptr obj = ODlink::obj_cptr(elm);

    /* XXX: assert to make sure the embeded link is within obj. */
    assert(obj != nullptr);
    return obj->obj_hash_dlink(bk_size, &obj->m_chain);
}

/**
 * dl_hash_cmp_chain
 * -----------------
 */
int
DHashObj::dh_hash_cmp_chain(const dhash_elm_t *elm1, const dhash_elm_t *elm2)
{
    const ODlink      *cmp = reinterpret_cast<const ODlink *>(elm2);
    const Object::ptr  obj = Object::obj_cptr(elm1);

    verify((obj != nullptr) && (cmp != nullptr));
    assert((&obj->m_chain.ol_link == elm1) || (obj->m_chain.obj_ptr() == obj));

    return obj->obj_compare_dlink(cmp);
}

/**
 * insert_chain
 * ------------
 */
int
DHashObj::insert_chain(Object::ptr obj, ODlink *p)
{
    verify((obj != nullptr) && (p != nullptr));
    p->obj_ref(obj);

    return dhash_insert_elm(&m_tab, &p->ol_link, dh_hash_chain);
}

/**
 * remove_chain
 * ------------
 */
int
DHashObj::remove_chain(Object::ptr obj, ODlink *p)
{
    dhash_takeout_elm(&m_tab, &p->ol_link);

    dlist_init(&p->ol_link);
    p->obj_deref(obj);
    return 0;
}

/**
 * lookup
 * ------
 */
Object::ptr
DHashObj::lookup(const ODlink *p)
{
    dhash_elm_t *res;
    
    res = dhash_find_elm(&m_tab, const_cast<dlist_t *>(&p->ol_link),
                         dh_hash_chain, dh_hash_cmp_chain);
    if (res != nullptr) {
        return ODlink::obj_ptr(res);
    }
    return nullptr;
}

/**
 * clear
 * -----
 */
void
DHashObj::clear()
{
    for (auto it = this->begin(); it != this->end(); it++) {
        Object::ptr obj = it.iter_takeout();
    }
}

/**
 * DHashObj iterator
 */
DHashObjIter::DHashObjIter() {}
DHashObjIter::DHashObjIter(DHashObj &h)
{
    dhash_iter_init(&h.m_tab, &m_iter);
}

bool
DHashObjIter::operator ==(const DHashObjIter &rhs)
{
    if ((m_iter.dh_tab == rhs.m_iter.dh_tab) &&
        (m_iter.dh_curr == rhs.m_iter.dh_curr) &&
        (m_iter.dh_iter == rhs.m_iter.dh_iter)) {
        return true;
    }
    return false;
}

Object::ptr
DHashObjIter::value()
{
    dlist_t *cur = m_iter.dh_iter;

    if (cur != nullptr) {
        return ODlink::obj_ptr(cur);
    }
    return nullptr;
}

const char *
DHashObjIter::key()
{
    Object::ptr val = value();
    return val != nullptr ? val->obj_keystr() : nullptr;
}

/*
 * ------------------------------------------------------------------------------------
 *  Embeded Single Linked List Hash
 * ------------------------------------------------------------------------------------
 */
SHashObj::SHashObj(int size) : m_end()
{
    shash_init(&m_tab, size, sh_hash_chain, sh_hash_cmp_chain);
    m_end.m_iter.sh_tab  = &m_tab;
    m_end.m_iter.sh_curr = nullptr;
    m_end.m_iter.sh_iter.sl_curr = nullptr;
    m_end.m_iter.sh_iter.sl_curr = nullptr;
}

SHashObj::~SHashObj()
{
    shash_free(&m_tab, nullptr, m_tab.sh_bk_size);
}

/**
 * sh_hash_chain
 * -------------
 */
int
SHashObj::sh_hash_chain(int size, const shash_elm_t *elm)
{
    const Object::ptr obj = OSlink::obj_cptr(elm);

    assert(obj != nullptr);
    return obj->obj_hash_slink(size, OSlink::oslink_cptr(elm));
}

/**
 * sh_hash_cmp_chain
 * -----------------
 */
int
SHashObj::sh_hash_cmp_chain(const shash_elm_t *e1, const shash_elm_t *e2)
{
    const OSlink      *cmp = reinterpret_cast<const OSlink *>(e2);
    const Object::ptr  obj = Object::obj_cptr(e1);

    assert((obj != nullptr) && (cmp != nullptr));
    return obj->obj_compare_slink(cmp);
}

/**
 * insert_chain
 * ------------
 */
int
SHashObj::insert_chain(Object::ptr obj, OSlink *p)
{
    assert((obj != nullptr) && (p != nullptr));
    p->obj_ref(obj);

    return shash_insert(&m_tab, &p->ol_link);
}

/**
 * remove_chain
 * ------------
 */
int
SHashObj::remove_chain(Object::ptr obj, OSlink *p)
{
    shash_takeout_elm(&m_tab, &p->ol_link);
    p->obj_deref(obj);
    return 0;
}

/**
 * lookup
 * ------
 */
Object::ptr
SHashObj::lookup(const OSlink *p)
{
    shash_elm_t *res;

    res = shash_find(&m_tab, const_cast<slink_t *>(&p->ol_link));
    if (res != nullptr) {
        return OSlink::obj_ptr(res);
    }
    return nullptr;
}

/**
 * clear
 * -----
 */
void
SHashObj::clear()
{
    for (auto it = this->begin(); it != this->end(); it++) {
        Object::ptr obj = it.iter_takeout();
    }
}

/**
 * SHashObj iterator
 */
SHashObjIter::SHashObjIter() {}
SHashObjIter::SHashObjIter(SHashObj &h)
{
    shash_iter_init(&h.m_tab, &m_iter);
}

bool
SHashObjIter::operator ==(const SHashObjIter &rhs)
{
    if ((m_iter.sh_tab == rhs.m_iter.sh_tab) &&
        (m_iter.sh_curr == rhs.m_iter.sh_curr) &&
        (m_iter.sh_iter.sl_curr == rhs.m_iter.sh_iter.sl_curr)) {
        return true;
    }
    return false;
}

Object::ptr
SHashObjIter::value()
{
    slink_t *cur = m_iter.sh_iter.sl_curr;

    if (cur != nullptr) {
        return OSlink::obj_ptr(cur);
    }
    return nullptr;
}

const char *
SHashObjIter::key()
{
    Object::ptr val = value();
    return val != nullptr ? val->obj_keystr() : nullptr;
}

/*
 * ------------------------------------------------------------------------------------
 *  String key/value hash map
 * ------------------------------------------------------------------------------------
 */
StringKvIter::StringKvIter() {}
StringKvIter::StringKvIter(StringKvMap &h)
{
    shash_iter_init(&h.m_tab, &m_iter);
}

/**
 * value
 * -----
 */
void *
StringKvIter::value()
{
    slink_t *link = m_iter.sh_iter.sl_curr;

    if (link != nullptr) {
        string_kv_t *kv = object_of(string_kv_t, s_link, link);
        return kv->s_value;
    }
    return nullptr;
}

/**
 * key
 * ---
 */
const char *
StringKvIter::key()
{
    slink_t *link = m_iter.sh_iter.sl_curr;

    if (link != nullptr) {
        string_kv_t *kv = object_of(string_kv_t, s_link, link);
        return kv->s_key;
    }
    return nullptr;
}

Object::ptr
StringKvIter::operator *()
{
    slink_t *cur = m_iter.sh_iter.sl_curr;

    if (cur != nullptr) {
        string_kv_t *rec = object_of(string_kv_t, s_link, cur);
        return rec->s_obj;
    }
    return nullptr;
}

bool
StringKvIter::operator ==(const StringKvIter &rhs)
{
    if ((m_iter.sh_tab == rhs.m_iter.sh_tab) &&
        (m_iter.sh_curr == rhs.m_iter.sh_curr) &&
        (m_iter.sh_iter.sl_curr == rhs.m_iter.sh_iter.sl_curr)) {
        return true;
    }
    return false;
}

/**
 * iter_takeout
 * ------------
 */
Object::ptr
StringKvIter::iter_takeout(void **val)
{
    slink_t *cur = shash_iter_rm_curr(&m_iter);

    if (cur != nullptr) {
        string_kv_t *kv  = object_of(string_kv_t, s_link, cur);
        Object::ptr  obj = kv->s_obj;

        *val      = kv->s_value;
        kv->s_obj = nullptr;
        free(kv);
        return obj;
    }
    return nullptr;
}

StringKvMap::StringKvMap(int size) : m_end()
{
    shash_init(&m_tab, size, sh_hash_chain, sh_hash_cmp_chain);
    memset(&m_end, 0, sizeof(m_end));
    m_end.m_iter.sh_tab = &m_tab;
}

StringKvMap::~StringKvMap()
{
    shash_free(&m_tab, nullptr, m_tab.sh_bk_size);
}

/**
 * sh_hash_chain
 * -------------
 */
int
StringKvMap::sh_hash_chain(int size, const shash_elm_t *elm)
{
    string_kv_t *rec = object_of(string_kv_t, s_link, elm);
    return Object::obj_hash_strfn(size, rec->s_key);
}

/**
 * sh_hash_cmp_chain
 * -----------------
 */
int
StringKvMap::sh_hash_cmp_chain(const shash_elm_t *e1, const shash_elm_t *e2)
{
    const string_kv_t *r1 = object_of(string_kv_t, s_link, e1);
    const string_kv_t *r2 = object_of(string_kv_t, s_link, e2);

    return strcmp(r1->s_key, r2->s_key);
}

/**
 * insert
 * ------
 */
int
StringKvMap::insert(const char *key, void *value, bool cpy)
{
    int          size;
    string_kv_t *rec;

    if (cpy == true) {
        size = sizeof(*rec) + strlen(key) + 1;
    } else {
        size = sizeof(*rec);
    }
    rec = alloc(size, key, value);
    return shash_insert(&m_tab, &rec->s_link);
}

int
StringKvMap::insert(const char *key, Object::ptr value, bool cpy)
{
    int          size;
    string_kv_t *rec;

    if (cpy == true) {
        size = sizeof(*rec) + strlen(key) + 1;
    } else {
        size = sizeof(*rec);
    }
    rec = alloc(size, key, value);
    return shash_insert(&m_tab, &rec->s_link);
}

/**
 * remove
 * ------
 */
Object::ptr
StringKvMap::remove(const char *key, void **val)
{
    string_kv_t  fnd; fnd.s_key = key;
    shash_elm_t *lnk = shash_rm(&m_tab, &fnd.s_link);

    if (lnk != nullptr) {
        string_kv_t *rec = object_of(string_kv_t, s_link, lnk);
        Object::ptr  obj = rec->s_obj;

        *val       = rec->s_value;
        rec->s_obj = nullptr;  /* deref it */
        free(rec);
        return obj;
    }
    *val = nullptr;
    return nullptr;
}

/**
 * value
 * -----
 */
void *
StringKvMap::value(const char *key)
{
    string_kv_t  fnd; fnd.s_key = key;
    shash_elm_t *lnk = shash_find(&m_tab, &fnd.s_link);

    if (lnk != nullptr) {
        string_kv_t *rec = object_of(string_kv_t, s_link, lnk);
        return rec->s_value;
    }
    return nullptr;
}

/**
 * object
 * ------
 */
Object::ptr
StringKvMap::object(const char *key)
{
    string_kv_t  fnd; fnd.s_key = key;
    shash_elm_t *lnk = shash_find(&m_tab, &fnd.s_link);

    if (lnk != nullptr) {
        string_kv_t *rec = object_of(string_kv_t, s_link, lnk);
        return rec->s_obj;
    }
    return nullptr;
}

/**
 * alloc
 * -----
 */
string_kv_t *
StringKvMap::alloc(size_t size, const char *key, void *val)
{
    string_kv_t *ret = (string_kv_t *)malloc(size);

    memset(ret, 0, sizeof(*ret));
    if (size > sizeof(*ret)) {
        int i;

        for (i = 0; key[i] != '\0'; i++) {
            ret->s_keyspace[i] = key[i];
        }
        ret->s_keyspace[i++] = '\0';
        ret->s_key = ret->s_keyspace;
        assert((i + sizeof(*ret)) == size);
    } else {
        assert(size == sizeof(*ret));
        ret->s_key = key;
    }
    ret->s_value = val;
    return ret;
}

string_kv_t *
StringKvMap::alloc(size_t size, const char *key, Object::ptr val)
{
    string_kv_t *ret = alloc(size, key, nullptr);
    ret->s_obj = val;
    return ret;
}

/**
 * clear
 * -----
 */
void
StringKvMap::clear()
{
    void *val;

    for (auto it = this->begin(); it != this->end(); it++) {
        Object::ptr obj = it.iter_takeout(&val);
    }
}

/*
 * ------------------------------------------------------------------------------------
 *  uint64 key/value hash map
 * ------------------------------------------------------------------------------------
 */
Uint64KvIter::Uint64KvIter() {}
Uint64KvIter::Uint64KvIter(Uint64KvMap &h)
{
    shash_iter_init(&h.m_tab, &m_iter);
}

/**
 * value
 * -----
 */
void *
Uint64KvIter::value()
{
    slink_t *link = m_iter.sh_iter.sl_curr;

    if (link != nullptr) {
        uint64_kv_t *kv = object_of(uint64_kv_t, s_link, link);
        return kv->s_value;
    }
    return nullptr;
}

/**
 * key
 * ---
 */
uint64_t
Uint64KvIter::key()
{
    slink_t *link = m_iter.sh_iter.sl_curr;

    if (link != nullptr) {
        uint64_kv_t *kv = object_of(uint64_kv_t, s_link, link);
        return kv->s_key;
    }
    return (-1);
}

Object::ptr
Uint64KvIter::operator *()
{
    slink_t *cur = m_iter.sh_iter.sl_curr;

    if (cur != nullptr) {
        uint64_kv_t *rec = object_of(uint64_kv_t, s_link, cur);
        return rec->s_obj;
    }
    return nullptr;
}

/**
 * iter_takeout
 * ------------
 */
Object::ptr
Uint64KvIter::iter_takeout(void **val)
{
    slink_t *cur = shash_iter_rm_curr(&m_iter);

    if (cur != nullptr) {
        uint64_kv_t *kv  = object_of(uint64_kv_t, s_link, cur);
        Object::ptr  obj = kv->s_obj;

        *val      = kv->s_value;
        kv->s_obj = nullptr;
        free(kv);
        return obj;
    }
    return nullptr;
}

Uint64KvMap::Uint64KvMap(int size) : m_end()
{
    shash_init(&m_tab, size, sh_hash_chain, sh_hash_cmp_chain);
    memset(&m_end, 0, sizeof(m_end));
    m_end.m_iter.sh_tab = &m_tab;
}

Uint64KvMap::~Uint64KvMap()
{
    shash_free(&m_tab, nullptr, m_tab.sh_bk_size);
}

/**
 * sh_hash_chain
 * -------------
 */
int
Uint64KvMap::sh_hash_chain(int size, const shash_elm_t *elm)
{
    uint64_kv_t *rec = object_of(uint64_kv_t, s_link, elm);
    return rec->s_key % size;
}

/**
 * sh_hash_cmp_chain
 * -----------------
 */
int
Uint64KvMap::sh_hash_cmp_chain(const shash_elm_t *e1, const shash_elm_t *e2)
{
    const uint64_kv_t *r1 = object_of(uint64_kv_t, s_link, e1);
    const uint64_kv_t *r2 = object_of(uint64_kv_t, s_link, e2);

    return r1->s_key - r2->s_key;
}

/**
 * insert
 * ------
 */
int
Uint64KvMap::insert(uint64_t key, void *value)
{
    uint64_kv_t *rec = alloc(sizeof(*rec), key, value);
    return shash_insert(&m_tab, &rec->s_link);
}

int
Uint64KvMap::insert(uint64_t key, Object::ptr value)
{
    uint64_kv_t *rec = alloc(sizeof(*rec), key, value);
    return shash_insert(&m_tab, &rec->s_link);
}

/**
 * remove
 * ------
 */
Object::ptr
Uint64KvMap::remove(uint64_t key, void **val)
{
    uint64_kv_t  fnd; fnd.s_key = key;
    shash_elm_t *lnk = shash_rm(&m_tab, &fnd.s_link);

    if (lnk != nullptr) {
        uint64_kv_t *rec = object_of(uint64_kv_t, s_link, lnk);
        Object::ptr  obj = rec->s_obj;

        *val       = rec->s_value;
        rec->s_obj = nullptr;  /* deref it */
        free(rec);
        return obj;
    }
    *val = nullptr;
    return nullptr;
}

/**
 * value
 * -----
 */
void *
Uint64KvMap::value(uint64_t key)
{
    uint64_kv_t  fnd; fnd.s_key = key;
    shash_elm_t *lnk = shash_find(&m_tab, &fnd.s_link);

    if (lnk != nullptr) {
        uint64_kv_t *rec = object_of(uint64_kv_t, s_link, lnk);
        return rec->s_value;
    }
    return nullptr;
}

/**
 * object
 * ------
 */
Object::ptr
Uint64KvMap::object(uint64_t key)
{
    uint64_kv_t  fnd; fnd.s_key = key;
    shash_elm_t *lnk = shash_find(&m_tab, &fnd.s_link);

    if (lnk != nullptr) {
        uint64_kv_t *rec = object_of(uint64_kv_t, s_link, lnk);
        return rec->s_obj;
    }
    return nullptr;
}

/**
 * alloc
 * -----
 */
uint64_kv_t *
Uint64KvMap::alloc(size_t size, uint64_t key, void *val)
{
    uint64_kv_t *ret = (uint64_kv_t *)malloc(size);

    memset(ret, 0, sizeof(*ret));
    ret->s_key   = key;
    ret->s_value = val;
    return ret;
}

uint64_kv_t *
Uint64KvMap::alloc(size_t size, uint64_t key, Object::ptr val)
{
    uint64_kv_t *ret = alloc(size, key, nullptr);
    ret->s_obj = val;
    return ret;
}

/**
 * clear
 * -----
 */
void
Uint64KvMap::clear()
{
    void *val;

    for (auto it = this->begin(); it != this->end(); it++) {
        Object::ptr obj = it.iter_takeout(&val);
    }
}
