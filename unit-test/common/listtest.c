
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
#include <stdio.h>
#include <ctype/list.h>
#include <ctype/dlist.h>
#include <osdep/osdep.h>
#include <data-test.h>

typedef struct dl_container dl_container_t;
struct dl_container
{
    container_test_t  dl_op;
    dlist_t           dl_norm;
    dlist_t           dl_sort;
    dlist_t           dl_merge;
    slist_t           dl_filter;
};

/*
 * dl_container_root
 * -----------------
 */
static inline dl_container_t *
dl_container_root(container_test_t *ct)
{
    return (object_of(dl_container_t, dl_op, ct));
}

static void
dl_tst_insert_front(container_test_t *ct, uint32_t num)
{
    tst_dlink_num_t *dt;
    dl_container_t  *dl = dl_container_root(ct);

    dt = tst_dlink_num_alloc(num);
    dlist_add_front(&dl->dl_norm, &dt->dl_link);
}

static void
dl_tst_insert_back(container_test_t *ct, uint32_t num)
{
    tst_dlink_num_t *dt;
    dl_container_t  *dl = dl_container_root(ct);

    dt = tst_dlink_num_alloc(num);
    dlist_add_back(&dl->dl_norm, &dt->dl_link);
}

static void
dl_tst_insert_sorted(container_test_t *ct, uint32_t num)
{
    tst_dlink_num_t      *dt;
    dl_container_t *dl = dl_container_root(ct);

    dt = tst_dlink_num_alloc(num);
    dlist_add_sorted(&dl->dl_sort, &dt->dl_link, tst_dlink_num_cmp);
}

static uint32_t
dl_tst_remove_front(container_test_t *ct)
{
    dlist_t         *p;
    dl_container_t  *dl = dl_container_root(ct);

    p = dlist_rm_front(&dl->dl_norm);
    if (p != NULL) {
        return (tst_dlink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
dl_tst_remove_back(container_test_t *ct)
{
    dlist_t         *p;
    dl_container_t  *dl = dl_container_root(ct);

    p = dlist_rm_back(&dl->dl_sort);
    if (p != NULL) {
        return (tst_dlink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
dl_tst_remove(container_test_t *ct, uint32_t num)
{
    tst_dlink_num_t  fnd;
    dlist_t         *p;
    dl_container_t  *dl = dl_container_root(ct);

    fnd.dl_num = num;
    p = dlist_find(&dl->dl_norm, &fnd.dl_link, tst_dlink_num_cmp, TRUE);
    if (p != NULL) {
        return (tst_dlink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
dl_tst_find(container_test_t *ct, uint32_t num)
{
    dlist_t         *p;
    dl_container_t  *dl = dl_container_root(ct);
    tst_dlink_num_t *rec, fnd;

    fnd.dl_num = num;
    p = dlist_find(&dl->dl_norm, &fnd.dl_link, tst_dlink_num_cmp, FALSE);
    if (p != NULL) {
        rec = object_of(tst_dlink_num_t, dl_link, p);
        return (rec->dl_num);
    }
    return (0xffffffff);
}

static void
dl_tst_split(container_test_t *ct, void *in)
{
    dlist_t        *sp, nlist;
    dl_container_t *dl = dl_container_root(ct);

    sp = (dlist_t *)in;
    dlist_init(&nlist);
    dlist_split(&dl->dl_norm, sp, &nlist);

    printf("Old list\n");
    dlist_print(&dl->dl_norm, tst_dlink_num_print);

    printf("New list\n");
    dlist_print(&nlist, tst_dlink_num_print);
    dlist_free(&nlist, free);
}

static void
dl_tst_merge(container_test_t *ct)
{
    dl_container_t *dl = dl_container_root(ct);

    dlist_merge(&dl->dl_merge, &dl->dl_norm);
    dlist_merge_front(&dl->dl_merge, &dl->dl_sort);
}

static void
dl_tst_print_container(container_test_t *ct)
{
    dl_container_t *dl = dl_container_root(ct);

    printf("Normal list\n");
    dlist_print(&dl->dl_norm, tst_dlink_num_print);

    printf("\nSorted list\n");
    dlist_print(&dl->dl_sort, tst_dlink_num_print);

    printf("\nMerge list\n");
    dlist_print(&dl->dl_merge, tst_dlink_num_print);
}

static void
dl_tst_filter_out(container_test_t *ct, slist_t *res)
{
    dl_container_t *dl = dl_container_root(ct);
    dl++;
}

static void
dl_tst_free_all(container_test_t *ct)
{
    dl_container_t *dl = dl_container_root(ct);

    dlist_free(&dl->dl_norm, free);
    dlist_free(&dl->dl_sort, free);
    dlist_free(&dl->dl_merge, free);
}

static dl_container_t dl_test =
{
    {
        .tst_insert_front     = dl_tst_insert_front,
        .tst_insert_back      = dl_tst_insert_back,
        .tst_insert_sorted    = dl_tst_insert_sorted,
        .tst_remove_front     = dl_tst_remove_front,
        .tst_remove_back      = dl_tst_remove_back,
        .tst_remove           = dl_tst_remove,
        .tst_find             = dl_tst_find,
        .tst_split            = dl_tst_split,
        .tst_merge            = dl_tst_merge,
        .tst_print_container  = dl_tst_print_container,
        .tst_filter_out       = dl_tst_filter_out,
        .tst_free_all         = dl_tst_free_all
    }
};

typedef struct sl_container sl_container_t;
struct sl_container
{
    container_test_t  sl_op;
    slist_t           sl_norm;
    slist_t           sl_sort;
    slist_t           sl_merge;
    slist_t           sl_filter;
};

/*
 * sl_container_root
 * -----------------
 */
static inline sl_container_t *
sl_container_root(container_test_t *ct)
{
    return (object_of(sl_container_t, sl_op, ct));
}

static void
sl_tst_insert_front(container_test_t *ct, uint32_t num)
{
    tst_slink_num_t *dt;
    sl_container_t  *sl = sl_container_root(ct);

    dt = tst_slink_num_alloc(num);
    slist_insert_front(&sl->sl_norm, &dt->sl_link);
}

static void
sl_tst_insert_back(container_test_t *ct, uint32_t num)
{
    tst_slink_num_t *dt;
    sl_container_t  *sl = sl_container_root(ct);

    dt = tst_slink_num_alloc(num);
    slist_insert_back(&sl->sl_norm, &dt->sl_link);
}

static void
sl_tst_insert_sorted(container_test_t *ct, uint32_t num)
{
    sl_container_t  *sl = sl_container_root(ct);

    slist_insert_sorted_data(&sl->sl_sort,
                             osd_cast_to_ptr(num),
                             tst_void_int_cmp);
}

static uint32_t
sl_tst_remove_front(container_test_t *ct)
{
    slink_t         *p;
    sl_container_t  *sl = sl_container_root(ct);

    p = slist_rm_front(&sl->sl_norm);
    if (p != NULL) {
        return (tst_slink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
sl_tst_remove(container_test_t *ct, uint32_t num)
{
    tst_slink_num_t  fnd;
    slink_t         *p;
    sl_container_t  *sl = sl_container_root(ct);

    fnd.sl_num = num;
    p = slist_find(&sl->sl_norm, &fnd.sl_link, tst_slink_num_cmp, TRUE);
    if (p != NULL) {
        return (tst_slink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
sl_tst_find(container_test_t *ct, uint32_t num)
{
    tst_slink_num_t *rec, fnd;
    slink_t         *p;
    sl_container_t  *sl = sl_container_root(ct);

    fnd.sl_num = num;
    p = slist_find(&sl->sl_norm, &fnd.sl_link, tst_slink_num_cmp, FALSE);
    if (p != NULL) {
        rec = object_of(tst_slink_num_t, sl_link, p);
        return (rec->sl_num);
    }
    return (0xffffffff);
}

static void
sl_tst_split(container_test_t *ct, void *in)
{
    sl_container_t *sl = sl_container_root(ct);
    sl++;
}

static void
sl_tst_merge(container_test_t *ct)
{
    sl_container_t *sl = sl_container_root(ct);
    sl++;
}

static void
sl_tst_print_container(container_test_t *ct)
{
    sl_container_t *sl = sl_container_root(ct);

    printf("Normal list\n");
    slist_print(&sl->sl_norm, tst_slink_num_print);

    printf("Sorted list\n");
    slist_print_data(&sl->sl_sort);

    printf("Merge list\n");
    slist_print(&sl->sl_merge, tst_slink_num_print);

    printf("Filtered list\n");
    slist_print(&sl->sl_filter, tst_slink_num_print);
}

static void
sl_tst_filter_out(container_test_t *ct, slist_t *res)
{
}

static void
sl_tst_free_all(container_test_t *ct)
{
    sl_container_t *sl = sl_container_root(ct);

    slist_free(&sl->sl_norm, (void (*)(slink_t *))free);
    slist_free(&sl->sl_merge, (void (*)(slink_t *))free);
    slist_free(&sl->sl_filter, (void (*)(slink_t *))free);

    slist_free_data(&sl->sl_sort, NULL);
}

static sl_container_t sl_test =
{
    {
        .tst_insert_front     = sl_tst_insert_front,
        .tst_insert_back      = sl_tst_insert_back,
        .tst_insert_sorted    = sl_tst_insert_sorted,
        .tst_remove_front     = sl_tst_remove_front,
        .tst_remove_back      = NULL,
        .tst_remove           = sl_tst_remove,
        .tst_find             = sl_tst_find,
        .tst_split            = sl_tst_split,
        .tst_merge            = sl_tst_merge,
        .tst_print_container  = sl_tst_print_container,
        .tst_filter_out       = sl_tst_filter_out,
        .tst_free_all         = sl_tst_free_all
    }
};

int
main(int argc, char **argv)
{
    printf("Interactive dlist code test\n");
    dlist_init(&dl_test.dl_norm);
    dlist_init(&dl_test.dl_sort);
    dlist_init(&dl_test.dl_merge);
    slist_init(&dl_test.dl_filter);
    container_test_shell(&dl_test.dl_op, &dl_test.dl_filter);

    printf("Interactive slist code test\n");
    slist_init(&sl_test.sl_norm);
    slist_init(&sl_test.sl_sort);
    slist_init(&sl_test.sl_merge);
    slist_init(&sl_test.sl_filter);
    container_test_shell(&sl_test.sl_op, &sl_test.sl_filter);

    return (0);
}
