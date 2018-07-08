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
package com.tvntd.ether.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dto.EtherBlockDTO;
import com.tvntd.ether.dto.EtherBlockDTO.EtherBlockResult;
import com.tvntd.ether.dto.PublicAccountDTO;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.rpc.JsonRpc;

@Service
@Transactional
public class TransactionSvc implements ITransactionSvc
{
    static Logger s_log = LoggerFactory.getLogger(TransactionSvc.class);
    static int maxBlockCached = 10000;

    protected LinkedList<BlockRange> cacheRange;
    protected Map<Long, BlockResult> cacheBlocks;

    @Autowired
    protected PublicAccount pubAccounts;

    static class BlockRange
    {
        Long start;
        int count;

        BlockRange(Long start, int count)
        {
            this.start = start;
            this.count = count;
        }
    }

    public TransactionSvc()
    {
        cacheBlocks = new HashMap<>();
        cacheRange = new LinkedList<>();
    }

    public TransactionDTO getTransaction(String txHash)
    {
        return null;
    }

    public List<TransactionDTO> getTransaction(String userUuid, boolean from)
    {
        return null;
    }

    public List<TransactionDTO> getTransactionAcct(String account, boolean from)
    {
        return null;
    }

    public List<TransactionDTO> getAllTransaction()
    {
        return null;
    }

    public PublicAccountDTO getPublicAccount()
    {
        return pubAccounts.getPublicAccount();
    }

    public void getEtherBlocks(EtherBlockDTO blocks) {
        blocks.addBlockResult(
                fetchBlocks(blocks.fetchStartBlock(), blocks.fetchCount()));
    }

    List<BlockResult> fetchBlocks(String start, String count)
    {
        Long startBlk = Long.parseLong(start);
        Integer num = Integer.parseInt(count);

        List<BlockResult> result = new LinkedList<>();
        synchronized(this) {
            for (int i = 0; i < num; i++) {
                BlockResult block = cacheBlocks.get(startBlk - i);
                if (block == null) {
                    startBlk = startBlk - i;
                    num = num - i;
                    break;
                }
                result.add(block);
            }
        }
        if (result.size() == num) {
            return result;
        }
        List<String> params = new LinkedList<>();
        params.add(startBlk.toString());
        params.add(num.toString());
        params.add("true");

        JsonRpc rpc = new JsonRpc();
        EtherBlockResult out = rpc.callJsonRpc(EtherBlockResult.class,
                "tudo_listBlocks", "id", params);

        if (out != null && out.getError() == null) {
            cacheBlockResult(out, startBlk, num);
            result = out.blockResult();
        }
        return result;
    }

    void cacheBlockResult(EtherBlockResult result, Long startBlk, Integer num)
    {
        BlockRange range = new BlockRange(startBlk, num);

        synchronized(this) {
            if (cacheBlocks.size() > maxBlockCached) {
                // Dumb cache algorithm.
                //
                BlockRange oldest = cacheRange.removeFirst();
                for (int i = 0; i < oldest.count; i++) {
                    cacheBlocks.remove(oldest.start - i);
                }
                System.out.println("Evicted oldest range from " +
                        oldest.start + " count " + oldest.count);
            }
            cacheRange.add(range);
            List<BlockResult> res = result.blockResult();

            for (BlockResult block : res) {
                if (block == null) {
                    continue;
                }
                int radix = 10;
                String number = block.number;

                if (block.number.startsWith("0x")) {
                    radix = 16;
                    number = number.substring(2);
                }
                try {
                    Long val = Long.parseLong(number, radix);
                    cacheBlocks.put(val, block);

                } catch(NumberFormatException e) {
                    s_log.info("Failed to parse " + block.number);
                }
            }
        }
    }
}
