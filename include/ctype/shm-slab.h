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
#ifndef _SHM_SLAB_H_
#define _SHM_SLAB_H_

#include <pthread.h>
#include <ctype/shm-slist.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * Generic library to manage fixed size records in shared memory segment where
 * data pointers must be relative offset because the base could be mapped to
 * different address spaces.
 */
typedef struct shm_seg_param shm_seg_param_t;
struct shm_seg_param
{
    uint32_t         shm_rec_align_sz;   /**< alignment, min 4-bytes.        */
    uint32_t         shm_rec_size;       /**< size in bytes.                 */
    uint32_t         shm_uhdr_size;
    size_t           shm_seg_size;       /**< size in bytes.                 */
    uint64_t         shm_seg_pa;
};

/*
 * shm_pa2va
 * ---------
 * Return the map of PA to VA for a given segment.
 *
 * shm_unmap_va
 * ------------
 * [Optional] Unmap VA of a segment when not in use.
 */
#define SHM_SEG_OPS_FUNCS                                                     \
    void   (*shm_mempcy)(char *arg, char *dest, char *src, size_t len);       \
    void   (*shm_memset)(char *arg, char *dest, int, size_t len);             \
    char * (*shm_pa2va)(char *arg, uint64_t pa);                              \
    void   (*shm_unmap_va)(char *arg, uint64_t pa)

/*
 * Generic ops plugin for a segment.
 */
typedef struct shm_slab_ops shm_seg_ops_t;
struct shm_seg_ops
{
    SHM_SEG_OPS_FUNCS;
};

typedef char * shm_seg_t;

extern shm_seg_t shm_seg_creat(const char *name, size_t size);
extern shm_seg_t shm_seg_attach(const char *name, size_t size, int flags);
extern int       shm_seg_detach(shm_seg_t seg, size_t size);
extern int       shm_seg_destroy(const char *name);

/*
 * shm_seg_ctor
 * ------------
 */
extern shm_seg_t
shm_seg_ctor(pthread_mutex_t     *lock,
             uint64_t            *uuid,
             shm_seg_param_t     *param,
             void                *op_arg,
             const shm_seg_ops_t *ops);

/*
 * shm_seg_dtor
 * ------------
 */
extern void
shm_seg_dtor(shm_seg_t seg);

/*
 * shm_seg_uuid
 * ------------
 */
extern uint64_t
shm_seg_uuid(shm_seg_t seg);

/*
 * shm_seg_op_arg
 * --------------
 */
extern char *
shm_seg_op_arg(shm_seg_t seg);

/*
 * shm_seg_spinlock
 * ----------------
 */
extern pthread_mutex_t *
shm_seg_spinlock(shm_seg_t seg);

/*
 * shm_seg_clear_header
 * --------------------
 * Clear the segment header to reinitialize it with the new header struct.
 */
extern void
shm_seg_clear_header(shm_seg_t handle);

/*
 * shm_seg_uhdr
 * ------------
 * Return VA of the header reserved for user data.
 */
extern char *
shm_seg_uhdr(shm_seg_t seg);

/*
 * shm_seg_base_adr
 * ----------------
 * Return base VA and PA of the given segment.
 */
extern char *
shm_seg_base_adr(shm_seg_t seg, uint32_t *seg_size, uint64_t *pa);

/*
 * shm_seg_reinit_freelist
 * -----------------------
 * Reinit the free list in the shared memory segment slab.  Call this function
 * after doing the recovery to reclaim any allocated blocks but weren't tracked
 * in the recovery log.
 */
extern void
shm_seg_reinit_freelist(shm_seg_t seg);

/*
 * shm_seg_alloc_rec
 * -----------------
 * Allocate a fixed size record from the segment's free list.
 *
 * @param seg (i) - the segment to allocate the memory from.
 * @param pa  (o) - physical address of the memory allocated.
 */
extern char *
shm_seg_alloc_rec(shm_seg_t seg, uint64_t *pa);

/*
 * shm_seg_free_rec
 * ----------------
 * Free the memory record at the physical address back to free list.  The
 * memory must be within the given segment.
 */
extern void
shm_seg_free_rec(shm_seg_t seg, uint64_t pa);

typedef enum
{
    /* Log opcodes < 0x1000 are reserved. */
    SHM_LOG_OP_EMPTY         = 0x0,
    SHM_LOG_OP_RSVD          = 0x1000,
    SHM_LOG_USR_OP
} shm_log_code_e;

/*
 * Plugin to support slab allocator in shared memory or any index based,
 * relative addressing from a common base.
 */
typedef struct shm_slab_ops shm_slab_ops_t;
struct shm_slab_ops
{
    SHM_SEG_OPS_FUNCS;

    /*
     * shm_open/close
     * --------------
     * Open/close the root segment based on the given name.
     * @return: PA of the segment that could be mapped to VA.
     */
    uint64_t (*shm_open)(char *arg, const char *slab_name);
    void      (*shm_close)(char *arg);

    /*
     * shm_alloc_seg
     * -------------
     * Allocate data segment that may not be able to map to VA.
     */
    uint64_t (*shm_alloc_seg)(char *arg, uint32_t seg_size);

    /*
     * shm_free_seg
     * ------------
     * Free the data segment above.
     */
    void (*shm_free_seg)(char *arg, uint64_t seg);

    /*
     * shm_alloc_va_seg
     * ----------------
     * Allocate a segment and map it to virtual address.
     * @param pa (o) - the PA of the segment.
     * @return VA of the segment.
     */
    char * (*shm_alloc_va_seg)(char *arg, uint64_t *pa);

    /*
     * shm_free_va_seg
     * ---------------
     * Free the segment allocated above.
     * @param va, pa (i) - va and its corresponding pa for consistency check.
     */
    void (*shm_free_va_seg)(char *arg, char *va, uint64_t pa);

    /*
     * shm_rollback_log
     * ----------------
     * Rollback uncommited log record.  The framework calls this to recover
     * these logs after the opening call.
     * @param log_op (i) : the log opcode.
     * @param log (i) : address of the log record to rollback old content.
     * @param rec (i) : address of the record to be rolled back.
     * @param size (i) : size of the log record.
     */
    void
    (*shm_rollback_log)(char           *arg,
                        char           *log,
                        char           *rec,
                        shm_log_code_e  log_op,
                        size_t          size);
};

typedef char * shm_slab_t;
typedef char * shm_slab_log_t;

/*
 * Constructor/destructor parameters.
 */
typedef struct shm_slab_ctrl shm_slab_ctrl_t;
struct shm_slab_ctrl
{
    /* Input parameters. */
    const char          *slab_name;
    size_t               slab_pg_size;          /**< page size in bytes.     */
    uint32_t             slab_bucket_cnt;       /**< bucket array count.     */
    uint32_t            *slab_bucket_sizes;
    uint32_t            *slab_bucket_min_pgs;
    uint32_t            *slab_bucket_max_pgs;

    /* Output parameter. */
    shm_slab_t           slab_handle;
};

/*
 * shm_slab_create
 * ---------------
 */
extern shm_slab_t
shm_slab_create(const shm_slab_ctrl_t *ctrl);

/*
 * shm_slab_free
 * -------------
 */
extern void
shm_slab_free(shm_slab_t slab);

/*
 * shm_alloc
 * ---------
 */
extern char *
shm_alloc(shm_slab_t slab, uint64_t *pa, size_t size);

/*
 * shm_free
 * --------
 */
extern void
shm_free(shm_slab_t slab, uint64_t pa, char *va, size_t size);

/*
 * shm_slab_start_log
 * ------------------
 */
extern shm_slab_log_t
shm_slab_start_log(shm_slab_t       slab,
                   char            *rec,
                   shm_log_code_e   log_op,
                   char           **log,
                   size_t           log_sz);

/*
 * shm_slab_set_log_code
 * ---------------------
 */
extern void
shm_slab_set_log_code(shm_slab_log_t log, shm_log_code_e code);

/*
 * shm_slab_commit_log
 * -------------------
 */
extern void
shm_slab_commit_log(shm_slab_t slab, shm_slab_log_t log);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_SHM_SLAB_H_ */
