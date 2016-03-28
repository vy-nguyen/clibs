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
#ifndef _CTYPE_SHM_SEG_H_
#define _CTYPE_SHM_SEG_H_

#include <ctype/types.h>
#include <ctype/shm-slist.h>
#include <ctype/shm-dlist.h>
#include <ctype/shm-slab.h>
#include <ctype/dlist.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * States of a shared memory segment.
 */
#define SHM_SEG_EMPTY        (0x00000001)
#define SHM_SEG_PARTIAL      (0x00000002)
#define SHM_SEG_FULL         (0x00000004)
#define SHM_SEG_EXCL_MASK    (0x0000ffff)
#define SHM_SEG_INTERN_REC   (0x10000000)
#define SHM_SEG_EXTERN_REC   (0x20000000)

/*
 * Header layout in a shared memory segment where it can be accessed/
 * reconstructed by any address spaces.
 */
typedef struct shm_seg_hdr shm_seg_hdr_t;
struct shm_seg_hdr
{
    uint64_t         seg_uuid;
    uint64_t         seg_pa;
    idlist_t         seg_link;
    uint32_t         seg_state;

    uint32_t         seg_size;
    uint32_t         seg_rec_size;       /**< record size in bytes.          */
    uint16_t         seg_uhdr_size;      /**< user header size.              */
    uint16_t         seg_rec_alignment;

    uint32_t         seg_uhdr_off;       /**< offset to user header area.    */
    uint32_t         seg_ntotal;         /**< total records in this seg.     */
    uint32_t         seg_nfree;          /**< number of free records.        */
    uint32_t         seg_npending;       /**< alloc but not yet released.    */
    islist_t         seg_free_rec;
    uint64_t         seg_uuid_dup;
};

/*
 * When a record is outside this segment, this segment only tracks the header
 * for that record.
 */
typedef struct seg_rec_hdr seg_rec_hdr_t;
struct seg_rec_hdr
{
    uint64_t         seg_rec_adr;
};

/*
 * Shared memory segment control obj in private addr space.  Data in here are
 * volatile.  This obj can be constructed by the header above.
 */
typedef struct seg_obj seg_obj_t;
struct seg_obj
{
    dlist_t              seg_link;
    shm_seg_hdr_t       *seg_ptr;
    uint32_t            *seg_free_bm;    /**< bitmap, end of shm_seg_hdr.    */
    pthread_mutex_t     *seg_spin;
    void                *seg_args;
    const shm_seg_ops_t *seg_ops;
};

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_SHM_SEG_H_ */
