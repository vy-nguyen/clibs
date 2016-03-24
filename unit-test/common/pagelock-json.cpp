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
#include <unit-test-def.h>
#include <util/pagelock.h>

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
        { "verbose",   no_argument,       &app.argv_verbose,    1  },
        { "debug",     required_argument, nullptr,             'd' },
        { nullptr,     0,                 nullptr,              0  }
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

/**
 * ---------------------------------------------------------------
 * Implement for JSON TestElm object.
 * ---------------------------------------------------------------
 */
class TestPageLock : public TestVerb
{
  public:
    TestPageLock(const char *v) : TestVerb(v) {}
    void run_verb(TestElm::ptr elm, TestCase::ptr tc, JsOutput::ptr out) const
    {
        PageLock::ptr mgr = PageLock::getInstance();
        mgr->pg_lock_range(elm.get(), sizeof(*elm));
    }
};

class TestPageUnlock : public TestVerb
{
  public:
    TestPageUnlock(const char *v) : TestVerb(v) {}
    void run_verb(TestElm::ptr elm, TestCase::ptr tc, JsOutput::ptr out) const
    {
        PageLock::ptr mgr = PageLock::getInstance();
        mgr->pg_unlock_range(elm.get(), sizeof(*elm));
    }
};

class PgTestCase : public TestCase
{
  public:
    OBJECT_COMMON_DEFS(PgTestCase);

    void begin_test_case(const char *, TestDriver::ptr, JsOutput::ptr) override;
    void end_test_case(const char *, TestDriver::ptr, JsOutput::ptr) override;
    void run_def_verb(const char *, TestElm::ptr, JsOutput::ptr) override;

  protected:
    PgTestCase(const char *const id) : TestCase(id) {}
};

/**
 * begin_test_case
 * ---------------
 */
void
PgTestCase::begin_test_case(const char *verb, TestDriver::ptr ctrl, JsOutput::ptr out)
{
    pthread_mutex_t *mtx = ctrl->js_get_lock();
    pthread_mutex_lock(mtx);
    pthread_mutex_unlock(mtx);
}

/**
 * end_test_case
 * -------------
 */
void
PgTestCase::end_test_case(const char *verb, TestDriver::ptr ctrl, JsOutput::ptr out)
{
}

/**
 * run_def_verb
 * ------------
 */
void
PgTestCase::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
}

/**
 * Test plugins
 */
const TestPageLock     test_page_lock("lock");
const TestPageUnlock   test_page_unlock("unlock");

TestCase::ptr TestDriver::test_cases[] =
{
    PgTestCase::alloc("pg-type-test"),
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
        &test_page_lock,
        &test_page_unlock,
        nullptr
    };
    js_install_test(verbs);
}

} // namespace
