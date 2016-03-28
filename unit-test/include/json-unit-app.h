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
#ifndef _JSON_JSON_UNIT_APP_H_
#define _JSON_JSON_UNIT_APP_H_

#include <foss/gtest/gtest.h>
#include <json/json-obj.h>

/**
 * Common TestApp functions.  Can only included once in the file having main.
 */
class TestApp : public Program
{
  public:
    virtual ~TestApp() {}
    TestApp(int argc, char **argv, Module::ptr mods[]) :
        Program(argc, argv, mods), in_file(nullptr), out_file(nullptr) {}

    void prog_pre_init() override {
        ::testing::InitGoogleTest(&p_argc, p_argv);
    }

    int run() override {
        return RUN_ALL_TESTS();
    }

    int         argv_verbose;
    int         argv_debug;
    const char *in_file;
    const char *out_file;

  protected:
    void prog_opt_fn(const struct option *opt,
                     void *optarg, int flag, int idx, int optidx) override;

    virtual void prog_extra_opt_fn(const struct option *, void *, int, int, int) {}
};

/**
 * prog_opt_fn
 * -----------
 */
void
TestApp::prog_opt_fn(const struct option *opt,
                     void *optarg, int flag, int idx, int optidx)
{
    switch (flag) {
    case 'i':
        in_file = reinterpret_cast<const char *>(optarg);
        break;

    case 'o':
        out_file = reinterpret_cast<const char *>(optarg);
        break;

    default:
        prog_extra_opt_fn(opt, optarg, flag, idx, optidx);
        break;
    }
}

/*
 * Common AppTest fixture used by Google test.
 */
class AppTestFixture : public ::testing::Test
{
  public:
    explicit AppTestFixture() {}
    virtual ~AppTestFixture() {}

    void SetUp() override
    {
        js_mgr  = JsManager::getInstance();
        js_prog = reinterpret_cast<const TestApp *>(Program::singleton());
    }

    void TearDown() override
    {
        js_mgr  = nullptr;
        js_prog = nullptr;
    }

  protected:
    JsManager::ptr     js_mgr;
    const TestApp     *js_prog;
};

namespace jsunit {
  extern const JsDecode *const gl_unit_test_def[];
  extern const JsDecode g_unit_test_def;
}

/**
 * Write additional tests for this fixture.
 */
TEST_F(AppTestFixture, LoadJson)
{
    EXPECT_TRUE(js_mgr != nullptr);
    js_mgr->js_process_file(js_prog->in_file, jsunit::g_unit_test_def);
}

TEST_F(AppTestFixture, ExecJson)
{
    js_mgr->js_run(nullptr);
}

#endif /* _JSON_JSON_UNIT_APP_H_ */
