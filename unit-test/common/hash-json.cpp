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
#include <di/program.h>
#include <di/logger.h>
#include <cpptype/lru-cache.h>
#include <json-unit-app.h>
#include <unit-test-def.h>

LOGGER_STATIC_DECL(s_log);

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
        { "verbose",   no_argument,       &app.argv_verbose,    1  },
        { "debug",     required_argument, nullptr,             'd' },
        { nullptr,     0,                 nullptr,              0  }
    };
    app.prog_reg_opt(STD_SOPTS "vi:o:d:", app_opts);
    return app.prog_run();
}

TEST_F(AppTestFixture, RunJson)
{
    const char *cmds[] = {
        "lru-insert-run",
        "lru-lookup-run",
        nullptr
    };
    js_mgr->js_run(cmds);
}

namespace jsunit {

const JsDecode *const gl_unit_test_def[] =
{
    COMMON_UNIT_TEST_DECODE,
    nullptr
};
const JsDecode g_unit_test_def("*", gl_unit_test_def, &JsManager::js_def_decode());

/**
 * ------------------------------------------------------------------------------------
 * Implement for JSON TestElm object.
 * ------------------------------------------------------------------------------------
 */
USER_TEST_VERB_DECL(TestHashAdd);
USER_TEST_VERB_DECL(TestHashRm);

USER_TEST_CASE_NORMAL(HTestCase, TestCase,

    uint64_t obj_key64(TestElm::ptr elm) const override {
        return elm->js_kv_int("age");
    }
    uint64_t obj_key_dlink(TestElm::ptr elm, const ODlink *link) const override {
        return elm->js_kv_int("age");
    }
    uint64_t obj_key_slink(TestElm::ptr elm, const OSlink *link) const override
    {
        int age = elm->js_kv_int("age");
        const char *name = elm->js_kv_str("name");

        printf("Slink: name %s, age %d\n", name, age);
        return age;
    }

    void setup_test_case(TestDriver::ptr anchor) override
    {
        t_add      = 0;
        t_remove   = 0;
        t_iter_rm  = 0;
        t_inserted = 0;
        t_deleted  = 0;

        t_name  = new DHashObj(1024);
        t_index = new DHashObj(1024);
        t_chain = new DHashObj(1024);

        pthread_mutexattr_t attr;
        pthread_mutexattr_init(&attr);
        pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
        pthread_mutex_init(&t_mtx, &attr);
    },
    friend class TestHashAdd;
    friend class TestHashRm;

    int              t_add;
    int              t_remove;
    int              t_inserted;
    int              t_deleted;
    int              t_iter_rm;
    DHashObj        *t_name;
    DHashObj        *t_index;
    DHashObj        *t_chain;
    pthread_mutex_t  t_mtx;

    ~HTestCase()
    {
        if (t_name != nullptr) {
            t_name->clear();
        }
        if (t_index != nullptr) {
            t_index->clear();
        }
        if (t_chain != nullptr) {
            t_chain->clear();
        }
        delete t_name;
        delete t_index;
        delete t_chain;
    }
);

USER_TEST_CASE_NORMAL(HSlinkTestCase, HTestCase,

    void setup_test_case(TestDriver::ptr anchor) override
    {
        t_shash = new SHashObj(1024);
        HTestCase::setup_test_case(anchor);
    },
    SHashObj      *t_shash;

    ~HSlinkTestCase()
    {
        if (t_shash != nullptr) {
            t_shash->clear();
        }
        delete t_shash;
    }
);

/**
 * begin_test_case
 * ---------------
 */
void
HTestCase::begin_test_case(const char *verb, TestDriver::ptr root, JsOutput::ptr out)
{
}

/**
 * end_test_case
 * -------------
 */
void
HTestCase::end_test_case(const char *verb, TestDriver::ptr root, JsOutput::ptr out)
{
    printf("End test %d, %d, inserted %d, deleted %d\n",
           t_add, t_remove, t_inserted, t_deleted);

    EXPECT_TRUE(t_add == 1000);
    if (strncmp(verb, "rm", sizeof("rm")) == 0) {
        EXPECT_TRUE(t_remove == 1000);
    }
}

/**
 * run_def_verb
 * ------------
 */
void
HTestCase::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
}

/**
 * run_verb:add
 * ------------
 */
void
TestHashAdd::run_verb(TestElm::ptr elm, TestCase::ptr tc, JsOutput::ptr out) const
{
    HTestCase::ptr ht = dynamic_cast<HTestCase *>(tc.get());
    if (ht == nullptr) {
        return;
    }
    auto age = elm->js_kv_int("age");

    pthread_mutex_lock(&ht->t_mtx);
    ht->t_add++;
    if (ht->t_chain->lookup(age) == nullptr) {
        ht->t_chain->insert_chain(elm, &elm->te_dlink1);
        auto chk = object_cast<TestElm>(ht->t_chain->lookup(age));

        ht->t_inserted++;
        EXPECT_TRUE(chk == elm);
    }
    pthread_mutex_unlock(&ht->t_mtx);
    s_log.info("add %s %p %s", tc->test_case, elm.get(), elm->js_get_id());
}

/**
 * run_verb:rm
 * -----------
 */
void
TestHashRm::run_verb(TestElm::ptr elm, TestCase::ptr tc, JsOutput::ptr out) const
{
    HTestCase::ptr ht = dynamic_cast<HTestCase *>(tc.get());
    if (ht == nullptr) {
        return;
    }
    auto age = elm->js_kv_int("age");

    pthread_mutex_lock(&ht->t_mtx);
    ht->t_remove++;

    auto find = ht->t_chain->lookup(age);
    if (find != nullptr) {
        auto data = dynamic_cast<TestElm *>(find.get());
        ht->t_chain->remove_chain(elm, &data->te_dlink1);
        ht->t_deleted++;
    }
    pthread_mutex_unlock(&ht->t_mtx);

}

void
HSlinkTestCase::begin_test_case(const char *verb, TestDriver::ptr r, JsOutput::ptr out)
{
}

void
HSlinkTestCase::end_test_case(const char *v, TestDriver::ptr r, JsOutput::ptr out)
{
}

/**
 * run_def_verb
 * ------------
 */
void
HSlinkTestCase::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
}

/*
 * -----------------------------------------------------------------------------------
 * LRU Test Case
 * -----------------------------------------------------------------------------------
 */
class LruTest : public LruObj
{
  public:
    OBJECT_COMMON_DEFS(LruTest);

    uint64_t     t_uuid;
    char         t_name[64];

  protected:
    LruTest(uint64_t uuid, const char *name) : t_uuid(uuid) {
        std::strncpy(t_name, name, sizeof(t_name));
    }

    const char *obj_keystr() const override {
        return t_name;
    }
    uint64_t obj_key64() const override {
        return t_uuid;
    }
};

class LruTableTest : public LruTable
{
  public:
    LruTableTest(int max, JsManager::ptr mgr) : LruTable(max), js_mgr(mgr) {}

    LruObj::ptr lookup_missed(uint64_t key) override
    {
        return nullptr;
    }

    LruObj::ptr lookup_missed(const std::string &key) override
    {
        auto elm = js_mgr->js_get_autogen(key.c_str());
        return LruTest::alloc(elm->js_kv_int("uuid"), elm->js_kv_str("name"));
    }

    void lookup_missed(uint64_t key, lru_u64_cb cb) override
    {
    }

    void lookup_missed(const std::string &key, lru_str_cb cb) override
    {
    }

  protected:
    JsManager::ptr           js_mgr;
};

USER_TEST_CASE_NORMAL(LruInsert, TestCase,

    bool apply_each_test_elm(TestDriver::ptr driver, 
                             TestElm::ptr elm, TestElm::ptr other) override
    {
        elm->js_set_kv_str("name", elm->js_get_id());
        return true;
    }

    inline LruTableTest *get_lru_test() {
        return t_lru;
    }

    void setup_test_case(TestDriver::ptr anchor) override {
        t_lru = new LruTableTest(100, JsManager::getInstance());
    },

    LruTableTest         *t_lru;
    ~LruInsert()
    {
        if (t_lru != nullptr) {
            t_lru->clear();
        }
        delete t_lru;
    }
);

/**
 * begin_test_case
 * ---------------
 */
void
LruInsert::begin_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    test->js_iter_foreach_test_elm();
}

/**
 * end_test_case
 * -------------
 */
void
LruInsert::end_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
}

/**
 * run_def_verb
 * ------------
 */
void
LruInsert::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
    LruTest::ptr obj = LruTest::alloc(elm->js_kv_int("uuid"), elm->js_kv_str("name"));
    t_lru->insert_keystr(obj);
}

USER_TEST_CASE_NORMAL(LruLookup, TestCase,

    void setup_test_case(TestDriver::ptr anchor) override
    {
        t_hitcnt = 0;
        TestDriver::ptr peer = anchor->js_get_peer("lru-insert-test");
        if (peer == nullptr) {
            printf("Counldn't find test case 'lru-insert-test'\n");
            return;
        }
        auto tcase = peer->js_get_test_case();
        LruInsert::ptr insert = dynamic_cast<LruInsert *>(tcase.get());
        if (insert != nullptr) {
            t_lru = insert->get_lru_test();
        }
    },

    LruTableTest         *t_lru;
    bo::atomic_int        t_hitcnt;
    ~LruLookup() {
        t_lru = nullptr;
    }
);

/**
 * begin_test_case
 * ---------------
 */
void
LruLookup::begin_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    EXPECT_TRUE(t_lru != nullptr);
}

/**
 * end_test_case
 * -------------
 */
void
LruLookup::end_test_case(const char *v, TestDriver::ptr test, JsOutput::ptr out)
{
    printf("LRU lookup test, hitcnt %d\n", t_hitcnt.load());
}

/**
 * run_def_verb
 * ------------
 */
void
LruLookup::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
    if (t_lru == nullptr) {
        return;
    }
    auto ptr = t_lru->lookup(elm->js_get_id());
    if (ptr != nullptr) {
        t_hitcnt++;
    }
}

/**
 * Test plugins
 */
const TestHashAdd   test_hash_add("add");
const TestHashRm    test_hash_rm("rm");

TestCase::ptr TestDriver::test_cases[] =
{
    HTestCase::alloc("hash-op-test"),
    HSlinkTestCase::alloc("hash-iter-test"),
    LruInsert::alloc("lru-insert-test"),
    LruLookup::alloc("lru-lookup-test"),
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
        &test_hash_add,
        &test_hash_rm,
        nullptr
    };
    js_install_test(verbs);
}

} // namespace

#if 0
void
ExecHashIterRemove::js_exec(JOut::ptr out)
{
    auto given = js_get_gen_obj<TestElm>("test-elm");
    ASSERT_TRUE(given != nullptr);

    auto tabs = js_get_glob_obj<HashGlobal>("HashTabs");
    ASSERT_TRUE(tabs != nullptr);

    auto pod = given->js_get_pod();
    ASSERT_TRUE(pod != nullptr);

    TestElement::ptr test = TestElement::alloc(pod->name, given->js_id(), pod->age);
    pthread_mutex_t *lock = tabs->js_get_lock();

    pthread_mutex_lock(lock);
    tabs->t_iter_rm++;
    tabs->t_name->insert_key64(test);
    auto chk = object_cast<TestElement>(tabs->t_name->lookup((uint64_t)pod->age));
    pthread_mutex_unlock(lock);

    ASSERT_TRUE(given->js_uobj == nullptr);
    ASSERT_EQ(chk, test);
    ASSERT_EQ(chk->elm_age, test->elm_age);
}

static void
check_missing_elm(JsTestObj::ptr test, int *id_check, int limit, const char *where)
{
    auto tabs = test->js_get_glob_obj<HashGlobal>("HashTabs");
    for (int i = 0; i < limit; i++) {
        if (id_check[i] != i) {
            printf("%s: missing element id %d, id check %d\n", where, i, id_check[i]);
        }
        EXPECT_TRUE(id_check[i] == i);
    }
}

void
ExecHashIterRemove::js_exec_teardown()
{
    ExecHashAdd::ptr master = object_cast<ExecHashAdd>(js_master);
    auto pod = master->js_get_pod();
    auto tabs = js_get_glob_obj<HashGlobal>("HashTabs");
    ASSERT_EQ(tabs->t_iter_rm, pod->assert_count);

    int *id_check = new int [pod->assert_count];
    memset(id_check, 0, pod->assert_count * sizeof(int));

    int id;
    int count = 0;
    for (auto it : *tabs->t_name) {
        count++;
        TestElement::ptr elm = object_cast<TestElement>(it);
        auto given = js_mgr->js_lookup_idref(elm->elm_id);

        id = JsObj::js_id_num_from_id(elm->elm_id);
        ASSERT_TRUE(id < (int)pod->assert_count);
        ASSERT_TRUE(given != nullptr);
        ASSERT_EQ(given->js_id(), elm->elm_id);
        EXPECT_TRUE(id_check[id] == 0);

        id_check[id] = id;
    }
    check_missing_elm(this, id_check, pod->assert_count, "HashIter");
    ASSERT_EQ(count, pod->assert_count);

    count = 0;
    memset(id_check, 0, pod->assert_count * sizeof(int));
    for (auto it = tabs->t_name->begin(); it != tabs->t_name->end(); it++) {
        count++;
        TestElement::ptr elm = object_cast<TestElement>(it.iter_takeout());
        ASSERT_TRUE(elm != nullptr);

        auto given = js_mgr->js_lookup_idref(elm->elm_id);
        id = JsObj::js_id_num_from_id(elm->elm_id);
        ASSERT_TRUE(id < (int)pod->assert_count);
        ASSERT_TRUE(given != nullptr);
        ASSERT_EQ(given->js_id(), elm->elm_id);
        EXPECT_TRUE(id_check[id] == 0);

        id_check[id] = id;
        elm->te_deref_slink();
    }
    check_missing_elm(this, id_check, pod->assert_count, "HashIterRemove");
    ASSERT_EQ(count, pod->assert_count);
    delete [] id_check;

    auto thp = js_get_exe_pool("normal");
    if (thp != nullptr) {
        Program::p_verbose = true;
        thp->thp_dump_stat();
        Program::p_verbose = false;
    }
}

#endif
