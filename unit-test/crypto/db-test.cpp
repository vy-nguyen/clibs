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
#include <chrono>
#include <foss/gtest/gtest.h>
#include <di/program.h>
#include <di/logger.h>
#include <json-unit-app.h>
#include <json/json-unit.h>
#include <unit-test-def.h>
#include <crypto/types.pb.h>
#include <db/leveldb.h>

namespace ts = std::chrono;

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc(MOD_SYS_THPOOL, 2, 8, 3, -1),
        Trace::alloc(2048),
        JsManager::alloc(JSMANAGER_MOD),
        LogModule::alloc(LOG_MODULE),
        LevelDb::alloc("TestDb", "test-db"),
        nullptr
    };
    TestApp app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { "in",        required_argument, nullptr,           'i' },
        { "verbose",   no_argument,       &app.argv_verbose,  1  },
        { nullptr,     0,                 nullptr,            0  }
    };
    GOOGLE_PROTOBUF_VERIFY_VERSION;

    app.prog_reg_opt(STD_SOPTS "vi:", app_opts);
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

/**
 * Db module test fixtures
 */
class DbTestFixture : public ::testing::Test
{
  public:
    void SetUp() override
    {
        prog   = reinterpret_cast<const TestApp *>(Program::singleton());
        db     = LevelDb::getInstance("TestDb");
        js_mgr = JsManager::getInstance();
    }

    void TearDown() override
    {
        prog   = nullptr;
        db     = nullptr;
        js_mgr = nullptr;
    }

  protected:
    const TestApp   *prog;
    KeyValDb::ptr    db;
    JsManager::ptr   js_mgr;
};

TEST_F(DbTestFixture, SimplePut)
{
}

TEST_F(DbTestFixture, SimpleGet)
{
}

TEST_F(DbTestFixture, RunJson)
{
    const char *cmds[] = {
        "db-put-run",
        "db-get-run",
        "db-iter-run",
        "db-batch-run",
        "db-erase-run",
        nullptr
    };
    js_mgr->js_run(cmds);
}

/*
 * -------------------------------------------------------------------------------
 *  User Test Code Section
 * -------------------------------------------------------------------------------
 */
class DbTestCase : public TestCase
{
  protected:
    KeyValDb::ptr       db;

    DbTestCase(const char *const id) : TestCase(id), db(nullptr) {}
    ~DbTestCase()
    {
        db = nullptr;
    }

    void setup_test_case(TestDriver::ptr anchor) override {
        db = LevelDb::getInstance("TestDb");
    }
};

namespace plh = std::placeholders;

/**
 * ------------------------------------------------------------------------------------
 * Db Put Test
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(DbPutTest, DbTestCase,

    bool apply_each_test_elm(TestDriver::ptr driver,
                             TestElm::ptr elm, TestElm::ptr other) override
    {
        std::string val;
        auto uuid = elm->js_kv_int("uuid");
        EXPECT_TRUE(db->read_key(std::to_string(uuid), &val) == true);

        auto cmp = val.compare(elm->js_kv_str("name"));
        if (cmp != 0) {
            dup_val++;
        }
        verify_uuid++;
        return true;
    },
    int verify_uuid;
    int dup_val;
);

void
DbPutTest::begin_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    dup_val = 0;
    verify_uuid = 0;
}

void
DbPutTest::end_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    ts::high_resolution_clock::time_point start = ts::high_resolution_clock::now();
    test->js_iter_foreach_test_elm();

    ts::high_resolution_clock::time_point end = ts::high_resolution_clock::now();
    auto duration = ts::duration_cast<ts::seconds>(end - start).count();

    printf("Verified %d PUT/GET uuid to DB ops, dup val %d, took %ld secs\n",
           verify_uuid, dup_val, duration);
}

void
DbPutTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
    auto uuid = elm->js_kv_int("uuid");
    auto name = elm->js_kv_str("name");

    db->write_key(std::to_string(uuid), name, false);
}

/**
 * ------------------------------------------------------------------------------------
 * Db Get Test
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(DbGetTest, DbTestCase,

    bool apply_each_test_elm(TestDriver::ptr driver,
                             TestElm::ptr elm, TestElm::ptr other) override
    {
        if (other != nullptr) {
            elm->js_set_kv_str("name", other->js_kv_str("name"), false);
            auto m_name = elm->js_kv_str("name");
            auto o_name = other->js_kv_str("name");

            EXPECT_TRUE(strcmp(m_name, o_name) == 0);
        } else {
            std::string val;
            auto name = elm->js_kv_str("name");
            EXPECT_TRUE(db->read_key(name, &val) == true);

            auto ret = val.compare(elm->js_kv_str("pubkey"));
            if (ret != 0) {
                dup_val++;
            }
            verify_name++;
        }
        return true;
    },
    int verify_name;
    int dup_val;
);

void
DbGetTest::begin_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    dup_val = 0;
    verify_name = 0;
    test->js_iter_foreach_test_elm("db-put-test");
}

void
DbGetTest::end_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    ts::high_resolution_clock::time_point start = ts::high_resolution_clock::now();
    test->js_iter_foreach_test_elm();

    ts::high_resolution_clock::time_point end = ts::high_resolution_clock::now();
    auto duration = ts::duration_cast<ts::seconds>(end - start).count();

    printf("Verified %d PUT/GET name to DB ops, dup val %d took %ld secs\n",
           verify_name, dup_val, duration);
}

void
DbGetTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
    auto name = elm->js_kv_str("name");
    auto pkey = elm->js_kv_str("pubkey");

    db->write_key(name, pkey, false);
}

/**
 * ------------------------------------------------------------------------------------
 * Db Erase Test
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(DbEraseTest, DbTestCase,

    bool apply_each_test_elm(TestDriver::ptr driver,
                             TestElm::ptr elm, TestElm::ptr other) override
    {
        if (other != nullptr) {
            elm->js_set_kv_str("name", other->js_kv_str("name"), false);
            auto m_name = elm->js_kv_str("name");
            auto o_name = other->js_kv_str("name");

            EXPECT_TRUE(strcmp(m_name, o_name) == 0);
        } else {
            verify_erase++;
        }
        return true;
    },
    int verify_erase;
);

void
DbEraseTest::begin_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    printf("Begin Erase run\n");
}

void
DbEraseTest::end_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
}

void
DbEraseTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
}

/**
 * ------------------------------------------------------------------------------------
 * DB Iter Test
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(DbIterTest, DbTestCase,

    bool apply_each_test_elm(TestDriver::ptr driver,
                             TestElm::ptr elm, TestElm::ptr other) override
    {
        if (other != nullptr) {
            elm->js_set_kv_str("name", other->js_kv_str("name"), false);
            auto m_name = elm->js_kv_str("name");
            auto o_name = other->js_kv_str("name");

            EXPECT_TRUE(strcmp(m_name, o_name) == 0);
        } else {
            // std::string val;
            // auto name = elm->js_kv_str("name");

            verify_iter++;
        }
        return true;
    },
    int verify_iter;
);

void
DbIterTest::begin_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    verify_iter = 0;
    test->js_iter_foreach_test_elm("db-put-test");
}

void
DbIterTest::end_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    test->js_iter_foreach_test_elm();
    printf("Verified %d PUT/GET iter to DB ops.\n", verify_iter);

    int cnt = 0;
    std::string key;
    auto iter = db->alloc_iterator();

    ts::high_resolution_clock::time_point start = ts::high_resolution_clock::now();
    for (iter->seek_to_first(); iter->valid(); iter->next()) {
        EXPECT_TRUE(iter->get_key_str(&key) == true);
        cnt++;
    }
    ts::high_resolution_clock::time_point end = ts::high_resolution_clock::now();
    auto duration = ts::duration_cast<ts::seconds>(end - start).count();
    printf("Walk DB %d records took %ld seconds\n", cnt, duration);
}

void
DbIterTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr)
{
    auto name = elm->js_kv_str("name");
    auto mesg = elm->js_kv_str("message");

    std::string k;
    k.reserve(strlen(name) + 20);
    k.append(name).append(":");
    auto size = k.size();

    for (int i = 0; i < 10; i++) {
        k.append(std::to_string(i));
        db->write_key(k, mesg, false);
        k.resize(size);
    }
    int cnt = 0;
    std::string key;
    auto iter = db->alloc_iterator();
    for (iter->seek(k); iter->valid(); iter->next()) {
        EXPECT_TRUE(iter->get_key_str(&key) == true);
        auto ret = key.find(k, 0);
        if (ret != std::string::npos) {
            cnt++;
            continue;
        }
        break;
    }
    EXPECT_TRUE(cnt == 10);
}

/**
 * ------------------------------------------------------------------------------------
 * DB Batch Write Test
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(DbBatchTest, DbTestCase, ,);

void
DbBatchTest::begin_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
    printf("Begin Batch run\n");
}

void
DbBatchTest::end_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

void
DbBatchTest::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
}

/**
 * ------------------------------------------------------------------------------------
 * Run special verbs
 * ------------------------------------------------------------------------------------
 */
USER_TEST_VERB_DECL(ActionVerb);

void
ActionVerb::run_verb(TestElm::ptr elm, TestCase::ptr tc, JsOutput::ptr out) const
{
}

/**
 * Install test plugins.
 */
const ActionVerb  s_some_action("add");

TestCase::ptr TestDriver::test_cases[] =
{
    DbPutTest::alloc("db-put-test"),
    DbGetTest::alloc("db-get-test"),
    DbEraseTest::alloc("db-erase-test"),
    DbIterTest::alloc("db-iter-test"),
    DbBatchTest::alloc("db-batch-test"),
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
