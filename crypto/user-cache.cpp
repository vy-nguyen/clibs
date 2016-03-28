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
#include "user-cache.h"
#include "crypto-client.h"

struct KeyVerSerial
{
    std::string  k_serialize;

    KeyVerSerial(uint64_t uuid, uint64_t ver)
    {
        k_serialize.resize(2 * sizeof(uint64_t));
        auto *ptr = reinterpret_cast<uint64_t *>(&k_serialize[0]);
        ptr[0] = uuid;
        ptr[1] = ver;
    }

    static uint64_t deserialize(const std::string &in, uint64_t *ver)
    {
        auto *ptr = reinterpret_cast<const uint64_t *>(&in[0]);
        *ver = ptr[1];
        return ptr[0];
    }
};

/**
 * get_user
 * --------
 */
void
UserLruCache::get_user(uint64_t uuid, uint64_t key_ver, lru_str_cb cb)
{
    auto ret = get_user(uuid);
    cb(this, ret, KeyVerSerial(uuid, key_ver).k_serialize);
}

/**
 * get_public_key
 * --------------
 */
bool
UserLruCache::get_public_key(uint64_t uuid, uint64_t ver, std::string *key)
{
    auto user = get_user(uuid, ver);
    if (user != nullptr) {
        return user->get_public_key(ver, key);
    }
    key->clear();
    return false;
}

void
UserLruCache::get_public_key(uint64_t uuid, uint64_t ver, lru_str_cb cb)
{
    std::string key;

    if (get_public_key(uuid, ver, &key) == true) {
        cb(this, get_user(uuid), key);
    } else {
        key.clear();
        cb(this, nullptr, key);
    }
}

/**
 * get_all_pub_keys
 * ----------------
 */
bool
UserLruCache::get_all_pub_keys(uint64_t uuid, std::vector<Crypto::KeyVer::ptr> *krec)
{
    auto user = get_user(uuid);
    if (user != nullptr) {
        return user->get_all_pub_keys(krec);
    }
    krec->clear();
    return false;
}

/**
 * lookup_missed
 * -------------
 * Do nothing, let the caller take care of cache miss.
 */
LruObj::ptr
UserLruCache::lookup_missed(uint64_t uuid)
{
    return cryp_mod->alloc_user(uuid);
}

LruObj::ptr
UserLruCache::lookup_missed(const std::string &key)
{
    uint64_t uuid, kver;

    uuid = KeyVerSerial::deserialize(key, &kver);
    return cryp_mod->alloc_user(uuid);
}

/**
 * async lookup
 * ------------
 */
void
UserLruCache::lookup_missed(uint64_t uuid, lru_u64_cb cb)
{
    cb(this, lookup_missed(uuid), uuid);
}

void
UserLruCache::lookup_missed(const std::string &key, lru_str_cb cb)
{
    cb(this, lookup_missed(key), key);
}
