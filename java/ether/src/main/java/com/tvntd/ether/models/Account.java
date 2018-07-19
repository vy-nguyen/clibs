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
package com.tvntd.ether.models;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import com.tvntd.ether.util.Constants;
import com.tvntd.lib.Util;

@Entity
@Table(name = "account",
    indexes = {
        @Index(columnList = "owner_uuid", unique = false),
        @Index(columnList = "wallet_uuid", unique = false)
    }
)
public class Account
{
    @Id
    @Column(length = 128, name = "account")
    protected String account;

    @Column(length = 64, name = "owner_uuid")
    protected String ownerUuid;

    @Column(length = 64, name = "wallet_uuid")
    protected String walletUuid;

    @Column(length = 64, name = "public_name")
    protected byte[] publicName;

    @Column(length = 64, name = "type")
    protected String type;

    public Account() {}
    public Account(String ownerUuid, String name)
    {
        this.ownerUuid = ownerUuid;
        this.publicName = Util.toRawByte(name, 64);
        this.walletUuid = UUID.randomUUID().toString();
        this.type = Constants.ACCT_VNTD;
    }

    public Account(String act, String owner, String wallet, String name, String type)
    {
        this.account = act;
        this.ownerUuid = owner;
        this.walletUuid = wallet;
        this.publicName = Util.toRawByte(name, 64);
        this.type = type;
    }

    /**
     * @return the account
     */
    public String getAccount() {
        return account;
    }

    /**
     * @param account the account to set
     */
    public void setAccount(String account) {
        this.account = account;
    }

    /**
     * @return the ownerUuid
     */
    public String getOwnerUuid() {
        return ownerUuid;
    }

    /**
     * @param ownerUuid the ownerUuid to set
     */
    public void setOwnerUuid(String ownerUuid) {
        this.ownerUuid = ownerUuid;
    }

    /**
     * @return the walletUuid
     */
    public String getWalletUuid() {
        return walletUuid;
    }

    /**
     * @param walletUuid the walletUuid to set
     */
    public void setWalletUuid(String walletUuid) {
        this.walletUuid = walletUuid;
    }

    /**
     * @return the publicName
     */
    public String getPublicName() {
        return Util.fromRawByte(publicName);
    }

    /**
     * @param publicName the publicName to set
     */
    public void setPublicName(String publicName) {
        this.publicName = Util.toRawByte(publicName, 64);
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }
}
