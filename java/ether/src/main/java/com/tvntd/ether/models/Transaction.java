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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Entity
@Table(name = "transaction",
    indexes = {
        @Index(columnList = "from_uuid", unique = false),
        @Index(columnList = "to_uuid", unique = false),
        @Index(columnList = "from_acct", unique = false),
        @Index(columnList = "to_acct", unique = false)
    }
)
public class Transaction
{
    @Id
    @Column(length = 128, name = "tx_hash")
    protected String txHash;

    @Column(length = 64, name = "from_uuid")
    protected String fromUuid;

    @Column(length = 64, name = "to_uuid")
    protected String toUuid;

    @Column(length = 64, name = "from_acct")
    protected String fromAcct;

    @Column(length = 64, name = "to_acct")
    protected String toAcct;

    /**
     * @return the txHash
     */
    public String getTxHash() {
        return txHash;
    }

    /**
     * @return the fromUuid
     */
    public String getFromUuid() {
        return fromUuid;
    }

    /**
     * @return the toUuid
     */
    public String getToUuid() {
        return toUuid;
    }

    /**
     * @return the fromAcct
     */
    public String getFromAcct() {
        return fromAcct;
    }

    /**
     * @return the toAcct
     */
    public String getToAcct() {
        return toAcct;
    }
}
