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
#include <di/logger.h>
#include <json-unit-app.h>
#include <json/json-unit.h>
#include <unit-test-def.h>

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc(MOD_SYS_THPOOL, 2, 8, 3, -1),
        Trace::alloc(2048),
        LogModule::alloc(LOG_MODULE),
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
        { nullptr,        0,                 nullptr,              0  }
    };
    app.prog_reg_opt(STD_SOPTS "vi:o:d:", app_opts);
    return app.prog_run();
}

namespace jsunit {
const JsDecode *const gl_unit_test_def[] =
{
    COMMON_UNIT_TEST_DECODE,
    nullptr
};
const JsDecode g_unit_test_def("*", gl_unit_test_def, &JsManager::js_def_decode());

/*
 * -------------------------------------------------------------------------------
 *  User Test Code Section
 * -------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(SomeTest, TestCase, ,);

/**
 * begin_test_case
 * ---------------
 */
void
SomeTest::begin_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

/**
 * end_test_case
 * -------------
 */
void
SomeTest::end_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

/**
 * run_def_verb
 * ------------
 */
void
SomeTest::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
}

/*
 * -------------------------------------------------------------------------------
 *  User Test Code Section
 * -------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(AnotherTest, TestCase, ,);

void
AnotherTest::begin_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

void
AnotherTest::end_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

void
AnotherTest::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
}

USER_TEST_VERB_DECL(ActionVerb);

/**
 * run_verb
 * --------
 */
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
    SomeTest::alloc("some-id"),
    AnotherTest::alloc("another-id"),
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
