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
#include <ctype/data-statefsm.h>

/*
 * dt_state_verify_table
 * ---------------------
 * Verify that the state table is setup correctly.
 */
void
dt_state_verify_table(const dt_state_fsm_t *tab)
{
    uint32_t              i, evt;
    const dt_state_arc_t  *arc;
    const dt_state_defs_t *cur;

    for (i = 0; i < tab->dst_num_states; i++) {
        cur = &tab->dst_states[i];
        verify(cur->dst_index == i);

        for (evt = 0; evt < tab->dst_num_evts; evt++) {
            if (cur->dst_trans_arcs == NULL) {
                continue;
            }
            arc = &cur->dst_trans_arcs[evt];
            verify(arc->dst_evt_code == evt);
            if (((arc->dst_exe_flags & DST_CHG_ST_1ST) != 0) ||
                ((arc->dst_exe_flags & DST_NEXT_STATIC) != 0)) {
                verify(arc->dst_next_state < tab->dst_num_states);
            }
        }
    }
}

/*
 * dt_state_evt
 * ------------
 * Submit the event to the state obj and invoke the action according to the
 * state table.  Caller must take care of the lock.
 */
void
dt_state_evt(const dt_state_fsm_t *tab, dt_state_obj_t *st, dt_state_evt_t *evt)
{
    uint32_t              pre;
    const dt_state_arc_t  *arc;
    const dt_state_defs_t *cur;

    while (evt->dst_evt != DST_EVT_NO_OP) {
        assert(evt->dst_evt < tab->dst_num_evts);
        assert(st->dst_idx < tab->dst_num_states);

        pre = st->dst_idx;
        cur = &tab->dst_states[st->dst_idx];
        arc = &cur->dst_trans_arcs[evt->dst_evt];

        /* If want to change the state before calling the action. */
        if ((arc->dst_exe_flags & DST_CHG_ST_1ST) != 0) {
            st->dst_idx = arc->dst_next_state;
        }
        if (arc->dst_action_fn != NULL) {
            arc->dst_action_fn(st, evt);
        }
        /*
         * When the next state is setup by the table and the current state is
         * the same before the action function, change the state.
         */
        if ((st->dst_idx == pre) &&
            (arc->dst_exe_flags & DST_NEXT_STATIC) != 0) {
            st->dst_idx = arc->dst_next_state;
        }
        if ((arc->dst_exe_flags & DST_EXE_NEXT_ST) != 0) {
            continue;
        }
        break;
    }
}

/*
 * dt_act_illegal_ok
 * -----------------
 */
void
dt_act_illegal_ok(dt_state_obj_t *st, dt_state_evt_t *evt)
{
}

/*
 * dt_act_illegal_panic
 * --------------------
 */
void
dt_act_illegal_panic(dt_state_obj_t *st, dt_state_evt_t *evt)
{
    verify(0);
}
