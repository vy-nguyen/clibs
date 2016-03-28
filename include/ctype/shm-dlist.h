/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
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
#ifndef _CTYPE_SHM_DLIST_H_
#define _CTYPE_SHM_DLIST_H_

#include <stdint.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * Double linked list based on relative addresses from a common base.
 */
typedef struct idlist idlist_t;
struct idlist
{
    uint32_t         il_next;
    uint32_t         il_prev;
};

/*
 * idlist_init
 * -----------
 */
static inline void
idlist_init(char *base, uint32_t ilist_off)
{
    idlist_t *ilist;

    ilist = (idlist_t *)(base + ilist_off);
    ilist->il_next = ilist->il_prev = ilist_off;
}

/*
 * idlist_empty
 * ------------
 */
static inline int
idlist_empty(char *base, uint32_t ilist_off)
{
    idlist_t *ilist;

    ilist = (idlist_t *)(base + ilist_off);
    return ((ilist->il_next == ilist_off) && (ilist->il_prev == ilist_off));
}

/*
 * idlist_add_front
 * ----------------
 */
static inline void
idlist_add_front(char *base, uint32_t list_off, uint32_t elm_off)
{
    idlist_t *list, *elem, *next;

    elem          = (idlist_t *)(base + elm_off);
    list          = (idlist_t *)(base + list_off);
    next          = (idlist_t *)(base + list->il_next);
    elem->il_next = list->il_next;
    elem->il_prev = list_off;
    next->il_prev = elm_off;
    list->il_next = elm_off;
}

/*
 * idlist_add_back
 * ---------------
 */
static inline void
idlist_add_back(char *base, uint32_t list_off, uint32_t elm_off)
{
    idlist_t *prev;

    prev = (idlist_t *)(base + list_off);
    idlist_add_front(base, prev->il_prev, elm_off);
}

/*
 * idlist_rm
 * ---------
 */
static inline void
idlist_rm(char *base, uint32_t elm_off)
{
    idlist_t *elem, *next, *prev;

    elem          = (idlist_t *)(base + elm_off);
    next          = (idlist_t *)(base + elem->il_next);
    prev          = (idlist_t *)(base + elem->il_prev);
    next->il_prev = elem->il_prev;
    prev->il_next = elem->il_next;
}

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _SHM_DLIST_H_ */
