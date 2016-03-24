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
#ifndef _CPPTYPE_LIST_OBJ_H_
#define _CPPTYPE_LIST_OBJ_H_

#include <iterator>
#include <ctype/dlist.h>
#include <cpptype/object.h>

class DListObj;
class SListObj;
class LruTable;

/**
 * ----------------------------------------------------------------------------------
 * Construct a seed object on the stack to query an object in a container.
 * It's more efficient to generate this obj on stack.
 * ----------------------------------------------------------------------------------
 */
class ObjKeyFind : public Object
{
  public:
    ~ObjKeyFind() {
        m_link.obj_deref(this);
        m_chain.obj_deref(this);
    }
    ObjKeyFind(const char *const key, bool stack = false) : m_link(this), m_keystr(key)
    {
        m_chain.obj_ref(this);
        if (stack == true) {
            intrusive_ptr_add_ref(this);
        }
    }
    ObjKeyFind(uint64_t key, bool stack = false) : m_link(this), m_key64(key)
    {
        m_chain.obj_ref(this);
        if (stack == true) {
            intrusive_ptr_add_ref(this);
        }
    }

    inline const char *obj_keystr() const override {
        return m_keystr;
    }
    inline uint64_t obj_key64() const override {
        return m_key64;
    }

  private:
    friend class SListObj;

    OSlink             m_link;
    uint64_t           m_key64;
    const char        *m_keystr;
};

/**
 * ----------------------------------------------------------------------------------
 *  Double Linked List.
 * ----------------------------------------------------------------------------------
 */
class DObjIter : public std::iterator<std::input_iterator_tag, Object>
{
  public:
    DObjIter(dlist_t *marker);
    Object::ptr operator *();
    bool operator ==(const DObjIter &rhs);

    inline bool operator !=(const DObjIter &rhs) {
        return !(*this == rhs);
    }
    DObjIter &operator ++() {
        dlist_iter_next(&m_iter);
        return *this;
    }
    DObjIter  operator ++(int) {
        DObjIter ret = *this;
        dlist_iter_next(&m_iter);
        return ret;
    }
    template <typename T>
    inline boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }

  protected:
    friend class DList;

    dlist_t           *m_iter;
};

class DListObj
{
  public:
    DListObj();
    ~DListObj();

    /**
     * Add sorted
     */
    inline void dl_add_sorted(Object::ptr obj)
    {
        assert(dlist_empty(&obj->m_chain.ol_link) && (obj->m_chain.ol_ptr == NULL));
        dlist_add_sorted(&m_list, &obj->m_chain.ol_link, dl_cmp_chain);
        obj->m_chain.ol_ptr = obj;
    }
    inline void dl_add_sorted(Object::ptr obj, ODlink *p)
    {
        assert(p->ol_ptr == NULL);
        dlist_add_sorted(&m_list, &p->ol_link, dl_cmp_chain);
        p->ol_ptr = obj;
    }
    inline void dl_add_sorted_key64(Object::ptr obj)
    {
        assert(obj->m_chain.ol_ptr == NULL);
        dlist_add_sorted(&m_list, &obj->m_chain.ol_link, dl_cmp_key64);
        obj->m_chain.ol_ptr = obj;
    }
    inline void dl_add_sorted_keystr(Object::ptr obj)
    {
        assert(obj->m_chain.ol_ptr == NULL);
        dlist_add_sorted(&m_list, &obj->m_chain.ol_link, dl_cmp_keystr);
        obj->m_chain.ol_ptr = obj;
    }

    /**
     * Locate object based on key.
     */
    Object::ptr dl_find_key64(uint64_t key, bool rm = false);
    Object::ptr dl_find_keystr(const char *key, bool rm = false);
    Object::ptr dl_find_chain(const ODlink *p, bool rm = false);

    /**
     * Common list operations.
     */
    inline bool dl_empty() {
        return dlist_empty(&m_list);
    }
    inline void dl_add_front(Object::ptr obj) {
        obj->m_chain.obj_add_front(obj, &m_list);
    }
    inline void dl_add_back(Object::ptr obj) {
        obj->m_chain.obj_add_back(obj, &m_list);
    }

    inline Object::ptr dl_peek_front() {
        return ODlink::obj_peek_front(&m_list);
    }
    inline Object::ptr dl_rm_front() {
        return ODlink::obj_rm_front(&m_list);
    }
    inline Object::ptr dl_rm_back() {
        return ODlink::obj_rm_back(&m_list);
    }

    /**
     * The obj at the split must be part of the link list.
     */
    inline void dl_split(Object::ptr split, DListObj &res) {
        assert(split->m_chain.ol_ptr == split);
        dlist_split(&m_list, &split->m_chain.ol_link, &res.m_list);
    }

    /**
     * Standard C++ iterator functions.
     */
    inline DObjIter  begin() {
        return DObjIter(m_list.dl_next);
    }
    inline DObjIter &end() {
        return m_end;
    }

  private:
    friend class DObjIter;
    friend class LruTable;

    dlist_t                  m_list;
    DObjIter                 m_end;

    /**
     * C-lib plugin functions.
     */
    static int dl_cmp_key64(const dlist_t *, const dlist_t *);
    static int dl_cmp_keystr(const dlist_t *, const dlist_t *);
    static int dl_cmp_chain(const dlist_t *, const dlist_t *);
};

/**
 * ----------------------------------------------------------------------------------
 *  Single Linked List.
 * ----------------------------------------------------------------------------------
 */
class SObjIter : public std::iterator<std::input_iterator_tag, Object>
{
  public:
    SObjIter(SListObj &l);
    Object::ptr operator *();
    bool operator ==(const SObjIter &rhs);

    inline bool operator !=(const SObjIter &rhs) {
        return !(*this == rhs);
    }
    SObjIter &operator ++() {
        return *this;
    }
    SObjIter  operator ++(int) {
        SObjIter ret = *this;
        return ret;
    }
    template <typename T>
    inline boost::intrusive_ptr<T> operator *() {
        return object_cast<T>(*this);
    }

  protected:
    friend class SList;

    slink_iter_t        m_iter;
};

class SListObj
{
  public:
    SListObj();
    ~SListObj();

    void sl_add_sorted(Object::ptr obj, OSlink *p);
    void sl_add_sorted_key64(Object::ptr obj, OSlink *p);
    void sl_add_sorted_keystr(Object::ptr obj, OSlink *p);

    Object::ptr sl_find_key64(uint64_t key, bool rm = false);
    Object::ptr sl_find_keystr(const char *key, bool rm = false);
    Object::ptr sl_find_chain(OSlink *p, bool rm = false);

    inline bool sl_empty() {
        return slist_empty(&m_list);
    }
    /**
     * Precond: the link must be empty and part of the obj.
     */
    inline void sl_add_front(Object::ptr obj, OSlink *p)
    {
        assert((obj != NULL) && (p->ol_ptr == NULL));
        slist_insert_front(&m_list, &p->ol_link);
        p->ol_ptr = obj;
    }
    inline void sl_add_back(Object::ptr obj, OSlink *p)
    {
        assert((obj != NULL) && (p->ol_ptr == NULL));
        slist_insert_back(&m_list, &p->ol_link);
        p->ol_ptr = obj;
    }
    /**
     * Remove or peek the front element from the list.  Return NULL if the list is
     * empty.
     */
    inline Object::ptr sl_rm_front() {
        return OSlink::obj_detach(slist_rm_front(&m_list));
    }
    inline Object::ptr sl_peek_front() {
        return OSlink::obj_ptr(slist_peek_front(&m_list));
    }

    /**
     * Split the list at the obj.  The link must be part of the obj.
     */
    inline void sl_split(Object::ptr obj, OSlink *p, SListObj &res) {
        assert(p->ol_ptr == obj);
        slist_split(&m_list, &p->ol_link, &res.m_list);
    }
    inline void sl_merge(SListObj &merge) {
        slist_merge(&m_list, &merge.m_list);
    }
    inline int sl_filter_out(SListObj &out,
                             bool (*fn)(const slink_t *, const void *), void *arg) {
        return slist_filter_out(&m_list, &out.m_list, fn, arg);
    }

    /**
     * Standard C++ iterator functions.
     */
    inline SObjIter  begin() {
        return SObjIter(*this);
    }
    inline SObjIter &end() {
        return m_end;
    }

  private:
    friend class SObjIter;

    slist_t                  m_list;
    SObjIter                 m_end;

    /**
     * C-lib plugin functions.
     */
    static int sl_cmp_key64(const slink_t *, const slink_t *);
    static int sl_cmp_keystr(const slink_t *, const slink_t *);
    static int sl_cmp_chain(const slink_t *, const slink_t *);
};

#endif /* _CPPTYPE_LIST_OBJ_H_ */
