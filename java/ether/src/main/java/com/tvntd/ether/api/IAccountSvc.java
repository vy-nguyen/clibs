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

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;
import org.ethereum.jsonrpc.TransactionResultDTO;

import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.AccountInfoDTO.AccountInfoResult;
import com.tvntd.ether.dto.AddressBook;
import com.tvntd.ether.dto.GenericResponse;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.dto.TransactionDTO.TransactionDTOResp;
import com.tvntd.ether.dto.WalletForm;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.ether.models.Account;
import com.tvntd.ether.models.Wallet;

public interface IAccountSvc
{
    /**
     * Get all walles from the database.
     */
    List<Wallet> getAllWallets();

    /**
     * Get account info for the given account.
     */
    AccountResultDTO getUserAccounts(List<String> userUuids);
    AccountResultDTO getAccounts(List<String> accounts, Map<String, Account> db);
    AccountResultDTO getAccounts(List<String> accounts, Boolean trans);

    /**
     * Create a new account in the given wallet.
     *
     * @param walletUuid uuid of the wallet.
     * @param ownerUuid uuid of the wallet owner.
     * @param password password to lock the account.
     * @param acctName public name of the account.
     * @param priv true if the account is in private, don't publish it.
     * @return WalletInfoDTO.
     */
    WalletInfoDTO createAccount(String walletUuid,
            String ownerUuid, String passwd, String acctName, Boolean priv);

    WalletInfoDTO createWallet(WalletForm form, String ownerUuid);
    WalletInfoDTO editEtherAccount(WalletForm form, String ownerUuid);

    /**
     * Get the list of wallets matching ownerUuid.
     */
    List<WalletInfoDTO> getWallet(String ownerUuid);
    TransactionDTO fundAccount(AccountInfoDTO account);

    /**
     * Pay from one account to another one.
     */
    TransactionDTOResp payAccount(String ownerUuid, String toUuid,
            String fromAccount, String toAccount, Long xuAmount, String text);

    /**
     * Get address book for the ownerUuid.
     * @param start the starting record count (e.g. 0).
     * @param count number of records returned from the query.
     * @return address book for the ownerUuid.
     */
    AddressBook getAddressBook(String ownerUuid, int start, int count);

    /**
     * List of account balances, transactions, and tx blocks.
     */
    public static class AccountResultDTO extends GenericResponse
    {
        protected List<AccountInfoDTO> accounts;
        protected List<TransactionDTO> recentTrans;
        protected List<BlockResult> transBlocks;

        public AccountResultDTO(String mesg) {
            super(mesg);
        }

        public void addAccount(AccountInfoDTO account)
        {
            if (accounts == null) {
                accounts = new LinkedList<>();
            }
            accounts.add(account);
        }

        public void importRpcResult(AccountInfoResult result)
        {
            accounts = result.fetchAccounts();
            for (AccountInfoDTO a : accounts) {
                a.processInfo(null, null);
            }
            recentTrans = new LinkedList<>();
            transBlocks = result.fetchBlocks();

            List<TransactionResultDTO> trans = result.fetchTrans();
            if (trans != null) {
                for (TransactionResultDTO tx : trans) {
                    recentTrans.add(new TransactionDTO(null, tx));
                }
            }
        }

        /**
         * @return the accounts
         */
        public List<AccountInfoDTO> getAccounts() {
            return accounts;
        }

        /**
         * @param accounts the accounts to set
         */
        public void setAccounts(List<AccountInfoDTO> accounts) {
            this.accounts = accounts;
        }

        /**
         * @return the recentTrans
         */
        public List<TransactionDTO> getRecentTrans() {
            return recentTrans;
        }

        /**
         * @return the transBlocks
         */
        public List<BlockResult> getTransBlocks() {
            return transBlocks;
        }
    }
}
