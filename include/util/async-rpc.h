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
#ifndef _UTIL_ASYNC_RPC_H_
#define _UTIL_ASYNC_RPC_H_

#include <memory>
#include <string>
#include <thread>
#include <boost/thread/barrier.hpp>
#include <grpc++/grpc++.h>

class ServerAsyncBase;
class ServerAsync
{
  public:
    virtual ~ServerAsync();

    virtual void *get_handler() = 0;
    virtual void register_requests() = 0;
    virtual void start_server() = 0;
    virtual void run_server_loop();

    inline grpc::ServerCompletionQueue *get_cqueue() {
        return srq_cq.get();
    }

  protected:
    std::unique_ptr<grpc::ServerCompletionQueue> srq_cq;
    std::unique_ptr<grpc::Server>                srq_ptr;
};

class ServerAsyncBase
{
  public:
    virtual ~ServerAsyncBase() {}

    virtual void request_data() = 0;
    virtual void process_request() = 0;
    virtual ServerAsyncBase *new_request() = 0;

    void proceed();
    inline void submit_new_request()
    {
        /* The req will be freed by async rpc when it's done. */
        ServerAsyncBase *req = new_request();
        req->proceed();
    }

  protected:
    friend class ServerAsync;
    enum ReqState { create, process, finish };

    ReqState                       srq_st;
    grpc::ServerContext            srq_ctx;
    ServerAsync                   *srq_user;

    ServerAsyncBase(ServerAsync *srv) : srq_st(create), srq_user(srv) {}
};

template <class ServerT, class ReqT, class ResT>
class ServerAsyncReq : public ServerAsyncBase
{
  public:
    inline ReqT &get_reqt() { return s_reqt; }
    inline ResT &get_resp() { return s_resp; }

  protected:
    ReqT                           s_reqt;
    ResT                           s_resp;
    ServerT                       *s_server;
    grpc::ServerAsyncResponseWriter<ResT>  s_resp_ctx;

    ServerAsyncReq(ServerT *srv, ServerAsync *usr) :
        ServerAsyncBase(usr), s_server(srv), s_resp_ctx(&srq_ctx) {}
};

#define SERVER_REQUEST_DECL(TypeName, ServerT, ReqT, ResT, MethodC, HandlerT)         \
class TypeName : public ServerAsyncReq<ServerT, ReqT, ResT>                           \
{                                                                                     \
  public:                                                                             \
    TypeName(ServerT *srv, ServerAsync *user) : ServerAsyncReq(srv, user) {}          \
                                                                                      \
    void process_request() override                                                   \
    {                                                                                 \
        auto hdler  = reinterpret_cast<HandlerT *>(srq_user->get_handler());          \
        auto status = hdler->MethodC(nullptr, &s_reqt, &s_resp);                      \
        s_resp_ctx.Finish(s_resp, status, this);                                      \
    }                                                                                 \
                                                                                      \
    TypeName *new_request() override {                                                \
        return new TypeName(s_server, srq_user);                                      \
    }                                                                                 \
    void request_data() override {                                                    \
        auto *srq_cq = srq_user->get_cqueue();                                        \
        s_server->Request##MethodC(&srq_ctx, &s_reqt, &s_resp_ctx, srq_cq,            \
                                   srq_cq, this);                                     \
    }                                                                                 \
}

/**
 * Common base class for async client request.
 */
template <class T> class ClientAsync;

class ClientAsyncBase
{
  public:
    virtual ~ClientAsyncBase() {}
    virtual void do_rpc_reqt() = 0;
    virtual void process_rpc_response() = 0;

  protected:
    grpc::Status                   c_status;
    grpc::ClientContext            c_ctx;
};

template <class SvcStubT, class ReqT, class ResT, class CallbackT>
class ClienAsyncReq : public ClientAsyncBase
{
  public:
    ClienAsyncReq(ClientAsync<SvcStubT> *clnt, const CallbackT &cb) :
        c_ptr(clnt), c_cbfn(cb) {}

    virtual ~ClienAsyncReq() { c_rpc = NULL; }
    inline ReqT &get_reqt() { return c_reqt; }
    inline ResT &get_resp() { return c_resp; }

  protected:
    ClientAsync<SvcStubT>         *c_ptr;
    ReqT                           c_reqt;
    ResT                           c_resp;
    CallbackT                      c_cbfn;

    std::unique_ptr<grpc::ClientAsyncResponseReader<ResT>> c_rpc;
};

#define CLIENT_REQUEST_DECL(TypeName, SvcStubT, ReqT, ResT, MethodC, UserT, PubDecl)  \
typedef std::function<void(Crypto::status, ResT *)> cb_##TypeName;                    \
class TypeName : public ClienAsyncReq<SvcStubT, ReqT, ResT, cb_##TypeName>            \
{                                                                                     \
  protected:                                                                          \
    UserT       c_arg;                                                                \
                                                                                      \
  public:                                                                             \
    TypeName(ClientAsync<SvcStubT> *clnt, const cb_##TypeName &cb, UserT arg) :       \
        ClienAsyncReq(clnt, cb), c_arg(arg) {}                                        \
                                                                                      \
    void process_rpc_response() override;                                             \
    void do_rpc_reqt() override                                                       \
    {                                                                                 \
        c_rpc = c_ptr->get_client_stub()->                                            \
            MethodC(&c_ctx, c_reqt, c_ptr->get_client_queue());                       \
        c_rpc->Finish(&c_resp, &c_status, this);                                      \
    }                                                                                 \
    PubDecl                                                                           \
}

/**
 * Common non-template base class for async client endpoint.
 */
class ClientAsyncEp
{
  public:
    explicit ClientAsyncEp();

    void run_client_loop();
    void shutdown_client();

    inline grpc::CompletionQueue *get_client_queue() {
        return &clnt_cq;
    }

  protected:
    bool                           clnt_thread;
    grpc::CompletionQueue          clnt_cq;
    boost::barrier                 clnt_sync;

    void client_loop();
};

template <class T>
class ClientAsync : public ClientAsyncEp
{
  public:
    inline std::unique_ptr<T> &get_client_stub() {
        return clnt_stub;
    }

  protected:
    std::unique_ptr<T>             clnt_stub;
};

#endif /* _UTIL_ASYNC_RPC_H_ */
