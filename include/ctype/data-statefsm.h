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
#ifndef _DATA_STATEFSM_H_
#define _DATA_STATEFSM_H_

/*
 * Simple state transition table to use in data path.  The caller must do high
 * level locking.
 */
#include <ctype/assert.h>
#include <ctype/types.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * State obj is embeded inside caller's data structure to track the state
 * of that data structure as it goes through the state transition.
 */
typedef struct dt_state_obj dt_state_obj_t;
struct dt_state_obj
{
    uint32_t             dst_idx;
};

#define DST_EVT_NO_OP     (0xffffffff)
#define DST_STATE_EVT_FIELDS                                                  \
    uint32_t             dst_evt

/*
 * Generic event to the state.  Extend this struct to include extra arguments.
 */
typedef struct dt_state_evt dt_state_evt_t;
struct dt_state_evt
{
    DST_STATE_EVT_FIELDS;
};

typedef void (*dst_act_fn)(dt_state_obj_t *, dt_state_evt_t *);

/*
 * One input arc to the state has:
 * 1) Input event (code + optional param).
 * 2) Action for the event at that state.  The action must be non-blocking
 *    because the caller may hold a lock.
 */
typedef struct dt_state_arc dt_state_arc_t;
struct dt_state_arc
{
    uint32_t             dst_evt_code;
    uint32_t             dst_exe_flags;
    uint32_t             dst_next_state;
    dst_act_fn           dst_action_fn;
};

/*
 * Execution flags for an input arc.
 */
#define DST_EXE_NONE      (0x00000000)
#define DST_EXE_NEXT_ST   (0x00000001)

/* Set this flag when the next state is coded in dt_state_arc_t. */
#define DST_NEXT_STATIC   (0x00000002)

/* Set this flag to change the state before exec the action function. */
#define DST_CHG_ST_1ST    (0x00000004)

/*
 * State definition.  Input events are indexed to the state directly without
 * any locking and queueing.
 */
typedef struct dt_state_defs dt_state_defs_t;
struct dt_state_defs
{
    uint32_t              dst_index;
    const char           *dst_name;
    const dt_state_arc_t *dst_trans_arcs;
};

/*
 * State machine table.
 */
typedef struct dt_state_fsm dt_state_fsm_t;
struct dt_state_fsm
{
    uint32_t              dst_num_evts;
    uint32_t              dst_num_states;
    const dt_state_defs_t dst_states[];
};

/*
 * dt_state_assign_st
 * ------------------
 * Used by the initialization code to assign the init. state to the st obj.
 */
static inline void
dt_state_assign_st(dt_state_obj_t *st, uint32_t state)
{
    st->dst_idx = state;
}

/*
 * dt_state_current
 * ----------------
 * Return the current state of the state obj.
 */
static inline uint32_t
dt_state_current(dt_state_obj_t *st)
{
    return (st->dst_idx);
}

/*
 * dt_state_assign_evt
 * -------------------
 */
static inline void
dt_state_assign_evt(dt_state_evt_t *evt, uint32_t code)
{
    evt->dst_evt = code;
}

/*
 * dt_state_evt_code
 * -----------------
 */
static inline uint32_t
dt_state_evt_code(dt_state_evt_t *evt)
{
    return (evt->dst_evt);
}

/*
 * dt_state_verify_table
 * ---------------------
 * Verify that the state table is setup correctly.
 */
extern void
dt_state_verify_table(const dt_state_fsm_t *tab);

/*
 * dt_state_evt
 * ------------
 * Submit the event to the state obj and invoke the action according to the
 * state table.  Caller must take care of the lock.
 */
extern void
dt_state_evt(const dt_state_fsm_t *tab, dt_state_obj_t *, dt_state_evt_t *);

/*
 * Common generic action functions that could be shared.
 */
extern void dt_act_illegal_ok(dt_state_obj_t *, dt_state_evt_t *);
extern void dt_act_illegal_panic(dt_state_obj_t *, dt_state_evt_t *);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_DATA_STATEFSM_H_ */
