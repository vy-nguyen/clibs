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
#include <ctype/hash.h>
#include <data-test.h>
#include <utest-lib.h>

typedef struct dhash_container dhash_container_t;
struct dhash_container
{
    container_test_t  dh_op;
    dhash_t           dh_norm;
    dhash_t           dh_sort;
    dhash_t           dh_merge;
    slist_t           dh_filter;
};

/*
 * dhash_container_root
 * --------------------
 */
static inline dhash_container_t *
dhash_container_root(container_test_t *ct)
{
    return (object_of(dhash_container_t, dh_op, ct));
}

static void
dhash_tst_insert(container_test_t *ct, uint32_t num)
{
    tst_dlink_num_t   *dt;
    dhash_container_t *dh;

    dh = dhash_container_root(ct);
    dt = tst_dlink_num_alloc(num);
    dhash_insert(&dh->dh_norm, &dt->dl_link);
}

static uint32_t
dhash_tst_remove(container_test_t *ct, uint32_t num)
{
    dlist_t           *p;
    tst_dlink_num_t    fnd;
    dhash_container_t *dh;

    fnd.dl_num = num;
    dh = dhash_container_root(ct);
    p  = dhash_rm(&dh->dh_norm, &fnd.dl_link);
    if (p != NULL) {
        return (tst_dlink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
dhash_tst_find(container_test_t *ct, uint32_t num)
{
    dlist_t           *p;
    tst_dlink_num_t   *rec, fnd;
    dhash_container_t *dh;

    fnd.dl_num = num;
    dh = dhash_container_root(ct);
    p  = dhash_find(&dh->dh_norm, &fnd.dl_link);
    if (p != NULL) {
        rec = object_of(tst_dlink_num_t, dl_link, p);
        return (rec->dl_num);
    }
    return (0xffffffff);
}

static void
dhash_tst_print_container(container_test_t *ct)
{
    dhash_container_t *dh;

    dh = dhash_container_root(ct);
    printf("Normal hash table\n");
    dhash_apply_all(&dh->dh_norm, tst_dlink_num_hash_print, NULL);
}

static void
dhash_tst_filter_out(container_test_t *ct, slist_t *res)
{
    dhash_container_t *dh;

    dh = dhash_container_root(ct);
    dh++;
}

static dhash_container_t gl_dhash_test =
{
    {
        .tst_insert_front     = dhash_tst_insert,
        .tst_insert_back      = dhash_tst_insert,
        .tst_insert_sorted    = NULL,
        .tst_remove_front     = NULL,
        .tst_remove_back      = NULL,
        .tst_remove           = dhash_tst_remove,
        .tst_find             = dhash_tst_find,
        .tst_split            = NULL,
        .tst_merge            = NULL,
        .tst_print_container  = dhash_tst_print_container,
        .tst_filter_out       = dhash_tst_filter_out,
        .tst_free_all         = NULL
    }
};

typedef struct shash_container shash_container_t;
struct shash_container
{
    container_test_t  sh_op;
    shash_t           sh_norm;
    shash_t           sh_sort;
    shash_t           sh_merge;
    slist_t           sh_filter;
};

/*
 * shash_container_root
 * --------------------
 */
static inline shash_container_t *
shash_container_root(container_test_t *ct)
{
    return (object_of(shash_container_t, sh_op, ct));
}

static void
shash_tst_insert(container_test_t *ct, uint32_t num)
{
    tst_slink_num_t   *dt;
    shash_container_t *sh;

    sh = shash_container_root(ct);
    dt = tst_slink_num_alloc(num);
    shash_insert(&sh->sh_norm, &dt->sl_link);
}

static uint32_t
shash_tst_remove(container_test_t *ct, uint32_t num)
{
    slink_t            *p;
    tst_slink_num_t    fnd;
    shash_container_t *sh;

    fnd.sl_num = num;
    sh = shash_container_root(ct);
    p  = shash_rm(&sh->sh_norm, &fnd.sl_link);
    if (p != NULL) {
        return (tst_slink_num_free(p));
    }
    return (0xffffffff);
}

static uint32_t
shash_tst_find(container_test_t *ct, uint32_t num)
{
    slink_t           *p;
    tst_slink_num_t   *rec, fnd;
    shash_container_t *sh;

    fnd.sl_num = num;
    sh = shash_container_root(ct);
    p  = shash_find(&sh->sh_norm, &fnd.sl_link);
    if (p != NULL) {
        rec = object_of(tst_slink_num_t, sl_link, p);
        return (rec->sl_num);
    }
    return (0xffffffff);
}

static void
shash_tst_print_container(container_test_t *ct)
{
    shash_container_t *sh;

    sh = shash_container_root(ct);
    printf("Normal hash table\n");
    shash_apply_all(&sh->sh_norm, tst_slink_num_hash_print, NULL);
}

static void
shash_tst_filter_out(container_test_t *ct, slist_t *res)
{
    int                cnt;
    shash_iter_t       iter;
    shash_elm_t       *cur;
    tst_slink_num_t   *rec;
    shash_container_t *sh;

    sh = shash_container_root(ct);
    shash_iter_init(&sh->sh_norm, &iter);
    for (cnt = 0; shash_iter_term(&iter) == FALSE; cnt++) {
        cur = shash_iter_curr(&iter);
        rec = object_of(tst_slink_num_t, sl_link, cur);
        printf("Hash iter %d, rec %p, num %u\n", cnt, rec, rec->sl_num);

        shash_iter_next(&iter);
    }
    printf("Total hash element %d\n", cnt);
}

static shash_container_t gl_shash_test =
{
    {
        .tst_insert_front     = shash_tst_insert,
        .tst_insert_back      = shash_tst_insert,
        .tst_insert_sorted    = NULL,
        .tst_remove_front     = NULL,
        .tst_remove_back      = NULL,
        .tst_remove           = shash_tst_remove,
        .tst_find             = shash_tst_find,
        .tst_split            = NULL,
        .tst_merge            = NULL,
        .tst_print_container  = shash_tst_print_container,
        .tst_filter_out       = shash_tst_filter_out,
        .tst_free_all         = NULL
    }
};

static void
sh_list_cmd(int sfd, char *cmdline)
{
    utest_print(sfd, "List command: %s\n", cmdline);
}

static void
sh_echo_cmd(int sfd, char *cmdline)
{
    utest_print(sfd, "echo %s\n", cmdline);
}

static utst_shell_t gl_test_shell =
{
    .sh_port       = 5000,
    .sh_prompt     = "% ",
    .sh_timeout    = NULL,
    .sh_tout_hdler = NULL,
    .sh_private    = NULL,
    .sh_cmdtab     =
    {
        {
            .sh_cmd      = "list",
            .sh_cmd_help = "List option",
            .sh_handler  = sh_list_cmd
        },
        {
            .sh_cmd      = "echo",
            .sh_cmd_help = "echo command",
            .sh_handler  = sh_echo_cmd
        }
    }
};

int
main(int argc, char **argv)
{
    printf("Interactive dhash test\n");
    slist_init(&gl_dhash_test.dh_filter);
    dhash_init(&gl_dhash_test.dh_norm,
               20, tst_dlink_num_hash_fn, tst_dlink_num_cmp);
    dhash_init(&gl_dhash_test.dh_sort,
               20, tst_dlink_num_hash_fn, tst_dlink_num_cmp);
    dhash_init(&gl_dhash_test.dh_merge,
               20, tst_dlink_num_hash_fn, tst_dlink_num_cmp);
    container_test_shell(&gl_dhash_test.dh_op, &gl_dhash_test.dh_filter);

    printf("Interactive shash test\n");
    slist_init(&gl_shash_test.sh_filter);
    shash_init(&gl_shash_test.sh_norm,
               20, tst_slink_num_hash_fn, tst_slink_num_cmp);
    shash_init(&gl_shash_test.sh_sort,
               20, tst_slink_num_hash_fn, tst_slink_num_cmp);
    shash_init(&gl_shash_test.sh_merge,
               20, tst_slink_num_hash_fn, tst_slink_num_cmp);
    container_test_shell(&gl_shash_test.sh_op, &gl_shash_test.sh_filter);

    utest_shell(&gl_test_shell);
    return (0);
}
