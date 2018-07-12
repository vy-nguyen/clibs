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

import com.tvntd.ether.models.Transaction;

public class TransactionDTO
{
    protected Transaction tx;

    public TransactionDTO() {}

    public TransactionDTO(Transaction trans)
    {
        this.tx = trans;
        if (this.tx == null) {
            this.tx = new Transaction();
        }
    }

    /**
     * @return the txHash
     */
    public String getTxHash() {
        return tx.getTxHash();
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
        return tx.getFromAcct();
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
        return tx.getToAcct();
    }

    public static class TransListDTO extends GenericResponse
    {
        protected List<TransactionDTO> transactions;

        public TransListDTO() {
            super("trans");
        }

        public TransListDTO(List<TransactionDTO> trans)
        {
            super("trans");
            this.transactions = trans;
        }

        public TransListDTO(Transaction tx)
        {
            super("trans");
            transactions = new LinkedList<>();
            transactions.add(new TransactionDTO(tx));
        }

        public void addTransaction(Transaction t)
        {
            if (transactions == null) {
                transactions = new LinkedList<>();
            }
            transactions.add(new TransactionDTO(t));
        }

        /**
         * @return the transactions
         */
        public List<TransactionDTO> getTransactions() {
            return transactions;
        }
    }
}
