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
#ifndef _INCLUDE_CRYPTO_USER_H_
#define _INCLUDE_CRYPTO_USER_H_

#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/aes.h>
#include <openssl/err.h>
#include <openssl/rand.h>

#include <string>
#include <vector>
#include <crypto/crypto.h>
#include <cpptype/lru-cache.h>

class UserCrypto : public LruObj
{
  public:
    OBJECT_COMMON_DEFS(UserCrypto);

    static const int rsa_keylen = 2048;
    static const int aes_keylen = 256;
    static const int aes_rounds = 6;
    static const int max_env_keys = 16;

    /**
     * RSA functions.
     */
    static Crypto::status gen_rsa_kp(std::string **privkey, std::string **pubkey);
    static Crypto::status rsa_sign(const crypto::SignedMessage *,
            crypto::SignedMessage *out, const std::string &pkey);

    static Crypto::status rsa_verify_signature(const crypto::SignedMessage *,
            std::string **hash, const std::string &pubkey);

    static int
    rsa_public_do(bool encrypt, const std::string &, const std::string &, std::string *);

    static int
    rsa_private_do(bool enc, const std::string &, const std::string &, std::string *);

    static void sha1(const std::string &in, uint8_t out[]);
    static void sha256(const std::string &in, uint8_t out[]);

    /**
     * Generate/save local RSA keys.
     */
    Crypto::status creat_rsa_ctx();
    Crypto::status gen_rsa_key(uint64_t key_ver);

    /**
     * Evelope encryption.
     */
    Crypto::status
    rsa_encrypt_envelope(uint64_t key_ver, encrypt_env_t *env);

    Crypto::status
    rsa_decrypt_envelope(uint64_t key_ver, encrypt_env_t *env);

    crypto::EnvelopeResp *
    rsa_encrypt_envelope(std::vector<const std::string *> &rkeys,
            const std::vector<uint64_t> &uuids, const std::string &mesg);

    std::string *
    rsa_decrypt_envelope(const crypto::EnvelopeKey &key,
            const std::string &iv, const std::string &mesg);

    inline int
    rsa_public_do(bool encrypt, const std::string &in, uint64_t kver, std::string *out)
    {
        auto *pubkey = reinterpret_cast<std::string *>(rsa_pubkeys.value(kver));
        return rsa_public_do(encrypt, in, *pubkey, out);
    }

    inline int
    rsa_private_do(bool encrypt, const std::string &in, uint64_t kver, std::string *out)
    {
        if (rsa_privkey == nullptr) {
            return 0;
        }
        return rsa_private_do(encrypt, in, *rsa_privkey, out);
    }

    /**
     * Sign and verify a message.
     */
    Crypto::status rsa_sign(crypto::SignedMessage *mesg);
    Crypto::status rsa_verify_signature(uint64_t kver, crypto::SignedMessage *mesg);

    std::string *
    rsa_sign(uint64_t key_ver, const std::string &in, std::string **hash);

    Crypto::status
    rsa_verify_signature(uint64_t key_ver, std::string **hash,
            const std::string &in, std::string *signature);

    /**
     * Get public key.
     */
    bool get_public_key(uint64_t ver, std::string *key);
    bool get_all_pub_keys(std::vector<Crypto::KeyVer::ptr> *krec);

    /**
     * AES
     */
    Crypto::status creat_aes_ctx(int max_keys);
    Crypto::status gen_aes_key(uint64_t key_ver, std::string *aes_key);
    Crypto::status get_aes_key(uint64_t key_ver, std::string *aes_key);

    /**
     * Ddebug utility.
     */
    static char *to_base16(const char *in, int len);
    static char *to_base64(const char *in, int len);
    static int   from_base16(const char *base16, char **out);
    static int   from_base64(const char *base64, char **out);

  protected:
    friend class Crypto;
    uint64_t                  usr_uuid;
    char                     *err_buff;
    EVP_CIPHER_CTX           *rsa_encrypt_ctx;
    EVP_CIPHER_CTX           *rsa_decrypt_ctx;

    EVP_CIPHER_CTX           *aes_encrypt_ctx;
    EVP_CIPHER_CTX           *aes_decrypt_ctx;

    Uint64KvMap               rsa_pubkeys;
    std::vector<std::string>  aes_keys;
    pthread_mutex_t *const    usr_mtx;

    std::string              *rsa_privkey;     /**< local testing, key generation. */

    virtual ~UserCrypto();
    UserCrypto(uint64_t uuid, pthread_mutex_t *const mtx);

    void report_error();
    void put_public_key(uint64_t key_ver, const std::string &key);
    void put_all_pub_keys(const std::vector<Crypto::KeyVer::ptr> *krec);
    void put_key_pair(uint64_t ver, const std::string &pub, const std::string &priv);

    static std::string *rsa_kp_to_pubkey(EVP_PKEY *kp);
    static std::string *rsa_kp_to_privkey(EVP_PKEY *kp);

    static RSA *create_rsa(const std::string &key, bool pub);
    static EVP_PKEY *read_rsa_pubkey(const std::string &key);
    static EVP_PKEY *read_rsa_privkey(const std::string &key);

    /**
     * @return array of EVP_PKEY from PEM strings of public/private keys.
     */
    static std::vector<EVP_PKEY *> *
    read_rsa_pubkeys(const std::vector<const std::string *> &input);

    static std::vector<EVP_PKEY *> *
    read_rsa_privkeys(const std::vector<const std::string *> &input);

    /**
     * Free the vector allocated by methods above.
     */
    void free_rsa_keys(std::vector<EVP_PKEY *> *rkeys);

    std::string *rsa_pub_encrypt(const std::string &clear, EVP_PKEY *pub);
    std::string *rsa_priv_decrypt(const std::string &encryt, EVP_PKEY *priv);

    /**
     * Object hash method.
     */
    uint64_t obj_key64() const override {
        return usr_uuid;
    }
};

#endif /* _INCLUDE_CRYPTO_USER_H_ */
