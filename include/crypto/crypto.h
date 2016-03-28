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
#ifndef _CRYPTO_CRYPTO_H_
#define _CRYPTO_CRYPTO_H_

#include <string>
#include <functional>
#include <di/program.h>
#include <crypto/types.pb.h>

struct encrypt_env_t
{
    size_t             m_in_len;
    size_t             m_out_len;
    union {
        const uint8_t *m_rmsg;
        const char    *m_msg;
    } in;
    union {
        uint8_t       *m_rmsg;
        char          *m_msg;
    } out;

    uint8_t           *m_ekey;
    uint8_t           *m_iv;
    size_t             m_iv_len;
    size_t             m_ekey_len;

    encrypt_env_t();
    ~encrypt_env_t();

    void env_alloc_mem(size_t out_len, size_t ek_len, size_t iv_len);
    void env_release_mem(char **mesg, char **ekey, char **iv);
};

#define CRYPTO_MODULE        "Crypto"

class AsyncKeyClient;
class KeyServiceClient;
class UserLruCache;
class UserCrypto;

class Crypto : public Module
{
  public:
    OBJECT_COMMON_DEFS(Crypto);
    MODULE_COMMON_DEFS(Crypto, CRYPTO_MODULE);

    enum status
    {
        ok         = 0,
        failure    = 0xff,
        max_status = 0xffff
    };
    struct KeyVer
    {
        OBJECT_PTR_DEFS(KeyVer);
        INTRUSIVE_PTR_DECL(KeyVer, m_refcnt);

        uint64_t             k_ver;
        std::string          k_public;

        KeyVer(uint64_t v, std::string &k) :
            m_refcnt(0), k_ver(v), k_public(std::move(k)) {}
    };
    struct UserRec
    {
        OBJECT_PTR_DEFS(UserRec);
        INTRUSIVE_PTR_DECL(UserRec, m_refcnt);

        uint64_t                 u_uuid;
        std::vector<KeyVer::ptr> u_key;

        UserRec(uint64_t u) : m_refcnt(0), u_uuid(u) {}
    };
    typedef std::function<void(status, KeyVer::ptr)> put_kpair_cbfn;
    typedef std::function<void(status, std::vector<KeyVer::ptr> **)> pub_keys_cbfn;

   /**
     * RSA key pair
     * Callback function must take ownership of all returned keys/array.
     */
    status gen_rsa_key(uint64_t uuid, uint64_t key_ver, std::string *pubkey);
    void gen_rsa_key(uint64_t uuid, uint64_t key_ver,
            const std::function<void(status, crypto::PubKeyResp *)> &callback);

    status get_rsa_key(uint64_t uuid, uint64_t key_ver, std::string *pub_key);
    void get_rsa_key(uint64_t uuid, uint64_t key_ver,
            const std::function<void(status, crypto::PubKeyResp *)> &callback);

    status put_rsa_keypair(uint64_t uuid, uint64_t kver,
            std::string *pub_key, std::string *priv_key);
    void put_rsa_keypair(uint64_t uuid, uint64_t kver,
            std::string *pub_key, std::string *priv_key, const put_kpair_cbfn &cb);

    status get_public_keys(uint64_t uuid, std::vector<KeyVer::ptr> *krec);
    void get_public_keys(uint64_t, const pub_keys_cbfn &cb);

    /**
     * Sign and verify message.
     */
    status rsa_sign(crypto::SignedMessage *mesg);

    status
    rsa_sign(uint64_t uuid, uint64_t key_ver, const std::string &in,
            std::string **signature, std::string **msg_hash);

    void
    rsa_sign(uint64_t uuid, uint64_t key_ver, const std::string &in,
            const std::function<void(status, crypto::SignedMessage *)> &callback);

    /**
     * Verify methods when don't have public key.
     */
    status rsa_verify_signature(crypto::SignedMessage *mesg);

    status
    rsa_verify_signature(uint64_t uuid, uint64_t key_ver, std::string *mesg,
            std::string *signature, std::string **hash, std::string **pubkey);

    /**
     * Async cb params
     * 1st string: result sha1 hash.
     * 2nd string: public key.
     */
    void
    rsa_verify_signature(uint64_t uuid, uint64_t key_ver,
            std::string *mesg, std::string *signature,
            const std::function<void(status, std::string &, std::string &)> &callback);

    /**
     * Verify with known public key.
     */
    status
    rsa_verify_signature(const std::string &pubkey,
            std::string *mesg, std::string *signature, std::string **hash);

    /**
     * Encrypt/decrypt envelope with 1 key.
     */
    status
    rsa_encrypt_envelope(uint64_t uuid, uint64_t kver, encrypt_env_t *env);

    status
    rsa_decrypt_envelope(uint64_t uuid, uint64_t kver, encrypt_env_t *env);

    /**
     * Encrypt the message in an envelop and encrypt the key for each user in the
     * list.
     */
    crypto::EnvelopeResp *
    rsa_encrypt_envelope(std::vector<uint64_t> uuids,
            std::vector<uint64_t> key_vers, const std::string &msg);

    std::string *
    rsa_decrypt_envelope(const std::string &encrypt, const crypto::EnvelopeKey &key);

  protected:
    friend class UserLruCache;
    friend class GenKeyAsync;
    friend class QueryPubKeyAsync;
    friend class ListPubKeysAsync;
    friend class SaveKPairAsync;
    friend struct RsaVerifySigCb;

    UserLruCache          *users;
    AsyncKeyClient        *async;
    KeyServiceClient      *cryp_clnt;

    virtual ~Crypto();
    Crypto(const char *const name, int users);

    /**
     * Wire async callback to this object for async APIs above.
     */
    void gen_rsa_key_callback(crypto::PubKeyResp *);
    void get_public_keys_callback(crypto::UserKeyRecord *, std::vector<KeyVer::ptr> *);

    /**
     * Allocate cache element for LRU cache to cache keys from server.
     */
    bo::intrusive_ptr<UserCrypto> alloc_user(uint64_t uuid);

    /**
     * Standard module methods.
     */
    void mod_init() override;
    void mod_startup() override;
    void mod_enable_service() override;

    void mod_disable_service() override;
    void mod_shutdown() override;
    void mod_cleanup() override;

  public:
    /**
     * Key server db commands for testing.  Disable in production.
     */
    std::string *key_db_command(const std::string &in);
    void key_db_command(const std::string &in,
            const std::function<void(status, crypto::DbCommand *)> &callback);

    void list_user_records(uint64_t uuid, uint32_t count, std::vector<UserRec::ptr> *);
 };

#endif /* _CRYPTO_CRYPTO_H_ */
