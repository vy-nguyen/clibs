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
#ifndef _CTYPE_UUID_MAP_H_
#define _CTYPE_UUID_MAP_H_

#include <ctype/types.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

#define OBJ_ID_NIL               (0)

/*
 * objid_map_uuid64
 * ----------------
 * The ptr should have the refcnt inc before adding to the mapping.
 * @param uuid [in] - uuid to map to the 32-bit indexed obj id.
 * @param ptr  [in] - the ptr associated with { obj_id, uuid }.  Can be NULL.
 * @param refcnt [in] - to guard the ptr from being freed.  Can be NULL.
 * @return 32-bit id that could be indexed to the mapping struct.
 */
extern uint32_t
objid_map_uuid64(uuid64_t *uuid, void *ptr);

/*
 * objid_map_uuid128
 * -----------------
 * Do the mapping for 128-bit uuid.
 */
extern uint32_t
objid_map_uuid128(uuid128_t *uuid, void *ptr);

/*
 * objid_remap_ptr
 * ---------------
 * Remap the obj id with new ptr.  The new ptr should also have its refcnt++
 */
extern int
objid_remap_ptr(uint32_t id, void *ptr);

/*
 * objid_unmap_ptr
 * ---------------
 * Unmap the obj id with { uuid, ptr }.  After this, the caller should do
 * refcnt-- on the ptr.  The mapping from obj_id to uuid is still valid.
 */
extern int
objid_unmap_ptr(uint32_t id);

/*
 * objid_uuid_lookup
 * -----------------
 * Do the same lookup but also return the 64-bit, or 128-bit uuid.
 *
 * @param id      [in]  - the obj id to lookup.
 * @param uuid64  [out] - set to zero if the mapping is for 128-bit uuid.
 * @param uuid128 [out] - set to zero if the mapping is for 64-bit uuid.
 */
extern void *
objid_uuid_lookup(uint32_t id, uuid64_t *uuid64, uuid128_t *uuid128);

/*
 * uuid64_objid_lookup
 * -------------------
 * Do the lookup based on 64-bit uuid.
 *
 * @param uuid [in]  -
 * @param id   [out] -
 */
extern void *
uuid64_objid_lookup(uuid64_t *uuid, uint32_t *id);

/*
 * uuid128_objid_lookup
 * --------------------
 * Do the same lookup but based on 128-bit uuid.
 */
extern void *
uuid128_objid_lookup(uuid128_t *uuid, uint32_t *id);

/*
 * objid_unmap
 * -----------
 * Unmap the obj id.  If the refcnt != NULL, deref it also.
 */
extern int
objid_unmap(uint32_t id);

/*
 * Control vector parameters.
 */
typedef struct uuid_ctrlvec uuid_ctrlvec_t;
struct uuid_ctrlvec
{
    ctrlvec_t     uuid_ctrl_fn;
    uint32_t      uuid_map_rec_shft;
    char          *uuid_persist_dev;
    void *       (*uuid_map_alloc)(size_t);
    void         (*uuid_map_persist)(uuid_ctrlvec_t *, void *arg);
};

extern const uuid_ctrlvec_t gl_uuid_map_ctrlvec;

extern void uuid_map_std_init(const ctrlvec_t *vec);
extern void uuid_map_std_shutdown(const ctrlvec_t *vec);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _UUID_MAP_H_ */
