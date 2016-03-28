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
#include <ctype/dlist.h>

/*
 * dlist_split
 * -----------
 * Split a dlist at ptr point.  The first half remains in the old 'hdr' list,
 * the 2nd half becomes the 'res' list.  The 'res' list must be an empty list.
 */
void
dlist_split(dlist_t *hdr, dlist_t *ptr, dlist_t *res)
{
    if (!dlist_empty(ptr)) {
        if (hdr != ptr) {
            res->dl_next          = ptr;
            res->dl_prev          = hdr->dl_prev;
            hdr->dl_prev          = ptr->dl_prev;
            hdr->dl_prev->dl_next = hdr;
            ptr->dl_prev          = res;
            res->dl_prev->dl_next = res;
        } else {
            dlist_merge(hdr, res);
        }
    }
}

/*
 * dlist_add_sorted
 * ----------------
 * Added new element to a sorted dlist.
 */
void
dlist_add_sorted(dlist_t *list, dlist_t *elm,
                 int (*cmp_fn)(const dlist_t *elm1, const dlist_t *elm2))
{
    dlist_t *cur;

    if (!dlist_empty(list)) {
        if (cmp_fn(list->dl_prev, elm) >= 0) {
            foreach_dlist_iter(list, cur) {
                if (cmp_fn(elm, cur) <= 0) {
                    dlist_add_back(cur, elm);
                    return;
                }
            }
        } else {
            /* List is already sorted, this code optimizes the insertion. */
            dlist_add_back(list, elm);
        }
    } else {
        dlist_add_front(list, elm);
    }
}

/*
 * dlist_filter_out
 * ----------------
 * Move any dlist element from 'old' to 'newlst' when the cmp_func returns true.
 * Will apply the cmp_func to every element of the list.
 */
void
dlist_filter_out(dlist_t *old, dlist_t *newlst,
                 bool cmp_func(dlist_t *elm, void *arg), void *arg)
{
    dlist_t   *iter, *curr;

    foreach_dlist_iter(old, iter) {
        if (cmp_func(iter, arg) == true) {
            curr = dlist_iter_rm_curr(&iter);
            dlist_add_back(newlst, curr);
        }
    }
}

/*
 * dlist_print
 * -----------
 * Print the whole dlist for debugging.
 */
void
dlist_print(dlist_t *dlist, void (*print_fn)(dlist_t *elem))
{
    dlist_t   *iter;

    foreach_dlist_iter(dlist, iter) {
        print_fn(iter);
    }
}
