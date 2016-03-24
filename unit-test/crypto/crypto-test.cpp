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
#include <cpptype/lock.h>
#include <di/program.h>
#include <json-unit-app.h>
#include <json/json-unit.h>
#include <unit-test-def.h>
#include <crypto/user.h>
#include <di/logger.h>
#include <util/uuid.h>

LOGGER_STATIC_DECL(s_log);

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc(MOD_SYS_THPOOL, 2, 8, 3, -1),
        Trace::alloc(2048),
        JsManager::alloc(JSMANAGER_MOD),
        LogModule::alloc(LOG_MODULE),
        Crypto::alloc(CRYPTO_MODULE, 104729),
        nullptr
    };
    TestApp app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { "in",        required_argument, nullptr,             'i' },
        { "verbose",   no_argument,       &app.argv_verbose,    1  },
        { nullptr,        0,              nullptr,              0  }
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
 * Crypto module test fixtures
 */
class CryptoTestFixture : public ::testing::Test
{
  public:
    void SetUp() override
    {
        prog   = reinterpret_cast<const TestApp *>(Program::singleton());
        crypto = Crypto::getInstance();
        t_user = UserCrypto::alloc(10, crypto->mod_get_lock(0));

        t_user->creat_rsa_ctx();
        t_user->gen_rsa_key(0);
    }

    void TearDown() override
    {
        prog   = nullptr;
        crypto = nullptr;
        t_user = nullptr;
    }

  protected:
    const TestApp   *prog;
    Crypto::ptr      crypto;
    UserCrypto::ptr  t_user;
};

TEST_F(CryptoTestFixture, SimpleEncrypt)
{
    std::string pub_key;
    t_user->get_public_key(0, &pub_key);

    encrypt_env_t enc;
    const auto *mesg = "This is a test string, I don't know what I wrote";

    enc.in.m_msg = mesg;
    enc.m_in_len = strlen(enc.in.m_msg);
    t_user->rsa_encrypt_envelope(0, &enc);

    char *encode = t_user->to_base64(enc.out.m_msg, enc.m_out_len);
    printf("Message : %s\n", enc.in.m_msg);
    printf("Encode64: %s\n", encode);
    delete [] encode;

    /* Swap the in/out and reuse ekey/iv to decode. */
    enc.in.m_msg   = enc.out.m_msg;
    enc.m_in_len   = enc.m_out_len;
    enc.out.m_msg  = nullptr;
    enc.m_out_len  = 0;
    t_user->rsa_decrypt_envelope(0, &enc);
    printf("Decode  : %s, len %ld\n", enc.out.m_msg, enc.m_out_len);

    delete [] enc.in.m_msg;
    enc.env_release_mem(nullptr, nullptr, nullptr);

    std::string pub_enc, priv_enc;
    t_user->rsa_public_do(true, mesg, 0, &pub_enc);
    t_user->rsa_private_do(true, mesg, 0, &priv_enc);
    encode = t_user->to_base64(pub_enc.c_str(), pub_enc.size());

    printf("Public encrypt (%ld): %s\n", pub_enc.size(), encode);
    delete [] encode;

    encode = t_user->to_base64(priv_enc.c_str(), priv_enc.size());
    printf("Private encrypt(%ld): %s\n", priv_enc.size(), encode);
    delete [] encode;

    std::string pub_dec, priv_dec;
    t_user->rsa_public_do(false, priv_enc, 0, &pub_dec);
    t_user->rsa_private_do(false, pub_enc, 0, &priv_dec);

    ASSERT_TRUE(strcmp(mesg, pub_dec.c_str()) == 0);
    ASSERT_TRUE(strcmp(mesg, priv_dec.c_str()) == 0);
}

TEST_F(CryptoTestFixture, EnvelopeEnscript)
{
    std::string pub_key;

    t_user->get_public_key(0, &pub_key);
    std::vector<uint64_t> uuid;
    std::vector<const std::string *> in;

    in.push_back(&pub_key);
    uuid.push_back(0xdefcafe);
    auto envelope = t_user->rsa_encrypt_envelope(in, uuid, "This is an envelope");
    if (envelope == nullptr) {
        printf("Failed to encode\n");
        return;
    }
    auto enc = envelope->encrypt();
    auto b64 = t_user->to_base64(enc.c_str(), enc.length());
    printf("Encode: %s, len %ld\n", b64, enc.length());
    delete [] b64;

    auto ekey = envelope->env_keys(0);
    auto iv   = envelope->env_iv();
    auto dec  = t_user->rsa_decrypt_envelope(ekey, iv, enc);
    printf("Decode: %s, len %ld\n", dec->c_str(), dec->length());

    delete envelope;
    delete dec;
}

TEST_F(CryptoTestFixture, SignVerification)
{
    crypto::SignedMessage sign;
    sign.set_message("This is test signed message");

    if (t_user->rsa_sign(&sign) == Crypto::ok) {
        auto str = sign.signature();
        auto b64 = t_user->to_base64(str.c_str(), str.length());
        printf("Signature %s\n", b64);
        delete [] b64;

        auto hash = sign.mesg_hash();
        auto hex  = t_user->to_base16(hash.c_str(), hash.length());
        printf("Hash SHA1: %s\n", hex);
        delete [] hex;
    } else {
        printf("Sign failed, skip verify\n");
        return;
    }
    crypto::SignedMessage verify;
    verify.set_message(sign.message());
    verify.set_signature(sign.signature());

    if (t_user->rsa_verify_signature(0, &verify) == Crypto::ok) {
        auto hash = verify.mesg_hash();
        auto hex  = t_user->to_base16(hash.c_str(), hash.length());
        printf("Verified recompute hash: %s, len %ld\n", hex, hash.length());
        delete [] hex;
    }
}

TEST_F(AppTestFixture, RunJson)
{
    const char *cmds[] = {
        "envelope",
        "gen-key-run",
        "query-key-run",
        "sign-mesg-run",
        "read-db-key-run",
        "sign-all-rec-run",
        nullptr
    };
    js_mgr->js_run(cmds);
}

TEST_F(AppTestFixture, DumpDb)
{
    auto crypto = Crypto::getInstance();
    auto resp = crypto->key_db_command("dump");
    delete resp;
}

/*
 * -------------------------------------------------------------------------------
 *  User Test Code Section
 * -------------------------------------------------------------------------------
 */
class CryptoTestCase : public AsyncTestCase
{
  public:
    OBJECT_COMMON_DEFS(CryptoTestCase);

  protected:
    UserCrypto::ptr     user;
    Crypto::ptr         crypto;

    CryptoTestCase(const char *const id) :
        AsyncTestCase(id), user(nullptr), crypto(nullptr) {}

    ~CryptoTestCase()
    {
        user   = nullptr;
        crypto = nullptr;
    }

    void setup_test_case(TestDriver::ptr anchor) override {
        crypto = Crypto::getInstance();
    }
};

struct KeyDbCallback
{
    TestElm::ptr         elm;
    CryptoTestCase::ptr  test;

    virtual ~KeyDbCallback()
    {
        elm  = nullptr;
        test = nullptr;
    }
    KeyDbCallback(TestElm::ptr e, CryptoTestCase::ptr t) : elm(e), test(t) {}

    void finalized_callback()
    {
        test->notify_test_done();
        delete this;
    }
};

namespace plh = std::placeholders;

/**
 * ------------------------------------------------------------------------------------
 * Generate keys for an account.
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_RUNONLY(GenKeyTest, CryptoTestCase,
    ,
);

struct GenKeyCb : public KeyDbCallback
{
    GenKeyCb(TestElm::ptr e, CryptoTestCase::ptr t) : KeyDbCallback(e, t) {}

    void gen_key_cb(Crypto::status status, crypto::PubKeyResp *resp)
    {
        if (resp->pub_keys_size() != 0) {
            auto pubkey = resp->pub_keys(0);
            elm->js_set_kv_str("pubKey", pubkey.pub_key().c_str());

        } else {
            EXPECT_TRUE(resp->pub_keys_size() != 0);
        }
        finalized_callback();
    }
};

void
GenKeyTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
    auto uuid    = UuidGen::gen_uuid64();
    auto ver_lo  = elm->js_kv_int("keyVer64");

    elm->js_set_kv_int64("uuid64", uuid);

#if 0
    std::string pub_key;
    crypto->gen_rsa_key(uuid, ver_lo, &pub_key);
    notify_test_done();
#endif
    crypto->gen_rsa_key(uuid, ver_lo,
            std::bind(&GenKeyCb::gen_key_cb,
                new GenKeyCb(elm, this), plh::_1, plh::_2));
}

/**
 * ------------------------------------------------------------------------------------
 * Query public keys for an account.
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_RUNONLY(QueryKeyTest, CryptoTestCase,
    ,
);

struct QueryKeyCb : public KeyDbCallback
{
    QueryKeyCb(TestElm::ptr e, CryptoTestCase::ptr t) : KeyDbCallback(e, t) {}

    void query_key_cb(Crypto::status status, crypto::PubKeyResp *resp)
    {
        if (resp->pub_keys_size() != 0) {
            auto pubkey = resp->pub_keys(0);
            auto uuid   = pubkey.uuid();
            auto pkey   = pubkey.pub_key();

            auto ruuid  = elm->js_kv_int64("uuid64");
            auto rkey   = elm->js_kv_str("pubKey");

            EXPECT_TRUE(uuid == ruuid);
            EXPECT_TRUE(strcmp(rkey, pkey.c_str()) == 0);
        } else {
            EXPECT_TRUE(resp->pub_keys_size() != 0);
        }
        finalized_callback();
    }
};

void
QueryKeyTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr out)
{
    auto uuid    = elm->js_kv_int64("uuid64");
    auto ver_lo  = elm->js_kv_int("keyVer64");

#if 0
    std::string pub_key;
    crypto->get_rsa_key(uuid, ver_lo, &pub_key);
    notify_test_done();
#endif
    crypto->get_rsa_key(uuid, ver_lo,
            std::bind(&QueryKeyCb::query_key_cb,
                new QueryKeyCb(elm, this), plh::_1, plh::_2));
}

/**
 * ------------------------------------------------------------------------------------
 * Sign a message test
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_RUNONLY(SignMesgTest, CryptoTestCase,
    ,
);

struct SignMesgCb : public KeyDbCallback
{
    Crypto::ptr  crypto;
    std::string  orig_mesg;

    virtual ~SignMesgCb() {
        crypto = nullptr;
    }
    SignMesgCb(TestElm::ptr e, CryptoTestCase::ptr t, Crypto::ptr c, const char *m) :
        KeyDbCallback(e, t), crypto(c), orig_mesg(m) {}

    void sign_mesg_cb(Crypto::status status, crypto::SignedMessage *resp)
    {
        auto *pkey = elm->js_kv_str("pubKey");
        ASSERT_TRUE(pkey != nullptr);

        std::string *verf_hash;
        std::string pubkey(pkey);
        auto hash = resp->mesg_hash();
        auto ret = crypto->rsa_verify_signature(pubkey,
                &orig_mesg, resp->mutable_signature(), &verf_hash);

        EXPECT_TRUE(ret == Crypto::ok);
        EXPECT_TRUE(hash.compare(*verf_hash) == 0);
        delete verf_hash;
#if 0
        auto str = resp->signature();
        auto b64 = UserCrypto::to_base64(str.c_str(), str.length());
        printf("Signature %s\n", b64);
        delete [] b64;

        auto hex  = UserCrypto::to_base16(hash.c_str(), hash.length());
        printf("Hash SHA1: %s\n", hex);
        delete [] hex;
#endif
        finalized_callback();
    }
};

void
SignMesgTest::run_def_verb(const char *v, TestElm::ptr elm, JsOutput::ptr)
{
    auto uuid    = elm->js_kv_int64("uuid64");
    auto key_ver = elm->js_kv_int("keyVer64");
    auto mesg    = elm->js_kv_str("message");

#if 0
    std::string signature;
    std::string mesg_hash;
    crypto->rsa_sign(uuid, key_ver, mesg, &signature, &mesg_hash);
    notify_test_done();
#endif
    crypto->rsa_sign(uuid, key_ver, mesg,
        std::bind(&SignMesgCb::sign_mesg_cb,
            new SignMesgCb(elm, this, crypto, mesg), plh::_1, plh::_2));
}

/**
 * ------------------------------------------------------------------------------------
 * Test with data read back from DB.
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_RUNONLY(ReadKeyDbTest, CryptoTestCase,

    size_t   gen_content_str(int order, const char *fname, char *, size_t) override;

    void setup_test_case(TestDriver::ptr anchor) override
    {
        CryptoTestCase::setup_test_case(anchor);
        crypto->list_user_records(0, 0xffffffff, &user_rec);
    }
    void begin_test_case(const char *v, TestDriver::ptr d, JsOutput::ptr out) override
    {
        CryptoTestCase::begin_test_case(v, d, out);
        user_rec.clear();
    }
    ,
    std::vector<Crypto::UserRec::ptr>  user_rec;
);

void
ReadKeyDbTest::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
    auto uuid    = elm->js_kv_int64("uuid64");
    auto key_ver = elm->js_kv_int64("keyVer64");
    auto mesg    = elm->js_kv_str("message");

    auto key = elm->js_kv_str("pubKey");
    assert(key != nullptr);
    assert(mesg != nullptr);

#if 0
    std::string signature;
    std::string mesg_hash;
    crypto->rsa_sign(uuid, key_ver, mesg, &signature, &mesg_hash);
    notify_test_done();
#endif

    crypto->rsa_sign(uuid, key_ver, mesg,
        std::bind(&SignMesgCb::sign_mesg_cb,
            new SignMesgCb(elm, this, crypto, mesg), plh::_1, plh::_2));
}

size_t
ReadKeyDbTest::gen_content_str(int order, const char *fname, char *out, size_t len)
{
    if (order >= user_rec.size()) {
        return 0;
    }
    auto rec = user_rec.at(order);
    if (strncmp(fname, "uuid64", sizeof("uuid64")) == 0) {
        return snprintf(out, len, "0x%lx", rec->u_uuid);
    }
    if (strncmp(fname, "keyVer64", sizeof("keyVer64")) == 0) {
        auto kver = rec->u_key;
        if (kver.size() > 0) {
            return snprintf(out, len, "0x%lx", kver.at(0)->k_ver);
        }
        return 0;
    }
    if (strncmp(fname, "pubKey", sizeof("pubKey")) == 0) {
        auto kver = rec->u_key;
        if (kver.size() > 0) {
            std::strncpy(out, kver.at(0)->k_public.c_str(), len);
            return len;
        }
    }
    printf("Gen content order %d, field %s, len %ld\n", order, fname, len);
    return 0;
}

/**
 * ------------------------------------------------------------------------------------
 * Local envelope encryption/decryption.
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_NORMAL(CryptoEnvelope, CryptoTestCase, ,);

void
CryptoEnvelope::begin_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

void
CryptoEnvelope::end_test_case(const char *verb, TestDriver::ptr elm, JsOutput::ptr out)
{
}

void
CryptoEnvelope::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
}

/**
 * ------------------------------------------------------------------------------------
 * Local signature sign/verify.
 * ------------------------------------------------------------------------------------
 */
USER_TEST_CASE_RUNONLY(CryptoSignature, CryptoTestCase, ,);

/**
 * run_def_verb
 * ------------
 */
void
CryptoSignature::run_def_verb(const char *verb, TestElm::ptr elm, JsOutput::ptr out)
{
    notify_test_done();

    auto uuid = elm->js_kv_int("uuid");
    auto kver = elm->js_kv_int("keyVer");
    auto data = elm->js_kv_str("data");

    auto user = UserCrypto::alloc(uuid, crypto->mod_get_lock(0));
    user->creat_rsa_ctx();
    user->gen_rsa_key(kver);

    crypto::SignedMessage signature;
    signature.set_message(data);
    if (user->rsa_sign(&signature) != Crypto::ok) {
        ASSERT_TRUE(0);
        return;
    }
    crypto::SignedMessage verify;
    verify.set_message(data);
    verify.set_signature(signature.signature());
    if (user->rsa_verify_signature(kver, &verify) != Crypto::ok) {
        ASSERT_TRUE(0);
        return;
    }
    auto sign_hash = signature.mesg_hash();
    auto verf_hash = verify.mesg_hash();
    EXPECT_TRUE(sign_hash.compare(verf_hash) == 0);
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
    CryptoSignature::alloc("crypto-signature-test"),
    CryptoEnvelope::alloc("crypto-envelope-test"),
    GenKeyTest::alloc("gen-key-test"),
    QueryKeyTest::alloc("query-key-test"),
    SignMesgTest::alloc("sign-mesg-test"),
    ReadKeyDbTest::alloc("read-db-key-test"),
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
