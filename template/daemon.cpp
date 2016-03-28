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
#include <grpc++/grpc++.h>
#include <di/program.h>
#include <di/request.h>
#include <di/log.h>

class App : public Program
{
  public:
    virtual ~App() {}
    App(int argc, char **argv, Module::ptr mods[]) :
        Program(argc, argv, mods), argv_verbose(0), argv_debug(0) {}

    void prog_pre_init() override {
        /* Stuffs before module init methods are called. */
    }
    void prog_pre_startup() override {
        /* Stuffs before module startup methods are called. */
    }
    void prog_pre_enable_services() override {
        /* Stuffs before module enable services method are called. */
    }
    int run() override
    {
        while (1) {
            /* do something */
            sleep(1);
        }
        return 0;
    }
    void prog_pre_disable_services() override {
    }
    void prog_pre_shutdown() override {
    }
    void prog_pre_cleanup() override {
    }

    int argv_verbose;
    int argv_debug;
};

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc(MOD_SYS_THPOOL, 2, 8, 3, -1),
        Trace::alloc(2048),
        NULL
    };
    App app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { "add",         required_argument, NULL,              0 },
        { "verbose",     no_argument,       &app.argv_verbose, 1 },
        { "debug",       no_argument,       &app.argv_debug,   1 },
        { NULL,          0,                 NULL,              0 }
    };
    app.prog_reg_opt(STD_SOPTS "a:b:c", app_opts);
    auto ret = app.prog_run();

    // google::protobuf::ShutdownProtobufLibrary();
    return ret;
}
