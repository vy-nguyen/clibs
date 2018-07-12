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
package com.tvntd.forms;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.tvntd.util.Util;

public class EtherPay
{
    protected String ownerUuid;
    protected String toUuid;
    protected String fromAccount;
    protected String toAccount;
    protected String passCode;
    protected String text;
    protected Long xuAmount;

    public boolean cleanInput()
    {
        if (ownerUuid == null || fromAccount == null ||
            toAccount == null || xuAmount == null) {
            return false;
        }
        Whitelist wlist = Util.allowedTags;
        if (passCode != null) {
            passCode = Jsoup.clean(passCode, wlist);
        }
        if (text != null) {
            text = Jsoup.clean(text, wlist);
        }
        if (toUuid != null) {
            toUuid = Jsoup.clean(toUuid, wlist);
        }
        ownerUuid = Jsoup.clean(ownerUuid, wlist);
        fromAccount = Jsoup.clean(fromAccount, wlist);
        toAccount = Jsoup.clean(toAccount, wlist);

        if (xuAmount <= 0) {
            return false;
        }
        return true;
    }

    /**
     * @return the ownerUuid
     */
    public String getOwnerUuid() {
        return ownerUuid;
    }

    /**
     * @return the toUuid
     */
    public String getToUuid() {
        return toUuid;
    }

    /**
     * @return the fromAccount
     */
    public String getFromAccount() {
        return fromAccount;
    }

    /**
     * @return the toAccount
     */
    public String getToAccount() {
        return toAccount;
    }

    /**
     * @return the passCode
     */
    public String getPassCode() {
        return passCode;
    }

    /**
     * @return the text
     */
    public String getText() {
        return text;
    }

    /**
     * @return the xuAmount
     */
    public Long getXuAmount() {
        return xuAmount;
    }
}
