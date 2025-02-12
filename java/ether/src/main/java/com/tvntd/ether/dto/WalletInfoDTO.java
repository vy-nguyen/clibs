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
package com.tvntd.ether.dto;

import java.util.LinkedList;
import java.util.List;

import com.tvntd.ether.models.Account;
import com.tvntd.ether.models.Wallet;

public class WalletInfoDTO extends GenericResponse
{
    protected String name;
    protected String walletUuid;
    protected List<AccountInfoDTO> accountInfo;

    public WalletInfoDTO(String text) {
        super(text);
    }

    public WalletInfoDTO(Wallet w)
    {
        super("ok");
        name = w.getName();
        walletUuid = w.getWalletUuid();
        accountInfo = new LinkedList<>();
    }

    public void addAccountInfo(AccountInfoDTO acct) {
        accountInfo.add(acct);
    }

    public void addAccountInfo(Account acct) {
        accountInfo.add(new AccountInfoDTO(acct));
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @return the walletUuid
     */
    public String getWalletUuid() {
        return walletUuid;
    }

    /**
     * @return the accountInfo
     */
    public List<AccountInfoDTO> getAccountInfo() {
        return accountInfo;
    }

    /**
     * @param accountInfo the accountInfo to set
     */
    public void setAccountInfo(List<AccountInfoDTO> accountInfo) {
        this.accountInfo = accountInfo;
    }
}
