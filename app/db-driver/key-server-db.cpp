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
#include <key-db.pb.h>
#include <crypto/types.pb.h>
#include <key-server-db.h>
#include <di/logger.h>

LOGGER_STATIC_DECL(s_log);

KeyServerDb::KeyServerDb(const char *db) : db_name(db)
{
    db_inst = KeyValDb::getInstance(USER_KEY_DB);
    if (db_inst == nullptr) {
        printf("You need to include module %s\n", USER_KEY_DB);
        exit(1);
    }
}

/**
 * save_account
 * ------------
 */
bool
KeyServerDb::save_account(uint64_t uuid, uint64_t key_ver, int max_keys,
        std::string *given_privkey, std::string *given_pubkey)
{
    kdb::UuidKey      vkey;
    kdb::UuidKeyVers  uver;

    vkey.set_prefix(kdb::DbPrefix::USER_UUID);
    vkey.set_uuid(uuid);

    db_inst->read<kdb::UuidKey, kdb::UuidKeyVers>(vkey, &uver);
    uver.add_key_vers(key_ver);

    kdb::UserKey ukey;
    ukey.set_prefix(kdb::DbPrefix::USER_KEY);
    ukey.set_uuid(uuid);
    ukey.set_key_version(key_ver);

    crypto::UserPrivKey rec;
    auto user = rec.mutable_user();
    user->set_uuid(uuid);
    user->set_key_version(key_ver);
    user->set_allocated_pub_key(given_pubkey);
    rec.set_allocated_priv_key(given_privkey);

    auto trans = db_inst->alloc_batch();
    trans->put<kdb::UuidKey, kdb::UuidKeyVers>(vkey, uver);
    trans->put<kdb::UserKey, crypto::UserPrivKey>(ukey, rec);
    db_inst->write_batch(trans);

    return true;
}

/**
 * remove_account
 * --------------
 */
bool
KeyServerDb::remove_account(uint64_t uuid, std::vector<crypto::UserPrivKey *> *out)
{
    int max_keys;

    auto trans = db_inst->alloc_batch();
    for (auto it = query_account(uuid, &max_keys); it->valid(); it->next()) {
        if (out != nullptr) {
            crypto::UserPrivKey *rec = new crypto::UserPrivKey();
            it->get_value<crypto::UserPrivKey>(rec);
            out->push_back(rec);
        }
        std::string key;
        it->get_key_str(&key);
        trans->kv_delete(key);
    }
    db_inst->write_batch(trans);
    return true;
}

struct AcctIterPlugin : public KvIterPlugin
{
    std::string    ref_key;

    AcctIterPlugin() {}
    bool valid_key(const std::string &key) override
    {
        if (ref_key.compare(key) == 0) {
            return true;
        }
        return false;
    }

    OBJECT_PTR_DEFS(AcctIterPlugin);
};

/**
 * query_account
 * -------------
 */
KeyValIterator::ptr
KeyServerDb::query_account(uint64_t uuid, int *max_keys)
{
    kdb::UuidKey     vkey;
    kdb::UuidKeyVers key_vers;

    vkey.set_prefix(kdb::DbPrefix::USER_UUID);
    vkey.set_uuid(uuid);
    db_inst->read<kdb::UuidKey, kdb::UuidKeyVers>(vkey, &key_vers);
    *max_keys = key_vers.key_vers_size();

    KeyValIterator::ptr it = db_inst->alloc_iterator();
    AcctIterPlugin::ptr ap = new AcctIterPlugin();

    kdb::UserKey seek;
    seek.set_prefix(kdb::DbPrefix::USER_KEY);
    seek.set_uuid(uuid);
    seek.set_key_version(0);
    seek.SerializeToString(&ap->ref_key);
    it->assign_plugin(ap);

    it->seek(ap->ref_key);
    if (it->valid()) {
        return it;
    }
    *max_keys = 0;
    return nullptr;
}

/**
 * query_account_key
 * -----------------
 */
bool
KeyServerDb::query_account_key(uint64_t uuid, uint64_t key_ver,
        std::string **privkey, std::string **pubkey)
{
    kdb::UserKey         key;
    crypto::UserPrivKey  rec;

    key.set_prefix(kdb::DbPrefix::USER_KEY);
    key.set_uuid(uuid);
    key.set_key_version(key_ver);

    if (db_inst->read<kdb::UserKey, crypto::UserPrivKey>(key, &rec) == false) {
        *pubkey  = nullptr;
        *privkey = nullptr;
        return false;
    }
    auto usr = rec.mutable_user();
    *pubkey  = usr->release_pub_key();
    *privkey = rec.release_priv_key();
    return true;
}

/**
 * query_key_vers
 * --------------
 */
bool
KeyServerDb::query_key_vers(uint64_t uuid, std::vector<uint64_t> &key_ver)
{
    kdb::UuidKey     key;
    kdb::UuidKeyVers vers;

    key.set_prefix(kdb::DbPrefix::USER_UUID);
    key.set_uuid(uuid);

    if (db_inst->read<kdb::UuidKey, kdb::UuidKeyVers>(key, &vers) == false) {
        return false;
    }
    auto lim = vers.key_vers_size();
    for (auto i = 0; i < lim; i++) {
        key_ver.push_back(vers.key_vers(i));
    }
    return true;
}
