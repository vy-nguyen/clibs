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
#include <stdio.h>
#include <stdlib.h>
#include <ctype/hash.h>

/*
 * dhash_init
 * ----------
 */
void
dhash_init(dhash_t *table,
           int      size,
           int    (*hash_fn)(int, const dhash_elm_t *),
           int    (*cmp_fn)(const dhash_elm_t *, const dhash_elm_t *))
{
    int  i;

    table->dh_bk_size   = size;
    table->dh_elm_cnt   = 0;
    table->dh_max_chain = 0;
    table->dh_hash_fn   = hash_fn;
    table->dh_cmp_fn    = cmp_fn;
    table->dh_bucket    = (dlist_t *)malloc(size * sizeof(dlist_t));

    for (i = 0; i < size; i++) {
        dlist_init(&table->dh_bucket[i]);
    }
}

/*
 * dhash_free
 * ----------
 */
void
dhash_free(dhash_t *table, void (*free_fn)(dhash_elm_t *, int), int sz)
{
    int      i;
    dlist_t *ptr;

    if (free_fn != NULL) {
        for (i = 0; i < table->dh_bk_size; i++) {
            while (!dlist_empty(&table->dh_bucket[i])) {
                ptr = dlist_rm_front(&table->dh_bucket[i]);
                free_fn((dhash_elm_t *)ptr, sz);
            }
        }
    }
    free(table->dh_bucket);
}

/*
 * dhash_insert_elm
 * ----------------
 */
int
dhash_insert_elm(dhash_t *table, dhash_elm_t *elm,
                 int (*hash_fn)(int, const dhash_elm_t *))
{
    int index;

    index = hash_fn(table->dh_bk_size, elm);
    assert((0 <= index) && (index < table->dh_bk_size));

    table->dh_elm_cnt++;
    dlist_add_back(&table->dh_bucket[index], elm);
    return (index);
}

static void
dhash_rehash(dhash_t *in)
{
    int           count, save;
    dhash_t       out;
    dhash_iter_t  iter;
    dlist_t      *bucket;

    save  = in->dh_elm_cnt;
    count = 0;
    in->dh_elm_cnt = 0;

    dhash_init(&out, 1 + in->dh_bk_size * 2, NULL, NULL);
    for (dhash_iter_init(in, &iter); !dhash_iter_term(&iter); dhash_iter_next(&iter)) {
        dhash_elm_t *elm = dhash_iter_rm_curr(&iter);
        assert(elm != NULL);

        count++;
        out.dh_elm_cnt = 0; /* avoid potential recursive call. */
        dhash_insert_elm(&out, elm, in->dh_hash_fn);
    }
    bucket           = in->dh_bucket;
    in->dh_bucket    = out.dh_bucket;
    in->dh_bk_size   = out.dh_bk_size;
    in->dh_elm_cnt   = count;
    in->dh_max_chain = out.dh_max_chain;
    out.dh_bucket    = NULL;
    free(bucket);
}

/*
 * dhash_rm_elm
 * ------------
 */
dhash_elm_t *
dhash_rm_elm(dhash_t *table, dhash_elm_t *elm,
             int (*hash_fn)(int, const dhash_elm_t *),
             int (*hash_cmp)(const dhash_elm_t *, const dhash_elm_t *))
{
    int      index, chain;
    dlist_t *iter, *cur;

    index = hash_fn(table->dh_bk_size, elm);
    assert((0 <= index) && (index < table->dh_bk_size));

    chain = 0;
    cur   = NULL;
    foreach_dlist_iter(&table->dh_bucket[index], iter) {
        chain++;
        if (hash_cmp(iter, elm) == 0) {
            table->dh_elm_cnt--;
            cur = dlist_iter_rm_curr(&iter);
            break;
        }
    }
    table->dh_max_chain = MAX(table->dh_max_chain, chain);

    if ((chain >= 32) && (table->dh_elm_cnt > 0)) {
        dhash_rehash(table);
    }
    return (cur);
}

/*
 * dhash_takeout_elm
 * -----------------
 * Take the element out of the hash table.  The element must be attached in
 * the hash table.
 */
void
dhash_takeout_elm(dhash_t *table, dhash_elm_t *elm)
{
    table->dh_elm_cnt--;
    dlist_rm(elm);
}

/*
 * dhash_find_elm
 * --------------
 */
dhash_elm_t *
dhash_find_elm(dhash_t *table, const dhash_elm_t *elm,
               int (*hash_fn)(int, const dhash_elm_t *),
               int (*hash_cmp)(const dhash_elm_t *, const dhash_elm_t *))
{
    int       index, cnt;
    dlist_t  *iter, *found;

    index = hash_fn(table->dh_bk_size, elm);
    assert((0 <= index) && (index < table->dh_bk_size));

    cnt   = 0;
    found = NULL;
    foreach_dlist_iter(&table->dh_bucket[index], iter) {
        cnt++;
        if (hash_cmp(iter, elm) == 0) {
            found = iter;
            break;
        }
    }
    table->dh_max_chain = table->dh_max_chain > cnt ? table->dh_max_chain : cnt;

    if ((cnt >= 32) && (table->dh_elm_cnt > 0)) {
        dhash_rehash(table);
    }
    return (found);
}

typedef struct dhash_apply_arg dhash_apply_arg_t;
struct dhash_apply_arg
{
    void           *app_arg;
    dhash_apply_fn  app_fn;
};

/*
 * dhash_filter_all
 * ----------------
 */
static bool
dhash_filter_all(const dhash_elm_t *elm, int index, void *arg)
{
    dhash_apply_arg_t *apply;

    apply = (dhash_apply_arg_t *)arg;
    apply->app_fn(elm, index, apply->app_arg);
    return (false);
}

/*
 * dhash_apply_all
 * ---------------
 */
void
dhash_apply_all(dhash_t *table, dhash_apply_fn app_fn, void *arg)
{
    dhash_apply_arg_t apply;

    apply.app_arg = arg;
    apply.app_fn  = app_fn;
    dhash_filter(table, NULL, (void *)&apply, dhash_filter_all);
}

/*
 * dhash_filter
 * ------------
 * This function takes filtered element out of the table and add it to the newlst
 * if the select_fn returns true.
 */
void
dhash_filter(dhash_t     *table,
             dlist_t     *newlst,
             void        *arg,
             bool (*select_fn)(const dhash_elm_t *elm, int idx, void *arg))
{
    int      i;
    dlist_t *iter, *cur;

    for (i = 0; i < table->dh_bk_size; i++) {
        foreach_dlist_iter(&table->dh_bucket[i], iter) {
            if (select_fn(iter, i, arg) == true) {
                cur = dlist_iter_rm_curr(&iter);
                dlist_add_back(newlst, cur);
            }
        }
    }
}

/*
 * dhash_iter_init
 * ---------------
 */
void
dhash_iter_init(dhash_t *table, dhash_iter_t *iter)
{
    iter->dh_tab = table;
    if (table != NULL) {
        iter->dh_curr = table->dh_bucket;
        dlist_iter_init(iter->dh_curr, &iter->dh_iter);
        if (dlist_iter_term(iter->dh_curr, iter->dh_iter)) {
            dhash_iter_next(iter);
        }
    } else {
        iter->dh_curr = NULL;
        iter->dh_iter = NULL;
    }
}

/*
 * dhash_iter_next
 * ---------------
 */
void
dhash_iter_next(dhash_iter_t *iter)
{
    dlist_t *end;

    if (iter->dh_curr != NULL) {
        if (!dlist_iter_term(iter->dh_curr, iter->dh_iter) ||
            (iter->dh_curr == iter->dh_tab->dh_bucket)) {
            dlist_iter_next(&iter->dh_iter);
            if (!dlist_iter_term(iter->dh_curr, iter->dh_iter)) {
                return;
            }
        }
        iter->dh_curr++;
        end = iter->dh_tab->dh_bucket + iter->dh_tab->dh_bk_size;
        while (iter->dh_curr < end) {
            if (!dlist_empty(iter->dh_curr)) {
                dlist_iter_init(iter->dh_curr, &iter->dh_iter);
                return;
            }
            iter->dh_curr++;
        }
        iter->dh_curr = NULL;
        iter->dh_iter = NULL;
    }
}

dhash_elm_t *
dhash_iter_rm_curr(dhash_iter_t *iter)
{
    dhash_elm_t *curr = iter->dh_iter;
   
    if (iter->dh_iter != NULL) {
        dlist_iter_prev(&iter->dh_iter);
        dhash_takeout_elm(iter->dh_tab, curr);

        if (dlist_iter_term(iter->dh_curr, iter->dh_iter)) {
            if (iter->dh_curr > iter->dh_tab->dh_bucket) {
                iter->dh_curr--;
                assert(iter->dh_curr >= iter->dh_tab->dh_bucket);
                dlist_iter_init(iter->dh_curr, &iter->dh_iter);
            } else {
                assert(iter->dh_curr == iter->dh_tab->dh_bucket);
                iter->dh_iter = iter->dh_curr;
            }
        }
    }
    return curr;
}

/* //////////    S I N G L E    L I N K E D    H A S H    ////////////////// */

/*
 * shash_init
 * ----------
 */
void
shash_init(shash_t *table,
           int      size,
           int    (*hash_fn)(int, const shash_elm_t *),
           int    (*cmp_fn)(const shash_elm_t *, const shash_elm_t *))
{
    int  i;

    table->sh_bk_size   = size;
    table->sh_elm_cnt   = 0;
    table->sh_max_chain = 0;
    table->sh_hash_fn   = hash_fn;
    table->sh_cmp_fn    = cmp_fn;
    table->sh_bucket    = (slink_t *)malloc(size * sizeof(slink_t));

    for (i = 0; i < size; i++) {
        slink_init(&table->sh_bucket[i]);
    }
}

/*
 * shash_free
 * ----------
 */
void
shash_free(shash_t *table, void (*free_fn)(shash_elm_t *, int), int sz)
{
    int      i;
    slink_t *ptr;

    if (free_fn != NULL) {
        for (i = 0; i < table->sh_bk_size; i++) {
            while (!slink_empty(&table->sh_bucket[i])) {
                ptr = slink_rm_front(&table->sh_bucket[i]);
                free_fn(ptr, sz);
            }
        }
    }
    free(table->sh_bucket);
}

/*
 * shash_iter_init
 * ---------------
 */
void
shash_iter_init(shash_t *table, shash_iter_t *iter)
{
    iter->sh_tab = table;
    if (table != NULL) {
        iter->sh_curr = &table->sh_bucket[0];
        slink_iter_init(iter->sh_curr, &iter->sh_iter);

        if (slink_iter_term(&iter->sh_iter) == true) {
            shash_iter_next(iter);
        }
    } else {
        iter->sh_curr = NULL;
        iter->sh_iter.sl_curr = NULL;
    }
}

/*
 * shash_iter_next
 * ---------------
 */
void
shash_iter_next(shash_iter_t *iter)
{
    slink_t *end;

    if (iter->sh_curr != NULL) {
        if (slink_iter_term(&iter->sh_iter) == false) {
            slink_iter_next(&iter->sh_iter);
            if (slink_iter_term(&iter->sh_iter) == false) {
                return;
            }
        }
        iter->sh_curr++;
        end = iter->sh_tab->sh_bucket + iter->sh_tab->sh_bk_size;
        while (iter->sh_curr < end) {
            if (!slink_empty(iter->sh_curr)) {
                slink_iter_init(iter->sh_curr, &iter->sh_iter);
                return;
            }
            iter->sh_curr++;
        }
        iter->sh_curr = NULL;
        iter->sh_iter.sl_curr = NULL;
    }
}

/*
 * shash_iter_rm_curr
 * ------------------
 * It would be error to call this function twice w/out advancing to the next element with
 * shash_iter_next.
 */
slink_t *
shash_iter_rm_curr(shash_iter_t *iter)
{
    slink_t *curr = iter->sh_iter.sl_curr;

    if (curr != NULL) {
        assert(iter->sh_iter.sl_prev != NULL);
        assert(iter->sh_iter.sl_prev->sl_next == curr);

        iter->sh_iter.sl_prev->sl_next = curr->sl_next;
        if ((iter->sh_iter.sl_prev->sl_next == NULL) &&
            (iter->sh_iter.sl_prev == iter->sh_curr)) {
            if (iter->sh_curr > iter->sh_tab->sh_bucket) {
                iter->sh_curr--;
            }
            if (!slink_empty(iter->sh_curr)) {
                /* Mark this end of chain so that we'll go to the next bucket. */
                iter->sh_iter.sl_curr = NULL;
                iter->sh_iter.sl_prev = iter->sh_curr;
            } else {
                slink_iter_init(iter->sh_curr, &iter->sh_iter);
            }
        } else {
            iter->sh_iter.sl_curr = iter->sh_iter.sl_prev;
        }
    }
    return curr; 
}

/*
 * shash_insert_elm
 * ----------------
 */
int
shash_insert_elm(shash_t *table, shash_elm_t *elm,
                 int (*hash_fn)(int, const shash_elm_t *))
{
    int index;

    index = hash_fn(table->sh_bk_size, elm);
    assert((0 <= index) && (index < table->sh_bk_size));

    table->sh_elm_cnt++;
    slink_add_front(&table->sh_bucket[index], elm);

    return (index);
}

/*
 * shash_insert_bucket
 * -------------------
 */
int
shash_insert_bucket(shash_t *table, shash_elm_t *elm, int index)
{
    assert((0 <= index) && (index < table->sh_bk_size));

    table->sh_elm_cnt++;
    slink_add_front(&table->sh_bucket[index], elm);

    return (index);
}

/*
 * shash_index
 * -----------
 * Return the bucket of the hashed elem and its index in the table w/out
 * inserting the entry to the table.  Used by custom code to insert the entry
 * to the hash table at the hashed index.
 */
int
shash_index(shash_t *table, slink_t **bucket, shash_elm_t *elm)
{
    int index;

    index = table->sh_hash_fn(table->sh_bk_size, elm);
    assert((0 <= index) && (index < table->sh_bk_size));

    *bucket = &table->sh_bucket[index];
    return (index);
}

/*
 * shash_rm_elm
 * ------------
 */
shash_elm_t *
shash_rm_elm(shash_t *table, shash_elm_t *elm,
             int (*hash_fn)(int, const shash_elm_t *),
             int (*hash_cmp)(const shash_elm_t *, const shash_elm_t *))
{
    int           index;
    slink_t      *curr, *prev;

    index = hash_fn(table->sh_bk_size, elm);
    assert((0 <= index) && (index < table->sh_bk_size));

    curr = slink_find(&table->sh_bucket[index], elm, hash_cmp, true, &prev);
    if (curr != NULL) {
        table->sh_elm_cnt--;
    }
    return (curr);
}

/*
 * shash_rm_bucket
 * ---------------
 */
shash_elm_t *
shash_rm_bucket(shash_t *table, shash_elm_t *elm, int index)
{
    slink_t      *curr, *prev;

    assert((0 <= index) && (index < table->sh_bk_size));

    curr = slink_find(&table->sh_bucket[index], elm,
                      table->sh_cmp_fn, true, &prev);
    if (curr != NULL) {
        table->sh_elm_cnt--;
    }
    return (curr);
}

/*
 * shash_takeout_elm
 * -----------------
 * Take the element out of the hash table.  The element must be attached in
 * the hash table.
 */
void
shash_takeout_elm(shash_t *table, shash_elm_t *elm)
{
    int      index;
    slink_t *found, *prev;

    index = table->sh_hash_fn(table->sh_bk_size, elm);
    assert((0 <= index) && (index < table->sh_bk_size));

    table->sh_elm_cnt--;
    found = slink_find(&table->sh_bucket[index], elm,
                       table->sh_cmp_fn, true, &prev);

    assert(found == elm);
}

/*
 * shash_find
 * ----------
 */
shash_elm_t *
shash_find(shash_t *table, const shash_elm_t *elm)
{
    int       index;
    slink_t  *found, *prev;

    index = table->sh_hash_fn(table->sh_bk_size, elm);
    assert((0 <= index) && (index < table->sh_bk_size));

    found = slink_find(&table->sh_bucket[index], (shash_elm_t *)elm,
                       table->sh_cmp_fn, false, &prev);
    return (found);
}

/*
 * shash_find_bucket
 * -----------------
 */
shash_elm_t *
shash_find_bucket(shash_t *table, const shash_elm_t *elm, int index)
{
    slink_t  *found, *prev;

    assert((0 <= index) && (index < table->sh_bk_size));

    found = slink_find(&table->sh_bucket[index], (shash_elm_t *)elm,
                       table->sh_cmp_fn, false, &prev);
    return (found);
}

typedef struct shash_apply_arg shash_apply_arg_t;
struct shash_apply_arg
{
    void           *app_arg;
    shash_apply_fn  app_fn;
};

/*
 * shash_filter_all
 * ----------------
 */
static bool
shash_filter_all(shash_elm_t *elm, int index, void *arg)
{
    shash_apply_arg_t *apply;

    apply = (shash_apply_arg_t *)arg;
    apply->app_fn(elm, index, apply->app_arg);
    return (false);
}

/*
 * shash_apply_all
 * ---------------
 */
void
shash_apply_all(shash_t *table, shash_apply_fn app_fn, void *arg)
{
    shash_apply_arg_t apply;

    apply.app_arg = arg;
    apply.app_fn  = app_fn;
    shash_filter(table, NULL, (void *)&apply, shash_filter_all);
}

/*
 * shash_filter
 * ------------
 */
void
shash_filter(shash_t     *table,
             slink_t     *newlst,
             void        *arg,
             bool (*select_fn)(shash_elm_t *elm, int idx, void *arg))
{
    int           i;
    slink_t      *curr, *chk;
    slink_iter_t  iter;

    for (i = 0; i < table->sh_bk_size; i++) {
        foreach_slink_iter(&table->sh_bucket[i], &iter) {
            curr = slink_iter_curr(&iter);
            if (select_fn(curr, i, arg) == true) {
                chk = slink_iter_rm_curr(&iter);

                assert(chk == curr);
                slink_add_front(newlst, curr);
            }
        }
    }
}

/*
 * hash_string_fn
 * --------------
 */
uint32_t
hash_string_fn(const char *str)
{
    uint32_t h;

    for (h = 0; *str; str++) {
        h = (h << 4) + *str;
        h = (h ^ (((h & 0xf0000000) >> 24) & 0x0fffffff));
    }
    return (h);
}
