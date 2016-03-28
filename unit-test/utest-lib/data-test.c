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
#include <data-test.h>
#include <utest-lib.h>

/*
 * tst_cmp_list
 * ------------
 * Compare two lists and empty them as the result.  Return true if their data
 * are the same.
 */
bool
tst_cmp_list(slist_t *l1, slist_t *l2)
{
    void     *d1, *d2;
    uint32_t  n1, n2;
    bool      ret;

    ret = true;
    while (!slist_empty(l1)) {
        d1 = slist_rm_front_data(l1);
        d2 = slist_rm_front_data(l2);
        if ((d1 != NULL) && (d2 != NULL)) {
            n1 = osd_cast_to_num(d1);
            n2 = osd_cast_to_num(d2);
            if (n1 == n2) {
                continue;
            }
        }
        ret = false;
        break;
    }
    if (ret == false) {
        slist_free_data(l1, NULL);
        slist_free_data(l2, NULL);
    }
    return (ret);
}

/*
 * tst_dlink_num_cmp
 * -----------------
 */
int
tst_dlink_num_cmp(const dlist_t *e1, const dlist_t *e2)
{
    const tst_dlink_num_t  *d1, *d2;

    d1 = object_of(tst_dlink_num_t, dl_link, e1);
    d2 = object_of(tst_dlink_num_t, dl_link, e2);

    return (d1->dl_num - d2->dl_num);
}

/*
 * tst_dlink_num_hash_fn
 * ---------------------
 */
int
tst_dlink_num_hash_fn(int size, const dhash_elm_t *elm)
{
    const tst_dlink_num_t *dt;

    dt = object_of(tst_dlink_num_t, dl_link, elm);
    return (dt->dl_num % size);
}

/*
 * tst_dlink_num_print
 * -------------------
 */
void
tst_dlink_num_print(dlist_t *elm)
{
    tst_dlink_num_t *data;

    data = object_of(tst_dlink_num_t, dl_link, elm);
    printf("[%p [%p %p] - %u] <->\n",
           data, elm->dl_next, elm->dl_prev, data->dl_num);
}

/*
 * tst_dlink_num_hash_print
 * ------------------------
 */
void
tst_dlink_num_hash_print(const dhash_elm_t *elm, int idx, void *arg)
{
    tst_dlink_num_t *data;

    data = object_of(tst_dlink_num_t, dl_link, elm);
    printf("%4d [%p [%p %p] - %u]\n",
           idx, data, elm->dl_next, elm->dl_prev, data->dl_num);
}

/*
 * tst_dlist_num_hash_free
 * -----------------------
 */
void
tst_dlist_num_hash_free(dhash_elm_t *elm, int siz)
{
    free(elm);
}

/*
 * tst_slink_num_cmp
 * -----------------
 */
int
tst_slink_num_cmp(const slink_t *e1, const slink_t *e2)
{
    tst_slink_num_t  *d1, *d2;

    d1 = object_of(tst_slink_num_t, sl_link, e1);
    d2 = object_of(tst_slink_num_t, sl_link, e2);

    return (d1->sl_num - d2->sl_num);
}

/*
 * tst_slink_num_hash_fn
 * ---------------------
 */
int
tst_slink_num_hash_fn(int size, const shash_elm_t *elm)
{
    tst_slink_num_t *dt;

    dt = object_of(tst_slink_num_t, sl_link, elm);
    return (dt->sl_num % size);
}

/*
 * tst_slink_num_hash_print
 * ------------------------
 */
void
tst_slink_num_hash_print(shash_elm_t *elm, int idx, void *arg)
{
    tst_slink_num_t *data;

    data = object_of(tst_slink_num_t, sl_link, elm);
    printf("%4d [%p [%p] - %u]\n", idx, data, elm->sl_next, data->sl_num);
}

/*
 * tst_slist_num_hash_free
 * -----------------------
 */
void
tst_slist_num_hash_free(shash_elm_t *elm, int siz)
{
    free(elm);
}

/*
 * tst_void_int_cmp
 * ----------------
 */
int
tst_void_int_cmp(const void *a1, const void *a2)
{
   int  num1, num2;

   num1 = osd_cast_to_num(a1);
   num2 = osd_cast_to_num(a2);

   return (num1 - num2);
}

/*
 * tst_slink_num_print
 * -------------------
 */
void
tst_slink_num_print(slink_t *elm)
{
    tst_slink_num_t *data;

    data = object_of(tst_slink_num_t, sl_link, elm);
    printf("[%p [-> %p] - %u]\n", data, elm->sl_next, data->sl_num);
}

/*
 * container_test_shell
 * --------------------
 * Interactive test.
 */
void
container_test_shell(container_test_t *ct, slist_t *out)
{
    char       cmd;
    uint32_t  num, res;

    do {
        cmd = utest_getchar("Enter a command\n% ");
        switch (cmd) {
        case 'i':
            if (ct->tst_insert_front != NULL) {
                num = utest_getnum("Insert front, number: ");
                ct->tst_insert_front(ct, num);
            } else {
                printf("Don't support insert front\n");
            }
            break;

        case 'I':
            if (ct->tst_insert_back != NULL) {
                num = utest_getnum("Insert back, number: ");
                ct->tst_insert_back(ct, num);
            } else {
                printf("Don't support insert back\n");
            }
            break;

        case 's':
            if (ct->tst_insert_sorted != NULL) {
                num = utest_getnum("Insert sorted, number: ");
                ct->tst_insert_sorted(ct, num);
            } else {
                printf("Don't support insert sorted\n");
            }
            break;

        case 'r':
            if (ct->tst_remove_front != NULL) {
                num = ct->tst_remove_front(ct);
                printf("Removed %u out of the front\n", num);
            } else {
                printf("Don't support remove front\n");
            }
            break;

        case 'R':
            if (ct->tst_remove_back != NULL) {
                num = ct->tst_remove_back(ct);
                printf("Removed %u out of the back\n", num);
            } else {
                printf("Don't support remove back\n");
            }
            break;

        case 'd':
            if (ct->tst_remove != NULL) {
                num = utest_getnum("Remove number: ");
                res = ct->tst_remove(ct, num);
                printf("Result removed %u\n", res);
            } else {
                printf("Don't support remove number\n");
            }
            break;

        case 'l':
            if (ct->tst_find != NULL) {
                num = utest_getnum("Lookup number: ");
                res = ct->tst_find(ct, num);
                printf("Result lookup %u\n", res);
            } else {
                printf("Don't support lookup\n");
            }
            break;

        case 'b':
            if (ct->tst_split != NULL) {
                num = utest_getnum("Enter data to split container: ");
                ct->tst_split(ct, osd_cast_to_ptr(num));
            } else {
                printf("Don't support split\n");
            }
            break;

        case 'm':
            if (ct->tst_merge != NULL) {
                ct->tst_merge(ct);
            } else {
                printf("Don't support merge\n");
            }
            break;

        case 'p':
            if (ct->tst_print_container != NULL) {
                ct->tst_print_container(ct);
            } else {
                printf("Don't support print\n");
            }
            break;

        case 'f':
            if (ct->tst_filter_out != NULL) {
                ct->tst_filter_out(ct, out);
            } else {
                printf("Don't support filter-out\n");
            }
            break;

        case 'F':
            if (ct->tst_free_all != NULL) {
                ct->tst_free_all(ct);
            } else {
                printf("Don't support free_all\n");
            }
            break;

        case 'q':
            break;

        default:
            printf("Help:\n"
                   "    iI - insert front/back\n"
                   "    rR - remove front/back\n"
                   "    d  - remove a number\n"
                   "    l  - lookup a number\n"
                   "    b  - break up the container\n"
                   "    m  - merge the container\n"
                   "    p  - print the container\n"
                   "    f  - filter out elements from the container\n"
                   "    F  - free all data from the container\n");
            break;
        }
    } while (cmd != 'q');
}

/*
 * container_test_rand_data
 * ------------------------
 * Auto generate random data set to test.
 */
void
container_test_rand_data(container_test_t *ct, slist_t *out, uint32_t num_elm)
{
}
