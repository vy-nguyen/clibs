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
#ifndef _CTYPE_LIST_H_
#define _CTYPE_LIST_H_

#include <ctype/types.h>

#ifdef __cplusplus
extern  "C" {
#endif  /* __cplusplus */

/*
 * Generic link pointer type to chain embeded within a structure.
 */
typedef struct slink slink_t;
struct slink
{
    slink_t       *sl_next;
};

/*
 * Link list iteration cookie.
 */
typedef struct slink_iter slink_iter_t;
struct slink_iter
{
    slink_t       *sl_prev;
    slink_t       *sl_curr;
};

/*
 * slink_init
 * ----------
 */
inline static void
slink_init(slink_t *head)
{
    head->sl_next = NULL;
}

/*
 * slink_iter_init
 * ---------------
 */
inline static void
slink_iter_init(slink_t *head, slink_iter_t *iter)
{
    iter->sl_prev = head;
    iter->sl_curr = (head != NULL) ? head->sl_next : NULL;
}

/*
 * slink_iter_term
 * ---------------
 */
inline static bool
slink_iter_term(slink_iter_t *iter)
{
    return (iter->sl_curr == NULL ? true : false);
}

/*
 * slink_iter_next
 * ---------------
 */
inline static void
slink_iter_next(slink_iter_t *iter)
{
    iter->sl_prev = iter->sl_curr;
    iter->sl_curr = iter->sl_curr->sl_next;
}

/*
 * slink_iter_rm_curr
 * ------------------
 */
inline static slink_t *
slink_iter_rm_curr(slink_iter_t *iter)
{
    slink_t *cur;

    cur = iter->sl_curr;
    if (cur != NULL) {
        iter->sl_prev->sl_next = iter->sl_curr->sl_next;
        iter->sl_curr->sl_next = NULL;
    }
    return (cur);
}

/*
 * slink_iter_curr
 * ---------------
 */
inline static slink_t *
slink_iter_curr(slink_iter_t *iter)
{
    return (iter->sl_curr);
}

/*
 * slink_iter_prev
 * ---------------
 */
inline static slink_t *
slink_iter_prev(slink_iter_t *iter)
{
    return (iter->sl_prev);
}

/*
 * Macro to iterate the whole list.
 */
#define foreach_slink_iter(head, iter)                                \
    for (slink_iter_init(head, iter);                                 \
         slink_iter_term(iter) == false; slink_iter_next(iter))

/*
 * slink_empty
 * -----------
 */
inline static int
slink_empty(slink_t *head)
{
    return (head->sl_next == NULL);
}

/*
 * slink_add_front
 * ---------------
 */
inline static void
slink_add_front(slink_t *head, slink_t *elm)
{
    elm->sl_next  = head->sl_next;
    head->sl_next = elm;
}

/*
 * slink_rm_front
 * --------------
 */
inline static slink_t *
slink_rm_front(slink_t *head)
{
    slink_t *elm = head->sl_next;

    if (elm != NULL) {
        head->sl_next = elm->sl_next;
        elm->sl_next  = NULL;
    }
    return (elm);
}

/*
 * slink_find
 * ----------
 * Remove the first matching record.  The compare function returns 0 if two
 * records are the same.  If the rm arg is true, then also remove it out of
 * the list and set the prev ptr if it's not NULL.
 */
extern slink_t *
slink_find(slink_t *head, slink_t *elm,
           int (*cmp_func)(const slink_t *, const slink_t *), bool rm, slink_t **prv);

/*
 * slink_filter_out
 * ----------------
 * Filter out selected elements from root to nlst if the sel_fn returns true.
 * This function also could be used to apply the sel_fn to every elemen in the
 * list.
 * @return the number of elements filtered out from the root list.
 */
extern int
slink_filter_out(slink_t *root, slink_t *nlst,
                 bool (*sel_fn)(const slink_t *, void *), void *arg);

/* ///////////    T E X T    B O O K    L I N K    L I S T    ////////////// */

typedef struct sl_elm  sl_elm_t;
struct sl_elm
{
    slink_t           sl_link;
    void             *sl_data;
};

typedef struct slist slist_t;
struct slist
{
    slink_t           sl_head;
    slink_t          *sl_tail;
};

/*
 * slist_init
 * ----------
 */
extern void
slist_init(slist_t *list);

/*
 * slist_free
 * ----------
 */
extern void slist_free(slist_t *list, void (*free_fn)(slink_t *));
extern void slist_free_data(slist_t *list, void (*free_fn)(void *));

/*
 * slist_insert_back
 * -----------------
 */
extern void slist_insert_back(slist_t *list, slink_t *elem);
extern void slist_insert_back_data(slist_t *list, void *data);

/*
 * slist_insert_front
 * ------------------
 */
extern void slist_insert_front(slist_t *list, slink_t *elem);
extern void slist_insert_front_data(slist_t *list, void *data);

/*
 * slist_insert_sorted
 * -------------------
 */
extern void
slist_insert_sorted(slist_t *list, slink_t *elem,
                    int (*cmp_fn)(const slink_t *, const slink_t *));

extern void
slist_insert_sorted_data(slist_t *list, void *data,
                         int (*cmp_fn)(const void *, const void *));

/*
 * slist_rm_front
 * --------------
 */
extern slink_t *slist_rm_front(slist_t *list);
extern void    *slist_rm_front_data(slist_t *list);

/*
 * slist_peek_front
 * ----------------
 */
static inline slink_t *
slist_peek_front(slist_t *list)
{
    return (list->sl_head.sl_next);
}

static inline void *
slist_peek_front_data(slist_t *list)
{
    slink_t  *ptr = slist_peek_front(list);
    return ((ptr != NULL) ? object_of(sl_elm_t, sl_link, ptr) : NULL);
}

/*
 * slist_find
 * ----------
 * The compare function returns 0 if two record are the same.  If the cmp_fn
 * is NULL, this function will use the pointer to compare.
 *
 * The 'rm' argument is true if want to remove the result out of the list.
 */
extern slink_t *
slist_find(slist_t *list, slink_t *data,
           int (*cmp_fn)(const slink_t *, const slink_t *), bool rm);

extern void *
slist_find_data(slist_t *list, const void *data,
                int (*cmp_fn)(const void *, const void *), bool rm);

/*
 * slist_empty
 * -----------
 */
static inline bool
slist_empty(slist_t *list)
{
    return (slink_empty(&list->sl_head));
}

/*
 * slist_merge
 * -----------
 * Merge the 'list' to 'root' and empty the 'list'
 */
extern void
slist_merge(slist_t *root, slist_t *list);

/*
 * slist_split
 * -----------
 * Split a single link list into two.
 */
extern void
slist_split(slist_t *old, slink_t *split, slist_t *nlst);

/*
 * slist_filter_out
 * ----------------
 * Filter out selected elements from root to nlst if the sel_fn returns true.
 * This function also could be used to apply the sel_fn to every elemen in the
 * list.
 *
 * Return the number of elements filtered out.
 */
extern int
slist_filter_out(slist_t *root, slist_t *nlst,
                 bool (*sel_fn)(const slink_t *, const void *), void *arg);

extern int
slist_filter_out_data(slist_t *root, slist_t *nlst,
                      bool (*sel_fn)(const void *, const void *), void *arg);

/*
 * slist_print
 * -----------
 */
extern void
slist_print(slist_t *root, void (*print_fn)(slink_t *elm));

/*
 * slist_print_data
 * ----------------
 * Dump the whole list for debugging.
 */
extern void
slist_print_data(slist_t *root);

#ifdef __cplusplus
}
#endif  /* __cplusplus */
#endif  /* _CTYPE_SLIST_H_ */
