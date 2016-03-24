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
#ifndef _INCLUDE_KEY_SERVER_H_
#define _INCLUDE_KEY_SERVER_H_

#include <grpc++/grpc++.h>
#include <crypto/types.pb.h>
#include <crypto/types.grpc.pb.h>
#include <key-db.pb.h>
#include <db/kv-db.h>
#include <di/module.h>
#include <util/async-rpc.h>

/**
 * ------------------------------------------------------------------------------------
 * Synch server.
 * ------------------------------------------------------------------------------------
 */
#define KEY_SERVER_MOD           "KeyServer"

class KeyServerDb;
class KeyServerModule;
class KeyServer final : public crypto::KeyService::Service
{
  public:
    KeyServer();
    ~KeyServer();

    grpc::Status
    db_command(grpc::ServerContext *ctx,
            const crypto::DbCommand *reqt, crypto::DbCommand *resp) override;

    grpc::Status
    generate_key(grpc::ServerContext *ctx,
            const crypto::KeyReqt *reqt, crypto::PubKeyResp *resp) override;

    grpc::Status
    query_pub_key(grpc::ServerContext *ctx,
            const crypto::KeyReqt *reqt, crypto::PubKeyResp *resp) override;

    grpc::Status
    sign_mesg(grpc::ServerContext *ctx,
            const crypto::SignedMessage *reqt, crypto::SignedMessage *resp) override;

    grpc::Status
    save_key_pair(grpc::ServerContext *ctx,
            const crypto::UserPrivKey *reqt, crypto::UserKeyRecord *resp) override;

    grpc::Status
    list_public_keys(grpc::ServerContext *ctx,
            const crypto::KeyReqt *reqt, crypto::UserKeyRecord *resp) override;

    grpc::Status
    list_all_acct(grpc::ServerContext *ctx,
            const crypto::AllUserRecReqt *reqt, crypto::AllUserRecords *resp) override;

  protected:
    friend class ModuleMixin<KeyServer>;

    bo::atomic_int                  cnt_gen;
    bo::atomic_int                  cnt_query;
    bo::atomic_int                  cnt_sign;
    bo::intrusive_ptr<KeyServerDb>  db;

    /**
     * Hookup with module's methods.
     */
    void mod_startup();
    void mod_shutdown();
    void mod_init() {}
    void mod_cleanup() {}
    void mod_enable_service() {}
    void mod_disable_service() {}
};

class KeyServerModule : public ModuleMixin<KeyServer>
{
  public:
    OBJECT_COMMON_DEFS(KeyServerModule);
    MODULE_MIXIN_GET_INSTANCE(KeyServer, KEY_SERVER_MOD);

  protected:
    KeyServerModule() : ModuleMixin(KEY_SERVER_MOD) {}
};

/**
 * ------------------------------------------------------------------------------------
 * Async requests/response plugins for server.
 * The client is defined in crypto-client.h
 * ------------------------------------------------------------------------------------
 */
SERVER_REQUEST_DECL(DbCommandReqt,
        crypto::KeyService::AsyncService,
        crypto::DbCommand, crypto::DbCommand, db_command, KeyServer);

SERVER_REQUEST_DECL(GenKeyRequest,
        crypto::KeyService::AsyncService,
        crypto::KeyReqt, crypto::PubKeyResp, generate_key, KeyServer);

SERVER_REQUEST_DECL(QueryKeyRequest,
        crypto::KeyService::AsyncService,
        crypto::KeyReqt, crypto::PubKeyResp, query_pub_key, KeyServer);

SERVER_REQUEST_DECL(SignedMesgRequest,
        crypto::KeyService::AsyncService,
        crypto::SignedMessage, crypto::SignedMessage, sign_mesg, KeyServer);

SERVER_REQUEST_DECL(SaveKPairRequest,
        crypto::KeyService::AsyncService,
        crypto::UserPrivKey, crypto::UserKeyRecord, save_key_pair, KeyServer);

SERVER_REQUEST_DECL(ListPulicKeysRequest,
        crypto::KeyService::AsyncService,
        crypto::KeyReqt, crypto::UserKeyRecord, list_public_keys, KeyServer);

SERVER_REQUEST_DECL(ListAllAcctRequest,
        crypto::KeyService::AsyncService,
        crypto::AllUserRecReqt, crypto::AllUserRecords, list_all_acct, KeyServer);

/**
 * Async key server
 */
class AsyncKeyServer final : public ServerAsync
{
  public:
    explicit AsyncKeyServer(const std::string &adr) :
        k_addr(adr), k_db(nullptr), k_hdler(nullptr) {}

    void register_requests() override;
    void start_server() override;

    void *get_handler() override {
        return k_hdler;
    }

  protected:
    std::string                         k_addr;
    KeyValDb::ptr                       k_db;
    crypto::KeyService::AsyncService    k_service;
    KeyServer                          *k_hdler;
};

#endif /* _INCLUDE_KEY_SERVER_H_ */
