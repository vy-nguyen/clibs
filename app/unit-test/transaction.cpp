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
#include <foss/gtest/gtest.h>
#include <di/program.h>
#include <json-unit-app.h>
#include <json/json-unit.h>
#include <unit-test-def.h>
#include <util/bigint.pb.h>
#include <transaction.pb.h>

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
        { "verbose",   no_argument,       &app.argv_verbose, 1  },
        { "debug",     required_argument, nullptr,             'd' },
        { nullptr,     0,                 nullptr,              0  }
    };
    app.prog_reg_opt(STD_SOPTS "vi:o:d:", app_opts);

    GOOGLE_PROTOBUF_VERIFY_VERSION;
    int ret = app.prog_run();

    google::protobuf::ShutdownProtobufLibrary();
    return ret;
}

namespace jsunit {
const JsDecode *const gl_unit_test_def[] =
{
    COMMON_UNIT_TEST_DECODE,
    nullptr
};
const JsDecode g_unit_test_def("*", gl_unit_test_def, &JsManager::js_def_decode());

TEST_F(AppTestFixture, TestBigInt)
{
}

/*
 * -------------------------------------------------------------------------------
 *  User Test Code Section
 * -------------------------------------------------------------------------------
 */

/**
 * run_verb
 * --------
 */
USER_TEST_VERB_DECL(ActionVerb);

void
ActionVerb::run_verb(TestElm::ptr elm, TestCase::ptr tc, JsOutput::ptr out) const
{
}

/**
 * Install test plugins.
 */
const ActionVerb  s_some_action("verb");

TestCase::ptr TestDriver::test_cases[] =
{
    nullptr
};

/**
 * js_init
 * -------
 */
void
TestDriver::js_init()
{
    const TestVerb *const verbs[] = {
        &s_some_action,
        nullptr
    };
    js_install_test(verbs);
}

} // namespace
