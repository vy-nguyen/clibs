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
#ifndef _CRYPTO_USER_CACHE_H_
#define _CRYPTO_USER_CACHE_H_

#include <crypto/user.h>

class AsyncKeyClient;
class KeyServiceClient;

class UserLruCache : public LruTable
{
  public:
    UserLruCache(int max_elm, Crypto::ptr m) : LruTable(max_elm), cryp_mod(m) {}

    inline UserCrypto::ptr get_user(uint64_t uuid) {
        return object_cast<UserCrypto>(lookup(uuid));
    }
    inline UserCrypto::ptr get_user(uint64_t uuid, uint64_t key_ver) {
        return object_cast<UserCrypto>(lookup(uuid));
    }

    void get_user(uint64_t uuid, uint64_t key_ver, lru_str_cb cb);

    bool get_public_key(uint64_t uuid, uint64_t ver, std::string *key);
    void get_public_key(uint64_t uuid, uint64_t ver, lru_str_cb cb);
    bool get_all_pub_keys(uint64_t uuid, std::vector<Crypto::KeyVer::ptr> *krec);

    LruObj::ptr lookup_missed(uint64_t uuid) override;
    LruObj::ptr lookup_missed(const std::string &key) override;

    void lookup_missed(uint64_t uuid, lru_u64_cb cb) override;
    void lookup_missed(const std::string &key, lru_str_cb cb) override;

  protected:
    Crypto::ptr         cryp_mod;
};

#endif /* _CRYPTO_USER_CACHE_H_ */
