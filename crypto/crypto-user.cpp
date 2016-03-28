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
#include <math.h>
#include <di/logger.h>
#include <crypto/user.h>

LOGGER_STATIC_DECL(s_log);

UserCrypto::UserCrypto(uint64_t uuid, pthread_mutex_t *const mtx) :
    usr_uuid(uuid), err_buff(nullptr),
    rsa_encrypt_ctx(nullptr), rsa_decrypt_ctx(nullptr),
    aes_encrypt_ctx(nullptr), aes_decrypt_ctx(nullptr),
    rsa_pubkeys(37), usr_mtx(mtx), rsa_privkey(nullptr) {}

UserCrypto::~UserCrypto()
{
    if (err_buff != nullptr) {
        delete [] err_buff;
    }
    if (rsa_encrypt_ctx != nullptr) {
        EVP_CIPHER_CTX_cleanup(rsa_encrypt_ctx);
        EVP_CIPHER_CTX_cleanup(rsa_decrypt_ctx);

        delete rsa_encrypt_ctx;
        delete rsa_decrypt_ctx;
    }
    if (aes_encrypt_ctx != nullptr) {
        EVP_CIPHER_CTX_cleanup(aes_encrypt_ctx);
        EVP_CIPHER_CTX_cleanup(aes_decrypt_ctx);

        delete aes_encrypt_ctx;
        delete aes_decrypt_ctx;
    }
    void *val;
    for (auto it = rsa_pubkeys.begin(); it != rsa_pubkeys.end(); it++) {
        auto obj = it.iter_takeout(&val);
        auto key = reinterpret_cast<std::string *>(val);
        assert(val != nullptr);
        delete key;
    }
    if (rsa_privkey != nullptr) {
        delete rsa_privkey;
    }
}

/**
 * creat_rsa_ctx
 * -------------
 */
Crypto::status
UserCrypto::creat_rsa_ctx()
{
    rsa_encrypt_ctx = new EVP_CIPHER_CTX();
    rsa_decrypt_ctx = new EVP_CIPHER_CTX();

    EVP_CIPHER_CTX_init(rsa_encrypt_ctx);
    EVP_CIPHER_CTX_init(rsa_decrypt_ctx);

    return Crypto::ok;
}

/**
 * gen_rsa_key
 * -----------
 */
Crypto::status
UserCrypto::gen_rsa_kp(std::string **privkey, std::string **pubkey)
{
    EVP_PKEY *rsa_keypair = nullptr;
    EVP_PKEY_CTX *ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, nullptr);

    if (EVP_PKEY_keygen_init(ctx) <= 0) {
        s_log.error("Keygen init failure");
        return Crypto::failure;
    }
    if (EVP_PKEY_CTX_set_rsa_keygen_bits(ctx, rsa_keylen) <= 0) {
        s_log.error("RSA bits failure");
        return Crypto::failure;
    }
    if (EVP_PKEY_keygen(ctx, &rsa_keypair) <= 0) {
        s_log.error("RSA keygen failure");
        return Crypto::failure;
    }
    EVP_PKEY_CTX_free(ctx);

    *pubkey  = rsa_kp_to_pubkey(rsa_keypair);
    *privkey = rsa_kp_to_privkey(rsa_keypair);
    EVP_PKEY_free(rsa_keypair);
    return Crypto::ok;
}

Crypto::status
UserCrypto::gen_rsa_key(uint64_t key_ver)
{
    std::string *pub_key, *priv_key;

    auto rt = gen_rsa_kp(&priv_key, &pub_key);
    if (rt== Crypto::ok) {
        pthread_mutex_lock(usr_mtx);
        rsa_pubkeys.insert(key_ver, pub_key);
        rsa_privkey = priv_key;
        pthread_mutex_unlock(usr_mtx);
    }
    return rt;
}

/**
 * rsa_kp_to_privkey
 * -----------------
 */
std::string *
UserCrypto::rsa_kp_to_privkey(EVP_PKEY *kp)
{
    auto bio = BIO_new(BIO_s_mem());
    PEM_write_bio_PrivateKey(bio, kp, nullptr, nullptr, 0, 0, nullptr);

    auto priv_klen = BIO_pending(bio);
    auto privkey = new std::string(priv_klen + 1, '\0');

    BIO_read(bio, &(*privkey)[0], priv_klen);
    (*privkey)[priv_klen] = '\0';
    BIO_free_all(bio);

    return privkey;
}

/**
 * rsa_kp_to_pubkey
 * ----------------
 */
std::string *
UserCrypto::rsa_kp_to_pubkey(EVP_PKEY *kp)
{
    auto bio = BIO_new(BIO_s_mem());
    PEM_write_bio_PUBKEY(bio, kp);

    auto pub_klen = BIO_pending(bio);
    auto pubkey = new std::string(pub_klen + 1, '\0');

    BIO_read(bio, &(*pubkey)[0], pub_klen);
    (*pubkey)[pub_klen] = '\0';
    BIO_free_all(bio);
    return pubkey;
}

/**
 * read_rsa_pubkey
 * ---------------
 */
EVP_PKEY *
UserCrypto::read_rsa_pubkey(const std::string &key)
{
    auto bio = BIO_new_mem_buf(const_cast<char *>(key.data()), key.length());

    if (bio == nullptr) {
        printf("Failed to create key BIO");
        return nullptr;
    }
    auto kp = PEM_read_bio_PUBKEY(bio, nullptr, nullptr, nullptr);
    BIO_free_all(bio);

    return kp;
}

std::vector<EVP_PKEY *> *
UserCrypto::read_rsa_pubkeys(const std::vector<const std::string *> &rkeys)
{
    auto siz = rkeys.size();
    auto ret = new std::vector<EVP_PKEY *>(siz);

    for (auto i = 0; i < siz; i++) {
        (*ret)[i] = read_rsa_pubkey(*rkeys[i]);
    }
    return ret;
}

/**
 * read_rsa_privkey
 * ----------------
 */
EVP_PKEY *
UserCrypto::read_rsa_privkey(const std::string &key)
{
    auto bio = BIO_new_mem_buf(const_cast<char *>(key.data()), key.length());

    if (bio == nullptr) {
        printf("Failed to create key BIO");
        return nullptr;
    }
    auto kp = PEM_read_bio_PrivateKey(bio, nullptr, nullptr, nullptr);
    BIO_free_all(bio);

    return kp;
}

std::vector<EVP_PKEY *> *
UserCrypto::read_rsa_privkeys(const std::vector<const std::string *> &rkeys)
{
    auto siz = rkeys.size();
    auto ret = new std::vector<EVP_PKEY *>(siz);

    for (auto i = 0; i < siz; i++) {
        (*ret)[i] = read_rsa_privkey(*rkeys[i]);
    }
    return ret;
}

/**
 * free_rsa_keys
 * -------------
 */
void
UserCrypto::free_rsa_keys(std::vector<EVP_PKEY *> *rkeys)
{
    for (auto it : *rkeys) {
        EVP_PKEY_free(it);
    }
    rkeys->clear();
    delete rkeys;
}

/**
 * rsa_encrypt_envelope
 * --------------------
 */
Crypto::status
UserCrypto::rsa_encrypt_envelope(uint64_t key_ver, encrypt_env_t *env)
{
    int blk_len = 0;
    auto *pubkey = reinterpret_cast<std::string *>(rsa_pubkeys.value(key_ver));
    auto *kp = read_rsa_pubkey(*pubkey);

    if (kp == nullptr) {
        return Crypto::failure;
    }
    auto rt = Crypto::ok;
    env->env_alloc_mem(env->m_in_len + EVP_MAX_IV_LENGTH,
            EVP_PKEY_size(kp), EVP_MAX_IV_LENGTH);

    pthread_mutex_lock(usr_mtx);
    if (!EVP_SealInit(rsa_encrypt_ctx, EVP_aes_256_cbc(), &env->m_ekey,
                reinterpret_cast<int *>(&env->m_ekey_len), env->m_iv, &kp, 1)) {
        rt = Crypto::failure;
        report_error();
        goto out;
    }
    env->m_out_len = 0;
    if (!EVP_SealUpdate(rsa_encrypt_ctx, env->out.m_rmsg + env->m_out_len,
                &blk_len, env->in.m_rmsg, env->m_in_len)) {
        rt = Crypto::failure;
        report_error();
        goto out;
    }
    env->m_out_len += blk_len;
    if (!EVP_SealFinal(rsa_encrypt_ctx, env->out.m_rmsg + env->m_out_len, &blk_len)) {
        rt = Crypto::failure;
        report_error();
        goto out;
    }
    env->m_out_len += blk_len;

out:
    EVP_CIPHER_CTX_cleanup(rsa_encrypt_ctx);
    pthread_mutex_unlock(usr_mtx);

    EVP_PKEY_free(kp);
    return rt;
}

crypto::EnvelopeResp *
UserCrypto::rsa_encrypt_envelope(std::vector<const std::string *> &rkeys,
        const std::vector<uint64_t> &uuids, const std::string &mesg)
{
    auto users = rkeys.size();

    if ((uuids.size() != users) || (users > max_env_keys)) {
        return nullptr;
    }
    auto resp     = new crypto::EnvelopeResp();
    auto pub_keys = read_rsa_pubkeys(rkeys);
    auto ek_len   = EVP_PKEY_size((*pub_keys)[0]);
    auto env_keys = new uint8_t * [users];

    resp->clear_env_keys();
    for (auto i = 0; i < users; i++) {
        auto key = resp->add_env_keys();
        assert(key != nullptr);

        auto ek = new std::string(ek_len, '\0');
        key->set_allocated_env_key(ek);
        key->set_uuid(uuids[i]);
        env_keys[i] = reinterpret_cast<uint8_t *>(&(*ek)[0]);
    }
    auto iv      = new std::string(EVP_MAX_IV_LENGTH, '\0');
    auto enc     = new std::string(mesg.size() + EVP_MAX_IV_LENGTH, '\0');
    auto iv_ptr  = reinterpret_cast<uint8_t *>(&(*iv)[0]);
    auto enc_ptr = reinterpret_cast<uint8_t *>(&(*enc)[0]);
    auto src_ptr = reinterpret_cast<const uint8_t *>(&mesg[0]);

    resp->set_allocated_env_iv(iv);
    resp->set_allocated_encrypt(enc);

    auto blk_len = 0;
    auto out_len = 0;
    pthread_mutex_lock(usr_mtx);
    if (!EVP_SealInit(rsa_encrypt_ctx, EVP_aes_256_cbc(),
                env_keys, &ek_len, iv_ptr, &(*pub_keys)[0], users)) {
        report_error();
        delete resp;
        resp = nullptr;
        goto out;
    }
    if (!EVP_SealUpdate(rsa_encrypt_ctx, enc_ptr, &blk_len, src_ptr, mesg.size())) {
        report_error();
        delete resp;
        resp = nullptr;
        goto out;
    }
    out_len += blk_len;
    if (!EVP_SealFinal(rsa_encrypt_ctx, enc_ptr + out_len, &blk_len)) {
        report_error();
        delete resp;
        resp = nullptr;
        goto out;
    }
    out_len += blk_len;
    enc->resize(out_len);
    for (auto i = 0; i < users; i++) {
        auto key = resp->mutable_env_keys(i);
        auto ek  = key->mutable_env_key();
        ek->resize(ek_len);
    }
out:
    EVP_CIPHER_CTX_cleanup(rsa_encrypt_ctx);
    pthread_mutex_unlock(usr_mtx);

    free_rsa_keys(pub_keys);
    delete [] env_keys;
    return resp;
}

/**
 * rsa_decrypt_envelope
 * --------------------
 */
Crypto::status
UserCrypto::rsa_decrypt_envelope(uint64_t key_ver, encrypt_env_t *env)
{
    if (rsa_privkey == nullptr) {
        return Crypto::failure;
    }
    assert(env->m_ekey != nullptr && env->m_ekey_len > 0);
    assert(env->in.m_msg != nullptr && env->m_in_len > 0);

    int blk_len = 0;
    auto *kp = read_rsa_privkey(*rsa_privkey);
    auto  rt = Crypto::failure;

    if (kp == nullptr) {
        return rt;
    }
    env->out.m_msg = new char [env->m_in_len + env->m_iv_len + 1];
    if (env->out.m_msg == nullptr) {
        return rt;
    }
    pthread_mutex_lock(usr_mtx);
    if (!EVP_OpenInit(rsa_decrypt_ctx, EVP_aes_256_cbc(),
                env->m_ekey, env->m_ekey_len, env->m_iv, kp)) {
        report_error();
        goto out;
    }
    env->m_out_len = 0;
    if (!EVP_OpenUpdate(rsa_decrypt_ctx, env->out.m_rmsg + env->m_out_len,
                &blk_len, env->in.m_rmsg, (int)env->m_in_len)) {
        report_error();
        goto out;
    }
    env->m_out_len += blk_len;
    if (!EVP_OpenFinal(rsa_decrypt_ctx, env->out.m_rmsg + env->m_out_len, &blk_len)) {
        report_error();
        goto out;
    }
    rt = Crypto::ok;
    env->m_out_len += blk_len;
    env->out.m_msg[env->m_out_len] = '\0';

out:
    EVP_CIPHER_CTX_cleanup(rsa_decrypt_ctx);
    pthread_mutex_unlock(usr_mtx);

    EVP_PKEY_free(kp);
    return rt;
}

std::string *
UserCrypto::rsa_decrypt_envelope(const crypto::EnvelopeKey &key,
        const std::string &iv, const std::string &mesg)
{
    if (rsa_privkey == nullptr) {
        return nullptr;
    }
    auto *privkey = rsa_privkey;
    auto kp = read_rsa_privkey(*privkey);

    if (kp == nullptr) {
        return nullptr;
    }
    auto blk_len  = 0;
    auto out_len  = 0;
    auto ekey     = key.env_key();
    auto decrypt  = new std::string(mesg.length() + EVP_MAX_IV_LENGTH, '\0');
    auto iv_ptr   = reinterpret_cast<const uint8_t *>(&iv[0]);
    auto ekey_ptr = reinterpret_cast<const uint8_t *>(&ekey[0]);
    auto mesg_ptr = reinterpret_cast<const uint8_t *>(&mesg[0]);
    auto dec_ptr  = reinterpret_cast<uint8_t *>(&(*decrypt)[0]);

    pthread_mutex_lock(usr_mtx);
    if (!EVP_OpenInit(rsa_decrypt_ctx, EVP_aes_256_cbc(),
                ekey_ptr, ekey.length(), iv_ptr, kp)) {
        delete [] decrypt;
        decrypt = nullptr;
        goto out;
    }
    if (!EVP_OpenUpdate(rsa_decrypt_ctx, dec_ptr, &blk_len, mesg_ptr, mesg.length())) {
        delete [] decrypt;
        decrypt = nullptr;
        goto out;
    }
    out_len += blk_len;
    if (!EVP_OpenFinal(rsa_decrypt_ctx, dec_ptr + out_len, &blk_len)) {
        delete [] decrypt;
        decrypt = nullptr;
        goto out;
    }
    out_len += blk_len;
    decrypt->resize(out_len);

out:
    EVP_CIPHER_CTX_cleanup(rsa_decrypt_ctx);
    pthread_mutex_unlock(usr_mtx);

    EVP_PKEY_free(kp);
    return decrypt;
}

/**
 * rsa_sign
 * --------
 */
Crypto::status
UserCrypto::rsa_sign(crypto::SignedMessage *mesg)
{
    if (rsa_privkey == nullptr) {
        return Crypto::failure;
    }
    crypto::SignedMessage out;
    auto key = rsa_privkey;
    auto ret = rsa_sign(mesg, &out, *key);

    if (ret == Crypto::ok) {
        mesg->set_allocated_signature(out.release_signature());
        mesg->set_allocated_mesg_hash(out.release_mesg_hash());
    }
    return ret;
}

Crypto::status
UserCrypto::rsa_sign(const crypto::SignedMessage *mesg,
        crypto::SignedMessage *out, const std::string &key)
{
    uint32_t sig_len;
    auto bio = BIO_new_mem_buf(const_cast<char *>(key.data()), key.length());
    auto rsa = PEM_read_bio_RSAPrivateKey(bio, nullptr, nullptr, nullptr);
    BIO_free_all(bio);

    if (rsa == nullptr) {
        return Crypto::failure;
    }
    auto signature = new std::string(RSA_size(rsa), '\0');
    auto mesg_hash = new std::string(SHA_DIGEST_LENGTH, '\0');

    auto src  = mesg->message();
    auto spt  = reinterpret_cast<const uint8_t *>(src.data());
    auto sig  = reinterpret_cast<uint8_t *>(&(*signature)[0]);
    auto hash = reinterpret_cast<uint8_t *>(&(*mesg_hash)[0]);
    auto src_len = static_cast<uint32_t>(src.length());

    SHA1(spt, src_len, hash);
    if (RSA_sign(NID_sha1, hash, SHA_DIGEST_LENGTH, sig, &sig_len, rsa) > 0) {
        assert(sig_len <= signature->length());
        signature->resize(sig_len);
        RSA_free(rsa);
        out->set_allocated_signature(signature);
        out->set_allocated_mesg_hash(mesg_hash);
        return Crypto::ok;
    }
    RSA_free(rsa);
    return Crypto::failure;
}

std::string *
UserCrypto::rsa_sign(uint64_t key_ver, const std::string &in, std::string **hash)
{
    crypto::SignedMessage mesg;

    mesg.set_message(in);
    mesg.set_cipher("RSA");
    mesg.set_uuid(usr_uuid);
    mesg.set_key_version(key_ver);

    Crypto::status ret = rsa_sign(&mesg);
    if (ret != Crypto::ok) {
        *hash = nullptr;
        return nullptr;
    }
    *hash = mesg.release_mesg_hash();
    return mesg.release_signature();
}

/**
 * rsa_verify_signature
 * --------------------
 */
Crypto::status
UserCrypto::rsa_verify_signature(uint64_t kver, crypto::SignedMessage *mesg)
{
    std::string *hash;
    auto *key = reinterpret_cast<std::string *>(rsa_pubkeys.value(kver));
    auto  ret = rsa_verify_signature(mesg, &hash, *key);

    if (ret == Crypto::ok) {
        mesg->set_allocated_mesg_hash(hash);
    }
    return ret;
}

Crypto::status
UserCrypto::rsa_verify_signature(const crypto::SignedMessage *mesg,
        std::string **hash_out, const std::string &pubkey)
{
    auto bio = BIO_new_mem_buf(const_cast<char *>(pubkey.data()), pubkey.length());
    auto rsa = PEM_read_bio_RSA_PUBKEY(bio, nullptr, nullptr, nullptr);
    BIO_free_all(bio);

    if (rsa == nullptr) {
        printf("Failed to read rsa pub key\n");
        return Crypto::failure;
    }
    auto signature = mesg->signature();
    auto mesg_hash = new std::string(SHA_DIGEST_LENGTH, '\0');
    *hash_out = mesg_hash;

    auto src  = mesg->message();
    auto spt  = reinterpret_cast<const uint8_t *>(src.data());
    auto sig  = reinterpret_cast<uint8_t *>(&signature[0]);
    auto hash = reinterpret_cast<uint8_t *>(&(*mesg_hash)[0]);
    auto src_len = static_cast<uint32_t>(src.length());
    auto sig_len = static_cast<uint32_t>(signature.length());

    SHA1(spt, src_len, hash);
    if (RSA_verify(NID_sha1, hash, SHA_DIGEST_LENGTH, sig, sig_len, rsa) == 1) {
        RSA_free(rsa);
        return Crypto::ok;
    }
    RSA_free(rsa);
    return Crypto::failure;
}

Crypto::status
UserCrypto::rsa_verify_signature(uint64_t key_ver, std::string **hash,
        const std::string &in, std::string *signature)
{
    crypto::SignedMessage mesg;

    mesg.set_message(in);
    mesg.set_cipher("RSA");
    mesg.set_uuid(usr_uuid);
    mesg.set_key_version(key_ver);
    mesg.set_allocated_signature(signature);

    if (rsa_verify_signature(key_ver, &mesg) == Crypto::ok) {
        *hash = mesg.release_mesg_hash();
        mesg.release_signature();
        return Crypto::ok;
    }
    *hash = nullptr;
    mesg.release_signature();
    return Crypto::failure;
}

/**
 * get_public_key
 * --------------
 */
bool
UserCrypto::get_public_key(uint64_t ver, std::string *key)
{
    pthread_mutex_lock(usr_mtx);
    auto *rec = reinterpret_cast<std::string *>(rsa_pubkeys.value(ver));
    pthread_mutex_unlock(usr_mtx);

    if (rec != nullptr) {
        *key = *rec;
        return true;
    }
    key->clear();
    return false;
}

/**
 * get_all_pub_keys
 * ----------------
 */
bool
UserCrypto::get_all_pub_keys(std::vector<Crypto::KeyVer::ptr> *krec)
{
    pthread_mutex_lock(usr_mtx);
    for (auto it = rsa_pubkeys.begin(); it != rsa_pubkeys.end(); it++) {
        auto *pub = new std::string(*reinterpret_cast<std::string *>(it.value()));
        auto  ver = it.key();

        Crypto::KeyVer::ptr rec = new Crypto::KeyVer(ver, *pub);
        krec->push_back(rec);
        delete pub;
    }
    pthread_mutex_unlock(usr_mtx);
    return true;
}

/**
 * put_public_key
 * --------------
 */
void
UserCrypto::put_public_key(uint64_t ver, const std::string &key)
{
    pthread_mutex_lock(usr_mtx);
    auto *rec = reinterpret_cast<std::string *>(rsa_pubkeys.value(ver));
    if (rec == nullptr) {
        rsa_pubkeys.insert(ver, new std::string(key));
    } else {
        assert(rec->compare(key) == 0);
    }
    pthread_mutex_unlock(usr_mtx);
}

/**
 * put_all_pub_keys
 * ----------------
 */
void
UserCrypto::put_all_pub_keys(const std::vector<Crypto::KeyVer::ptr> *krec)
{
    pthread_mutex_lock(usr_mtx);
    for (auto it : *krec) {
        auto *rec = reinterpret_cast<std::string *>(rsa_pubkeys.value(it->k_ver));
        if (rec == nullptr) {
            rsa_pubkeys.insert(it->k_ver, new std::string(it->k_public));
        } else {
            assert(rec->compare(it->k_public) == 0);
        }
    }
    pthread_mutex_unlock(usr_mtx);
}

/**
 * put_key_pair
 * ------------
 */
void
UserCrypto::put_key_pair(uint64_t ver, const std::string &pub, const std::string &priv)
{
    auto *privkey = new std::string(priv);

    pthread_mutex_lock(usr_mtx);
    if (rsa_privkey != nullptr) {
        delete rsa_privkey;
    }
    rsa_privkey = privkey;
    auto *rec = reinterpret_cast<std::string *>(rsa_pubkeys.value(ver));
    if (rec == nullptr) {
        rsa_pubkeys.insert(ver, new std::string(pub));
    } else {
        assert(rec->compare(pub) == 0);
    }
    pthread_mutex_unlock(usr_mtx);
}

/**
 * creat_aes_ctx
 * -------------
 */
Crypto::status
UserCrypto::creat_aes_ctx(int max_keys)
{
    return Crypto::ok;
}

/**
 * gen_aes_key
 * -----------
 */
Crypto::status
UserCrypto::gen_aes_key(uint64_t key_ver, std::string *aes_key)
{
    return Crypto::ok;
}

/**
 * get_aes_key
 * -----------
 */
Crypto::status
UserCrypto::get_aes_key(uint64_t key_ver, std::string *aes_key)
{
    return Crypto::ok;
}

/**
 * to_base64
 * ---------
 */
char *
UserCrypto::to_base64(const char *in, int len)
{
    auto size = (int)(4 * ceil((double)len / 3));
    auto buff = new char [size + 1];
    auto stream = fmemopen(buff, size + 1, "w");
    auto b64 = BIO_new(BIO_f_base64());
    auto bio = BIO_new_fp(stream, BIO_NOCLOSE);

    bio = BIO_push(b64, bio);
    BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);
    BIO_write(bio, in, len);

    (void)BIO_flush(bio);
    BIO_free_all(bio);
    fclose(stream);

    return buff;
}

/**
 * from_base64
 * -----------
 */
int
UserCrypto::from_base64(const char *base64, char **out)
{
    return 0;
}

/**
 * to_base16
 * ---------
 */
char *
UserCrypto::to_base16(const char *in, int len)
{
    static const char hexmap[] = {
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
    };
    auto size = (len * 2) + 1;
    auto buff = new char [size];
    auto curr = buff;

    for (auto i = 0; i < len; i++) {
        *curr++ = hexmap[((uint8_t)in[i]) >> 4];
        *curr++ = hexmap[((uint8_t)in[i]) & 0xf];
    }
    *curr = '\0';
    return buff;
}

/**
 * from_base16
 * -----------
 */
int
UserCrypto::from_base16(const char *base16, char **out)
{
    return 0;
}

/**
 * report_error
 * ------------
 */
void
UserCrypto::report_error()
{
    if (err_buff == nullptr) {
        err_buff = new char [130];
    }
    auto err = ERR_get_error();
    ERR_error_string(err, err_buff);
    s_log.error("%s", err_buff);
}

static void log_error()
{
    char err_buff[130];
    auto err = ERR_get_error();
    ERR_error_string(err, err_buff);
    s_log.error("%s", err_buff);
}

/**
 * create_rsa
 * ----------
 */
RSA *
UserCrypto::create_rsa(const std::string &key, bool pub)
{
    RSA *rsa = nullptr;
    auto *keybio = BIO_new_mem_buf(
            reinterpret_cast<uint8_t *>(const_cast<char *>(&key[0])), -1);

    if (keybio == nullptr) {
        s_log.error("Failed to create key BIO");
        return rsa;
    }
    if (pub == true) {
        rsa = PEM_read_bio_RSA_PUBKEY(keybio, &rsa, nullptr, nullptr);
    } else {
        rsa = PEM_read_bio_RSAPrivateKey(keybio, &rsa, nullptr, nullptr);
    }
    return rsa;
}

/**
 * rsa_public_do
 * -------------
 */
int
UserCrypto::rsa_public_do(bool encrypt, const std::string &in,
        const std::string &pub, std::string *out)
{
    int   len = 0;
    auto *rsa = create_rsa(pub, true);
    out->resize(RSA_size(rsa));

    if (encrypt == true) {
        len = RSA_public_encrypt(in.size(),
                reinterpret_cast<uint8_t *>(const_cast<char *>(&in[0])),
                reinterpret_cast<uint8_t *>(&(*out)[0]), rsa, RSA_PKCS1_OAEP_PADDING);
    } else {
        len = RSA_public_decrypt(in.size(),
                reinterpret_cast<uint8_t *>(const_cast<char *>(&in[0])),
                reinterpret_cast<uint8_t *>(&(*out)[0]), rsa, RSA_PKCS1_PADDING);
    }
    if (len < out->size()) {
        out->resize(len);
    } else if (len != out->size()) {
        log_error();
        assert(len == out->size());
    }
    RSA_free(rsa);
    return len;
}

/**
 * rsa_private_do
 * --------------
 */
int
UserCrypto::rsa_private_do(bool encrypt, const std::string &in,
        const std::string &priv, std::string *out)
{
    int   len = 0;
    auto *rsa = create_rsa(priv, false);
    out->resize(RSA_size(rsa));

    if (encrypt == true) {
        len = RSA_private_encrypt(in.size(),
            reinterpret_cast<uint8_t *>(const_cast<char *>(&in[0])),
            reinterpret_cast<uint8_t *>(&(*out)[0]), rsa, RSA_PKCS1_PADDING);
    } else {
        len = RSA_private_decrypt(in.size(),
            reinterpret_cast<uint8_t *>(const_cast<char *>(&in[0])),
            reinterpret_cast<uint8_t *>(&(*out)[0]), rsa, RSA_PKCS1_OAEP_PADDING);
    }
    if (len < out->size()) {
        out->resize(len);
    } else if (len != out->size()) {
        log_error();
        assert(len == out->size());
    }
    RSA_free(rsa);
    return len;
}

/**
 * sha1
 * ----
 */
void
UserCrypto::sha1(const std::string &in, uint8_t out[])
{
}

/**
 * sha256
 * ------
 */
void
UserCrypto::sha256(const std::string &in, uint8_t out[])
{
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, in.c_str(), in.size());
    SHA256_Final(out, &sha256);
}
