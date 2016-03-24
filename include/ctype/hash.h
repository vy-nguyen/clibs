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
#ifndef _CTYPE_HASH_H_
#define _CTYPE_HASH_H_

#include <ctype/list.h>
#include <ctype/dlist.h>
#include <ctype/assert.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/* Generic hash entry using dlist bucket. */
typedef dlist_t  dhash_elm_t;

/*
 * Hash table with double linked list bucket.
 */
typedef struct dhash dhash_t;
struct dhash
{
    dlist_t      *dh_bucket;
    int           dh_bk_size;
    int           dh_elm_cnt;
    int           dh_max_chain;
    int         (*dh_hash_fn)(int bk_size, const dhash_elm_t *elm);
    int         (*dh_cmp_fn)(const dhash_elm_t *elm1, const dhash_elm_t *elm2);
};

/*
 * Double linked list hash iteration.
 */
typedef struct dhash_iter dhash_iter_t;
struct dhash_iter
{
    dhash_t      *dh_tab;
    dlist_t      *dh_curr;
    dlist_t      *dh_iter;
};

/*
 * dhash_iter_init
 * ---------------
 */
extern void
dhash_iter_init(dhash_t *table, dhash_iter_t *iter);

/*
 * dhash_iter_term
 * ---------------
 */
static inline bool
dhash_iter_term(const dhash_iter_t *iter)
{
    return (iter->dh_curr == NULL ? true : false);
}

/*
 * dhash_iter_next
 * ---------------
 */
extern void
dhash_iter_next(dhash_iter_t *iter);

extern dhash_elm_t *
dhash_iter_rm_curr(dhash_iter_t *iter);

/*
 * dhash_iter_curr
 * ---------------
 */
static inline dhash_elm_t *
dhash_iter_curr(const dhash_iter_t *iter)
{
    return iter->dh_iter;
}

/*
 * dhash_init
 * ----------
 */
extern void
dhash_init(dhash_t *table,
           int      size,
           int    (*hash_fn)(int, const dhash_elm_t *),
           int    (*cmp_fn)(const dhash_elm_t *, const dhash_elm_t *));

/*
 * dhash_free
 * ----------
 */
extern void
dhash_free(dhash_t *table, void (*free_fn)(dhash_elm_t *, int), int sz);

/*
 * dhash_insert
 * ------------
 */
extern int
dhash_insert_elm(dhash_t *tab, dhash_elm_t *elm,
                 int (*hash_fn)(int, const dhash_elm_t *));

static inline int
dhash_insert(dhash_t *table, dhash_elm_t *elm) {
    return dhash_insert_elm(table, elm, table->dh_hash_fn);
}

/*
 * dhash_rm
 * --------
 * Remove the element in the hash table maching the test elm.  The test elm
 * must not attach to the hash table.
 */
extern dhash_elm_t *
dhash_rm_elm(dhash_t *tab, dhash_elm_t *elm,
             int (*hash_fn)(int, const dhash_elm_t *),
             int (*hash_cmp)(const dhash_elm_t *, const dhash_elm_t *));

static inline dhash_elm_t *
dhash_rm(dhash_t *table, dhash_elm_t *elm) {
    return dhash_rm_elm(table, elm, table->dh_hash_fn, table->dh_cmp_fn);
}

/*
 * dhash_takeout_elm
 * -----------------
 * Take the element out of the hash table.  The element must be attached in
 * the hash table.
 */
extern void
dhash_takeout_elm(dhash_t *table, dhash_elm_t *elm);

/*
 * dhash_find
 * ----------
 */
extern dhash_elm_t *
dhash_find_elm(dhash_t *tab, const dhash_elm_t *elm,
               int (*hash_fn)(int, const dhash_elm_t *),
               int (*hash_cmp)(const dhash_elm_t *, const dhash_elm_t *));

static inline dhash_elm_t *
dhash_find(dhash_t *table, const dhash_elm_t *elm)
{
    return dhash_find_elm(table, elm, table->dh_hash_fn, table->dh_cmp_fn);
}

/*
 * dhash_apply_fn
 * --------------
 * Callback function to apply to all elements in the hash table.
 *
 * @param elm [i] - the element in the hash table.
 * @param idx [i] - the index of that element.
 */
typedef void
(*dhash_apply_fn)(const dhash_elm_t *elm, int idx, void *arg);

/*
 * dhash_apply_all
 * ---------------
 * Apply the function to all elements in the hash table.
 */
extern void
dhash_apply_all(dhash_t *table, dhash_apply_fn app_fn, void *arg);

/*
 * dhash_filter
 * ------------
 */
extern void
dhash_filter(dhash_t     *table,
             dlist_t     *newlst,
             void        *arg,
             bool (*select_func)(const dhash_elm_t *elm, int idx, void *arg));

/* Generic hash entry using slist bucket. */
typedef slink_t  shash_elm_t;

typedef int (*shash_hash_fn)(int bk_size, const shash_elm_t *elm);
typedef int (*shash_cmp_fn)(const shash_elm_t *elm1, const shash_elm_t *elm2);
typedef void (*shash_free_fn)(const shash_elm_t *, int);

/*
 * Hash table with single linked list bucket.
 */
typedef struct shash shash_t;
struct shash
{
    slink_t      *sh_bucket;
    int           sh_bk_size;
    int           sh_elm_cnt;
    int           sh_max_chain;
    int         (*sh_hash_fn)(int bk_size, const shash_elm_t *elm);
    int         (*sh_cmp_fn)(const shash_elm_t *elm1, const shash_elm_t *elm2);
};

/*
 * Single linked list hash iteration.
 */
typedef struct shash_iter shash_iter_t;
struct shash_iter
{
    shash_t      *sh_tab;
    slink_t      *sh_curr;
    slink_iter_t  sh_iter;
};

/*
 * shash_init
 * ----------
 */
extern void
shash_init(shash_t *table,
           int      size,
           int    (*hash_fn)(int, const shash_elm_t *),
           int    (*cmp_fn)(const shash_elm_t *, const shash_elm_t *));

/*
 * shash_iter_init
 * ---------------
 */
extern void
shash_iter_init(shash_t *table, shash_iter_t *iter);

/*
 * shash_iter_term
 * ---------------
 */
static inline bool
shash_iter_term(shash_iter_t *iter)
{
    return (iter->sh_curr == NULL ? true : false);
}

/*
 * shash_iter_next
 * ---------------
 */
extern void
shash_iter_next(shash_iter_t *iter);

/*
 * shash_iter_rm_curr
 * ------------------
 * Remove the current iterator, required intermediate call to shash_iter_next.
 * Return the chanined element at the current iterator.
 */
extern slink_t *
shash_iter_rm_curr(shash_iter_t *iter);

/*
 * shash_iter_curr
 * ---------------
 */
static inline shash_elm_t *
shash_iter_curr(shash_iter_t *iter)
{
    if (iter->sh_curr != NULL) {
        return (slink_iter_curr(&iter->sh_iter));
    }
    return (NULL);
}

/*
 * shash_free
 * ----------
 */
extern void
shash_free(shash_t *table, void (*free_fn)(shash_elm_t *, int), int sz);

/*
 * shash_insert
 * ------------
 */
extern int
shash_insert_elm(shash_t *table, shash_elm_t *elm,
                 int (*hash_fn)(int, const shash_elm_t *));

static inline int
shash_insert(shash_t *table, shash_elm_t *elm) {
    return shash_insert_elm(table, elm, table->sh_hash_fn);
}

extern int
shash_insert_bucket(shash_t *table, shash_elm_t *elm, int bucket);

/*
 * shash_index
 * -----------
 * Return the bucket of the hashed elem and its index in the table w/out
 * inserting the entry to the table.  Used by custom code to insert the entry
 * to the hash table at the hashed index.
 */
extern int
shash_index(shash_t *table, slink_t **bucket, shash_elm_t *elem);

/*
 * shash_idx_bucket
 * ----------------
 * Return the bucket corresponding with the index.
 */
static inline slink_t *
shash_idx_bucket(shash_t *table, int idx)
{
    verify((0 <= idx) && (idx < table->sh_bk_size));
    return (&table->sh_bucket[idx]);
}

/*
 * shash_rm
 * --------
 * Remove the element in the hash table maching the test elm.  The test elm
 * must not attach to the hash table.
 */
extern shash_elm_t *
shash_rm_elm(shash_t *table, shash_elm_t *elm,
             int (*hash_fn)(int, const shash_elm_t *),
             int (*hash_cmp)(const shash_elm_t *, const shash_elm_t *));

static inline shash_elm_t *
shash_rm(shash_t *table, shash_elm_t *elm)
{
    return shash_rm_elm(table, elm, table->sh_hash_fn, table->sh_cmp_fn);
}

/*
 * shash_rm_bucket
 * ---------------
 */
extern shash_elm_t *
shash_rm_bucket(shash_t *table, shash_elm_t *elm, int bucket);

/*
 * shash_takeout_elm
 * -----------------
 * Take the element out of the hash table.  The element must be attached in
 * the hash table.
 */
extern void
shash_takeout_elm(shash_t *table, shash_elm_t *elm);

/*
 * shash_find
 * ----------
 */
extern shash_elm_t *
shash_find(shash_t *table, const shash_elm_t *elm);

extern shash_elm_t *
shash_find_bucket(shash_t *table, const shash_elm_t *elm, int bucket);

static inline int
shash_get_bucket(shash_t *table, const shash_elm_t *elm)
{
    return (table->sh_hash_fn(table->sh_bk_size, elm));
}

/*
 * shash_apply_fn
 * --------------
 * Callback function to apply to all elements in the hash table.
 *
 * @param elm [i] - the element in the hash table.
 * @param idx [i] - the index of that element.
 */
typedef void
(*shash_apply_fn)(shash_elm_t *elm, int idx, void *arg);

/*
 * shash_apply_all
 * ---------------
 * Apply the function to all elements in the hash table.
 */
extern void
shash_apply_all(shash_t *table, shash_apply_fn app_fn, void *arg);

/*
 * shash_filter
 * ------------
 */
extern void
shash_filter(shash_t     *table,
             slink_t     *newlst,
             void        *arg,
             bool (*select_func)(shash_elm_t *elm, int idx, void *arg));

/*
 * hash_string_fn
 * --------------
 */
extern uint32_t
hash_string_fn(const char *str);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_HASH_H_ */
