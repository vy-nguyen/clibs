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
#include <pthread.h>
#include <ctype/hash.h>
#include <ctype/uuid-map.h>
#include <osdep/constants.h>

/*
 * 32-bit obj id encoding
 * 0                                                               31
 * +-------------------------------------+--------------------------+
 * |  shift-entry index (e.g. 22 bits)   |   collision assignment   |
 * +-------------------------------------+--------------------------+
 */
#define UUID_REC_COLLISION_SHFT        (6)

typedef struct uuid_map uuid_map_t;
struct uuid_map
{
    slink_t           uid_link;
    void             *uid_ptr;
    uint32_t          uid_obj_id;
    uuid128_t         uid_128;
};

typedef struct uuid_map_ctrl uuid_map_ctrl_t;
struct uuid_map_ctrl
{
    uint32_t          uid_idx_mask;
    uint32_t          uid_col_mask;
    uint32_t          uid_map_entries;

    slist_t           uid_free_map;
    uuid_map_t       *uid_map_recs;
    shash_t           uid_table;
    pthread_mutex_t   uid_spin;
    pthread_mutex_t   uid_bket_spin[OSD_MAX_CPUS];
};

static uuid_map_ctrl_t gl_uuid_map;

/*
 * objid_index
 * -----------
 */
static inline uint32_t 
objid_index(uint32_t id, uint32_t *collision)
{
    *collision = id >> UUID_REC_COLLISION_SHFT;
    return (id & gl_uuid_map.uid_idx_mask);
}

/*
 * objid_assign_val
 * ----------------
 */
static inline uint64_t
objid_assign_val(uint32_t  idx, uint32_t  collision)
{
    uint64_t id;

    id = 0;
    id = idx & gl_uuid_map.uid_idx_mask;
    return (id | (collision << UUID_REC_COLLISION_SHFT));
}

/*
 * objid_hash_fn
 * -------------
 * Simple hash function to hash uuid.
 */
static int
objid_hash_fn(int size, const shash_elm_t *entry)
{
    uuid_map_t  *map;
    uint32_t    *ptr, hash;

    map  = object_of(uuid_map_t, uid_link, entry);
    ptr  = (uint32_t  *)&map->uid_128.uuid_lo;
    hash = ptr[0] ^ ptr[1];
    if (map->uid_128.uuid_hi != 0) {
        ptr  = (uint32_t  *)&map->uid_128.uuid_hi;
        hash = hash ^ ptr[0];
        hash = hash ^ ptr[1];
    }
    return (hash % size);
}

/*
 * objid_hash_cmp_fn
 * -----------------
 * Compare function based on uuid as the key used in hash table.
 */
static int
objid_hash_cmp_fn(const shash_elm_t *e1, const shash_elm_t *e2)
{
    uuid_map_t  *map1, *map2;

    map1 = object_of(uuid_map_t, uid_link, e1);
    map2 = object_of(uuid_map_t, uid_link, e2);
    if (uuid128_equal(&map1->uid_128, &map2->uid_128) == TRUE) {
        return (0);
    }
    return (1);
}

/*
 * objid_id_cmp_fn
 * ---------------
 * Compare function based on obj id as the key.
 */
static int
objid_id_cmp_fn(const slink_t *e1, const slink_t *e2)
{
    uuid_map_t *r1, *r2;

    r1 = object_of(uuid_map_t, uid_link, e1);
    r2 = object_of(uuid_map_t, uid_link, e2);
    if (r1->uid_obj_id == r2->uid_obj_id) {
        return (0);
    }
    return (1);
}

/*
 * objid_init_ctrl
 * ---------------
 */
static void
objid_init_ctrl(uuid_map_ctrl_t *ctrl, uint32_t map_entries, uuid_map_t *maps)
{
    uint32_t  i;

    ctrl->uid_idx_mask = 0;
    ctrl->uid_col_mask = 0;
    for (i = 0; i < map_entries; i++) {
        ctrl->uid_idx_mask |= (1 << i);
    }
    ctrl->uid_col_mask    |= ~ctrl->uid_idx_mask;
    ctrl->uid_map_recs     = maps;
    ctrl->uid_map_entries  = map_entries;

    pthread_mutex_init(&ctrl->uid_spin, NULL);
    for (i = 0; i < OSD_MAX_CPUS; i++) {
        pthread_mutex_init(&ctrl->uid_bket_spin[i], NULL);
    }
    slist_init(&ctrl->uid_free_map);
    for (i = 0; i < map_entries; i++) {
        slist_insert_back(&ctrl->uid_free_map, &maps[i].uid_link);
    }
    shash_init(&ctrl->uid_table, map_entries, objid_hash_fn, objid_hash_cmp_fn);
}

/*
 * objid_alloc_map_rec
 * -------------------
 */
static inline uuid_map_t *
objid_alloc_map_rec(uuid_map_ctrl_t *ctrl)
{
    slink_t *ptr;

    pthread_mutex_lock(&ctrl->uid_spin);
    ptr = slist_rm_front(&ctrl->uid_free_map);
    pthread_mutex_unlock(&ctrl->uid_spin);
    assert(ptr != NULL);

    return (object_of(uuid_map_t, uid_link, ptr));
}

/*
 * objid_free_map_rec
 * ------------------
 */
static inline void
objid_free_map_rec(uuid_map_ctrl_t *ctrl, uuid_map_t *map)
{
    pthread_mutex_lock(&ctrl->uid_spin);
    slist_insert_back(&ctrl->uid_free_map, &map->uid_link);
    pthread_mutex_unlock(&ctrl->uid_spin);
}

/*
 * objid_bucket_spinl
 * ------------------
 */
static inline pthread_mutex_t *
objid_bucket_spinl(uuid_map_ctrl_t *ctrl, int idx)
{
    return (&ctrl->uid_bket_spin[idx & OSD_MAX_CPUS_MASK]);
}

/*
 * objid_add_mapping
 * -----------------
 */
static uint32_t
objid_add_mapping(uuid_map_ctrl_t *ctrl, uuid_map_t *map)
{
    uint32_t    idx, col, tmp;
    void       *ptr;
    slink_t    *lnk, *cur, *pre;
    uuid_map_t *rec;

    lnk = NULL;
    idx = shash_index(&gl_uuid_map.uid_table, &lnk, &map->uid_link);
    assert(idx != -1);
    assert(lnk != NULL);

    /* We can't assign the obj id 0. */
    col = idx != 0 ? 0 : 1;
    tmp = 0;
    pre = lnk;
    rec = NULL;
    pthread_mutex_lock(objid_bucket_spinl(&gl_uuid_map, idx));
    for (cur = lnk->sl_next; cur != NULL; pre = cur, cur = cur->sl_next) {
        col++;
        rec = object_of(uuid_map_t, uid_link, cur);
        assert(idx == objid_index(rec->uid_obj_id, &tmp));

        if (objid_hash_cmp_fn(&rec->uid_link, &map->uid_link) == 0) {
            break;
        }
        rec = NULL;
    }
    if (rec == NULL) {
        /* XXX: TODO make sure the id is unique in the chain. */

        /* Ok to add this record to the hash. */
        verify(pre->sl_next == NULL);
        pre->sl_next          = &map->uid_link;
        map->uid_link.sl_next = NULL;
        map->uid_obj_id       = objid_assign_val(idx, col);
    }
    pthread_mutex_unlock(objid_bucket_spinl(&gl_uuid_map, idx));

    if (rec != NULL) {
        /* Found existing record with matching uuid. */
        verify(map != rec);
        ptr = map->uid_ptr;
        objid_free_map_rec(&gl_uuid_map, map);

        if (rec->uid_ptr == ptr) {
            return (rec->uid_obj_id);
        }
        return (OBJ_ID_NIL);
    }
    verify(map->uid_obj_id != OBJ_ID_NIL);
    return (map->uid_obj_id);
}

/*
 * objid_map_uuid64
 * ----------------
 * @param uuid [in] - uuid to map to the 32-bit indexed obj id.
 * @param ptr  [in] - the ptr associated with { obj_id, uuid }.  Can be NULL.
 * @param refcnt [in] - to guard the ptr from being freed.  Can be NULL.
 * @return 32-bit id that could be indexed to the mapping struct.
 */
uint32_t
objid_map_uuid64(uuid64_t *uuid, void *ptr)
{
    uuid_map_t *map;

    map                  = objid_alloc_map_rec(&gl_uuid_map);
    map->uid_ptr         = ptr;
    map->uid_128.uuid_lo = *uuid;
    map->uid_128.uuid_hi = INVAL_UUID;

    return (objid_add_mapping(&gl_uuid_map, map));
}

/*
 * objid_map_uuid128
 * -----------------
 * Do the mapping for 128-bit uuid.
 */
uint32_t
objid_map_uuid128(uuid128_t *uuid, void *ptr)
{
    uuid_map_t *map;

    map          = objid_alloc_map_rec(&gl_uuid_map);
    map->uid_ptr = ptr;
    map->uid_128 = *uuid;

    return (objid_add_mapping(&gl_uuid_map, map));
}

/*
 * objid_remap_ptr
 * ---------------
 * Remap the obj id with new ptr and its refcnt.
 */
int
objid_remap_ptr(uint32_t id, void *ptr)
{
    return (0);
}

/*
 * objid_unmap_ptr
 * ---------------
 * Unmap the obj id with { uuid, ptr }.  Still maintain the mapping from
 * obj_id to uuid.
 */
int
objid_unmap_ptr(uint32_t id)
{
    return (0);
}

/*
 * objid_uuid_lookup
 * -----------------
 * Do the same lookup but also return the 64-bit, or 128-bit uuid.
 *
 * @param id      [in]  - the obj id to lookup.
 * @param uuid64  [out] - set to zero if the mapping is for 128-bit uuid.
 * @param uuid128 [out] - set to zero if the mapping is for 64-bit uuid.
 */
void *
objid_uuid_lookup(uint32_t id, uuid64_t *uuid64, uuid128_t *uuid128)
{
    uint32_t    idx, col;
    void       *ptr;
    slink_t    *bket, *found, *pre;
    uuid_map_t *map, rec;

    ptr  = NULL;
    idx  = objid_index(id, &col);
    bket = shash_idx_bucket(&gl_uuid_map.uid_table, idx);

    rec.uid_obj_id = id;
    pthread_mutex_lock(objid_bucket_spinl(&gl_uuid_map, idx));
    found = slink_find(bket, &rec.uid_link, objid_id_cmp_fn, FALSE, &pre);
    if (found != NULL) {
        map = object_of(uuid_map_t, uid_link, found);
        ptr = map->uid_ptr;
        if (map->uid_128.uuid_hi == INVAL_UUID) {
            /* We only have 64-bit uuid. */
            *uuid64 = map->uid_128.uuid_lo;
            if (uuid128 != NULL) {
                uuid128_set_nil(uuid128);
            }
        } else {
            *uuid128 = map->uid_128;
            if (uuid64 != NULL) {
                *uuid64  = INVAL_UUID;
            }
        }
    } else {
        if (uuid64 != NULL) {
            *uuid64 = INVAL_UUID;
        }
        if (uuid128 != NULL) {
            uuid128_nil(uuid128);
        }
    }
    pthread_mutex_unlock(objid_bucket_spinl(&gl_uuid_map, idx));
    return (ptr);
}

/*
 * uuid64_objid_lookup
 * -------------------
 * Do the lookup based on 64-bit uuid.
 *
 * @param uuid [in]  -
 * @param id   [out] -
 */
void *
uuid64_objid_lookup(uuid64_t *uuid, uint32_t *id)
{
    uuid128_t uuid128;

    uuid128.uuid_lo = *uuid;
    uuid128.uuid_hi = INVAL_UUID;
    return (uuid128_objid_lookup(&uuid128, id));
}

/*
 * uuid128_objid_lookup
 * --------------------
 * Do the same lookup but based on 128-bit uuid.
 */
void *
uuid128_objid_lookup(uuid128_t *uuid, uint32_t *id)
{
    uint32_t    idx, tmp;
    void       *ptr;
    slink_t    *lnk, *cur;
    uuid_map_t *rec, find;

    find.uid_128 = *uuid;
    idx = shash_index(&gl_uuid_map.uid_table, &lnk, &find.uid_link);
    assert(idx != -1);
    assert(lnk != NULL);

    pthread_mutex_lock(objid_bucket_spinl(&gl_uuid_map, idx));
    for (cur = lnk->sl_next; cur != NULL; cur = cur->sl_next) {
        tmp = 0;
        rec = object_of(uuid_map_t, uid_link, cur);
        assert(idx == objid_index(rec->uid_obj_id, &tmp));

        if (objid_hash_cmp_fn(&rec->uid_link, &find.uid_link) == 0) {
            break;
        }
        rec = NULL;
    }
    if (rec == NULL) {
        ptr = NULL;
        *id = OBJ_ID_NIL;
    } else {
        ptr = rec->uid_ptr;
        *id = rec->uid_obj_id;
    }
    pthread_mutex_unlock(objid_bucket_spinl(&gl_uuid_map, idx));
    return (ptr);
}

/*
 * objid_unmap
 * -----------
 * Unmap the obj id.  If the refcnt != NULL, deref it also.
 */
int
objid_unmap(uint32_t id)
{
    return (0);
}

/*
 * uuid_map_persist
 * ----------------
 */
static void
uuid_map_persist(uuid_ctrlvec_t *vec, void *arg)
{
}

/*
 * uuid_map_std_init
 * -----------------
 */
void
uuid_map_std_init(const ctrlvec_t *vec)
{
    size_t                cnt, siz;
    uuid_map_t           *maps;
    const uuid_ctrlvec_t *ctrl;

    ctrl = object_of(const uuid_ctrlvec_t, uuid_ctrl_fn, vec);
    cnt  = 1 << ctrl->uuid_map_rec_shft;
    siz  = cnt * sizeof (*maps);
    maps = (uuid_map_t *)ctrl->uuid_map_alloc(siz);
    objid_init_ctrl(&gl_uuid_map, cnt, maps);
}

/*
 * uuid_map_std_shutdown
 * ---------------------
 */
void
uuid_map_std_shutdown(const ctrlvec_t *vec)
{
    const uuid_ctrlvec_t *ctrl;

    ctrl = object_of(const uuid_ctrlvec_t, uuid_ctrl_fn, vec);
    if (ctrl->uuid_map_alloc != NULL) {
    }
}

const uuid_ctrlvec_t gl_uuid_map_ctrlvec =
{
    .uuid_ctrl_fn =
    {
        .ctrl_init_fn     = uuid_map_std_init,
        .ctrl_startup_fn  = NULL,
        .ctrl_shutdown_fn = uuid_map_std_shutdown,
        .ctrl_cleanup_fn  = NULL
    },
    .uuid_map_rec_shft    = 16,
    .uuid_persist_dev     = NULL,
    .uuid_map_alloc       = malloc,
    .uuid_map_persist     = uuid_map_persist
};
