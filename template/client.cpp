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
#include <thread>

#include <grpc++/grpc++.h>
#include <grpc++/channel.h>
#include <grpc++/client_context.h>
#include <grpc++/create_channel.h>
#include <grpc++/security/credentials.h>
#include "hello.grpc.pb.h"

using grpc::Channel;
using grpc::ClientContext;
using grpc::Status;
using grpc::ClientReaderWriter;
using chat::HelloRequest;
using chat::HelloResponse;
using chat::ChatMesg;
using chat::Talker;
using chat::ByeRequest;
using chat::ByeResponse;

class TalkerClient
{
  public:
    TalkerClient(std::shared_ptr<Channel> channel) :
        m_chan(Talker::NewStub(channel)) {}

    void session();
    void chat();

  private:
    std::unique_ptr<Talker::Stub> m_chan;
};

void
TalkerClient::session()
{
    HelloRequest   reqt;
    HelloResponse resp;

    reqt.set_name("Annie");
    reqt.set_text("I'm learning RPC");

    ClientContext ctx;
    Status status = m_chan->say_hello(&ctx, reqt, &resp);
    if (status.ok()) {
        const std::string &ack = resp.ack();
        int32_t code = resp.acc_code();

        std::cout << "Ack " << ack << " code " << code << std::endl;
    }
    ClientContext bye;
    ByeRequest  bye_reqt;
    ByeResponse bye_resp;

    bye_reqt.set_exit_code(8000);
    bye_reqt.set_message("I'm not talking to you");
    status = m_chan->say_bye(&bye, bye_reqt, &bye_resp);

    std::cout << "Bye received " << bye_resp.ack() << std::endl;
}

void
TalkerClient::chat()
{
    ClientContext ctx;
    std::shared_ptr<ClientReaderWriter<ChatMesg, ChatMesg>> stream(m_chan->chat(&ctx));

    std::thread writer([stream]() {
        ChatMesg s;
        s.set_opcode(10);
        s.set_content("This is string");
        stream->Write(s);
        stream->WritesDone();
    });
    ChatMesg mesg;
    while (stream->Read(&mesg)) {
        std::cout << "Op " << mesg.opcode() << " data " << mesg.content() << std::endl;
    }
    writer.join();
    Status status = stream->Finish();
}

int main(int argc, char **argv)
{
    /*
    SslCredentialsOptions ssl_opts;
    std::unique_ptr<grpc::SslCredentials> creds =
        grpc::CredentialsFactory::SslCredentials(ssl_opts);
    std::shared_ptr<ChannelInterface> channel =
        CreateChannel(server_name, creds, channel_args);
    */
    TalkerClient client(grpc::CreateChannel(
                "localhost:5151", grpc::InsecureChannelCredentials()));

    client.chat();
    client.session();
    return 0;
}
