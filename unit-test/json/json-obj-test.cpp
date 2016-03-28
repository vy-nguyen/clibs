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
#include <foss/gtest/gtest.h>
#include <json/json-app.h>

class TestApp : public JsonApp
{
  public:
    TestApp(int argc, char **argv, Module::ptr mods[]) : JsonApp(argc, argv, mods) {}

    void prog_pre_init() override {
        ::testing::InitGoogleTest(&p_argc, p_argv);
    }
    int run() override;
};

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc(MOD_SYS_THPOOL, 2, 8, 3, -1),
        Trace::alloc(2048),
        JsManager::alloc(JSMANAGER_MOD),
        nullptr
    };
    TestApp app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { "in",        required_argument, nullptr,             'i' },
        { "out",       required_argument, nullptr,             'o' },
        { nullptr,        0,                 nullptr,              0  }
    };
    app.prog_reg_opt(STD_SOPTS "vi:o:", app_opts);
    return app.prog_run();
}

int
TestApp::run()
{
    JsonApp::run();
    return RUN_ALL_TESTS();
}

class AppTestFixture : public ::testing::Test
{
  public:
    explicit AppTestFixture() {}
    virtual ~AppTestFixture() {}

    virtual void SetUp() override {
        js_mgr = JsManager::getInstance();
    }
    virtual void TearDown() override {
        js_mgr = nullptr;
    }

  protected:
    JsManager::ptr           js_mgr;
};

TEST_F(AppTestFixture, LoadTest)
{
    printf("Load test is called\n");
}

TEST_F(AppTestFixture, ExecTest)
{
    printf("Exec test is called\n");
}

