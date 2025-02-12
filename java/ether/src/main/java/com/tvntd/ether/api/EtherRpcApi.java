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
package com.tvntd.ether.api;

import java.util.List;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tvntd.ether.dto.AccountInfoDTO;

public interface EtherRpcApi
{
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RpcResponse
    {
        protected String jsonRpc;
        protected String id;
        protected Object error;

        public void printJson()
        {
            try {
                ObjectMapper mapper = new ObjectMapper();
                System.out.println(mapper.writerWithDefaultPrettyPrinter()
                        .writeValueAsString(this));

            } catch(JsonProcessingException e) {
                System.out.println("Exception " + e.getMessage());
            }
        }

        /**
         * @return the jsonRpc
         */
        @JsonProperty(value = "jsonrpc")
        public String getJsonRpc() {
            return jsonRpc;
        }

        /**
         * @return the id
         */
        @JsonProperty(value = "id")
        public String getId() {
            return id;
        }

        /**
         * @return the error
         */
        @JsonProperty(value = "error")
        public Object getError() {
            return error;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EtherAcctInfo extends RpcResponse
    {
        protected Result result;

        /**
         * @return the result
         */
        @JsonProperty(value = "result")
        public Result getResult() {
            return result;
        }

        public List<AccountInfoDTO> accountResult()
        {
            if (result != null) {
                return result.getAccounts();
            }
            return null;
        }

        public BlockResult getLatestBlock()
        {
            if (result != null) {
                return result.getLatest();
            }
            return null;
        }

        static class Result
        {
            protected List<AccountInfoDTO> accounts;
            protected BlockResult latest;
            protected String error;

            /**
             * @return the accounts
             */
            @JsonProperty(value = "accounts")
            public List<AccountInfoDTO> getAccounts() {
                return accounts;
            }

            /**
             * @return the latest
             */
            @JsonProperty(value = "latest")
            public BlockResult getLatest() {
                return latest;
            }

            /**
             * @return the error
             */
            @JsonProperty(value = "error")
            public String getError() {
                return error;
            }
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EtherAccount extends RpcResponse
    {
        protected Result result;

        /**
         * @return the accounts
         */
        @JsonProperty(value = "result")
        public Result getResult() {
            return result;
        }

        static class Result
        {
            protected List<Account> accounts;

            @JsonProperty(value = "account")
            public List<Account> getAccounts() {
                return accounts;
            }
        }

        public static class Account
        {
            protected String ownerUuid;
            protected String publicName;
            protected String passKey;
            protected String walletUuid;
            protected String account;

            /**
             * @return the ownerUuid
             */
            @JsonProperty(value = "OwnerUuid")
            public String getOwnerUuid() {
                return ownerUuid;
            }

            /**
             * @return the publicName
             */
            @JsonProperty(value = "PublicName")
            public String getPublicName() {
                return publicName;
            }

            /**
             * @return the passKey
             */
            @JsonProperty(value = "PassKey")
            public String getPassKey() {
                return passKey;
            }

            /**
             * @return the walletUuid
             */
            @JsonProperty(value = "WalletUuid")
            public String getWalletUuid() {
                return walletUuid;
            }

            /**
             * @return the account
             */
            @JsonProperty(value = "Account")
            public String getAccount() {
                return account;
            }
        }
    }
}
