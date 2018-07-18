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

import java.io.UnsupportedEncodingException;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import com.tvntd.lib.Util;

@Entity
@Table(name = "wallet",
    indexes = {
        @Index(columnList = "wallet_uuid", unique = false),
        @Index(columnList = "owner_uuid", unique = false)
    }
)
public class Wallet
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;

    @Column(length = 64, name = "wallet_uuid")
    protected String walletUuid;

    @Column(length = 64, name = "owner_uuid")
    protected String ownerUuid;

    @Column(length = 128, name = "account")
    protected String account;

    @Column(length = 64, name = "name")
    protected byte[] name;

    public Wallet() {}
    public Wallet(String ownerUuid, byte[] name)
    {
        this.name = name;
        this.ownerUuid = ownerUuid;
        this.walletUuid = UUID.randomUUID().toString();
    }

    public Wallet(String ownerUuid, String name)
    {
        try {
            this.name = name.getBytes("UTF-8");
        } catch(UnsupportedEncodingException e) {}

        this.ownerUuid = ownerUuid;
        this.walletUuid = UUID.randomUUID().toString();
    }

    public Wallet resetId() {
        this.id = null;
        return this;
    }

    /**
     * @return the walletUuid
     */
    public String getWalletUuid() {
        return walletUuid;
    }

    /**
     * @return the ownerUuid
     */
    public String getOwnerUuid() {
        return ownerUuid;
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
     * @return the name
     */
    public String getName() {
        return Util.fromRawByte(name);
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = Util.toRawByte(name, 64);
    }
}
