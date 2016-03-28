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
#ifndef _CPPTYPE_OBJECT_H_
#define _CPPTYPE_OBJECT_H_

#include <ctype/list.h>
#include <ctype/dlist.h>
#include <ctype/assert.h>
#include <cpptype/intrusive-ptr.h>
#include <typeinfo>

class Object;
class DHashObj;
class SHashObj;
class DlistObj;
class SlistObj;
class DHashObjIter;

/**
 * POD obj for embedded dlink with pointer to the original object.
 * Don't change the order of the link and obj ptr, it'll break ptr casting.
 */
class ODlink
{
  public:
    explicit ODlink() : ol_ptr(NULL) {
        dlist_init(&ol_link);
    }
    explicit ODlink(boost::intrusive_ptr<Object> p) : ol_ptr(p) {
        dlist_init(&ol_link);
    }
    ~ODlink() {
        assert(dlist_empty(&ol_link));
        ol_ptr = NULL;
    }

    /**
     * Return the object containing this link.
     */
    inline boost::intrusive_ptr<Object> obj_ptr() {
        return ol_ptr;
    }
    inline const boost::intrusive_ptr<Object> obj_cptr() const {
        return ol_ptr;
    }
    static inline boost::intrusive_ptr<Object> obj_ptr(dlist_t *link) {
        return (reinterpret_cast<ODlink *>(link))->ol_ptr;
    }
    static inline const boost::intrusive_ptr<Object> obj_cptr(const dlist_t *link) {
        return (reinterpret_cast<const ODlink *>(link))->ol_ptr;
    }

    /**
     * Detatch the obj from whatever link it's chained.
     */
    static inline boost::intrusive_ptr<Object> obj_detach(dlist_t *link)
    {
        ODlink *p = reinterpret_cast<ODlink *>(link);

        if (link != NULL) {
            boost::intrusive_ptr<Object> ret = p->ol_ptr;
            p->ol_ptr = NULL;
            dlist_init(&p->ol_link);
            assert(ret != NULL);
            return ret;
        }
        return NULL;
    }
    inline void obj_rm()
    {
        assert(ol_ptr != NULL);
        dlist_rm_init(&ol_link);
        ol_ptr = NULL;
    }

    static inline boost::intrusive_ptr<Object> obj_peek_front(dlist_t *list) {
        return ODlink::obj_ptr(dlist_peek_front(list));
    }
    static inline boost::intrusive_ptr<Object> obj_rm_front(dlist_t *list) {
        return ODlink::obj_detach(dlist_rm_front(list));
    }
    static inline boost::intrusive_ptr<Object> obj_rm_back(dlist_t *list) {
        return ODlink::obj_detach(dlist_rm_back(list));
    }

    inline void obj_ref(boost::intrusive_ptr<Object> p)
    {
        assert(dlist_empty(&ol_link) && (ol_ptr == NULL));
        ol_ptr = p;
    }
    inline void obj_deref(boost::intrusive_ptr<Object> p)
    {
        assert(dlist_empty(&ol_link));
        assert(ol_ptr == p);
        ol_ptr = NULL;
    }
    inline void obj_add_front(boost::intrusive_ptr<Object> obj, dlist_t *list)
    {
        assert(dlist_empty(&ol_link) && (ol_ptr == NULL));
        dlist_add_front(list, &ol_link);
        ol_ptr = obj;
    }
    inline void obj_add_back(boost::intrusive_ptr<Object> obj, dlist_t *list)
    {
        assert(dlist_empty(&ol_link) && (ol_ptr == NULL));
        dlist_add_back(list, &ol_link);
        ol_ptr = obj;
    }

  private:
    friend class Object;
    friend class DHashObj;
    friend class SHashObj;
    friend class DListObj;
    friend class SListObj;
    friend class DHashObjIter;

    dlist_t                      ol_link;
    boost::intrusive_ptr<Object> ol_ptr;
};

/**
 * POD obj for embedded slink.
 */
class OSlink
{
  public:
    OSlink(Object *p) : ol_ptr(p) {
        slink_init(&ol_link);
    }
    ~OSlink() {
        assert(slink_empty(&ol_link));
        ol_ptr = NULL;
    }

    inline boost::intrusive_ptr<Object> obj_ptr() {
        return ol_ptr;
    }
    inline boost::intrusive_ptr<Object> obj_cptr() const {
        return ol_ptr;
    }
    static inline OSlink *oslink_ptr(slink_t *link) {
        return reinterpret_cast<OSlink *>(link);
    }
    static inline const OSlink *oslink_cptr(const slink_t *link) {
        return reinterpret_cast<const OSlink *>(link);
    }
    static inline boost::intrusive_ptr<Object> obj_ptr(slink_t *link) {
        return (reinterpret_cast<OSlink *>(link))->ol_ptr;
    }
    static inline const boost::intrusive_ptr<Object> obj_cptr(const slink_t *link) {
        return (reinterpret_cast<const OSlink *>(link))->ol_ptr;
    }

    /**
     * Detach the link so that it no longer references the obj.
     */
    static inline boost::intrusive_ptr<Object> obj_detach(slink_t *link)
    {
        OSlink *p = reinterpret_cast<OSlink *>(link);

        if (p != NULL) {
            boost::intrusive_ptr<Object> ret = p->ol_ptr;
            p->ol_ptr = NULL;
            assert(ret != NULL);
            return ret;
        }
        return NULL;
    }
    static inline boost::intrusive_ptr<Object> obj_rm_front(slink_t *head) {
        return obj_detach(slink_rm_front(head));
    }
    inline void obj_add_front(boost::intrusive_ptr<Object> obj, slink_t *head)
    {
        assert((ol_ptr == NULL) && (obj != NULL));
        slink_add_front(head, &ol_link);
        ol_ptr = obj;
    }

    inline void obj_ref(boost::intrusive_ptr<Object> p)
    {
        assert(slink_empty(&ol_link) && (ol_ptr == NULL));
        ol_ptr = p;
    }
    inline void obj_deref(boost::intrusive_ptr<Object> p)
    {
        assert(slink_empty(&ol_link) && (ol_ptr == p));
        ol_ptr = NULL;
    }
 
  private:
    friend class Object;
    friend class DHashObj;
    friend class SHashObj;
    friend class DListObj;
    friend class SListObj;

    slink_t                      ol_link;
    boost::intrusive_ptr<Object> ol_ptr;
};

/**
 * Boiler plate code for object's derrive classes.
 */
#define OBJECT_COMMON_DEFS(Type)                                                     \
    typedef boost::intrusive_ptr<Type>       ptr;                                    \
    typedef const boost::intrusive_ptr<Type> cptr;                                   \
                                                                                     \
    static uint32_t id() {                                                           \
        return reinterpret_cast<uint64_t>(typeid(Type).name());                      \
    }                                                                                \
    static inline const char *const name() {                                         \
        return typeid(Type).name();                                                  \
    }                                                                                \
    template <class... Args>                                                         \
    static boost::intrusive_ptr<Type> alloc(Args... args) {                          \
        return new Type(args...);                                                    \
    }

#define OBJECT_PTR_DEFS(Type)                                                        \
    typedef boost::intrusive_ptr<Type>       ptr;                                    \
    typedef const boost::intrusive_ptr<Type> cptr;

/**
 * Generic type Object with the following properties and important characteristics:
 * - Created on the heap by the T::alloc() call.
 * - Has reference count, don't need to call delete explicitly.
 * - Has embeded chain link to common data structures, hash, lists.
 * - Important: don't refer to 'this' object in constructor function because the ref
 *   count will be zero when out of constructor's scope.
 */
class Object
{
  public:
    virtual ~Object() {}
    OBJECT_COMMON_DEFS(Object);

    static int obj_hash_strfn(int size, const char *key);
    static inline Object::ptr obj_ptr(dlist_t *link) {
        return (reinterpret_cast<ODlink *>(link))->obj_ptr();
    }
    static inline const Object::ptr obj_cptr(const dlist_t *link) {
        return (reinterpret_cast<const ODlink *>(link))->obj_cptr();
    }
    static inline Object::ptr obj_ptr(slink_t *link) {
        return (reinterpret_cast<OSlink *>(link))->obj_ptr();
    }
    static inline const Object::ptr obj_cptr(const slink_t *link) {
        return (reinterpret_cast<const OSlink *>(link))->obj_cptr();
    }
    inline uint32_t obj_id() const {
        return reinterpret_cast<uint64_t>(typeid(*this).name());
    }
    inline const char *const obj_name() const {
        return typeid(*this).name();
    }
    inline bool obj_is_chained() {
        return !dlist_empty(&m_chain.ol_link);
    }
    inline int obj_refcnt() {
        return m_refcnt.load(boost::memory_order_relaxed);
    }
    /**
     * Remove the object out of whatever link it's chained to.
     */
    inline void obj_rm()
    {
        if (!dlist_empty(&m_chain.ol_link)) {
            m_chain.obj_rm();
        } else {
            assert(m_chain.ol_ptr == NULL);
        }
    }

    /**
     * Required methods to use with embeded hash table operated on object type.
     */
    virtual int obj_hash_str(int size, const char *key) const {
        return Object::obj_hash_strfn(size, key);
    }
    virtual int obj_hash64(int size, uint64_t key) const {
        return key % size;
    }
    virtual int obj_hash_dlink(int size, const ODlink *p) const {
        return obj_key_dlink(p) % size;
    }
    virtual int obj_hash_slink(int size, const OSlink *p) const {
        return obj_key_slink(p) % size;
    }

    virtual int obj_compare_str(const char *s) const;
    virtual int obj_compare64(uint64_t key) const {
        return obj_key64() - key;
    }
    virtual int obj_compare_dlink(const ODlink *p) const {
        return obj_compare64(p->obj_cptr()->obj_key64());
    }
    virtual int obj_compare_slink(const OSlink *p) const {
        return obj_compare64(p->obj_cptr()->obj_key64());
    }

    virtual const char *obj_keystr() const {
        return obj_name();
    }
    virtual uint64_t obj_key64() const {
        return reinterpret_cast<uint64_t>(this);
    }
    virtual uint64_t obj_key_dlink(const ODlink *p) const {
        return p->obj_cptr()->obj_key64();
    }
    virtual uint64_t obj_key_slink(const OSlink *p) const {
        return p->obj_cptr()->obj_key64();
    }

  protected:
    friend class DHashObj;
    friend class SHashObj;
    friend class DListObj;
    friend class SListObj;

    Object() : m_chain(NULL), m_refcnt(0) {}

    ODlink                     m_chain;
    INTRUSIVE_PTR_DECL(Object, m_refcnt);
};

template <class T, class U>
static inline boost::intrusive_ptr<T>
object_cast(boost::intrusive_ptr<U> p) {
    return reinterpret_cast<T *>(p.get());
}

template <class T>
static inline boost::intrusive_ptr<T>
object_cast(Object::ptr p) {
    return reinterpret_cast<T *>(p.get());
}

template <class T>
static inline const boost::intrusive_ptr<T>
object_const_cast(Object::ptr p) {
    return reinterpret_cast<T *>(p.get());
}

#endif /* _CPPTYPE_OBJECT_H_ */
