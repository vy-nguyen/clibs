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
import java.util.Map;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;
import org.ethereum.jsonrpc.TransactionResultDTO;

public class PublicAccountDTO
{
    protected BlockResult latestBlock;
    protected List<AccountInfoDTO> publicAcct;
    protected List<TransactionDTO> recentTrans;

    public PublicAccountDTO(List<AccountInfoDTO> acct) {
        this.publicAcct = acct;
    }

    public PublicAccountDTO(Map<String, AccountInfoDTO> acct) {
        this.publicAcct = new LinkedList<>(acct.values());
        latestBlock = new BlockTransDetail();
    }

    public PublicAccountDTO(Map<String, AccountInfoDTO> acct, BlockResult latest) {
        this(acct);
        this.latestBlock = latest;
    }

    /**
     * @return the latestBlock
     */
    public BlockResult getLatestBlock() {
        return latestBlock;
    }

    /**
     * @param latestBlock the latestBlock to set
     */
    public void setLatestBlock(BlockResult latestBlock) {
        this.latestBlock = latestBlock;
    }

    /**
     * @return the publicAcct
     */
    public List<AccountInfoDTO> getPublicAcct() {
        return publicAcct;
    }

    /**
     * @return the recentTrans
     */
    public List<TransactionDTO> getRecentTrans() {
        return recentTrans;
    }

    /**
     * @param recentTrans the recentTrans to set
     */
    public void setRecentTrans(List<TransactionDTO> recentTrans) {
        this.recentTrans = recentTrans;
    }

    /**
     * Block having transactions detail.
     */
    public static class BlockTransDetail extends BlockResult
    {
        public TransactionResultDTO[] transactions;

        public BlockTransDetail() {
            transactions = new TransactionResultDTO[2];
        }
    }

    /**
     * Block having only transaction hashes.
     */
    public static class BlockTransaction extends BlockResult
    {
        public String[] transactions;
    }
}
