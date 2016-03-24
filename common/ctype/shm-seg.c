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
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <ctype/bitmap.h>
#include <ctype/shm-slab.h>
#include "shm-seg.h"

#define SHM_SEG_FENCE_PAT                      (0xcafecafe)

/*
 * seg_verify
 * ----------
 */
static int
seg_verify(shm_seg_hdr_t *seg)
{
    uint32_t cnt;
    int      ret;

    ret = isl_fixup_list((char *)seg, seg->seg_size, &seg->seg_free_rec, &cnt);
    if (ret == 0) {
        if (cnt != seg->seg_nfree) {
            printf("Seg %p, wrong nfree %d, %d\n", seg, seg->seg_nfree, cnt);
        }
    } else if (ret == -1) {
        printf("Seg %p has elem out of bound\n", seg);
    } else {
        printf("Seg %p is corrupted, can't fix err 0x%x\n", seg, ret);
    }
    return (ret);
}

/*
 * seg_verify_layout
 * -----------------
 * Verify segment layout to detect any corruption/buffer overrun.
 */
static inline bool
seg_verify_layout(shm_seg_hdr_t *seg)
{
    return (true);
}

/*
 * seg_cal_usage
 * -------------
 */
static void
seg_cal_usage(shm_seg_param_t *p,
              uint32_t       *rec_cnt,
              uint32_t       *rec_flg,
              uint32_t       *rec_siz,
              uint32_t       *hdr_siz,
              uint32_t       *uhdr_off)
{
    uint32_t usr_siz, cnt;

    /* Compute the header size + fence - the free bitmaps. */
    *hdr_siz = sizeof(shm_seg_hdr_t) + p->shm_uhdr_size + sizeof(uint32_t);
    *hdr_siz = round_up_align(*hdr_siz, p->shm_rec_align_sz);
    *rec_siz = round_up_align(p->shm_rec_size, p->shm_rec_align_sz);

    usr_siz = p->shm_seg_size - *hdr_siz;
    if (usr_siz > *rec_siz) {
        /* User data can fit in the segment. */
        cnt = usr_siz / *rec_siz;
    } else {
        cnt = usr_siz / sizeof(seg_rec_hdr_t);
    }
    /* Compute the header + fence + the free bitmaps. */
    *hdr_siz  = bmap_u32cnt(cnt) * sizeof(uint32_t);
    *uhdr_off = *hdr_siz + sizeof(shm_seg_hdr_t) + sizeof(uint32_t);
    *hdr_siz += p->shm_uhdr_size;
    *hdr_siz  = round_up_align(*hdr_siz, p->shm_rec_align_sz);

    usr_siz = p->shm_seg_size - *hdr_siz;
    if (usr_siz >= *rec_siz) {
        *rec_cnt = usr_siz / *rec_siz;
        *rec_flg = SHM_SEG_INTERN_REC;
    } else {
        *rec_cnt = usr_siz / sizeof(seg_rec_hdr_t);
        *rec_flg = SHM_SEG_EXTERN_REC;
    }
}

/*
 * shm_seg_reinit
 * --------------
 * Reinit the shared memory segment to the fresh state.
 */
static void
shm_seg_reinit(shm_seg_hdr_t *seg, shm_seg_param_t *param)
{
    uint32_t *fence, *bitmap, cnt, rec_off;

    seg_cal_usage(param,
                  &seg->seg_ntotal,
                  &seg->seg_state,
                  &seg->seg_rec_size,
                  &rec_off,
                  &seg->seg_uhdr_off);

    fence  = (uint32_t *)(seg + seg->seg_uhdr_off - sizeof(uint32_t));
    *fence = SHM_SEG_FENCE_PAT;
    bitmap = (uint32_t *)(seg + sizeof(*seg));
    bmap_init(bitmap, seg->seg_ntotal, FALSE);

    seg->seg_state    |= SHM_SEG_EMPTY;
    seg->seg_nfree     = seg->seg_ntotal;
    seg->seg_npending  = 0;

    for (cnt = 0; cnt < seg->seg_ntotal; cnt++) {
        isl_add_front(seg, seg->seg_size, &seg->seg_free_rec, rec_off);
        rec_off += seg->seg_rec_size;
    }
    verify(*fence == SHM_SEG_FENCE_PAT);
    verify(rec_off <= seg->seg_size);
    verify(seg_verify_layout(seg) == TRUE);
}

/*
 * shm_seg_handle2obj
 * ------------------
 * Convert segment handle to the object.
 */
static seg_obj_t *
shm_seg_handle2obj(shm_seg_t handle, shm_seg_hdr_t **seg)
{
    seg_obj_t  *obj;

    obj  = (seg_obj_t *)handle;
    *seg = obj->seg_ptr;
    verify(obj->seg_ptr->seg_uuid == obj->seg_ptr->seg_uuid_dup);

    return (obj);
}

/*
 * shm_seg_reinit_freelist
 * -----------------------
 * Reinit the shared memory segnment after the recovery to reclaim all blocks
 * as free.
 */
void
shm_seg_reinit_freelist(shm_seg_t handle)
{
    seg_obj_t       *obj;
    shm_seg_hdr_t   *seg;
    shm_seg_param_t  param;

    obj                    = shm_seg_handle2obj(handle, &seg);
    param.shm_rec_align_sz = seg->seg_rec_alignment;
    param.shm_rec_size     = seg->seg_rec_size;
    param.shm_uhdr_size    = seg->seg_uhdr_size;
    param.shm_seg_size     = seg->seg_size;
    param.shm_seg_pa       = 0;
    shm_seg_reinit(seg, &param);
}

/*
 * shm_seg_clear_header
 * --------------------
 * Clear the segment header to reinitialize it with the new header struct.
 */
void
shm_seg_clear_header(shm_seg_t handle)
{
    seg_obj_t       *obj;
    shm_seg_hdr_t   *seg;

    obj = shm_seg_handle2obj(handle, &seg);
    memset(seg, 0, sizeof(*seg));
}

/*
 * seg_init
 * --------
 */
static void
seg_init(shm_seg_hdr_t *seg, shm_seg_param_t *param)
{
    seg->seg_uuid          = gen_uuid64();
    seg->seg_uuid_dup      = seg->seg_uuid;
    seg->seg_pa            = param->shm_seg_pa;
    seg->seg_size          = param->shm_seg_size;
    seg->seg_rec_size      = param->shm_rec_size;
    seg->seg_uhdr_size     = param->shm_uhdr_size;
    seg->seg_rec_alignment = param->shm_rec_align_sz;

    shm_seg_reinit(seg, param);
}

shm_seg_t
shm_seg_creat(const char *name, size_t size)
{
    char *addr;
    int   fd = shm_open(name, O_RDWR | O_CREAT | O_EXCL, S_IRWXU);

    if (fd < 0) {
        goto err;
    }
    if (ftruncate(fd, size) < 0) {
        goto err;
    }
    addr = (char *)mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (addr == NULL) {
        goto err;
    }
    close(fd);
    return addr;

err:
    perror(name);
    return NULL;
}

shm_seg_t
shm_seg_attach(const char *name, size_t size, int flags)
{
    char *addr;
    int   fd = shm_open(name, O_RDWR, S_IRUSR);

    if (fd < 0) {
        perror("shm_open");
        return NULL;
    }
    addr = (char *)mmap(NULL, size, flags, MAP_SHARED, fd, 0);
    close(fd);

    return addr;
}

int
shm_seg_detach(shm_seg_t seg, size_t size)
{
    return munmap(seg, size);
}

int
shm_seg_destroy(const char *name)
{
    return shm_unlink(name);
}

/*
 * shm_seg_ctor
 * ------------
 */
shm_seg_t
shm_seg_ctor(pthread_mutex_t     *lock,
             uint64_t            *uuid,
             shm_seg_param_t     *param,
             void                *op_args,
             const shm_seg_ops_t *ops)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    hdr = (shm_seg_hdr_t *)ops->shm_pa2va(op_args, param->shm_seg_pa);
    if (hdr == NULL) {
        return (NULL);
    }
    if ((*uuid != INVAL_UUID) && (*uuid != hdr->seg_uuid)) {
        /* Have uuid and don't match with the one on the segment. */
        return (NULL);
    }
    seg = (seg_obj_t *)malloc(sizeof(*seg));
    dlist_init(&seg->seg_link);
    seg->seg_spin = lock;
    seg->seg_ops  = ops;
    seg->seg_ptr  = hdr;
    seg->seg_args = op_args;

    if ((hdr->seg_pa == param->shm_seg_pa) &&
        (hdr->seg_uuid != INVAL_UUID) &&
        (hdr->seg_uuid == hdr->seg_uuid_dup)) {
        /* The segment has valid uuid, do intergity checks. */
        if ((hdr->seg_size == param->shm_seg_size) &&
            (hdr->seg_rec_size == param->shm_rec_size) &&
            (hdr->seg_uhdr_size == param->shm_uhdr_size)) {
            if (seg_verify(hdr) == -1) {
                goto fail;
            }
        } else {
            goto fail;
        }
    } else {
        seg_init(hdr, param);
    }
    seg->seg_free_bm = (uint32_t *)((char *)hdr + sizeof(*hdr));
    verify(hdr->seg_pa == param->shm_seg_pa);
    verify(hdr->seg_uuid == hdr->seg_uuid_dup);

    if (seg_verify_layout(hdr) == TRUE) {
        *uuid = hdr->seg_uuid;
        return ((shm_seg_t)seg);
    }

fail:
    /* It may not be the correct segment.  Return failure. */
    if (ops->shm_unmap_va != NULL) {
    }
    free(seg);
    return (NULL);
}

/*
 * shm_seg_dtor
 * ------------
 */
void
shm_seg_dtor(shm_seg_t obj)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    if (seg->seg_ops->shm_unmap_va != NULL) {
        seg->seg_ops->shm_unmap_va(NULL, seg->seg_ptr->seg_pa);
    }
    free(seg);
}

/*
 * shm_seg_uuid
 * ------------
 */
uint64_t
shm_seg_uuid(shm_seg_t obj)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    return (seg->seg_ptr->seg_uuid);
}

/*
 * shm_seg_op_arg
 * --------------
 */
char *
shm_seg_op_arg(shm_seg_t obj)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    return NULL;
}

/*
 * shm_seg_spinlock
 * ----------------
 */
pthread_mutex_t *
shm_seg_spinlock(shm_seg_t obj)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    return (seg->seg_spin);
}

/*
 * shm_seg_uhdr
 * ------------
 */
char *
shm_seg_uhdr(shm_seg_t obj)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    return ((char *)seg->seg_ptr + seg->seg_ptr->seg_uhdr_off);
}

/*
 * shm_seg_base_adr
 * ----------------
 * Return base VA and PA of the given segment.
 */
char *
shm_seg_base_adr(shm_seg_t obj, uint32_t *seg_size, uint64_t *pa)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    *pa = hdr->seg_pa;
    *seg_size = hdr->seg_size;

    return ((char *)hdr);
}

/*
 * shm_verify_pa_range
 * -------------------
 */
static inline void
shm_verify_pa_range(shm_seg_hdr_t *hdr, uint64_t pa)
{
    verify(pa <= (hdr->seg_pa + hdr->seg_size));
}

/*
 * shm_seg_alloc_rec
 * -----------------
 */
char *
shm_seg_alloc_rec(shm_seg_t obj, uint64_t *pa)
{
    ilink_t       *ptr;
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    *pa = 0;
    ptr = NULL;
    seg = shm_seg_handle2obj(obj, &hdr);
    if ((hdr->seg_state & SHM_SEG_FULL) == 0) {
        pthread_mutex_lock(seg->seg_spin);
        ptr = isl_rm_front((char *)hdr, hdr->seg_size, &hdr->seg_free_rec);
        if (ptr != NULL) {
            hdr->seg_nfree--;
            hdr->seg_state &= ~SHM_SEG_EXCL_MASK;
            if (hdr->seg_nfree == 0) {
                hdr->seg_state |= SHM_SEG_FULL;
            } else {
                hdr->seg_state |= SHM_SEG_PARTIAL;
            }
        }
        pthread_mutex_unlock(seg->seg_spin);
    }
    if (ptr != NULL) {
        *pa = hdr->seg_pa + osd_cast_to_num((void *)ptr - (void *)hdr);
    }
    if (hdr->seg_state & SHM_SEG_INTERN_REC) {
        shm_verify_pa_range(hdr, *pa);
        return ((char *)ptr);
    }
    return (NULL);
}

/*
 * shm_seg_free_rec
 * ----------------
 */
void
shm_seg_free_rec(shm_seg_t obj, uint64_t pa)
{
    seg_obj_t     *seg;
    shm_seg_hdr_t *hdr;

    seg = shm_seg_handle2obj(obj, &hdr);
    pthread_mutex_lock(seg->seg_spin);
    if (hdr->seg_state & SHM_SEG_INTERN_REC) {
        assert(pa >= hdr->seg_pa);
        pa = pa - hdr->seg_pa;
        isl_add_front((char *)hdr, hdr->seg_size, &hdr->seg_free_rec, pa);
        hdr->seg_nfree++;
        if (hdr->seg_nfree == hdr->seg_ntotal) {
            hdr->seg_state &= ~SHM_SEG_EXCL_MASK;
            hdr->seg_state |= SHM_SEG_EMPTY;
        }
    }
    pthread_mutex_unlock(seg->seg_spin);
}
