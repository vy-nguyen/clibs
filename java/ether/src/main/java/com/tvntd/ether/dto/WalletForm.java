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

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.lib.Util;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WalletForm
{
    protected String acctName;
    protected String account;
    protected String walletName;
    protected String walletUuid;
    protected String password;
    protected Boolean acctPriv;

    public WalletForm() {}
    public WalletForm(String acctName, String walletName)
    {
        this.acctName = acctName;
        this.walletName = walletName;
        this.password = "default";
        this.acctPriv = false;
    }

    public boolean cleanInput()
    {
        if (acctName == null || walletName == null) {
            return false;
        }
        Whitelist wlist = Util.allowedTags;
        acctName = Jsoup.clean(acctName, wlist);
        walletName = Jsoup.clean(walletName, wlist);
        if (walletUuid != null) {
            walletUuid = Jsoup.clean(walletUuid, wlist);
        }
        if (password != null) {
            password = Jsoup.clean(password, wlist);
        } else {
            password = "password";
        }
        if (account != null) {
            account = Jsoup.clean(account, wlist);
        }
        return true;
    }

    public static class WalletListForm
    {
        protected List<WalletForm> wallets;

        /**
         * @return the wallets
         */
        public List<WalletForm> getWallets() {
            return wallets;
        }
    }

    /**
     * @return the acctName
     */
    public String getAcctName() {
        return acctName;
    }

    /**
     * @return the account
     */
    public String getAccount() {
        return account;
    }

    /**
     * @return the walletName
     */
    public String getWalletName() {
        return walletName;
    }

    /**
     * @return the walletUuid
     */
    public String getWalletUuid() {
        return walletUuid;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @return the acctPriv
     */
    public Boolean getAcctPriv() {
        return acctPriv == null ? false : acctPriv;
    }
}
