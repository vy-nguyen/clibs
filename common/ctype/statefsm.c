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
#include <ctype/statefsm.h>

/*
 * fsm_ctrl_init
 * -------------
 */
void
fsm_ctrl_init(fsm_ctrl_t            *fsm,
              const fsm_ops_t       *ops,
              const char            *name,
              void                  *usr,
              uint32_t               init_state,
              uint32_t               nr_states,
              const fsm_state_def_t *states[])
{
    fsm->fsm_ops       = ops;
    fsm->fsm_name      = name;
    fsm->fsm_usr_arg   = usr;
    fsm->fsm_init_st   = init_state;
    fsm->fsm_nr_states = nr_states;
    fsm->fsm_states    = states;
}

/*
 * fsm_submit_evt_id
 * -----------------
 * Light weight, just submit the event id to the state fsm.
 */
void
fsm_submit_evt_id(const fsm_ctrl_t *fsm, fsm_state_t *state, uint32_t evt_id)
{
}

/*
 * fsm_submit_evt
 * --------------
 * @param evt (i) - the event is owned by the submitter.  Request the cbfn if
 *     want to free it after the event is executed.
 * @param cbfn (i) - optional callback when the event is executed.
 */
void
fsm_submit_evt(const fsm_ctrl_t *fsm,
               fsm_state_t      *state,
               fsm_evt_t        *evt,
               fsm_evt_cbfn      cbfn)
{
}

/*
 * fsm_submit_evt_sync
 * -------------------
 * Block the caller until the event is executed.
 */
void
fsm_submit_evt_sync(const fsm_ctrl_t *fsm,
                    fsm_state_t      *state,
                    fsm_evt_t        *evt)
{
}
