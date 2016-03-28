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
#ifndef _DI_FSM_H_
#define _DI_FSM_H_

#include <pthread.h>
#include <di/request.h>

class StateObj;

class StateEvt : public Request
{
  public:
    OBJECT_COMMON_DEFS(StateEvt);

    virtual void req_done_notif() override;

  protected:
    int                      st_evt;
};

class StateEncode
{
  public:
    virtual ~StateEncode() {}
    StateEncode(int my_idx, int parent) : st_my_idx(my_idx), st_par_idx(parent) {}

    virtual const char *st_name() const = 0;
    virtual void st_enter(StateEvt::cptr evt, const StateObj *st) const;
    virtual void st_exit(StateEvt::cptr evt, const StateObj *st) const;
    virtual int  st_handle(StateEvt::cptr evt, const StateObj *st) const;

  protected:
    const int                st_my_idx;
    const int                st_par_idx;
};

typedef struct state_router state_router_t;
struct state_router
{
    int                      st_cur_state;
    int                      st_evt_code;
    int                      st_nxt_state;
};

class FsmTable : public Module
{
  public:
    OBJECT_COMMON_DEFS(FsmTable);

    void st_input(StateEvt::ptr evt, StateObj *st);
    void st_input_async(StateEvt::ptr evt, StateObj *st);

  protected:
    int                             st_router_cnt;
    const state_router_t            st_routers;
    StateEncode const *const *const st_entries;

    virtual ~FsmTable();
    FsmTable(int cnt, StateEncode const *const *entries);
};

class StateObj
{
  public:
    static const int                st_max_hist = 4;

    virtual ~StateObj() {}
    StateObj(int idx, FsmTable::ptr tab);

  protected:
    int                             st_idx;
    uint32_t                        st_status : 16;
    uint32_t                        st_hist_idx : 16;
    uint8_t                         st_hist_log[st_max_hist];
    DListObj                        st_pend_queue;
};

#endif /* _DI_FSM_H_ */
