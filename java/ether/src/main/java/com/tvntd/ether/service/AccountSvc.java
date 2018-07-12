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

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.ether.models.Transaction;

@Service
@Transactional
@EnableCaching
public class AccountSvc implements IAccountSvc
{
    public AccountDTO getAccount(String ownerUuid, String account)
    {
        return null;
    }

    public List<AccountDTO> getAccountsIn(List<String> accounts)
    {
        return null;
    }

    public WalletInfoDTO
    createWallet(byte[] walletName, byte[] acctName,
            String walletUuid, String ownerUuid)
    {
        return null;
    }

    public WalletInfoDTO
    createAccount(String walletUuid, String ownerUuid, byte[] acctName)
    {
        return null;
    }

    public List<WalletInfoDTO> getWallet(String ownerUuid)
    {
        return null;
    }

    public Transaction fundAccount(AccountInfoDTO account)
    {
        return null;
    }

    public Transaction payAccount(String ownerUuid, String toUuid,
            String fromAccount, String toAccount, Long xuAmount, String text)
    {
        return null;
    }
}
