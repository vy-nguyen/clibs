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
#include <di/request.h>
#include <di/program.h>
#include "mod-test.h"

RequestTest::~RequestTest()
{
    tpool = nullptr;
    // printf("[CPU %d]: destroy task %p\n", sched_getcpu(), this);
}

void
RequestTest::req_exec_task()
{
    // printf("[CPU %d]: exec task %p\n", sched_getcpu(), this);
    float x = 54.3;
    for (int i = 0; i < 100; i++) {
        x = x * x * x;
        rand();
    }
    req_done(0);

    if (req_cnt < 100) {
        RequestTest::ptr req = RequestTest::alloc(req_no, ++req_cnt, tpool);
        tpool->schedule(nullptr, req, req_no % 2, 0);
    }
    Trace::ptr tr = Program::trace();
    tr->trace("Request 0x%llx, queue %d, req cnt %d", 0,
              Trace::ptr2u64(this), req_no, req_cnt, 0);
}

void
RequestTest::req_done_notif()
{
    // printf("[CPU %d]: done task %p\n", sched_getcpu(), this);
}

void
RequestTestInst::SetUp()
{
}

void
RequestTestInst::TearDown()
{
}

void
ThreadPoolTest::SetUp()
{
    tpool = object_cast<ThreadPool>(Program::module("PoolA"));
    assert(tpool != nullptr);
}

void
ThreadPoolTest::TearDown()
{
    tpool = nullptr;
}

TEST_F(ThreadPoolTest, schedule)
{
    RequestTest::ptr req[1000];

    for (uint32_t i = 0; i < num_elem(req); i++) {
        req[i] = RequestTest::alloc(i, 0, tpool);
        tpool->schedule(tpool, req[i], i % 2, 0);
    }
    for (uint32_t i = 0; i < num_elem(req); i++) {
        req[i]->req_wait();
        req[i] = nullptr;
    }
    sleep(10);
}
