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
#include <memory>
#include <string>

#include <di/program.h>
#include <di/request.h>
#include <di/log.h>
#include <di/logger.h>
#include <key-server.h>
#include <db/leveldb.h>
#include <key-server-db.h>

class App : public Program
{
  public:
    virtual ~App() {}
    App(int argc, char **argv, Module::ptr mods[]) :
        Program(argc, argv, mods), argv_debug(0) {}

    int run() override;

    int argv_debug;

  protected:
    std::unique_ptr<grpc::Server>  m_server;
};

int App::run()
{
#if 0
    std::string   srv_addr("0.0.0.0:5151");
    KeyServer     server(LevelDb::getInstance(USER_KEY_DB));
    ServerBuilder sb;

    sb.AddListeningPort(srv_addr, grpc::InsecureServerCredentials());
    sb.RegisterService(&server);

    m_server = sb.BuildAndStart();
    m_server->Wait();
#endif
    auto *conf = prog_kv_sub_cfg("key-server");
    if (conf == nullptr) {
        printf("Don't have 'key-server' section in config file\n");
        exit(1);
    }
    auto port = prog_kv_int(conf, "listen-port");
    if (port < 1024) {
        printf("Invalid port number %d in 'key-server' section\n", port);
        exit(1);
    }
    char info[32];
    snprintf(info, sizeof(info), "0.0.0.0:%d", port);
    std::string addr(info);

    AsyncKeyServer server(addr);
    server.start_server();
    return 0;
}

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc(MOD_SYS_THPOOL, 2, 8, 3, -1),
        Trace::alloc(2048),
        LogModule::alloc(LOG_MODULE),
        LevelDb::alloc(USER_KEY_DB, "key-db-config"),
        KeyServerModule::alloc(),
        nullptr
    };
    App app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { "debug",      no_argument,        &app.argv_debug,     1 },
        { nullptr,      0,                  nullptr,             0 }
    };
    app.prog_reg_opt(STD_SOPTS "d", app_opts);

    GOOGLE_PROTOBUF_VERIFY_VERSION;
    auto ret = app.prog_run();

    google::protobuf::ShutdownProtobufLibrary();
    return ret;
}
