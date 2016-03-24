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
#include <cpptype/list-obj.h>

/**
 * ----------------------------------------------------------------------------------
 *  Double Linked List.
 * ----------------------------------------------------------------------------------
 */
DListObj::~DListObj() {}
DListObj::DListObj() : m_end(&m_list)
{
    dlist_init(&m_list);
}

int
DListObj::dl_cmp_key64(const dlist_t *e1, const dlist_t *e2)
{
    const Object::ptr o1 = ODlink::obj_cptr(e1);
    const Object::ptr o2 = ODlink::obj_cptr(e2);

    return o1->obj_compare64(o2->obj_key64());
}

int
DListObj::dl_cmp_keystr(const dlist_t *e1, const dlist_t *e2)
{
    const Object::ptr o1 = ODlink::obj_cptr(e1);
    const Object::ptr o2 = ODlink::obj_cptr(e2);

    return o1->obj_compare_str(o2->obj_keystr());
}

int
DListObj::dl_cmp_chain(const dlist_t *e1, const dlist_t *e2)
{
    const Object::ptr o1 = ODlink::obj_cptr(e1);
    const Object::ptr o2 = ODlink::obj_cptr(e2);

    return o1->obj_compare64(o2->obj_key64());
}

Object::ptr
DListObj::dl_find_key64(uint64_t key, bool rm)
{
    ObjKeyFind  seed(key, true);
    dlist_t    *ret = dlist_find(&m_list, &seed.m_chain.ol_link, dl_cmp_key64, rm);

    if (ret != nullptr) {
        if (rm == true) {
            return ODlink::obj_detach(ret);
        }
        return ODlink::obj_ptr(ret);
    }
    return nullptr;
}

Object::ptr
DListObj::dl_find_keystr(const char *key, bool rm)
{
    ObjKeyFind  seed(key, true);
    dlist_t    *ret = dlist_find(&m_list, &seed.m_chain.ol_link, dl_cmp_keystr, rm);

    if (ret != nullptr) {
        if (rm == true) {
            return ODlink::obj_detach(ret);
        }
        return ODlink::obj_ptr(ret);
    }
    return nullptr;
}

Object::ptr
DListObj::dl_find_chain(const ODlink *p, bool rm)
{
    dlist_t *ret = dlist_find(&m_list, &p->ol_link, dl_cmp_chain, rm);

    if (ret != nullptr) {
        if (rm == true) {
            return ODlink::obj_detach(ret);
        }
        return ODlink::obj_ptr(ret);
    }
    return nullptr;
}

DObjIter::DObjIter(dlist_t *marker)
{
    m_iter = marker;
}

Object::ptr
DObjIter::operator *()
{
    if (m_iter != nullptr) {
        return ODlink::obj_ptr(m_iter);
    }
    return nullptr;
}

bool
DObjIter::operator ==(const DObjIter &rhs)
{
    if (m_iter == rhs.m_iter) {
        return true;
    }
    return false;
}

/**
 * ----------------------------------------------------------------------------------
 *  Single Linked List.
 * ----------------------------------------------------------------------------------
 */
SListObj::~SListObj() {}
SListObj::SListObj() : m_end(*this)
{
    slist_init(&m_list);
}

int
SListObj::sl_cmp_key64(const slink_t *e1, const slink_t *e2)
{
    const Object::ptr o1 = OSlink::obj_cptr(e1);
    const Object::ptr o2 = OSlink::obj_cptr(e2);

    return o1->obj_compare64(o2->obj_key64());
}

int
SListObj::sl_cmp_keystr(const slink_t *e1, const slink_t *e2)
{
    const Object::ptr o1 = OSlink::obj_cptr(e1);
    const Object::ptr o2 = OSlink::obj_cptr(e2);

    return o1->obj_compare_str(o2->obj_keystr());
}

int
SListObj::sl_cmp_chain(const slink_t *e1, const slink_t *e2)
{
    Object::ptr o1 = OSlink::obj_cptr(e1);
    Object::ptr o2 = OSlink::obj_cptr(e2);

    return o1->obj_compare64(o2->obj_key64());
}

void
SListObj::sl_add_sorted(Object::ptr obj, OSlink *p)
{
    assert((obj != nullptr) && (p->ol_ptr == nullptr));
    slist_insert_sorted(&m_list, &p->ol_link, sl_cmp_chain);
    p->ol_ptr = obj;
}

void
SListObj::sl_add_sorted_key64(Object::ptr obj, OSlink *p)
{
    assert((obj != nullptr) && (p->ol_ptr == nullptr));
    slist_insert_sorted(&m_list, &p->ol_link, sl_cmp_key64);
    p->ol_ptr = obj;
}

void
SListObj::sl_add_sorted_keystr(Object::ptr obj, OSlink *p)
{
    assert((obj != nullptr) && (p->ol_ptr == nullptr));
    slist_insert_sorted(&m_list, &p->ol_link, sl_cmp_keystr);
    p->ol_ptr = obj;
}

Object::ptr
SListObj::sl_find_key64(uint64_t key, bool rm)
{
    ObjKeyFind  seed(key, true);
    slink_t    *ret = slist_find(&m_list, &seed.m_link.ol_link, sl_cmp_key64, rm);

    if (ret != nullptr) {
        if (rm == true) {
            return OSlink::obj_detach(ret);
        }
        return OSlink::obj_ptr(ret);
    }
    return nullptr;
}

Object::ptr
SListObj::sl_find_keystr(const char *key, bool rm)
{
    ObjKeyFind  seed(key, true);
    slink_t    *ret = slist_find(&m_list, &seed.m_link.ol_link, sl_cmp_keystr, rm);

    if (ret != nullptr) {
        if (rm == true) {
            return OSlink::obj_detach(ret);
        }
        return OSlink::obj_ptr(ret);
    }
    return nullptr;
}

Object::ptr
SListObj::sl_find_chain(OSlink *p, bool rm)
{
    assert(p->ol_ptr != nullptr);
    slink_t *ret = slist_find(&m_list, &p->ol_link, sl_cmp_chain, rm);

    if (ret != nullptr) {
        if (rm == true) {
            return OSlink::obj_detach(ret);
        }
        return OSlink::obj_ptr(ret);
    }
    return nullptr;
}

SObjIter::SObjIter(SListObj &l)
{
    slink_iter_init(nullptr, &m_iter);
}

Object::ptr
SObjIter::operator *()
{
    return OSlink::obj_ptr(slink_iter_curr(&m_iter));
}

bool
SObjIter::operator ==(const SObjIter &rhs)
{
    if (m_iter.sl_curr != rhs.m_iter.sl_curr) {
        return true;
    }
    return false;
}

void
dlist_unit_test()
{
    DListObj  dlist;
    SListObj  slist;

    for (auto it : dlist) {
        Object::ptr o = it;
    }
    for (auto it : slist) {
        Object::ptr o = it;
    }
    for (auto it = dlist.begin(); it != dlist.end(); it++) {
        Object::ptr o = *it;
    }
}
