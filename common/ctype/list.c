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
#include <stdlib.h>
#include <assert.h>
#include <pthread.h>
#include <ctype/list.h>
#include <ctype/assert.h>

/*
 * slink_find
 * ----------
 * The compare function returns 0 if two records are the same.
 */
slink_t *
slink_find(slink_t *head, slink_t *elm,
           int (*cmp_func)(const slink_t *, const slink_t *), bool rm, slink_t **prv)
{
    slink_t *orig;

    orig = head;
    for (; head->sl_next; head = head->sl_next) {
        if (cmp_func(head->sl_next, elm) == 0) {
            elm = head->sl_next;
            if (rm == true) {
                if (prv != NULL) {
                    *prv = (head == orig) ? NULL : head;
                }
                head->sl_next = elm->sl_next;
                elm->sl_next  = NULL;
            }
            return (elm);
        }
    }
    return (NULL);
}

/*
 * slink_filter_out
 * ----------------
 * Filter out selected elements from root to nlst if the sel_fn returns true.
 * This function also could be used to apply the sel_fn to every elemen in the
 * list.
 */
int
slink_filter_out(slink_t *root, slink_t *nlst,
                 bool (*sel_fn)(const slink_t *, void *), void *arg)
{
    slink_t      *curr, *match;
    slink_iter_t  iter;

    foreach_slink_iter(root, &iter) {
        curr = slink_iter_curr(&iter);
        if (sel_fn(curr, arg) == true) {
            match = slink_iter_rm_curr(&iter);
            slink_add_front(nlst, match);
        }
    }
    return (0);
}

/*
 * slist_init
 * ----------
 */
void
slist_init(slist_t *list)
{
    list->sl_tail = NULL;
    slink_init(&list->sl_head);
}

/*
 * slist_free
 * ----------
 */
void
slist_free(slist_t *list, void (*free_fn)(slink_t *))
{
    slink_t  *ptr;

    while (!slist_empty(list)) {
        ptr = slist_rm_front(list);
        free_fn(ptr);
    }
}

/*
 * slist_free_data
 * ---------------
 */
void
slist_free_data(slist_t *list, void (*free_fn)(void *))
{
    void *data;

    while (!slist_empty(list)) {
        data = slist_rm_front_data(list);
        if (free_fn != NULL) {
            free_fn(data);
        }
    }
}

/*
 * slist_insert_back
 * -----------------
 */
void
slist_insert_back(slist_t *list, slink_t *elem)
{
    if (list->sl_tail == NULL) {
        slink_add_front(&list->sl_head, elem);
    } else {
        assert(list->sl_tail->sl_next == NULL);
        list->sl_tail->sl_next = elem;
    }
    elem->sl_next = NULL;
    list->sl_tail = elem;
}

/*
 * slist_insert_back_data
 * ----------------------
 */
void
slist_insert_back_data(slist_t *list, void *data)
{
    sl_elm_t  *elem;

    elem          = (sl_elm_t *)malloc(sizeof(*elem));
    elem->sl_data = data;
    slist_insert_back(list, &elem->sl_link);
}

/*
 * slist_insert_front
 * ------------------
 */
void
slist_insert_front(slist_t *list, slink_t *elem)
{
    if (slink_empty(&list->sl_head)) {
        list->sl_tail = elem;
    }
    slink_add_front(&list->sl_head, elem);
}

/*
 * slist_insert_front_data
 * -----------------------
 */
void
slist_insert_front_data(slist_t *list, void *data)
{
    sl_elm_t  *elm;

    elm          = (sl_elm_t *)malloc(sizeof(*elm));
    elm->sl_data = data;
    slist_insert_front(list, &elm->sl_link);
}

/*
 * slist_rm_front
 * --------------
 */
slink_t *
slist_rm_front(slist_t *list)
{
    slink_t *elem;

    elem = slink_rm_front(&list->sl_head);
    if (elem != NULL) {
        if (list->sl_tail == elem) {
            assert(slink_empty(&list->sl_head));
            list->sl_tail = NULL;
        }
    }
    return (elem);
}

void *
slist_rm_front_data(slist_t *list)
{
    void      *data;
    slink_t   *ptr;
    sl_elm_t  *elm;

    ptr = slist_rm_front(list);
    if (ptr != NULL) {
        elm  = object_of(sl_elm_t, sl_link, ptr);
        data = elm->sl_data;
        free(elm);
    } else {
        data = NULL;
    }
    return (data);
}

/*
 * slist_find
 * ----------
 */
slink_t *
slist_find(slist_t *list, slink_t *data,
           int (*cmp_fn)(const slink_t *, const slink_t *), bool rm)
{
    slink_t *ptr, *prev;

    ptr = slink_find(&list->sl_head, data, cmp_fn, rm, &prev);
    if ((rm == true) && (ptr == list->sl_tail)) {
        list->sl_tail = prev;
    }
    return (ptr);
}

typedef struct sl_iter_arg sl_iter_arg_t;
struct sl_iter_arg
{
    slink_t       iter_dummy;
    const void   *iter_data;
    int         (*iter_cmpfn)(const void *, const void *);
};

/*
 * slist_iter_data_cmp
 * -------------------
 */
static int
slist_iter_data_cmp(const slink_t *elm1, const slink_t *elm2)
{
    sl_elm_t      *elm;
    sl_iter_arg_t *arg;

    elm = object_of(sl_elm_t, sl_link, elm1);
    arg = object_of(sl_iter_arg_t, iter_dummy, elm2);
    return (arg->iter_cmpfn(elm->sl_data, arg->iter_data));
}

/*
 * slist_find_data
 * ---------------
 */
void *
slist_find_data(slist_t *list, const void *data,
                int (*cmp_fn)(const void *, const void *), bool rm)
{
    void          *res;
    slink_t       *ptr;
    sl_elm_t      *elm;
    sl_iter_arg_t  arg;

    arg.iter_data  = data;
    arg.iter_cmpfn = cmp_fn;

    ptr = slist_find(list, &arg.iter_dummy, slist_iter_data_cmp, rm);
    if (ptr != NULL) {
        elm = object_of(sl_elm_t, sl_link, ptr);
        res = elm->sl_data;
        free(elm);
    } else {
        res = NULL;
    }
    return (res);
}

/*
 * slist_insert_sorted
 * -------------------
 */
void
slist_insert_sorted(slist_t *list, slink_t *elem,
                    int (*cmp_fn)(const slink_t *, const slink_t *))
{
    slink_t      *curr, *prev;
    slink_iter_t  iter;

    if (!slist_empty(list)) {
        if (cmp_fn(list->sl_tail, elem) > 0) {
            foreach_slink_iter(&list->sl_head, &iter) {
                curr = slink_iter_curr(&iter);
                if (cmp_fn(curr, elem) > 0) {
                    prev = slink_iter_prev(&iter);
                    if (prev != NULL) {
                        prev->sl_next = elem;
                        elem->sl_next = curr;
                    } else {
                        slink_add_front(curr, elem);
                    }
                    return;
                }
            }
        }
        /* The list is already sorted and tail < elem. */
        slist_insert_back(list, elem);
    } else {
        slist_insert_front(list, elem);
    }
}

/*
 * slist_insert_sorted_data
 * ------------------------
 */
void
slist_insert_sorted_data(slist_t *list, void *data,
                         int (*cmp_fn)(const void *, const void *))
{
    slink_t       *curr, *prev;
    sl_elm_t      *elem, *node;
    slink_iter_t   iter;

    elem          = (sl_elm_t *)malloc(sizeof(*elem));
    elem->sl_data = data;

    if (!slist_empty(list)) {
        node = object_of(sl_elm_t, sl_link, list->sl_tail);
        if (cmp_fn(node->sl_data, elem->sl_data) > 0) {
            foreach_slink_iter(&list->sl_head, &iter) {
                curr = slink_iter_curr(&iter);
                node = object_of(sl_elm_t, sl_link, curr);

                if (cmp_fn(node->sl_data, elem->sl_data) > 0) {
                    prev = slink_iter_prev(&iter);
                    if (prev != NULL) {
                        prev->sl_next         = &elem->sl_link;
                        elem->sl_link.sl_next = curr;
                    } else {
                        slink_add_front(curr, &elem->sl_link);
                    }
                    return;
                }
            }
        }
        /* The list is already sorted and tail < elem. */
        slist_insert_back(list, &elem->sl_link);
    } else {
        slist_insert_front(list, &elem->sl_link);
    }
}

/*
 * slist_filter_out
 * ----------------
 * Filter out selected elements from root to nlst if the sel_fn returns true.
 * This function also could be used to apply the sel_fn to every elemen in the
 * list.
 *
 * Return the number of elements filtered out.
 */
int
slist_filter_out(slist_t *root, slist_t *nlst,
                 bool (*sel_fn)(const slink_t *, const void *), void *arg)
{
    int            cnt;
    slink_t       *curr, *chk;
    slink_iter_t   iter;

    cnt = 0;
    foreach_slink_iter(&root->sl_head, &iter) {
        curr = slink_iter_curr(&iter);
        if (sel_fn(curr, arg) == true) {
            chk = slink_iter_rm_curr(&iter);

            cnt++;
            assert(chk == curr);
            slist_insert_back(nlst, curr);
        }
    }
    return (cnt);
}

/*
 * slist_filter_out_data
 * ---------------------
 */
int
slist_filter_out_data(slist_t *root, slist_t *nlst,
                      bool (*sel_fn)(const void *, const void *), void *arg)
{
    int            cnt;
    slink_t       *curr, *chk;
    sl_elm_t      *elem;
    slink_iter_t   iter;

    cnt = 0;
    foreach_slink_iter(&root->sl_head, &iter) {
        curr = slink_iter_curr(&iter);
        elem = object_of(sl_elm_t, sl_link, curr);
        if (sel_fn(elem->sl_data, arg) == true) {
            chk = slink_iter_rm_curr(&iter);

            cnt++;
            assert(chk == curr);
            slist_insert_back(nlst, curr);
        }
    }
    return (cnt);
}

/*
 * slist_merge
 * -----------
 * Merge the 'list' to 'root' and empty the 'list'
 */
void
slist_merge(slist_t *root, slist_t *list)
{
    if (root->sl_tail != NULL) {
        root->sl_tail->sl_next = list->sl_head.sl_next;
        root->sl_tail          = list->sl_tail;
        list->sl_tail          = NULL;
    } else {
        *root         = *list;
        list->sl_tail = NULL;
    }
    slink_init(&list->sl_head);
}

/*
 * slist_split
 * -----------
 * Split a single link list into two.
 */
void
slist_split(slist_t *old, slink_t *split, slist_t *nlst)
{
    assert(split != NULL);
    assert(slist_empty(nlst));

    if (split->sl_next != NULL) {
        nlst->sl_head.sl_next = split->sl_next;
        nlst->sl_tail         = old->sl_tail;
        split->sl_next        = NULL;
    }
}

/*
 * slist_print_sel_fn
 * ------------------
 * Function to select all elems in the list to print.
 */
static bool
slist_print_sel_fn(const slink_t *ptr, const void *arg)
{
    return (false);
}

/*
 * slist_print
 * -----------
 */
void
slist_print(slist_t *root, void (*print_fn)(slink_t *elm))
{
    int            cnt;
    slink_t       *curr;
    slink_iter_t   iter;

    cnt = 0;
    foreach_slink_iter(&root->sl_head, &iter) {
        curr = slink_iter_curr(&iter);
        print_fn(curr);
        cnt++;
    }
}

/*
 * slist_print_data
 * ----------------
 * Dump the whole list for debugging.
 */
void
slist_print_data(slist_t *root)
{
    int cnt;

    cnt = 0;
    (void)slist_filter_out(root, NULL, slist_print_sel_fn, (void *)&cnt);
}
