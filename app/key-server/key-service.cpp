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
#include <util/uuid.h>
#include <di/logger.h>
#include <key-server.h>
#include <db/leveldb.h>
#include <crypto/user.h>
#include <key-server-db.h>

LOGGER_STATIC_DECL(s_log);

KeyServer::KeyServer() : cnt_gen(0), cnt_query(0), cnt_sign(0), db(nullptr) {}
KeyServer::~KeyServer() { db = nullptr; }

/**
 * mod_startup
 * -----------
 */
void
KeyServer::mod_startup()
{
    db = KeyServerDb::alloc(USER_KEY_DB);
}

/**
 * mod_shutdown
 * ------------
 */
void
KeyServer::mod_shutdown()
{
    db = nullptr;
}

/**
 * db_command
 * ----------
 */
grpc::Status
KeyServer::db_command(grpc::ServerContext *ctx,
        const crypto::DbCommand *reqt, crypto::DbCommand *resp)
{
#if 0
    const char *file = "/tmp/key-db.txt";
    printf("Dump out db content to %s\n", file);

    auto fp = fopen(file, "w");
    if (fp == nullptr) {
        printf("Can't open file %s\n", file);
        return grpc::Status::OK;
    }
    auto it = db->get_db_iter();
    for (it->seek_to_first(); it->valid(); it->next()) {
        std::string key, val;

        it->get_key_str(&key);
        it->get_value_str(&val);

        kdb::UserKey rkey;
        if ((rkey.ParseFromString(key) == true) &&
            (rkey.prefix() == kdb::DbPrefix::USER_KEY)) {
            crypto::UserPrivKey rec;

            rec.ParseFromString(val);
            auto user = rec.user();
            fprintf(fp, "0x%llx: %s\n", user.uuid(), user.pub_key().c_str());
            continue;
        }
        kdb::UuidKey ukey;
        if ((ukey.ParseFromString(key) == true) &&
            (ukey.prefix() == kdb::DbPrefix::USER_UUID)) {
            kdb::UuidKeyVers key_vers;

            key_vers.ParseFromString(val);
            fprintf(fp, "Key ver 0x%llx: ", ukey.uuid());
            auto lim = key_vers.key_vers_size();
            for (int i = 0; i < lim; i++) {
                fprintf(fp, "0x%llx ", key_vers.key_vers(0));
            }
            fprintf(fp, "\n");
            continue;
        }
        fprintf(fp, "Unknown key format: %s\n", key.c_str());
    }
    fclose(fp);
#endif
    return grpc::Status::OK;
}

/**
 * generate_key
 * ------------
 */
grpc::Status
KeyServer::generate_key(grpc::ServerContext *ctx,
        const crypto::KeyReqt *reqt, crypto::PubKeyResp *resp)
{
    static bo::atomic_int count(0);
    auto uuid = reqt->uuid();
    auto kver = reqt->key_ver_lo();

    count++;
    if ((count.load() % 1000) == 0) {
        printf("Process %d key gen requests\n", count.load());
    }
    std::string *privkey, *pubkey;
    auto ret = UserCrypto::gen_rsa_kp(&privkey, &pubkey);

    if (ret != Crypto::ok) {
        s_log.error("Failed to create keys for 0x%llx", uuid);
        return grpc::Status::OK;
    }
    auto rec = resp->add_pub_keys();
    rec->set_uuid(uuid);
    rec->set_key_version(kver);
    rec->set_pub_key(*pubkey);

    auto res = db->save_account(uuid, kver, 10, privkey, pubkey);
    if (res == false) {
        s_log.error("Failed to save kp for 0x%llx to db", uuid);
    }
    return grpc::Status::OK;
}

/**
 * query_pub_key
 * -------------
 */
grpc::Status
KeyServer::query_pub_key(grpc::ServerContext *ctx,
        const crypto::KeyReqt *reqt, crypto::PubKeyResp *resp)
{
    auto uuid = reqt->uuid();
    auto kver = reqt->key_ver_lo();
    std::string *privkey, *pubkey;

    auto ret = db->query_account_key(uuid, kver, &privkey, &pubkey);
    if (ret == false) {
        s_log.error("Failed to query account uuid 0x%llx, ver 0x%llx", uuid, kver);
        return grpc::Status::OK;
    }
    if (pubkey != nullptr) {
        auto rec = resp->add_pub_keys();
        rec->set_uuid(uuid);
        rec->set_key_version(kver);
        rec->set_allocated_pub_key(pubkey);
        delete privkey;
    }
    return grpc::Status::OK;
}

/**
 * sign_mesg
 * ---------
 */
grpc::Status
KeyServer::sign_mesg(grpc::ServerContext *ctx,
        const crypto::SignedMessage *reqt, crypto::SignedMessage *resp)
{
    static bo::atomic_int count(0);
    count++;
    if ((count.load() % 1000) == 0) {
        printf("Process %d message signing requests\n", count.load());
    }
    auto uuid = reqt->uuid();
    auto kver = reqt->key_version();
    std::string *privkey, *pubkey;

    auto ret = db->query_account_key(uuid, kver, &privkey, &pubkey);
    if (ret == false) {
        s_log.error("Sign failed, account uuid 0x%llx, ver 0x%llx", uuid, kver);
        return grpc::Status::OK;
    }
    auto status = UserCrypto::rsa_sign(reqt, resp, *privkey);
    delete pubkey;
    delete privkey;

    if (status == Crypto::failure) {
        s_log.error("Crypto signed failed, uuid 0x%llx, ver 0x%llx", uuid, kver);
        return grpc::Status::OK;
    }
    resp->set_uuid(reqt->uuid());
    resp->set_key_version(reqt->key_version());

    return grpc::Status::OK;
}

/**
 * save_key_pair
 * -------------
 */
grpc::Status
KeyServer::save_key_pair(grpc::ServerContext *ctx,
        const crypto::UserPrivKey *reqt, crypto::UserKeyRecord *resp)
{
    auto &user     = reqt->user();
    auto *priv_key = new std::string(reqt->priv_key());
    auto *pub_key  = new std::string(user.pub_key());

    auto uuid = user.uuid();
    auto kver = user.key_version();
    if (!db->save_account(uuid, kver, 0, priv_key, pub_key)) {
        s_log.error("Failed to save pub/priv key 0x%llx, uuid 0x%llx", uuid, kver);
    }
    return grpc::Status::OK;
}

/**
 * list_public_keys
 * ----------------
 */
grpc::Status
KeyServer::list_public_keys(grpc::ServerContext *ctx,
        const crypto::KeyReqt *reqt, crypto::UserKeyRecord *resp)
{
    kdb::UserKey ukey;
    std::string  key, val;

    auto uuid = reqt->uuid();
    auto kver = reqt->key_ver_lo();
    resp->set_uuid(uuid);

    ukey.set_uuid(uuid);
    ukey.set_key_version(kver);
    ukey.set_prefix(kdb::DbPrefix::USER_UUID);
    ukey.SerializeToString(&key);

    auto it = db->get_db_iter();
    for (it->seek(key); it->valid(); it->next()) {
        it->get_key_str(&key);
        it->get_value_str(&val);

        if ((ukey.ParseFromString(key) != true) || (ukey.uuid() != uuid)) {
            break;
        }
        crypto::UserPrivKey rec;
        if (rec.ParseFromString(val) == false) {
            s_log.error("Parse db value failed uuid 0x%llx, kver 0x%llx", uuid, kver);
            break;
        }
        auto *db_rec  = rec.mutable_user();
        auto *pub_rec = resp->add_key_info();
        pub_rec->set_key_ver(db_rec->key_version());
        pub_rec->set_allocated_pub_key(db_rec->release_pub_key());
    }
    return grpc::Status::OK;
}

/**
 * list_all_acct
 * -------------
 */
grpc::Status
KeyServer::list_all_acct(grpc::ServerContext *ctx,
        const crypto::AllUserRecReqt *reqt, crypto::AllUserRecords *resp)
{
    uint32_t cnt = 0;
    uint64_t uid = 0;
    kdb::UuidKey ukey;
    std::string  key, val;

    ukey.set_uuid(reqt->uuid_start());
    ukey.set_prefix(kdb::DbPrefix::USER_UUID);
    ukey.SerializeToString(&key);

    auto it = db->get_db_iter();
    for (it->seek(key); it->valid(); it->next()) {
        it->get_key_str(&key);
        it->get_value_str(&val);

        if ((ukey.ParseFromString(key) != true) ||
            (ukey.prefix() != kdb::DbPrefix::USER_UUID)) {
            break;
        }
        kdb::UuidKeyVers db_rec;
        db_rec.ParseFromString(val);

        auto *rt_user = resp->add_account();
        uid = ukey.uuid();
        rt_user->set_uuid(uid);

        auto lim = db_rec.key_vers_size();
        for (auto i = 0; i < lim; i++) {
            auto *rt_keys = rt_user->add_key_info();
            rt_keys->set_key_ver(db_rec.key_vers(i));

            /* Retrieve the public key. */
            std::string *privkey, *pubkey;
            if (db->query_account_key(uid, db_rec.key_vers(i), &privkey, &pubkey)) {
                rt_keys->set_allocated_pub_key(pubkey);
                delete privkey;
            }
        }
        if (cnt == 0) {
            resp->set_uuid_start(uid);
        }
        cnt++;
    }
    resp->set_uuid_total(cnt);
    resp->set_uuid_end(uid);

    return grpc::Status::OK;
}
