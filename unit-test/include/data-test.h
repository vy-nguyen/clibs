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
#ifndef _DATA_TEST_H_
#define _DATA_TEST_H_

#include <stdlib.h>
#include <ctype/hash.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

typedef struct tst_dlink_num tst_dlink_num_t;
struct tst_dlink_num
{
    dlist_t    dl_link;
    uint32_t   dl_num;
};

extern int  tst_dlink_num_cmp(const dlist_t *, const dlist_t *);
extern int  tst_dlink_num_hash_fn(int, const dhash_elm_t *);
extern void tst_dlink_num_print(dlist_t *);
extern void tst_dlink_num_hash_print(const dhash_elm_t *, int, void *);
extern void tst_dlist_num_hash_free(dhash_elm_t *, int);

static inline tst_dlink_num_t *
tst_dlink_num_alloc(uint32_t num)
{
    tst_dlink_num_t *dt;

    dt         = malloc(sizeof(*dt));
    dt->dl_num = num;
    return (dt);
}

static inline uint32_t
tst_dlink_num_free(dlist_t *elm)
{
    uint32_t        rt;
    tst_dlink_num_t *dt;

    dt = object_of(tst_dlink_num_t, dl_link, elm);
    rt = dt->dl_num;
    free(dt);
    return (rt);
}

typedef struct tst_slink_num tst_slink_num_t;
struct tst_slink_num
{
    slink_t    sl_link;
    uint32_t  sl_num;
};

extern int  tst_void_int_cmp(const void *, const void *);
extern int  tst_slink_num_cmp(const slink_t *, const slink_t *);
extern int  tst_slink_num_hash_fn(int, const shash_elm_t *);
extern void tst_slink_num_print(slink_t *);
extern void tst_slink_num_hash_print(shash_elm_t *, int, void *);
extern void tst_slist_num_hash_free(shash_elm_t *, int);

static inline tst_slink_num_t *
tst_slink_num_alloc(uint32_t num)
{
    tst_slink_num_t *dt;

    dt         = malloc(sizeof(*dt));
    dt->sl_num = num;
    return (dt);
}

static inline uint32_t
tst_slink_num_free(slink_t *elm)
{
    uint32_t        rt;
    tst_slink_num_t *dt;

    dt = object_of(tst_slink_num_t, sl_link, elm);
    rt = dt->sl_num;
    free(dt);
    return (rt);
}

typedef struct container_test container_test_t;
struct container_test
{
    void      (*tst_insert_front)(container_test_t *ct, uint32_t num);
    void      (*tst_insert_back)(container_test_t *ct, uint32_t num);
    void      (*tst_insert_sorted)(container_test_t *ct, uint32_t num);
    uint32_t (*tst_remove_front)(container_test_t *ct);
    uint32_t (*tst_remove_back)(container_test_t *ct);
    uint32_t (*tst_remove)(container_test_t *ct, uint32_t num);
    uint32_t (*tst_find)(container_test_t *ct, uint32_t num);

    void      (*tst_split)(container_test_t *ct, void *in);
    void      (*tst_merge)(container_test_t *ct);
    void      (*tst_print_container)(container_test_t *ct);
    void      (*tst_filter_out)(container_test_t *ct, slist_t *res);
    void      (*tst_free_all)(container_test_t *ct);
};

/*
 * tst_cmp_list
 * ------------
 * Compare two lists and empty them as the result.  Return TRUE if their data
 * are the same.
 */
extern bool
tst_cmp_list(slist_t *l1, slist_t *l2);

/*
 * container_test_shell
 * --------------------
 * Interactive test.
 */
extern void
container_test_shell(container_test_t *ct, slist_t *out);

/*
 * container_test_rand_data
 * ------------------------
 * Auto generate random data set to test.
 */
extern void
container_test_rand_data(container_test_t *ct, slist_t *out, uint32_t num_elm);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _DATA_TEST_H_ */
