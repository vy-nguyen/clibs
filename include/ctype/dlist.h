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
#ifndef _CTYPE_DLIST_H_
#define _CTYPE_DLIST_H_

#include <stdlib.h>
#include <stdbool.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

typedef struct dlist dlist_t;
struct dlist
{
    dlist_t *dl_next;
    dlist_t *dl_prev;
};

#define dlink_next(ptr)               ((ptr)->dl_next)
#define dlink_prev(ptr)               ((ptr)->dl_prev)
#define dlist_term(list, ptr)         ((ptr) == (list))

/*
 * dlist_init
 * ----------
 * Initialize a circular dlist.
 */
static inline void
dlist_init(dlist_t *dlist)
{
    dlist->dl_next = dlist->dl_prev = dlist;
}

/*
 * dlist_empty
 * -----------
 * Return true if the dlist is empty.
 */
static inline int
dlist_empty(dlist_t *dlist)
{
    return ((dlist->dl_next == dlist) && (dlist->dl_prev == dlist));
}

/*
 * dlist_add_front
 * ---------------
 * Add a new element to the front of a dlist.
 */
static inline void
dlist_add_front(dlist_t *dlist, dlist_t *elm)
{
    elm->dl_next            = dlist->dl_next;
    elm->dl_prev            = dlist;
    dlist->dl_next->dl_prev = elm;
    dlist->dl_next          = elm;
}

/*
 * dlist_add_back
 * --------------
 * Add a new element to the back of a dlist.
 */
static inline void
dlist_add_back(dlist_t *dlist, dlist_t *elm)
{
    dlist_add_front(dlist->dl_prev, elm);
}

/*
 * dlist_rm
 * --------
 * Remove the current element of a dlist.  Don't care what list this element
 * is attached to.
 */
static inline void
dlist_rm(dlist_t *elm)
{
    elm->dl_prev->dl_next = elm->dl_next;
    elm->dl_next->dl_prev = elm->dl_prev;
}

/*
 * dlist_rm_init
 * -------------
 * Same as dlist_rm but also initialize the elm after removing it out.
 */
static inline void
dlist_rm_init(dlist_t *elm)
{
    dlist_rm(elm);
    dlist_init(elm);
}

/*
 * dlist_peek_front
 * ----------------
 * Peek the first element of a dlist.  Return NULL if the list is empty.
 */
static inline dlist_t *
dlist_peek_front(dlist_t *dlist)
{
    if ((dlist != NULL) && !dlist_empty(dlist)) {
        return (dlist->dl_next);
    }
    return (NULL);
}

/*
 * dlist_peek_back
 * ---------------
 * Peek the last element of a dlist.  Return NULL if the list is empty.
 */
static inline dlist_t *
dlist_peek_back(dlist_t *dlist)
{
    if ((dlist != NULL) && !dlist_empty(dlist)) {
        return (dlist->dl_prev);
    }
    return (NULL);
}

/*
 * dlist_rm_front
 * --------------
 * Remove elm from the front of a dlist.  Return NULL if the list is empty.
 */
static inline dlist_t *
dlist_rm_front(dlist_t *dlist)
{
    dlist_t *curr = NULL;

    if ((dlist != NULL) && !dlist_empty(dlist)) {
        curr = dlist->dl_next;
        dlist_rm(curr);
    }
    return (curr);
}

/*
 * dlist_rm_back
 * -------------
 * Remove elm from the back of a dlist.  Return NULL if the list is empty.
 */
static inline dlist_t *
dlist_rm_back(dlist_t *dlist)
{
    dlist_t *curr = NULL;

    if ((dlist != NULL) && !dlist_empty(dlist)) {
        curr = dlist->dl_prev;
        dlist_rm(curr);
    }
    return (curr);
}

/*
 * dlist_merge
 * -----------
 * Merge two dlists together.  Make list arg merge the root list and empty it.
 */
static inline void
dlist_merge(dlist_t *root, dlist_t *list)
{
    if (!dlist_empty(list)) {
        root->dl_prev->dl_next = list->dl_next;
        list->dl_next->dl_prev = root->dl_prev;
        list->dl_prev->dl_next = root;
        root->dl_prev          = list->dl_prev;
        dlist_init(list);
    }
}

/*
 * dlist_merge_front
 * -----------------
 * Like dlist_merge, but put the list arg to the front.
 */
static inline void
dlist_merge_front(dlist_t *root, dlist_t *list)
{
    if (!dlist_empty(list)) {
        root->dl_next->dl_prev = list->dl_prev;
        list->dl_prev->dl_next = root->dl_next;
        root->dl_next          = list->dl_next;
        list->dl_next->dl_prev = root;
        dlist_init(list);
    }
}

/*
 * dlist_split
 * -----------
 * Split a dlist at ptr point.  The first half is in the old 'root' list, the
 * 2nd half becomes 'res' list.  The 'res' list must be an empty list.
 */
extern void
dlist_split(dlist_t *hdr, dlist_t *ptr, dlist_t *res);

/*
 * dlist_add_sorted
 * ----------------
 * Added new element to a sorted dlist.  The compare function returns 0 for
 * equal, -1 if elm1 < elm2, and 1 if greater.
 */
extern void
dlist_add_sorted(dlist_t *list, dlist_t *elm,
                 int (*cmp_fn)(const dlist_t *elm1, const dlist_t *elm2));

/*
 * dlist_iter_init
 * ---------------
 */
static inline void
dlist_iter_init(dlist_t *list, dlist_t **iter)
{
    *iter = list->dl_next;
}

/*
 * dlist_iter_init
 * ---------------
 */
static inline bool
dlist_iter_term(dlist_t *list, dlist_t *iter)
{
    return (iter == list ? true : false);
}

/*
 * dlist_iter_init
 * ---------------
 */
static inline void
dlist_iter_next(dlist_t **iter)
{
    *iter = (*iter)->dl_next;
}

static inline void
dlist_iter_prev(dlist_t **iter)
{
    *iter = (*iter)->dl_prev;
}

/*
 * dlist_iter_rm_curr
 * ------------------
 */
static inline dlist_t *
dlist_iter_rm_curr(dlist_t **iter)
{
    dlist_t *curr;

    curr  = (*iter);
    *iter = curr->dl_next;
    dlist_rm(curr);

    return (curr);
}

/*
 * Macros to traverse the whole dlist.
 */
#define foreach_dlist_iter(dlist, iter)                                       \
    for (dlist_iter_init(dlist, &iter);                                       \
         dlist_iter_term(dlist, iter) == false; dlist_iter_next(&iter))

/*
 * Marco to free the whole dlist.
 */
#define dlist_free(dlist, free_fn)                                            \
    do {                                                                      \
        dlist_t *__cptr;                                                      \
        while (!dlist_empty(dlist)) {                                         \
            __cptr = dlist_rm_front(dlist);                                   \
           free_fn(__cptr);                                                   \
        }                                                                     \
    } while (0)

/*
 * dlist_find
 * ----------
 */
static inline dlist_t *
dlist_find(dlist_t       *dlist,
           const dlist_t *elm,
           int          (*cmp_fn)(const dlist_t *, const dlist_t *),
           bool           rm)
{
    dlist_t *iter, *found;

    foreach_dlist_iter(dlist, iter) {
        if (cmp_fn(iter, elm) == 0) {
            found = iter;
            if (rm == true) {
                dlist_iter_rm_curr(&iter);
            }
            return (found);
        }
    }
    return (NULL);
}

/*
 * dlist_print
 * -----------
 * Print the whole dlist for debugging.
 */
extern void
dlist_print(dlist_t *dlist, void (*print_fn)(dlist_t *elem));

/*
 * dlist_filter_out
 * ----------------
 * Move any element from 'old' to 'newlst' when the cmp_func returns 0.
 * Will apply the cmp_func to every element of the list.
 */
extern void
dlist_filter_out(dlist_t *old, dlist_t *newlst,
                 bool cmp_func(dlist_t *elm, void *arg), void *arg);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_DLIST_H_ */
