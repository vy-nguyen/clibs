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
#ifndef _CRYPTO_CRYPTO_CLIENT_H_
#define _CRYPTO_CRYPTO_CLIENT_H_

#include <memory>
#include <string>
#include <grpc++/grpc++.h>
#include <grpc++/channel.h>
#include <grpc++/client_context.h>
#include <grpc++/create_channel.h>
#include <grpc++/security/credentials.h>

#include <crypto/crypto.h>
#include <crypto/types.grpc.pb.h>
#include <util/async-rpc.h>

class KeyServiceClient
{
  public:
    KeyServiceClient(std::shared_ptr<grpc::Channel> channel) :
        m_chan(crypto::KeyService::NewStub(channel)) {}

    grpc::Status
    db_command(const crypto::DbCommand &in, crypto::DbCommand *out)
    {
        grpc::ClientContext ctx;
        return m_chan->db_command(&ctx, in, out);
    }

    grpc::Status
    generate_key(const crypto::KeyReqt &in, crypto::PubKeyResp *out)
    {
        grpc::ClientContext ctx;
        return m_chan->generate_key(&ctx, in, out);
    }

    grpc::Status
    query_pub_key(const crypto::KeyReqt &in, crypto::PubKeyResp *out)
    {
        grpc::ClientContext ctx;
        return m_chan->query_pub_key(&ctx, in, out);
    }

    grpc::Status
    sign_mesg(const crypto::SignedMessage &in, crypto::SignedMessage *out)
    {
        grpc::ClientContext ctx;
        return m_chan->sign_mesg(&ctx, in, out);
    }

    grpc::Status
    save_key_pair(const crypto::UserPrivKey &in, crypto::UserKeyRecord *out)
    {
        grpc::ClientContext ctx;
        return m_chan->save_key_pair(&ctx, in, out);
    }

    grpc::Status
    list_public_keys(const crypto::KeyReqt &in, crypto::UserKeyRecord *out)
    {
        grpc::ClientContext ctx;
        return m_chan->list_public_keys(&ctx, in, out);
    }

    grpc::Status
    list_all_acct(const crypto::AllUserRecReqt &in, crypto::AllUserRecords *out)
    {
        grpc::ClientContext ctx;
        return m_chan->list_all_acct(&ctx, in, out);
    }

  private:
    std::unique_ptr<crypto::KeyService::Stub>    m_chan;
};

/**
 * ------------------------------------------------------------------------------------
 * Async requests for client.
 * ------------------------------------------------------------------------------------
 */
CLIENT_REQUEST_DECL(DbCommandAsync,
        crypto::KeyService::Stub,
        crypto::DbCommand, crypto::DbCommand,
        Asyncdb_command, Crypto::ptr,
);

CLIENT_REQUEST_DECL(GenKeyAsync,
        crypto::KeyService::Stub,
        crypto::KeyReqt, crypto::PubKeyResp,
        Asyncgenerate_key, Crypto::ptr,
);

CLIENT_REQUEST_DECL(QueryPubKeyAsync,
        crypto::KeyService::Stub,
        crypto::KeyReqt, crypto::PubKeyResp,
        Asyncquery_pub_key, Crypto::ptr,
);

CLIENT_REQUEST_DECL(SignMesgAsync,
        crypto::KeyService::Stub,
        crypto::SignedMessage, crypto::SignedMessage,
        Asyncsign_mesg, Crypto::ptr,
);

CLIENT_REQUEST_DECL(SaveKPairAsync,
        crypto::KeyService::Stub,
        crypto::UserPrivKey, crypto::UserKeyRecord,
        Asyncsave_key_pair, Crypto::ptr,

    Crypto::put_kpair_cbfn  user_cb;
    static void null_cb(Crypto::status, crypto::UserKeyRecord *) {}
);

CLIENT_REQUEST_DECL(ListPubKeysAsync,
        crypto::KeyService::Stub,
        crypto::KeyReqt, crypto::UserKeyRecord,
        Asynclist_public_keys, Crypto::ptr,

    Crypto::pub_keys_cbfn   user_cb;
);

CLIENT_REQUEST_DECL(ListAllAcctAsync,
        crypto::KeyService::Stub,
        crypto::AllUserRecReqt, crypto::AllUserRecords,
        Asynclist_all_acct, Crypto::ptr,
);

/**
 * Async client.
 */
class AsyncKeyClient : public ClientAsync<crypto::KeyService::Stub>
{
  public:
    AsyncKeyClient(std::shared_ptr<grpc::Channel> channel) {
        clnt_stub = crypto::KeyService::NewStub(channel);
    }

    /* Factory methods. */
    inline DbCommandAsync *
    alloc_db_command(Crypto::ptr crypto, const cb_DbCommandAsync &callback) {
        return new DbCommandAsync(this, callback, crypto);
    }

    GenKeyAsync *
    alloc_gen_key(Crypto::ptr crypto, const cb_GenKeyAsync &cb) {
        return new GenKeyAsync(this, cb, crypto);
    }

    QueryPubKeyAsync *
    alloc_query_pub_key(Crypto::ptr crypto, const cb_QueryPubKeyAsync &cb) {
        return new QueryPubKeyAsync(this, cb, crypto);
    }

    SignMesgAsync *
    alloc_sign_mesg(Crypto::ptr crypto, const cb_SignMesgAsync &cb) {
        return new SignMesgAsync(this, cb, crypto);
    }

    SaveKPairAsync *
    alloc_save_key_pair(Crypto::ptr crypto, const Crypto::put_kpair_cbfn &cb)
    {
        auto *ret = new SaveKPairAsync(this, &SaveKPairAsync::null_cb, crypto);
        ret->user_cb = cb;
        return ret;
    }

    ListPubKeysAsync *
    alloc_list_pub_keys(Crypto::ptr crypto, const Crypto::pub_keys_cbfn &cb)
    {
        auto *ret = new ListPubKeysAsync(this, &SaveKPairAsync::null_cb, crypto);
        ret->user_cb = cb;
        return ret;
    }

    ListAllAcctAsync *
    alloc_list_all_acct(Crypto::ptr crypto, const cb_ListAllAcctAsync &cb) {
        return new ListAllAcctAsync(this, cb, crypto);
    }
};

#endif /* _CRYPTO_CRYPTO_CLIENT_H_ */
