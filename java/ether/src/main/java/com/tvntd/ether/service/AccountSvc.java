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

import java.math.BigInteger;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tvntd.ether.api.EtherRpcApi.EtherAcctInfo;
import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dao.AccountRepo;
import com.tvntd.ether.dao.WalletRepo;
import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.AccountInfoDTO.AccountInfoResult;
import com.tvntd.ether.dto.AccountInfoDTO.NewAccountResult;
import com.tvntd.ether.dto.AddressBook;
import com.tvntd.ether.dto.EtherTransDTO.EtherPayTrans;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.dto.TransactionDTO.TransactionDTOResp;
import com.tvntd.ether.dto.WalletForm;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.ether.models.Account;
import com.tvntd.ether.models.Wallet;
import com.tvntd.ether.rpc.JsonRpc;
import com.tvntd.ether.util.Constants;
import com.tvntd.ether.util.Convert;
import com.tvntd.lib.LRUCache;

@Service
@Transactional
@EnableCaching
public class AccountSvc implements IAccountSvc
{
    static Logger s_log = LoggerFactory.getLogger(AccountSvc.class);
    static int maxAccountCached = 10000;

    static List<Account> s_globAccount;
    static LRUCache<String, String, Account> s_acctCache;
    static {
        s_globAccount = null;
        s_acctCache = new LRUCache<>(1000, maxAccountCached);
    }

    @Autowired
    protected AccountRepo acctRepo;

    @Autowired
    protected WalletRepo walletRepo;

    @Autowired
    protected ITransactionSvc transSvc;

    /**
     * Return all wallets.
     */
    @Override
    public List<Wallet> getAllWallets() {
        return walletRepo.findAll();
    }

    /**
     * Return the account and recent transactions matching with ownerUuid and account.
     */
    @Override
    public AccountResultDTO getAccounts(List<String> accounts, Boolean trans)
    {
        AccountResultDTO out = new AccountResultDTO("accounts");

        JsonRpc rpc = new JsonRpc();
        AccountInfoResult result = rpc.<AccountInfoResult>
            callJsonRpcArr(AccountInfoResult.class,
                    "tudo_listAccountInfoAndTx", "id", accounts);

        if (result != null && result.getError() == null) {
            out.importRpcResult(result);
        }
        return out;
    }

    /**
     * Create a new wallet or create a new account to existing wallet.
     */
    @Override
    public WalletInfoDTO createWallet(WalletForm form, String ownerUuid)
    {
        String walletUuid = form.getWalletUuid();

        if (walletUuid != null) {
            return createAccount(walletUuid, ownerUuid,
                    form.getPassword(), form.getAcctName(), form.getAcctPriv());
        }
        return createAccount(new Wallet(ownerUuid, form.getWalletName()),
                form.getPassword(), form.getAcctName(), form.getAcctPriv());
    }

    @Override
    public WalletInfoDTO editEtherAccount(WalletForm form, String ownerUuid)
    {
        String account = form.getAccount(), walletName = form.getWalletName();
        if (account == null) {
            return null;
        }
        Wallet wallet = walletRepo.findByAccount(account);
        if (wallet == null) {
            return null;
        }
        if (walletName != null && !wallet.getName().equals(walletName)) {
            wallet.setName(walletName);
            wallet.resetId();
            walletRepo.save(wallet);
        }
        WalletInfoDTO result = new WalletInfoDTO(wallet);
        String accountName = form.getAcctName();

        if (accountName != null) {
            Account acct = acctRepo.findByAccount(account);
            if (acct != null && !acct.getPublicName().equals(accountName)) {
                acct.setPublicName(accountName);
                if (form.getAcctPriv()) {
                    acct.setType(Constants.ACCT_VNTD_PRIV);
                }
                acctRepo.save(acct);
            }
            result.addAccountInfo(acct);
        }
        return result;
    }

    /**
     * Create a new account to existing wallet.
     */
    @Override
    public WalletInfoDTO
    createAccount(String walletUuid, String ownerUuid,
            String passwd, String acctName, Boolean priv)
    {
        List<Wallet> wallets =
            walletRepo.findByWalletUuidAndOwnerUuid(walletUuid, ownerUuid);

        if (wallets.isEmpty()) {
            return new WalletInfoDTO("Invalid Wallet Uuid " + walletUuid);
        }
        return createAccount(wallets.get(0), passwd, acctName, priv);
    }

    protected WalletInfoDTO
    createAccount(Wallet w, String passwd, String acctName, Boolean priv)
    {
        JsonRpc rpc = new JsonRpc();
        String type = priv == true ? Constants.ACCT_VNTD_PRIV : Constants.ACCT_VNTD;

        NewAccountResult result = rpc.<NewAccountResult>
            callJsonRpc(NewAccountResult.class, "tudo_newAccount", "id",
                    w.getOwnerUuid(), w.getWalletUuid(),
                    acctName, passwd, type);

        if (result == null || result.getError() != null) {
            String err = result.getError().toString();

            s_log.warn("Error in creating account " + err);
            return new WalletInfoDTO(err);
        }
        // Save the new wallet entry.
        //
        Account account = result.fetchAccount(acctName, type);
        if (account != null) {
            w.resetId();
            w.setAccount(result.fetchAddress());
            walletRepo.save(w);
            acctRepo.save(account);

            WalletInfoDTO out = new WalletInfoDTO(w);
            out.addAccountInfo(new AccountInfoDTO(account));
            return out;
        }
        return null;
    }

    /**
     * Get wallets matching ownerUuid.
     */
    @Override
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
        }
        if (!accountNo.isEmpty()) {
            JsonRpc rpc = new JsonRpc();
            EtherAcctInfo result = rpc.callJsonRpcArr(EtherAcctInfo.class,
                    "tudo_listAccountInfo", "id", accountNo);

            if (result != null && result.getError() == null) {
                processAccountInfo(wallets, accountNo, result.accountResult());
            }
        }
        return new LinkedList<>(wallets.values());
    }

    protected void
    processAccountInfo(Map<String, WalletInfoDTO> wallets,
            List<String> accounts, List<AccountInfoDTO> balance)
    {
        List<Account> dbList = acctRepo.findByAccountIn(accounts);
        Map<String, Account> map = new HashMap<>();

        for (Account a : dbList) {
            map.put(a.getAccount(), a);
        }
        for (AccountInfoDTO act : balance) {
            Account actDb = map.get(act.getAccount());
            if (actDb != null) {
                act.processInfo(actDb.getPublicName(), actDb.getType());

                String wid = actDb.getWalletUuid();
                WalletInfoDTO w = wallets.get(wid);
                if (w != null) {
                    w.addAccountInfo(act);
                }
            }
        }
    }

    /**
     * Prefund accounts.
     */
    @Override
    public TransactionDTO fundAccount(AccountInfoDTO account)
    {
        return null;
    }

    /**
     * Pay from one account to aother one. The web layer has to verify the password
     * before calling this method.
     */
    @Override
    public TransactionDTOResp payAccount(String ownerUuid, String toUuid,
            String fromAccount, String toAccount, Long xuAmount, String text)
    {
        List<String> params = new LinkedList<>();
        BigInteger weiVal = Convert.toWei(xuAmount);

        params.add(fromAccount);
        params.add(ownerUuid);
        params.add(toAccount);
        params.add(toUuid);
        params.add(weiVal.toString());
        params.add(text);

        String error = null;
        JsonRpc rpc = new JsonRpc();
        EtherPayTrans tx = rpc.callJsonRpc(EtherPayTrans.class,
                "tudo_payUserAccount", "id", params);

        if (tx != null) {
            String txHash = tx.fetchTxHash();
            
            if (txHash != null) {
                TransactionDTO result = null;

                for (int i = 0; i < 10; i++) {
                    result = transSvc.getTransaction(txHash);
                    if (result != null) {
                        break;
                    }
                    try {
                        Thread.sleep(100);
                    } catch(InterruptedException e) {}
                }
                return new TransactionDTOResp("ok", result);
            }
            error = tx.getError().toString();
        } else {
            error = "Failed to send transaction";
        }
        return new TransactionDTOResp("Failed transaction", error);
    }

    /**
     * Return the addressbook for the ownerUuid.
     */
    @Override
    public AddressBook getAddressBook(String ownerUuid, int start, int count)
    {
        AddressBook book = new AddressBook(s_globAccount);

        if (s_globAccount == null) {
            Pageable page = new PageRequest(start, start + count, null);
            List<Account> accounts = acctRepo.findByType(page, Constants.ACCT_VNTD);

            // Race condition here is ok.
            //
            s_globAccount = accounts;
            book.setPublicBook(accounts);
        }
        if (ownerUuid != null) {
            List<Wallet> wallets = walletRepo.findByOwnerUuid(ownerUuid);
            for (Wallet w : wallets) {
                Account a = acctRepo.findByAccount(w.getAccount());
                if (a != null) {
                    book.addPersonalAcct(a);
                }
            }
        }
        return book;
    }
}
