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
package com.tvntd.ether.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

import com.tvntd.ether.api.EtherRpcApi.EtherAcctInfo;
import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.dao.AccountRepo;
import com.tvntd.ether.dao.WalletRepo;
import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.AccountInfoDTO.NewAccountResult;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.ether.models.Account;
import com.tvntd.ether.models.Wallet;
import com.tvntd.ether.rpc.JsonRpc;
import com.tvntd.ether.util.Constants;
import com.tvntd.lib.LRUCache;

@Service
@Transactional
@EnableCaching
public class AccountSvc implements IAccountSvc
{
    static Logger s_log = LoggerFactory.getLogger(AccountSvc.class);
    static int maxAccountCached = 10000;

    static LRUCache<String, String, Account> s_acctCache;
    static {
        s_acctCache = new LRUCache<>(1000, maxAccountCached);
    }

    @Autowired
    protected AccountRepo acctRepo;

    @Autowired
    protected WalletRepo walletRepo;

    /**
     * Return the account and recent transactions matching with ownerUuid and account.
     */
    public AccountDTO getAccount(String ownerUuid, String account)
    {
        Account act = acctRepo.findByAccount(account);
        if (act == null) {
            return null;
        }
        if (!ownerUuid.equals(act.getOwnerUuid())) {
            s_log.warn("Not matching owner " + ownerUuid + " db " + act.getOwnerUuid());
            return null;
        }
        return getAccountInfo(act);
    }

    public List<AccountDTO> getAccountsIn(List<String> accounts)
    {
        List<AccountDTO> out = new LinkedList<>();
        List<Account> result = acctRepo.findByAccountIn(accounts);

        if (result != null && !result.isEmpty()) {
            for (Account act : result) {
                out.add(getAccountInfo(act));
            }
        }
        return out;
    }

    protected AccountDTO getAccountInfo(Account account)
    {
        return null;
    }

    /**
     * Create a new wallet or create a new account to existing wallet.
     */
    public WalletInfoDTO
    createWallet(String walletName, String acctName, String passwd,
            String walletUuid, String ownerUuid)
    {
        List<Wallet> wallets = walletRepo.findByOwnerUuid(ownerUuid);
        if (wallets != null && wallets.size() > 5) {
            return createAccount(wallets.get(0), passwd, acctName);
        }
        return createAccount(new Wallet(ownerUuid, walletName), passwd, acctName);
    }

    /**
     * Create a new account to existing wallet.
     */
    public WalletInfoDTO
    createAccount(String walletUuid, String ownerUuid, String passwd, String acctName)
    {
        List<Wallet> wallets =
            walletRepo.findByWalletUuidAndOwnerUuid(walletUuid, ownerUuid);

        if (wallets.isEmpty()) {
            return new WalletInfoDTO("Invalid Wallet Uuid " + walletUuid);
        }
        return createAccount(wallets.get(0), passwd, acctName);
    }

    protected WalletInfoDTO
    createAccount(Wallet w, String passwd, String acctName)
    {
        List<Account> accounts = acctRepo.findByOwnerUuid(w.getOwnerUuid());
        if (accounts != null && accounts.size() > 5) {
            // Limit 5 account per wallet for now.
            //
            return new WalletInfoDTO(w);
        }
        JsonRpc rpc = new JsonRpc();
        NewAccountResult result = rpc.<NewAccountResult>
            callJsonRpc(NewAccountResult.class, "tudo_newAccount", "id",
                    w.getOwnerUuid(), w.getWalletUuid(),
                    acctName, passwd, Constants.ACCT_VNTD);

        if (result == null || result.getError() != null) {
            String err = result.getError().toString();

            s_log.warn("Error in creating account " + err);
            return new WalletInfoDTO(err);
        }
        WalletInfoDTO out = new WalletInfoDTO(w);
        Account account = result.fetchAccount(acctName, Constants.ACCT_VNTD);
        out.addAccountInfo(new AccountDTO(account));

        // Save the new wallet entry.
        //
        w.resetId();
        w.setAccount(result.fetchAddress());
        walletRepo.save(w);
        acctRepo.save(account);

        return out;
    }

    public List<WalletInfoDTO> getWallet(String ownerUuid)
    {
        List<String> accountNo = new LinkedList<>();
        Map<String, WalletInfoDTO> wallets = new HashMap<>();
        List<Wallet> raws = walletRepo.findByOwnerUuid(ownerUuid);

        for (Wallet w : raws) {
            String wid = w.getWalletUuid();
            WalletInfoDTO dto = wallets.get(wid);

            if (dto == null) {
                dto = new WalletInfoDTO(w);
                wallets.put(wid, dto);
            }
            accountNo.add(w.getAccount());
            dto.addAccountInfo(new AccountDTO(wid, w.getAccount(), null));
        }
        if (!accountNo.isEmpty()) {
            JsonRpc rpc = new JsonRpc();
            EtherAcctInfo result = rpc.callJsonRpcArr(EtherAcctInfo.class,
                    "tudo_listAccountInfo", "id", accountNo);

            if (result != null && result.getError() == null) {
                processAccountInfo(wallets, result.accountResult());
            }
        }
        return new LinkedList<>(wallets.values());
    }

    protected void
    processAccountInfo(Map<String, WalletInfoDTO> wallets, List<AccountInfoDTO> result)
    {
        for (AccountInfoDTO act : result) {
            System.out.println("account " + act);
        }
    }

    public TransactionDTO fundAccount(AccountInfoDTO account)
    {
        return null;
    }

    public TransactionDTO payAccount(String ownerUuid, String toUuid,
            String fromAccount, String toAccount, Long xuAmount, String text)
    {
        return null;
    }
}
