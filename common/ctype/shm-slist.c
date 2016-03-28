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
#include <ctype/shm-slist.h>

/*
 * islist_find
 * -----------
 * Remove the 1st matching record.  The compare function returns 0 if two
 * records are the same.  If the rm arg is TRUE, then also rmeove it out of
 * the list and set the prev ptr if it's not NULL.
 */
void
islist_find(char *base, uint32_t bound, uint32_t list_off, uint32_t elm_off,
            int (*cmp_fn)(ilink_t *, ilink_t *), bool rm, ilink_t **prv)
{
}

/*
 * islist_filter_out
 * -----------------
 * Filter out selected elements from the root list to nlst list if the sel_fn
 * returns TRUE.  This function also could be use to apply the sel_fn function
 * to every element in the list.
 * @return the number of elements filtered out from the root list.
 */
int
islist_filter_out(char       *base,
                  uint32_t    bound,
                  uint32_t    root_off,
                  uint32_t    nlist_off,
                  bool (*sel_fn)(ilink_t *, char *), char *arg)
{
    return (0);
}

/*
 * isl_fixup_list
 * --------------
 * Fixup the list after one of the insert/remove updates was interrupted by
 * crash leaving the list in shared memory in the inconsistent state.
 */
int
isl_fixup_list(char *base, uint32_t bound, islist_t *root, uint32_t *cnt)
{
    ilink_t       *elm, *nxt;
    uint32_t       off;
    int            ret;
    islist_iter_t  iter;

    *cnt = 0;
    if ((root->isl_head >= bound) || (root->isl_tail >= bound)) {
        return (-2);
    }
    if (root->isl_tail == IDX_NIL) {
        if (root->isl_head != IDX_NIL) {
            /* When adding 1st elm to the front, only the head was updated. */
            root->isl_tail = root->isl_head;
        }
    } else {
        elm = (ilink_t *)(base + root->isl_tail);
        if (root->isl_head == IDX_NIL) {
            /* When removing the last elem, only the head was updated. */
            if (elm->il_next == IDX_NIL) {
                root->isl_tail = IDX_NIL;
            } else {
                return (-1);
            }
        } else {
            if (elm->il_next != IDX_NIL) {
                if (elm->il_next > bound) {
                    return (-2);
                }
                nxt = (ilink_t *)(base + elm->il_next);
                if (nxt->il_next == IDX_NIL) {
                    /* When adding back, the tail wasn't updated. */
                    root->isl_tail = elm->il_next;
                } else {
                    return (-1);
                }
            }
        }
    }
    isl_iter_init(root, base, bound, &iter);
    do {
        (*cnt)++;
        ret = islist_iter_next(&iter, &off, &nxt);
        if (ret == -2) {
            *cnt = 0;
            return (ret);
        }
    } while (ret == 0);

    (*cnt)--;
    return (0);
}
