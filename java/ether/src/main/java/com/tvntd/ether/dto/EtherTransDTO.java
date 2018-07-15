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

import org.ethereum.jsonrpc.TransactionResultDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.ether.api.EtherRpcApi.RpcResponse;
import com.tvntd.ether.models.Transaction;

public class EtherTransDTO extends GenericResponse
{
    protected List<TransactionDTO> transactions;

    public EtherTransDTO(String text) {
        super(text);
    }

    public EtherTransDTO(String text, List<TransactionDTO> trans)
    {
        super(text);
        this.transactions = trans;
    }

    public EtherTransDTO(Transaction tx)
    {
        super("trans");
        transactions = new LinkedList<>();
        transactions.add(new TransactionDTO(tx, null));
    }

    public void addTransaction(Transaction t)
    {
        if (transactions == null) {
            transactions = new LinkedList<>();
        }
        transactions.add(new TransactionDTO(t, null));
    }

    /**
     * @return the transactions
     */
    public List<TransactionDTO> getTransactions() {
        return transactions;
    }

    /**
     * @param transactions the transactions to set
     */
    public void setTransactions(List<TransactionDTO> transactions) {
        this.transactions = transactions;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EtherTransResult extends RpcResponse
    {
        protected Result result;

        /**
         * @return the result
         */
        public Result getResult() {
            return result;
        }

        public List<TransactionResultDTO> fetchTrans() {
            return result.getTrans();
        }

        static class Result
        {
            protected List<TransactionResultDTO> trans;

            /**
             * @return the trans
             */
            public List<TransactionResultDTO> getTrans() {
                return trans;
            }
        }
    }
}
