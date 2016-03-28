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
#include <iostream>
#include <memory>
#include <string>

#include <grpc++/grpc++.h>
#include "hello.grpc.pb.h"

using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::ServerReaderWriter;
using grpc::Status;
using chat::HelloRequest;
using chat::HelloResponse;
using chat::ChatMesg;
using chat::ByeRequest;
using chat::ByeResponse;
using chat::Talker;

class TalkerService final : public Talker::Service
{
    Status
    say_hello(ServerContext *ctx, const HelloRequest *, HelloResponse *) override;

    Status
    say_bye(ServerContext *ctx, const ByeRequest *, ByeResponse *) override;

    Status
    chat(ServerContext *ctx, ServerReaderWriter<ChatMesg, ChatMesg> *stream) override;
};

Status
TalkerService::say_hello(ServerContext *ctx,
                         const HelloRequest *reqt, HelloResponse *resp)
{
    std::cout << "Received hello, name " << reqt->name()
        << " text " << reqt->text() << std::endl;

    resp->set_ack("This is Andzuey");
    resp->set_acc_code(2000);

    return Status::OK;
}

Status
TalkerService::say_bye(ServerContext *ctx, const ByeRequest *reqt, ByeResponse *resp)
{
    std::cout << "Received bye, mesg " << reqt->message()
        << ", code " << reqt->exit_code() << std::endl;

    resp->set_ack("Bye from Andzuey");
    return Status::OK;
}

Status
TalkerService::chat(ServerContext *ctx, ServerReaderWriter<ChatMesg, ChatMesg> *stream)
{
    ChatMesg mesg;

    while (stream->Read(&mesg)) {
        std::cout << "Server got: op " << mesg.opcode()
            << ", content " << mesg.content() << std::endl;

        mesg.set_opcode(1000);
        mesg.set_content("Hello Andzuey");
        stream->Write(mesg);
    }
    return Status::OK;
}

static void run_server()
{
    std::string   srv_addr("0.0.0.0:5151");
    TalkerService srv;

    ServerBuilder builder;
    builder.AddListeningPort(srv_addr, grpc::InsecureServerCredentials());
    builder.RegisterService(&srv);

    std::unique_ptr<Server> server(builder.BuildAndStart());
    server->Wait();
}

int main(int argc, char **argv)
{
    run_server();
    return 0;
}
