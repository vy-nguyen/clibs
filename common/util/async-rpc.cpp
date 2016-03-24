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
#include <thread>
#include <ctype/assert.h>
#include <di/logger.h>
#include <util/async-rpc.h>

LOGGER_STATIC_DECL(s_log);

ServerAsync::~ServerAsync()
{
    srq_ptr->Shutdown();
    srq_cq->Shutdown();
}

/**
 * run_server_loop
 * ---------------
 */
void
ServerAsync::run_server_loop()
{
    bool  ok;
    void *tag;

    register_requests();
    while (true) {
        srq_cq->Next(&tag, &ok);
        if (ok == true) {
            reinterpret_cast<ServerAsyncBase *>(tag)->proceed();
        } else {
            auto type = reinterpret_cast<ServerAsyncBase *>(tag);
            s_log.error("Error send response: %p %s", tag, typeid(*type).name());
        }
    }
}

/**
 * proceed
 * -------
 */
void
ServerAsyncBase::proceed()
{
    if (srq_st == create) {
        srq_st = process;
        s_log.finner("CREATE : %p (%s)", this, typeid(*this).name());
        request_data();

    } else if (srq_st == process) {
        submit_new_request();
        srq_st = finish;
        s_log.finner("PROCESS: %p (%s)", this, typeid(*this).name());
        process_request();

    } else {
        verify(srq_st == finish);
        s_log.finner("FINISH : %p (%s)", this, typeid(*this).name());
        delete this;
    }
}

/**
 * Async Client End Point.
 */
ClientAsyncEp::ClientAsyncEp() : clnt_thread(false), clnt_sync(2) {}

/**
 * run_client_loop
 * ---------------
 */
void
ClientAsyncEp::run_client_loop()
{
    if (clnt_thread == true) {
        return;
    }
    clnt_thread = true;
    std::thread thread(&ClientAsyncEp::client_loop, this);
    thread.detach();
}

/**
 * shutdown_client
 * ---------------
 */
void
ClientAsyncEp::shutdown_client()
{
    clnt_cq.Shutdown();
    clnt_sync.wait();
}

/**
 * client_loop
 * -----------
 */
void
ClientAsyncEp::client_loop()
{
    bool  ok;
    void *tag;

    while (true) {
        ok = false;
        clnt_cq.Next(&tag, &ok);
        auto req = reinterpret_cast<ClientAsyncBase *>(tag);
        if (ok == false) {
            s_log.error("Received shutdown signal");
            break;
        }
        req->process_rpc_response();
        delete req;
    }
    clnt_sync.wait();
}
