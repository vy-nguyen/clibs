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

import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.ether.models.Transaction;

public interface IAccountSvc
{
    AccountDTO getAccount(String ownerUuid, String account);
    List<AccountDTO> getAccountsIn(List<String> accounts);

    WalletInfoDTO createWallet(byte[] walletName, byte[] acctname,
            String walletUuid, String ownerUuid);

    List<WalletInfoDTO> getWallet(String ownerUuid);
    Transaction fundAccount(AccountInfoDTO account);
    Transaction payAccount(String ownerUuid, String toUuid,
            String fromAccount, String toAccount, Long xuAmount, String text);

    public static class AccountDTO
    {
        protected String ownerUuid;
        protected String walletUuid;
        protected AccountInfoDTO account;
        protected List<Transaction> recentTrans;

        public AccountDTO() {}
        public AccountDTO(String ownerUuid, String walletUuid)
        {
            this.ownerUuid = ownerUuid;
            this.walletUuid = walletUuid;
        }

        /**
         * @return the ownerUuid
         */
        public String getOwnerUuid() {
            return ownerUuid;
        }

        /**
         * @return the walletUuid
         */
        public String getWalletUuid() {
            return walletUuid;
        }

        /**
         * @return the account
         */
        public AccountInfoDTO getAccount() {
            return account;
        }
    }
}
