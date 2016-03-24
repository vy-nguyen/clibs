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
#ifndef _CTYPE_STATEFSM_H_
#define _CTYPE_STATEFSM_H_

#include <stdint.h>
#include <stdlib.h>
#include <pthread.h>
#include <ctype/types.h>
#include <ctype/dlist.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * Hierachical state machine framework.
 * Elements in a state machine:
 * - States: within a state
 *   o Action function:
 *     a) Entry + exit functions: when the object enters a state 1st time, the
 *     entry function in that state is executed.  After that, new events won't
 *     trigger the entry function.  When an event causes the obj to transit out
 *     of the current state, it runs the exit function.  The exit function
 *     determines the next state and optional output to that state.
 *     b) Exec function: executed whenever a new event is sent to the state.
 *   o Legal input events:
 *     List all expected input events to the state.
 *   o Output transition arcs:
 *     Evaluate { output, next state } from the exit action function to
 *     transit the object to the new state.
 *   o ID of the sub-state/supper-state.
 * - Events:
 */
#define FSM_STATE_HISTORY               (8)
#define FSM_NULL_STATE                  (0xffffffff)

/*
 * Generic event, extra parameters can be added by embeding this obj.
 * The callback function is optional, non-NULL if the submitter wants the cb
 * after the event is executed in the state machine.
 *
 * Whoever generated the event is responsible to free it.  Events can be static
 * or dynamic.
 */
typedef struct fsm_evt fsm_evt_t;
typedef void (*fsm_evt_cbfn)(fsm_evt_t *evt);

#define FSM_EVT_FIELDS                                                        \
    dlist_t                evt_link;                                          \
    uint32_t               evt_id;                                            \
    fsm_evt_cbfn           evt_cbfn

struct fsm_evt
{
    FSM_EVT_FIELDS;
};

/*
 * State obj, embeded inside user's obj to track the state of that obj.
 * Data in this obj are protected by the lock in fsm_ctrl obj.
 */
typedef struct fsm_state fsm_state_t;
struct fsm_state
{
    uint32_t               st_id;
    uint8_t                st_log[FSM_STATE_HISTORY];
    dlist_t                st_evt_queue;
};

/*
 * fsm_set_state
 * -------------
 */
static void inline
fsm_set_state(fsm_state_t *st, uint32_t state)
{
    st->st_id = state;
}

/*
 * fsm_curr_state
 * --------------
 * Return the current state from the state obj.
 */
static inline uint32_t
fsm_curr_state(const fsm_state_t *state)
{
    return (state->st_id);
}

/*
 * Action functions.
 *
 * fsm_exec_fn
 * -----------
 * Common prototype for entry and exec functions.
 * @param arg (i) - user's private data associated with the fsm.
 * @param obj (i) - the state obj embeded inside user's data struct.
 * @param evt (i) - the input event + exteded params.  NULL if in case the
 *     transition is from another that that doesn't send any event.
 */
typedef void
(*fsm_exec_fn)(void *arg, fsm_state_t *obj, fsm_evt_t *evt);

/*
 * fsm_exit_fn
 * -----------
 * The exit function eval the next state and output to that state.
 * @param arg (i) - user's private data associated with the fsm.
 * @param obj (i) - the state obj embeded inside user's data struct.
 * @param in  (i) - input event.
 * @param out (o) - output event if need to generate new event to the next
 *     state.  It could reuse the same event or allocate the new event.  NULL
 *     if don't need to send new event to the new state.
 * @return the next state.
 */
typedef uint32_t
(*fsm_exit_fn)(void *arg, fsm_state_t *obj, fsm_evt_t *in, fsm_evt_t **out);

/*
 * Template for event definitions.
 */
typedef struct fsm_evt_out fsm_evt_out_t;
struct fsm_evt_out
{
    uint32_t                evt_id;
    uint32_t                evt_state_id;
};

/*
 * FSM state defintion.  This is read-only template shared by many objs.
 */
typedef struct fsm_state_def fsm_state_def_t;
struct fsm_state_def
{
    const char             *st_name;
    uint32_t                st_id;
    uint32_t                st_parent_id;

    fsm_exec_fn             st_entry_fn;
    fsm_exec_fn             st_exec_fn;
    fsm_exit_fn             st_exit_fn;

    /* List of legal input event codes. */
    uint32_t                st_nr_in_evt;
    uint32_t               *st_in_evts;

    /* Ouput event & next state routing, terminated by COS_INVAL_IDX. */
    const fsm_evt_out_t     st_out_evts[];
};

/*
 * FSM ops plugins.
 */
typedef struct fsm_ops fsm_ops_t;
struct fsm_ops
{
    size_t                (*fsm_evt_size)(uint32_t evt_id);
    void                  (*fsm_log)(void *, const char *fmt, ...);
    void                  (*fsm_send)(fsm_evt_t *evt);

    /* Function to notify when the state obj reaches the end state. */
    void                  (*fsm_destroy_state)(fsm_state_t *state);
};

/*
 * FSM control obj.
 */
typedef struct fsm_ctrl fsm_ctrl_t;
struct fsm_ctrl
{
    const fsm_ops_t        *fsm_ops;
    const char             *fsm_name;
    void                   *fsm_usr_arg;
    uint32_t                fsm_init_st;
    uint32_t                fsm_nr_states;
    const fsm_state_def_t **fsm_states;

    /* Events allocated to track mem. leak. */
    dlist_t                 fsm_evts;
    pthread_mutex_t        *fsm_mtx;
};

/*
 * fsm_ctrl_init
 * -------------
 */
extern void
fsm_ctrl_init(fsm_ctrl_t            *fsm,
              const fsm_ops_t       *ops,
              const char            *name,
              void                  *usr,
              uint32_t               init_state,
              uint32_t               nr_states,
              const fsm_state_def_t *states[]);

/*
 * fsm_ctrl_construct
 * ------------------
 */
static inline fsm_ctrl_t *
fsm_ctrl_construct(const fsm_ops_t       *ops,
                   const char            *name,
                   void                  *usr,
                   uint32_t               init_state,
                   uint32_t               nr_states,
                   const fsm_state_def_t *states[])
{
    fsm_ctrl_t *fsm;

    fsm = (fsm_ctrl_t *)malloc(sizeof(*fsm));
    fsm_ctrl_init(fsm, ops, name, usr, init_state, nr_states, states);
    return (fsm);
}

/*
 * fsm_ctrl_usr_arg
 * ----------------
 */
static inline void *
fsm_ctrl_usr_arg(const fsm_ctrl_t *fsm)
{
    return (fsm->fsm_usr_arg);
}

/*
 * fsm_init_evt
 * ------------
 */
static inline void
fsm_init_evt(fsm_evt_t *evt, uint32_t id)
{
    evt->evt_id   = id;
    dlist_init(&evt->evt_link);
}

/*
 * fsm_alloc_evt
 * -------------
 * Allocate event that would be tracked by the fsm.
 */
static inline fsm_evt_t *
fsm_alloc_evt(fsm_ctrl_t *fsm, uint32_t id)
{
    fsm_evt_t *evt;

    evt = (fsm_evt_t *)malloc(fsm->fsm_ops->fsm_evt_size(id));
    fsm_init_evt(evt, id);

    pthread_mutex_lock(fsm->fsm_mtx);
    dlist_add_back(&fsm->fsm_evts, &evt->evt_link);
    pthread_mutex_unlock(fsm->fsm_mtx);
    return (evt);
}

/*
 * fsm_free_evt
 * ------------
 * Free the event allocated by the fsm.
 */
static inline void
fsm_free_evt(fsm_ctrl_t *fsm, fsm_evt_t *evt)
{
    pthread_mutex_lock(fsm->fsm_mtx);
    dlist_rm(&evt->evt_link);
    pthread_mutex_unlock(fsm->fsm_mtx);

    free(evt);
}

/*
 * fsm_submit_evt_id
 * -----------------
 * Light weight, just submit the event id to the state fsm.
 */
extern void
fsm_submit_evt_id(const fsm_ctrl_t *fsm, fsm_state_t *state, uint32_t evt_id);

/*
 * fsm_submit_evt
 * --------------
 * @param evt (i) - the event is owned by the submitter.  Request the cbfn if
 *     want to free it after the event is executed.
 * @param cbfn (i) - optional callback when the event is executed.
 */
extern void
fsm_submit_evt(const fsm_ctrl_t *fsm,
               fsm_state_t      *state,
               fsm_evt_t        *evt,
               fsm_evt_cbfn      cbfn);

/*
 * fsm_submit_evt_sync
 * -------------------
 * Block the caller until the event is executed.
 */
extern void
fsm_submit_evt_sync(const fsm_ctrl_t *fsm,
                    fsm_state_t      *state,
                    fsm_evt_t        *evt);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_STATEFSM_H_ */
