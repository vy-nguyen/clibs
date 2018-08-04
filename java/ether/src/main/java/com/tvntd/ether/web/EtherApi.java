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
package com.tvntd.ether.web;

import javax.servlet.http.HttpSession;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dto.EtherBlockDTO;
import com.tvntd.ether.dto.EtherTransDTO;
import com.tvntd.ether.dto.GenericResponse;
import com.tvntd.ether.dto.HashForm;
import com.tvntd.ether.dto.PublicAccountDTO;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.dto.TransactionDTO.TransListDTO;
import com.tvntd.lib.RawParseUtils;

@Controller
public class EtherApi
{
    static protected Logger s_log = LoggerFactory.getLogger(EtherApi.class);

    @Autowired
    protected ITransactionSvc etherTrans;

    @Autowired
    protected IAccountSvc accountSvc;

    @RequestMapping(value = "/api/ether", method = RequestMethod.GET)
    @ResponseBody
    public PublicAccountDTO
    getEtherStartup(HttpSession session) {
        return etherTrans.getPublicAccount();
    }

    @RequestMapping(value = "/api/ether/blkhash/{blkHash}", method = RequestMethod.GET)
    @ResponseBody
    public BlockResult
    getEtherBlockHash(@PathVariable(value = "blkHash") String blkHash) {
        return etherTrans.getBlockByHash(blkHash);
    }

    @RequestMapping(value = "/api/ether/blkno/{blkno}", method = RequestMethod.GET)
    @ResponseBody
    public BlockResult
    getEtherBlockNo(@PathVariable(value = "blkno") String blkno) {
        return etherTrans.getBlockByNumber(blkno);
    }

    /**
     * @return BlockResult for the list of hashes given by the post form.
     */
    @RequestMapping(value = "/api/ether/blkset",
        consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    EtherBlockDTO getEtherBlockHashSet(@RequestBody HashForm hash) {
        return etherTrans.getBlockByHashSet(hash.getHashes());
    }

    /**
     * @return TransactionResult for the list of hahses given by the post form.
     */
    @RequestMapping(value = "/api/ether/blkhash",
        consumes = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public EtherTransDTO getEtherTransHash(@RequestBody HashForm hash)
    {
        return null;
    }

    /**
     * @return account info with optional list of transactions.
     */
    @RequestMapping(value = "/api/ether/account",
        consumes = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public Object getAccountInfo(@RequestBody HashForm hash)
    {
        if (hash.cleanInput() == false) {
            return null;
        }
        String type = hash.getHashType();
        String[] hashes = hash.getHashes();

        switch (type) {
            case HashForm.acctType:
                return accountSvc.getAccounts(hashes, hash.getTrans());

            case HashForm.transType:

            case HashForm.blockType:

            default:
        }
        return null;
    }

    /**
     * @return range of blocks from start until start + count.
     */
    @RequestMapping(value = "/api/ether/{start}/{count}", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEhterBlocks(HttpSession session,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count)
    {
        EtherBlockDTO result = new EtherBlockDTO(start, count);
        etherTrans.getEtherBlocks(result);
        return result;
    }

    /**
     * @return the list of recent transactions from this user account starting
     * from start to start + count.
     */
    @RequestMapping(value = "/api/tudo/trans-from/{account}/{start}/{count}",
            method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEtherTransactionFrom(
            @PathVariable(value = "account") String account,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count) {
        return getEtherTransaction(account, start, count, true);
    }

    /**
     * @return the list of recent transactions to this user account starting from
     * start until start + count.
     */
    @RequestMapping(value = "/api/tudo/trans-to/{account}/{start}/{count}",
            method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEtherTransactionTo(HttpSession session,
            @PathVariable(value = "account") String account,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count) {
        return getEtherTransaction(account, start, count, false);
    }

    /**
     * @return list of recent transaction in db from start to start + count.
     */
    @RequestMapping(value = "/api/tudo/trans/{start}/{count}", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEtherTransaction(HttpSession session,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count)
    {
        int beg = RawParseUtils.parseNumber(start, 0, Integer.MAX_VALUE);
        int cnt = RawParseUtils.parseNumber(count, 1, 1000);

        return new TransListDTO(etherTrans.getRecentTransaction(beg, cnt));
    }

    @RequestMapping(value = "/api/tudo/tx-hash/{hash}", method = RequestMethod.GET)
    @ResponseBody
    public TransactionDTO
    getEtherTransactionInfo(@PathVariable(value = "hash") String hash) {
        return etherTrans.getTransaction(hash);
    }

    protected GenericResponse
    getEtherTransaction(String account, String start, String count, boolean from)
    {
        if (account == null) {
            return new GenericResponse("Missing account number");
        }
        int beg = RawParseUtils.parseNumber(start, 0, Integer.MAX_VALUE);
        int cnt = RawParseUtils.parseNumber(count, 1, 1000);

        return new TransListDTO(etherTrans.getTransactionAcct(account, beg, cnt, from));
    }
}
