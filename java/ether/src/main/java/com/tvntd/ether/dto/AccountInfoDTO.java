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

import java.math.BigInteger;
import java.util.List;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;
import org.ethereum.jsonrpc.TransactionResultDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tvntd.ether.api.EtherRpcApi.RpcResponse;
import com.tvntd.ether.models.Account;
import com.tvntd.ether.util.Convert;

@JsonIgnoreProperties(ignoreUnknown = true) 
public class AccountInfoDTO
{
    protected String account;
    protected String ownerUuid;
    protected Long xuBalance;
    protected String acctName;
    protected String balance;
    protected String type;

    public AccountInfoDTO()
    {
        xuBalance = 0L;
        balance = "NA";
    }

    public AccountInfoDTO(String acct, String name, String typ)
    {
        this();
        account = acct;
        acctName = name;
        type = typ;
    }

    public AccountInfoDTO(String acct, BigInteger weiBalance, String name, String typ)
    {
        this(acct, name, typ);
        if (weiBalance != null) {
            xuBalance = Convert.toXuValue(weiBalance);
        }
    }

    public AccountInfoDTO(Account acct)
    {
        this();
        this.account = acct.getAccount();
        this.acctName = acct.getPublicName();
        this.type = acct.getType();
    }

    public String toString() {
        return "Account " + account + ", name " + acctName + " xuBalance " + xuBalance;
    }

    public void processInfo(String name, String type)
    {
        this.acctName = name;
        this.type = type;

        if (balance != null) {
            BigInteger bal = new BigInteger(balance);
            xuBalance = Convert.toXuValue(bal);
        }
    }

    /**
     * @return the account
     */
    @JsonProperty("Account")
    public String getAccount() {
        return account;
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
     * @return the xuBalance
     */
    public Long getXuBalance() {
        return xuBalance;
    }

    /**
     */
    public void setXuBalance(Long xuBalance) {
        this.xuBalance = xuBalance;
    }

    /**
     * @return the acctName
     */
    public String getAcctName() {
        return acctName;
    }

    /**
     * @return the balance
     */
    @JsonProperty("Balance")
    public String getBalance() {
        return balance;
    }

    /**
     * @param balance the balance to set
     */
    public void setBalance(String balance) {
        this.balance = balance;
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

    /**
     * RPC result from NewAccount call
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NewAccountResult extends RpcResponse
    {
        public Result result;

        public String fetchAddress() {
            return result.address;
        }

        public Account fetchAccount(String name, String type)
        {
            if (result == null) {
                return null;
            }
            return new Account(result.address,
                    result.ownerUuid, result.walletUuid, name, type);
        }

        static class Result
        {
            public String ownerUuid;
            public String walletUuid;
            public String address;
        }
    }

    /**
     * RPC result from AccountInfo call
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AccountInfoResult extends RpcResponse
    {
        public Result result;

        public List<AccountInfoDTO> fetchAccounts() {
            return result.accounts;
        }

        public List<TransactionResultDTO> fetchTrans() {
            return result.transBChain;
        }

        public List<BlockResult> fetchBlocks() {
            return result.transBlocks;
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        static class Result
        {
            public List<AccountInfoDTO>accounts;
            public List<TransactionResultDTO> transBChain;
            public List<BlockResult> transBlocks;
            public TransactionResultDTO latest;
            public String error;
        }
    }
}
