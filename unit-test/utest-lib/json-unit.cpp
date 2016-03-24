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
#include <cpptype/lock.h>
#include <di/logger.h>
#include <json/json-unit.h>
#include <unit-test-def.h>

LOGGER_STATIC_DECL(s_log);

namespace jsunit {

/**
 * Async Test Case.
 */
AsyncTestCase::~AsyncTestCase()
{
    if (test_sync != nullptr) {
        delete test_sync;
    }
}

void
AsyncTestCase::begin_test_case(const char *v, TestDriver::ptr d, JsOutput::ptr o)
{
    d->js_iter_foreach_test_elm();

    test_sync = new SyncLock(d->test_elm_exec);
    s_log.info("Test %s: created sync lock %p", test_case, test_sync);
}

void
AsyncTestCase::end_test_case(const char *v, TestDriver::ptr d, JsOutput::ptr o)
{
    test_sync->sync_adjust_wait(d->test_elm_exec);
    test_sync->sync_wait();
    delete test_sync;

    test_sync = nullptr;
}

/**
 * notify_test_done
 * ----------------
 */
void
AsyncTestCase::notify_test_done(int console_count)
{
    cnt_done++;
    auto cnt = cnt_done.load();
    if ((cnt % console_count) == 0) {
        printf("%s processed %d completed requests\n", test_case, cnt);
    }
    if (test_sync != nullptr) {
        test_sync->sync_done();
    }
}

}
