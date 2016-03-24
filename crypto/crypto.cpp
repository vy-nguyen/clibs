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
#include <string>
#include <crypto/user.h>
#include <di/logger.h>
#include "user-cache.h"
#include "crypto-client.h"

LOGGER_STATIC_DECL(s_log);

encrypt_env_t::encrypt_env_t()
{
    memset(this, 0, sizeof(*this));
}

encrypt_env_t::~encrypt_env_t()
{
    if (out.m_msg != NULL) {
        delete [] out.m_msg;
    }
    if (m_iv != NULL) {
        delete [] m_iv;
    }
    m_iv      = NULL;
    m_ekey    = NULL;
    out.m_msg = NULL;
}

/**
 * env_alloc_mem
 * -------------
 */
void
encrypt_env_t::env_alloc_mem(size_t out_len, size_t ek_len, size_t iv_len)
{
    if (out.m_msg != NULL) {
        delete [] out.m_msg;
    }
    m_out_len = out_len;
    out.m_msg = new char [out_len];

    if (m_iv != NULL) {
        delete [] m_iv;
    }
    m_iv       = new uint8_t [iv_len + ek_len];
    m_ekey     = m_iv + iv_len;
    m_iv_len   = iv_len;
    m_ekey_len = ek_len;
}

/**
 * env_release_mem
 * ---------------
 * The caller must free memory relased by this structure.
 */
void
encrypt_env_t::env_release_mem(char **mesg, char **ekey, char **iv)
{
    if (mesg != NULL) {
        *mesg = out.m_msg;
    } else if (out.m_msg != NULL) {
        delete [] out.m_msg;
    }
    out.m_msg = NULL;

    if (ekey != NULL) {
        *ekey = new char [m_ekey_len];
        memcpy(*ekey, m_ekey, m_ekey_len);
    }
    if (iv != NULL) {
        *iv = new char [m_iv_len];
        memcpy(*iv, m_iv, m_iv_len);
    } else if (m_iv != NULL) {
        delete [] m_iv;
    }
    m_iv   = NULL;
    m_ekey = NULL;
}

Crypto::~Crypto() {}
Crypto::Crypto(const char *const name, int max_users) :
    Module(), mod_name(name), users(nullptr), async(NULL), cryp_clnt(NULL)
{
    assert(max_users != 0);
    users = new UserLruCache(max_users, this);
    mod_alloc_locks(16);
}

/**
 * key_db_command
 * --------------
 */
std::string *
Crypto::key_db_command(const std::string &in)
{
    crypto::DbCommand reqt;
    crypto::DbCommand resp;

    reqt.set_command(in);
    if (cryp_clnt->db_command(reqt, &resp).ok()) {
        return resp.release_command();
    }
    return nullptr;
}

void
Crypto::key_db_command(const std::string &in, const cb_DbCommandAsync &cb)
{
    auto *rpc  = async->alloc_db_command(this, cb);
    auto &reqt = rpc->get_reqt();

    reqt.set_command(in);
    rpc->do_rpc_reqt();
}

void
DbCommandAsync::process_rpc_response()
{
    c_cbfn(Crypto::ok, &c_resp);
}

/**
 * -----------------------------------------------------------------------------------
 * Generate/manage RSA key pair
 * -----------------------------------------------------------------------------------
 */
Crypto::status
Crypto::gen_rsa_key(uint64_t uuid, uint64_t key_ver, std::string *pub_key)
{
    crypto::KeyReqt    in;
    crypto::PubKeyResp out;

    in.set_uuid(uuid);
    in.set_key_ver_lo(key_ver);
    in.set_key_ver_hi(0);

    if (cryp_clnt->generate_key(in, &out).ok()) {
        if (out.pub_keys_size() > 0) {
            auto *key_rec = out.mutable_pub_keys(0);
            auto *key_str = key_rec->release_pub_key();
            pub_key->assign(std::move(*key_str));

            auto usr = users->get_user(uuid);
            assert(usr != nullptr);
            usr->put_public_key(key_rec->key_version(), *pub_key);
        }
    }
    return Crypto::ok;
}

void
Crypto::gen_rsa_key(uint64_t uuid, uint64_t key_ver, const cb_GenKeyAsync &cb)
{
    auto *rpc = async->alloc_gen_key(this, cb);
    auto &in  = rpc->get_reqt();

    in.set_uuid(uuid);
    in.set_key_ver_lo(key_ver);
    in.set_key_ver_hi(0);
    rpc->do_rpc_reqt();
}

void
Crypto::gen_rsa_key_callback(crypto::PubKeyResp *resp)
{
    if (resp->pub_keys_size() > 0) {
        auto rec  = resp->pub_keys(0);
        auto usr = users->get_user(rec.uuid());
        assert(usr != nullptr);
        usr->put_public_key(rec.key_version(), rec.pub_key());
    }
}

void
GenKeyAsync::process_rpc_response()
{
    c_arg->gen_rsa_key_callback(&c_resp);
    c_cbfn(Crypto::ok, &c_resp);
}

/**
 * put_rsa_keypair
 * ---------------
 */
Crypto::status
Crypto::put_rsa_keypair(uint64_t uuid, uint64_t kver,
        std::string *pub_key, std::string *priv_key)
{
    crypto::UserPrivKey   in;
    crypto::UserKeyRecord out;

    out.set_uuid(0);
    auto rec = in.mutable_user();
    rec->set_uuid(uuid);
    rec->set_key_version(kver);
    rec->set_allocated_pub_key(pub_key);
    in.set_allocated_priv_key(priv_key);

    auto ret = Crypto::ok;
    auto res = cryp_clnt->save_key_pair(in, &out);
    if (res.ok()) {
        assert(out.uuid() == uuid);
        auto *krec = new std::vector<KeyVer::ptr>();
        get_public_keys_callback(&out, krec);

        krec->clear();
        delete krec;
    } else {
        s_log.error("Failure saving kp: %s", res.error_message().c_str());
        ret = Crypto::failure;
    }
    auto *pub  = rec->release_pub_key();
    auto *priv = in.release_priv_key();
    assert(pub == pub_key);
    assert(priv == priv_key);

    return ret;
}

void
Crypto::put_rsa_keypair(uint64_t uuid, uint64_t kver,
        std::string *pub_key, std::string *priv_key, const put_kpair_cbfn &callback)
{
    auto *rpc = async->alloc_save_key_pair(this, nullptr);
    auto &in  = rpc->get_reqt();
    auto *rec = in.mutable_user();

    rec->set_uuid(uuid);
    rec->set_key_version(kver);
    rec->set_allocated_pub_key(pub_key);
    in.set_allocated_priv_key(priv_key);
    rpc->do_rpc_reqt();
}

void
SaveKPairAsync::process_rpc_response()
{
    if (c_status.ok()) {
        auto *krec = new std::vector<Crypto::KeyVer::ptr>();
        c_arg->get_public_keys_callback(&c_resp, krec);
        user_cb(Crypto::ok, (*krec)[0]);
        delete krec;
    } else {
        user_cb(Crypto::failure, nullptr);
        s_log.error("Async rpc save kp: %s", c_status.error_message().c_str());
    }
}

/**
 * get_public_keys
 * ---------------
 */
Crypto::status
Crypto::get_public_keys(uint64_t uuid, std::vector<KeyVer::ptr> *krec)
{
    if (users->get_all_pub_keys(uuid, krec) == true) {
        return Crypto::ok;
    }
    crypto::KeyReqt       in;
    crypto::UserKeyRecord out;

    out.set_uuid(0);
    in.set_uuid(uuid);
    in.set_key_ver_lo(0);
    in.set_key_ver_hi(0);

    auto ret = Crypto::ok;
    auto res = cryp_clnt->list_public_keys(in, &out);
    if (res.ok()) {
        assert(out.uuid() == uuid);
        get_public_keys_callback(&out, krec);
    } else {
        ret = Crypto::failure;
        s_log.error("Failure geting pub keys: %s", res.error_message().c_str());
    }
    return ret;
}

void
Crypto::get_public_keys(uint64_t uuid, const pub_keys_cbfn &callback)
{
    std::vector<KeyVer::ptr> krec;
    if (users->get_all_pub_keys(uuid, &krec) == true) {
        auto *assign = new std::vector<KeyVer::ptr>(std::move(krec));
        callback(ok, &assign);
        assert(assign == nullptr);
        return;
    }
    auto *rpc = async->alloc_list_pub_keys(this, callback);
    auto &in  = rpc->get_reqt();

    in.set_uuid(uuid);
    in.set_key_ver_lo(0);
    in.set_key_ver_hi(0);
    rpc->do_rpc_reqt();
}

void
ListPubKeysAsync::process_rpc_response()
{
    auto ret = Crypto::ok;
    std::vector<Crypto::KeyVer::ptr> *krec = nullptr;

    if (c_status.ok()) {
        krec = new std::vector<Crypto::KeyVer::ptr>();
        c_arg->get_public_keys_callback(&c_resp, krec);
    } else {
        ret = Crypto::failure;
        s_log.error("Async rpc save kp: %s", c_status.error_message().c_str());
    }
    user_cb(c_status.ok() ? Crypto::ok : Crypto::failure, &krec);
    assert(krec == nullptr);

}

/**
 * get_public_keys_callback
 * ------------------------
 */
void
Crypto::get_public_keys_callback(crypto::UserKeyRecord *resp,
        std::vector<KeyVer::ptr> *krec)
{
    auto lim = resp->key_info_size();
    for (auto i = 0; i < lim; i++) {
        auto *rec = resp->mutable_key_info(i);
        auto *sav = new KeyVer(rec->key_ver(), *rec->mutable_pub_key());
        krec->push_back(sav);
    }
    auto u = users->get_user(resp->uuid());
    assert(u != nullptr);

    u->put_all_pub_keys(krec);
}

/**
 * -----------------------------------------------------------------------------------
 * Query RSA public keys
 * -----------------------------------------------------------------------------------
 */
Crypto::status
Crypto::get_rsa_key(uint64_t uuid, uint64_t key_ver, std::string *pub_key)
{
    if (users->get_public_key(uuid, key_ver, pub_key) == true) {
        return Crypto::ok;
    }
    crypto::KeyReqt    in;
    crypto::PubKeyResp out;

    in.set_uuid(uuid);
    in.set_key_ver_lo(key_ver);
    in.set_key_ver_hi(0);

    auto ret = cryp_clnt->query_pub_key(in, &out);
    if (ret.ok()) {
        if (out.pub_keys_size() > 0) {
            auto *key_rec = out.mutable_pub_keys(0);
            auto *key_str = key_rec->release_pub_key();
            pub_key->assign(std::move(*key_str));

            auto u = users->get_user(uuid);
            assert(u != nullptr);
            u->put_public_key(key_ver, *pub_key);
            return Crypto::ok;
        }
        s_log.error("Rpc ok but no key returned 0x%lx, ver 0x%lx", uuid, key_ver);
    } else {
        s_log.error("Rpc get key failed: %s", ret.error_message().c_str());
    }
    return Crypto::failure;
}

void
Crypto::get_rsa_key(uint64_t uuid, uint64_t key_ver, const cb_QueryPubKeyAsync &cb)
{
    std::string pub_key;
    if (users->get_public_key(uuid, key_ver, &pub_key) == true) {
        crypto::PubKeyResp resp;

        auto rec = resp.add_pub_keys();
        rec->set_uuid(uuid);
        rec->set_key_version(key_ver);
        rec->set_allocated_pub_key(&pub_key);
        cb(Crypto::ok, &resp);

        auto *k = rec->release_pub_key();
        assert(k == &pub_key);
    } else {
        auto *rpc = async->alloc_query_pub_key(this, cb);
        auto &in  = rpc->get_reqt();

        in.set_uuid(uuid);
        in.set_key_ver_lo(key_ver);
        in.set_key_ver_hi(0);
        rpc->do_rpc_reqt();
    }
}

void
QueryPubKeyAsync::process_rpc_response()
{
    if (c_status.ok()) {
        c_arg->gen_rsa_key_callback(&c_resp);
        c_cbfn(Crypto::ok, &c_resp);
    } else {
        c_cbfn(Crypto::failure, nullptr);
        s_log.error("Async get key failed: %s", c_status.error_message().c_str());
    }
}

/**
 * -----------------------------------------------------------------------------------
 * RSA Message Signing via Key Server
 * -----------------------------------------------------------------------------------
 */
Crypto::status
Crypto::rsa_sign(crypto::SignedMessage *mesg)
{
    crypto::SignedMessage out;

    auto ret = cryp_clnt->sign_mesg(*mesg, &out);
    if (ret.ok()) {
        mesg->set_allocated_mesg_hash(out.release_mesg_hash());
        mesg->set_allocated_signature(out.release_signature());
        verify(mesg->uuid() == out.uuid());
        return Crypto::ok;
    }
    s_log.error("Message signing failed: %s", ret.error_message().c_str());
    return Crypto::failure;
}

Crypto::status
Crypto::rsa_sign(uint64_t uuid, uint64_t key_ver, const std::string &mesg,
        std::string **signature, std::string **msg_hash)
{
    crypto::SignedMessage in;
    crypto::SignedMessage out;

    in.set_uuid(uuid);
    in.set_allocated_message(const_cast<std::string *>(&mesg));
    in.set_key_version(key_ver);

    if (cryp_clnt->sign_mesg(in, &out).ok()) {
        auto *ret_hash = out.release_mesg_hash();
        if (ret_hash != NULL) {
            *msg_hash  = ret_hash;
            *signature = out.release_signature();
        }
        auto *orig = in.release_message();
        verify(orig == &mesg);
        verify(in.uuid() == out.uuid());
        return Crypto::ok;
    }
    return Crypto::failure;
}

void
Crypto::rsa_sign(uint64_t uuid, uint64_t key_ver,
        const std::string &mesg, const cb_SignMesgAsync &cb)
{
    auto *rpc = async->alloc_sign_mesg(this, cb);
    auto &in  = rpc->get_reqt();

    in.set_uuid(uuid);
    in.set_allocated_message(const_cast<std::string *>(&mesg));
    in.set_key_version(key_ver);
    rpc->do_rpc_reqt();
}

void
SignMesgAsync::process_rpc_response()
{
    /* The message string belongs to caller, we need to releae it. */
    c_reqt.release_message();
    if (c_status.ok()) {
        c_cbfn(Crypto::ok, &c_resp);
    } else {
        c_cbfn(Crypto::failure, nullptr);
        s_log.error("Async mesg sign failed: %s", c_status.error_message().c_str());
    }
}

/**
 * -----------------------------------------------------------------------------------
 * RSA Verify Message Signing with Public Key
 * -----------------------------------------------------------------------------------
 */
Crypto::status
Crypto::rsa_verify_signature(crypto::SignedMessage *mesg)
{
    std::string pubkey, *mesg_hash;
    auto uuid = mesg->uuid();
    auto kver = mesg->key_version();
    auto ret  = get_rsa_key(uuid, kver, &pubkey);

    if (ret != Crypto::ok) {
        return ret;
    }
    ret = UserCrypto::rsa_verify_signature(mesg, &mesg_hash, pubkey);
    if (ret != Crypto::ok) {
        s_log.debug("Failed to verify 0x%llx, 0x%llx", uuid, kver);
        return ret;
    }
    mesg->set_allocated_mesg_hash(mesg_hash);
    return Crypto::ok;
}

Crypto::status
Crypto::rsa_verify_signature(uint64_t uuid, uint64_t key_ver, std::string *in,
        std::string *signature, std::string **hash, std::string **pubkey)
{
    crypto::SignedMessage mesg;

    mesg.set_uuid(uuid);
    mesg.set_key_version(key_ver);
    mesg.set_allocated_message(in);
    mesg.set_allocated_signature(signature);

    auto ret = rsa_verify_signature(&mesg);

    *hash   = mesg.release_mesg_hash();
    *pubkey = mesg.release_mesg_hash();
    auto m  = mesg.release_message();
    auto s  = mesg.release_signature();

    assert(m == in);
    assert(s == signature);
    return ret;
}

Crypto::status
Crypto::rsa_verify_signature(const std::string &pubkey,
        std::string *in, std::string *signature, std::string **hash)
{
    crypto::SignedMessage mesg;

    assert(hash != nullptr);
    mesg.set_allocated_message(in);
    mesg.set_allocated_signature(signature);
    auto ret = UserCrypto::rsa_verify_signature(&mesg, hash, pubkey);

    auto m = mesg.release_message();
    auto s = mesg.release_signature();

    assert(m == in);
    assert(s == signature);
    return ret;
}

struct RsaVerifySigCb
{
    typedef std::function<void(Crypto::status, std::string &, std::string &)> usr_cbfn;

    uint64_t            v_uuid;
    std::string        *v_mesg;
    std::string        *v_signature;
    Crypto::ptr         v_crypto;
    usr_cbfn            v_usrcb;

    void callback(Crypto::status status, crypto::PubKeyResp *resp)
    {
        if ((status != Crypto::ok) || (resp->pub_keys_size() == 0)) {
            std::string empty;
            // v_usrcb(status, empty, empty);
            return;
        }
        std::string pub_key, *hash;

        /* Cache the return value. */
        v_crypto->gen_rsa_key_callback(resp);
        auto &rec = resp->pub_keys(0);
        assert(rec.uuid() == v_uuid);

        v_crypto->get_rsa_key(v_uuid, rec.key_version(), &pub_key);
        auto rt = v_crypto->rsa_verify_signature(pub_key, v_mesg, v_signature, &hash);
        assert(rt == 0);
        v_usrcb(rt, *hash, pub_key);
        delete this;
    }

    RsaVerifySigCb(uint64_t u, std::string *m, std::string *s,
            Crypto::ptr c, const usr_cbfn &cbfn) :
        v_uuid(u), v_mesg(m), v_signature(s), v_crypto(c), v_usrcb(cbfn) {}
};

namespace plh = std::placeholders;

void
Crypto::rsa_verify_signature(uint64_t uuid, uint64_t key_ver,
        std::string *mesg, std::string *signature,
        const std::function<void(status, std::string &, std::string &)> &cb)
{
    get_rsa_key(uuid, key_ver,
            std::bind(&RsaVerifySigCb::callback,
                new RsaVerifySigCb(uuid, mesg, signature, this, cb), plh::_1, plh::_2));
}

/**
 * rsa_encrypt_envelope
 * --------------------
 */
Crypto::status
Crypto::rsa_encrypt_envelope(uint64_t uuid, uint64_t key_ver, encrypt_env_t *env)
{
    return Crypto::ok;
}

crypto::EnvelopeResp *
Crypto::rsa_encrypt_envelope(std::vector<uint64_t> uuids,
        std::vector<uint64_t> slot, const std::string &msg)
{
    return NULL;
}

/**
 * rsa_decrypt_envelope
 * --------------------
 */
Crypto::status
Crypto::rsa_decrypt_envelope(uint64_t uuid, uint64_t key_ver, encrypt_env_t *env)
{
    return Crypto::ok;
}

std::string *
Crypto::rsa_decrypt_envelope(const std::string &encrypt, const crypto::EnvelopeKey &key)
{
    return NULL;
}

/**
 * list_user_records
 * -----------------
 */
void
Crypto::list_user_records(uint64_t uuid_start, uint32_t count,
        std::vector<UserRec::ptr> *records)
{
    crypto::AllUserRecReqt in;
    crypto::AllUserRecords out;

    in.set_uuid_start(0);
    in.set_uuid_count(0xffffffff);
    out.set_uuid_start(0);
    out.set_uuid_end(0);
    out.set_uuid_total(0);

    auto ret = cryp_clnt->list_all_acct(in, &out);
    if (!ret.ok()) {
        s_log.error("List all error %s", ret.error_message().c_str());
        return;
    }
    auto total = out.uuid_total();
    assert(total == out.account_size());

    for (auto i = 0; i < total; i++) {
        auto *acct = out.mutable_account(i);
        auto limit = acct->key_info_size();
        UserRec::ptr sav = new UserRec(acct->uuid());

        for (auto j = 0; j < limit; j++) {
            auto *info = acct->mutable_key_info(j);
            auto &pkey = *info->mutable_pub_key();
            sav->u_key.push_back(new KeyVer((*info).key_ver(), pkey));
        }
        records->push_back(sav);
    }
}

/**
 * alloc_user
 * ----------
 */
UserCrypto::ptr
Crypto::alloc_user(uint64_t uuid)
{
    return UserCrypto::alloc(uuid, mod_get_lock(reinterpret_cast<const void *>(uuid)));
}

/**
 * mod_init
 * --------
 */
void
Crypto::mod_init()
{
    OpenSSL_add_all_algorithms();
    OpenSSL_add_all_ciphers();
    ERR_load_crypto_strings();
}

/**
 * mod_startup
 * -----------
 */
void
Crypto::mod_startup()
{
    cryp_clnt = new KeyServiceClient(grpc::CreateChannel(
                "localhost:5151", grpc::InsecureChannelCredentials()));
    async = new AsyncKeyClient(grpc::CreateChannel(
                "localhost:5151", grpc::InsecureChannelCredentials()));
    async->run_client_loop();
}

/**
 * mod_enable_service
 * ------------------
 */
void
Crypto::mod_enable_service()
{
}

/**
 * mod_disable_service
 * -------------------
 */
void
Crypto::mod_disable_service()
{
}

/**
 * mod_shutdown
 * ------------
 */
void
Crypto::mod_shutdown()
{
    async->shutdown_client();
    delete cryp_clnt;
    delete async;

    users->dump_stat();
}

/**
 * mod_cleanup
 * -----------
 */
void
Crypto::mod_cleanup()
{
    ERR_free_strings();
    EVP_cleanup();

    users->clear();
    delete users;
}
