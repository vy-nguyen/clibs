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
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sched.h>
#include <thread>
#include <di/program.h>
#include <di/request.h>
#include "mod-test.h"

class ModuleE : public Module
{
  public:
    OBJECT_COMMON_DEFS(ModuleE);

    ModuleE(int i, const char *s) : mod_i(i), mod_s(s) {
    }

  protected:
    int                 mod_i;
    const char *const   mod_s;
};

class ModuleD : public Module
{
  public:
    OBJECT_COMMON_DEFS(ModuleD);
};

class ModuleC : public Module
{
  public:
    OBJECT_COMMON_DEFS(ModuleC);
};

class ModuleB;
class ModuleA : public Module
{
  public:
    OBJECT_COMMON_DEFS(ModuleA);

    ModuleA() {}
    void mod_resolve() override;
    void mod_shutdown() override
    {
        mod_c = nullptr;
        mod_b = nullptr;
    }

  protected:
    ModuleC::ptr                   mod_c;
    boost::intrusive_ptr<ModuleB>  mod_b;
};

class ModuleB : public Module
{
  public:
    OBJECT_COMMON_DEFS(ModuleB);

    ModuleB() {}
    void mod_resolve() override
    {
        mod_a = object_cast<ModuleA>(Program::module(ModuleA::name()));
        mod_d = object_cast<ModuleD>(Program::module(ModuleD::name()));

        ModuleA::ptr a = object_cast<ModuleA>(Program::module(mod_a->obj_id()));
        assert(a == mod_a);

        ModuleD::ptr d = object_cast<ModuleD>(Program::module(mod_d->obj_id()));
        assert(d == mod_d);
    }
    void mod_shutdown() override
    {
        mod_a = nullptr;
        mod_d = nullptr;
    }

  protected:
    ModuleA::ptr           mod_a;
    ModuleD::ptr           mod_d;
};

void
ModuleA::mod_resolve()
{
    mod_c = object_cast<ModuleC>(Program::module(ModuleC::name()));
    mod_b = object_cast<ModuleB>(Program::module(ModuleB::name()));
}

class ProgTest : public Program
{
  public:
    virtual ~ProgTest() {}
    ProgTest(int argc, char **argv, Module::ptr mods[])
        : Program(argc, argv, mods) {}

    void prog_pre_init() override
    {
        Program::prog_pre_init();
        ::testing::InitGoogleTest(&p_argc, p_argv);
    }
    int run() override
    {
        printf("Max cpu %d\n", std::thread::hardware_concurrency());
        return RUN_ALL_TESTS();

        for (int i = 0; i < 3; i++) {
            int cpu = sched_getcpu();
            printf("Current cpu %d\n", cpu);
            sleep(1);
        }
        return 0;
    }
};

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc("PoolA", 2, 8, 3, -1),
        ThreadPool::alloc("PoolB", 2, 18, 2, -1),
        Trace::alloc(2048),
        ModuleA::alloc(),
        ModuleB::alloc(),
        ModuleC::alloc(),
        ModuleD::alloc(),
        ModuleE::alloc(1, "test"),
        nullptr
    };
    const uint32_t locksteps[] = {
        ModuleA::id(),
        ModuleD::id(),
        ModuleC::id(),
        0,
    };
    ProgTest app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { nullptr,        0,         nullptr,       0 }
    };
    app.prog_reg_opt(STD_SOPTS, app_opts);
    app.setup_lockstep(1, locksteps);
    return app.prog_run();
}
