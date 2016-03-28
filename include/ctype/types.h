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
#ifndef _CTYPE_TYPES_H_
#define _CTYPE_TYPES_H_

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef TRUE
#define TRUE                  (1)
#endif /* TRUE */

#ifndef FALSE
#define FALSE                 (0)
#endif /* FALSE */

#ifndef SUCCESS
#define SUCCESS               (1)
#endif /* SUCCESS */

#ifndef FAILURE
#define FAILURE               (0)
#endif /* FAILURE */

#ifndef MAX
#define MAX(x, y)             ((x) > (y) ? (x) : (y))
#endif /* MAX */

#ifndef MIN
#define MIN(x, y)             ((x) < (y) ? (x) : (y))
#endif /* MIN */

#define DIV_ROUND_UP(n,d)     (((n) + (d) - 1) / (d))

#define IDX_NIL               (-1)
#define osd_cast_ptr(ptr)     (unsigned long)(ptr)
#define osd_cast_to_ptr(num)  (void *)((unsigned long)num)
#define osd_cast_to_num(ptr)  (unsigned long)(ptr)
#define INVAL_UUID            (0ULL)

/* UUID types. */
typedef unsigned long long   uuid64_t;
typedef struct uuid128       uuid128_t;
struct uuid128
{
    uuid64_t  uuid_lo;
    uuid64_t  uuid_hi;
};

/*
 * uuid128_equal
 * -------------
 */
static inline bool
uuid128_equal(uuid128_t *a1, uuid128_t *a2)
{
    if ((a1->uuid_lo == a2->uuid_lo) && (a1->uuid_hi == a2->uuid_hi)) {
        return (true);
    }
    return (false);
}

/*
 * uuid128_nil
 * -----------
 */
static inline int
uuid128_nil(uuid128_t *uuid)
{
    if ((uuid->uuid_lo == INVAL_UUID) && (uuid->uuid_hi == INVAL_UUID)) {
        return (TRUE);
    }
    return (FALSE);
}

/*
 * uuid128_set_nil
 * ---------------
 */
static inline void
uuid128_set_nil(uuid128_t *uuid)
{
    uuid->uuid_lo = INVAL_UUID;
    uuid->uuid_hi = INVAL_UUID;
}

extern uuid64_t gen_uuid64(void);
extern void uuid64_to_str(uuid64_t, char *, uint32_t);
extern void gen_uuid128(uuid128_t *uuid);
extern void uuid128_to_str(const uuid128_t *, char *, uint32_t);

/* Number of elements in an array */
#define num_elem(s)      (sizeof (s) / sizeof ((s)[0]))

/* Get the offset of 'y' in the structure 'x'  */
#define offset(x, y)     offsetof(x, y)

/* Get the address of the obj from addr of an element in it. */
#define object_of(obj, elem, ptr)                                           \
    ((obj *)(((char *)(ptr)) - (char *)offsetof(obj, elem)))

/* Cast a const ptr to a non-const one. */
typedef struct const_conv const_conv_t;
struct const_conv
{
    union {
        void       *cst_ptr;
        const void *cst_const;
    } u;
};

/*
 * cast_no_const
 * -----------------
 * Force cast a const ptr to a non const one.
 */
static inline void *
cast_no_const(const void *ptr)
{
    const_conv_t cast;

    cast.u.cst_const = ptr;
    return (cast.u.cst_ptr);
};

/* Generic control vector. */
typedef struct ctrlvec ctrlvec_t;
struct ctrlvec
{
    void  (*ctrl_init_fn)(const ctrlvec_t *arg);
    void  (*ctrl_startup_fn)(const ctrlvec_t *arg);
    void  (*ctrl_shutdown_fn)(const ctrlvec_t *arg);
    void  (*ctrl_cleanup_fn)(const ctrlvec_t *arg);
};

/*
 * init_ctrlvec
 * ------------
 * Initialize pointers of ctrlvec terminated by NULL.  This method is called
 * to initialize any required data structure.
 */
extern void
init_ctrlvec(const ctrlvec_t **vec);

/*
 * startup_ctrlvec
 * ---------------
 * Invoke startup functions from ctrlvec pointers terminated by NULL.
 */
extern void
startup_ctrlvec(const ctrlvec_t **vec);

/*
 * shutdown_ctrlvec
 * ----------------
 * Invoke shutdown functions from these ctrlvec ptrs.
 */
extern void
shutdown_ctrlvec(const ctrlvec_t **vec);

/*
 * cleanup_ctrlvec
 * ---------------
 * Cleanup and free resources used by these ctrlvec ptrs.
 */
extern void
cleanup_ctrlvec(const ctrlvec_t **vec);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_TYPES_H_ */
