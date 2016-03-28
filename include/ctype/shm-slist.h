/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
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
#ifndef _CTYPE_SHM_SLIST_
#define _CTYPE_SHM_SLIST_

#include <stdint.h>
#include <stdlib.h>
#include <ctype/assert.h>
#include <ctype/types.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * Single link using index & base pointer.
 */
typedef struct ilink ilink_t;
struct ilink
{
    uint32_t    il_next;
};

/*
 * Single link list root with head and tail as offset to a common base.
 */
typedef struct islist islist_t;
struct islist
{
    uint32_t    isl_head;
    uint32_t    isl_tail;
};

/*
 * Index single link list iteration.
 */
typedef struct islist_iter islist_iter_t;
struct islist_iter
{
    char       *isl_base;
    uint32_t    isl_bound;
    uint32_t    isl_curr;
};

/*
 * ilink_init
 * ----------
 */
static inline void
ilink_init(ilink_t *elem)
{
    elem->il_next = IDX_NIL;
}

/*
 * isl_init
 * --------
 */
static inline void
isl_init(islist_t *root)
{
    root->isl_head = IDX_NIL;
    root->isl_tail = IDX_NIL;
}

/*
 * isl_empty
 * ---------
 * Return TRUE if the list is empty.
 */
static inline bool
isl_empty(islist_t *root)
{
    if ((root->isl_head == IDX_NIL) && (root->isl_tail == IDX_NIL)) {
        return (true);
    }
    return (false);
}

/*
 * islist_init
 * -----------
 */
static inline void
islist_init(char *base, uint32_t list_off)
{
    islist_t *root;

    root = (islist_t *)(base + list_off);
    isl_init(root);
}

/*
 * isl_iter_init
 * -------------
 */
static inline void
isl_iter_init(islist_t *root, char *base, uint32_t bound, islist_iter_t *iter)
{
    iter->isl_base  = base;
    iter->isl_bound = bound;
    iter->isl_curr  = root->isl_head;
}

/*
 * islist_iter_init
 * ----------------
 */
static inline void
islist_iter_init(char          *base,
                 uint32_t       list_off,
                 uint32_t       bound,
                 islist_iter_t *iter)
{
    islist_t *root;

    root = (islist_t *)(base + list_off);
    isl_iter_init(root, base, bound, iter);
}

/*
 * islist_iter_next
 * ----------------
 * @param iter (i) - list iterator.
 * @param next (o) - index of the next element, IDX_NIL if end of list.
 * @param link (o) - VA of the next pointer.
 * @return:
 */
static inline int
islist_iter_next(islist_iter_t *iter, uint32_t *next, ilink_t **link)
{
    if ((iter->isl_curr == IDX_NIL) || (iter->isl_curr > iter->isl_bound)) {
        *link = NULL;
        *next = IDX_NIL;
        if (iter->isl_curr == IDX_NIL) {
            return (-1);
        }
        return (-2);
    }
    *next = iter->isl_curr;
    *link = (ilink_t *)(iter->isl_base + iter->isl_curr);
    iter->isl_curr = (*link)->il_next;
    return (0);
}

/*
 * isl_add_front
 * -------------
 */
static inline void
isl_add_front(char *base, uint32_t bound, islist_t *root, uint32_t elm_off)
{
    ilink_t  *elem;

    verify(elm_off < bound);
    verify(root->isl_head < bound);
    assert(root->isl_tail < bound);

    elem           = (ilink_t *)(base + elm_off);
    elem->il_next  = root->isl_head;
    root->isl_head = elm_off;
    if (root->isl_tail == IDX_NIL) {
        root->isl_tail = elm_off;
    }
}

/*
 * islist_add_front
 * ----------------
 */
static inline void
islist_add_front(char *base, uint32_t bound,
                 uint32_t list_off, uint32_t elm_off)
{
    islist_t *root;

    assert(list_off < bound);
    root = (islist_t *)(base + list_off);
    isl_add_front(base, bound, root, elm_off);
}

/*
 * isl_rm_front
 * ------------
 */
static inline ilink_t *
isl_rm_front(char *base, uint32_t bound, islist_t *root)
{
    ilink_t  *elem;

    if (root->isl_head == IDX_NIL) {
        return (NULL);
    }
    elem = (ilink_t *)(base + root->isl_head);
    verify(root->isl_head < bound);
    verify(elem->il_next < bound);

    root->isl_head = elem->il_next;
    elem->il_next  = IDX_NIL;

    if (root->isl_head == IDX_NIL) {
        root->isl_tail = IDX_NIL;
    }
    return (elem);
}

/*
 * islist_rm_front
 * ---------------
 */
static inline ilink_t *
islist_rm_front(char *base, uint32_t bound, uint32_t list_off)
{
    islist_t *root;

    assert(list_off < bound);
    root = (islist_t *)(base + list_off);
    return (isl_rm_front(base, bound, root));
}

/*
 * isl_add_back
 * ------------
 */
static inline void
isl_add_back(char *base, uint32_t bound, islist_t *root, uint32_t elm_off)
{
    ilink_t  *tail, *elem;

    verify(elm_off < bound);
    verify(root->isl_tail < bound);
    verify(root->isl_head < bound);

    elem          = (ilink_t *)(base + elm_off);
    elem->il_next = IDX_NIL;

    if (root->isl_tail == IDX_NIL) {
        root->isl_head = elm_off;
        root->isl_tail = elm_off;
    } else {
        tail = (ilink_t *)(base + root->isl_tail);
        assert(tail->il_next == IDX_NIL);

        tail->il_next  = elm_off;
        root->isl_tail = elm_off;
    }
}

/*
 * isl_add_back
 * ------------
 */
static inline void
islist_add_back(char *base, uint32_t bound,
                uint32_t list_off, uint32_t elm_off)
{
    islist_t *root;

    assert(list_off < bound);
    root = (islist_t *)(base + list_off);
    isl_add_back(base, bound, root, elm_off);
}

/*
 * isl_fixup_list
 * --------------
 * Fixup the list after one of the insert/remove updates was interrupted by
 * crash leaving the list in shared memory in the inconsistent state.
 */
extern int
isl_fixup_list(char *base, uint32_t bound, islist_t *root, uint32_t *cnt);

/*
 * islist_fixup_list
 * -----------------
 */
static inline int
islist_fixup_list(char     *base,
                  uint32_t  bound,
                  uint32_t  list_off,
                  uint32_t *cnt)
{
    islist_t *root;

    assert(list_off < bound);
    root = (islist_t *)(base + list_off);
    return (isl_fixup_list(base, bound, root, cnt));
}

/*
 * islist_find
 * -----------
 * Remove the 1st matching record.  The compare function returns 0 if two
 * records are the same.  If the rm arg is TRUE, then also rmeove it out of
 * the list and set the prev ptr if it's not NULL.
 */
extern void
islist_find(char *base, uint32_t bound, uint32_t list_off, uint32_t elm_off,
            int (*cmp_fn)(ilink_t *, ilink_t *), bool rm, ilink_t **prv);

/*
 * islist_filter_out
 * -----------------
 * Filter out selected elements from the root list to nlst list if the sel_fn
 * returns TRUE.  This function also could be use to apply the sel_fn function
 * to every element in the list.
 * @return the number of elements filtered out from the root list.
 */
extern int
islist_filter_out(char     *base,
                  uint32_t  bound,
                  uint32_t  root_off,
                  uint32_t  nlist_off,
                  bool (*sel_fn)(ilink_t *, char *), char *arg);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _SHM_SLIST_ */
