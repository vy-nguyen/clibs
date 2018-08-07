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
import java.util.LinkedList;
import java.util.List;

import org.ethereum.jsonrpc.TransactionResultDTO;
import org.ethereum.jsonrpc.TypeConverter;

import com.tvntd.ether.models.Transaction;
import com.tvntd.ether.util.Convert;
import com.tvntd.lib.RawParseUtils;

public class TransactionDTO
{
    protected Transaction tx;
    protected TransactionResultDTO bcTx;

    public static class TransactionDTOResp extends GenericResponse
    {
        public List<TransactionDTO> transactions;

        public TransactionDTOResp(String mesg, String error) {
            super(mesg, error);
        }

        public TransactionDTOResp(String mesg, TransactionDTO tx)
        {
            super(mesg, null);
            transactions = new LinkedList<>();
            transactions.add(tx);
        }

        public void addTransaction(TransactionDTO tx)
        {
            if (transactions == null) {
                transactions = new LinkedList<>();
            }
            transactions.add(tx);
        }
    }

    public TransactionDTO(Transaction trans, TransactionResultDTO bc)
    {
        this.tx = trans;
        this.bcTx = bc;

        if (this.tx == null) {
            this.tx = new Transaction();
        }
        if (this.bcTx == null) {
            this.bcTx = new TransactionResultDTO();
        }
    }

    /**
     * @return the txHash
     */
    public String getTxHash() {
        return bcTx.hash != null ? bcTx.hash : tx.getTxHash().toLowerCase();
    }

    /**
     * @return the fromUuid
     */
    public String getFromUuid() {
        return tx.getFromUuid();
    }

    /**
     * @return the fromAcct
     */
    public String getFromAcct() {
        return bcTx.from != null ? bcTx.from : tx.getFromAcct().toLowerCase();
    }

    /**
     * @return the toUuid
     */
    public String getToUuid() {
        return tx.getToUuid();
    }

    /**
     * @return the toAcct
     */
    public String getToAcct() {
        return bcTx.to != null ? bcTx.to : tx.getToAcct().toLowerCase();
    }

    public String getBlockHash() {
        return bcTx.blockHash;
    }

    public Long getNonce() {
        return bcTx.nonce != null ?  RawParseUtils.parseLong(bcTx.nonce) : 0L;
    }

    public String getR() {
        return bcTx.r;
    }

    public String getS() {
        return bcTx.s;
    }

    public String getV() {
        return bcTx.v;
    }

    public String getFromBalance() {
        return bcTx.fromBalance;
    }

    public String getToBalance() {
        return bcTx.toBalance;
    }

    public String getInput() {
        return bcTx.input;
    }

    public Long getTransactionIndex() {
        return bcTx.transactionIndex != null ?
            RawParseUtils.parseLong(bcTx.transactionIndex) : 0L;
    }

    public Long getXuAmount()
    {
        if (bcTx == null || bcTx.value == null) {
            return tx.getXuAmount();
        }
        BigInteger val = TypeConverter.StringHexToBigInteger(bcTx.value);
        return Convert.toXuValue(val);
    }

    public Long getGasPrice() {
        return bcTx.gasPrice != null ? 
            RawParseUtils.parseLong(bcTx.gasPrice) : 0L;
    }

    public Long getGas() {
        return bcTx.gas != null ?
            RawParseUtils.parseLong(bcTx.gasPrice) : 0L;
    }

    public static class TransListDTO extends GenericResponse
    {
        protected List<TransactionDTO> transactions;

        public TransListDTO()
        {
            super("trans");
            transactions = new LinkedList<>();
        }

        public TransListDTO(List<TransactionDTO> trans)
        {
            super("trans");
            this.transactions = trans;
        }

        public TransListDTO(Transaction t, TransactionResultDTO tx)
        {
            this();
            transactions.add(new TransactionDTO(t, tx));
        }

        public void addTransaction(Transaction t, TransactionResultDTO tx) {
            transactions.add(new TransactionDTO(t, tx));
        }

        /**
         * @return the transactions
         */
        public List<TransactionDTO> getTransactions() {
            return transactions;
        }
    }
}
