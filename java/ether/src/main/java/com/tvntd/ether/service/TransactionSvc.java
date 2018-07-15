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
import org.ethereum.jsonrpc.TransactionResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dao.TransactionRepo;
import com.tvntd.ether.dto.EtherBlockDTO;
import com.tvntd.ether.dto.EtherBlockDTO.EtherBlockResult;
import com.tvntd.ether.dto.EtherTransDTO.EtherTransResult;
import com.tvntd.ether.dto.PublicAccountDTO;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.models.Transaction;
import com.tvntd.ether.rpc.JsonRpc;
import com.tvntd.lib.LRUCache;

@Service
@Transactional
public class TransactionSvc implements ITransactionSvc
{
    static Logger s_log = LoggerFactory.getLogger(TransactionSvc.class);
    static int maxBlockCached = 10000;
    static int maxTransCached = 30000;

    protected LinkedList<BlockRange> cacheRange;
    protected Map<Long, BlockResult> cacheBlocks;
    protected LRUCache<String, TransactionDTO> cacheTrans;

    @Autowired
    protected PublicAccount pubAccounts;

    @Autowired
    protected TransactionRepo transRepo;

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
        cacheTrans = new LRUCache<>(1000, maxTransCached);
    }

    public TransactionDTO getTransaction(String txHash)
    {
        synchronized(cacheTrans) {
            TransactionDTO tx = cacheTrans.get(txHash);
            if (tx != null) {
                return tx;
            }
        }
        JsonRpc rpc = new JsonRpc();
        List<String> transHash = new LinkedList<>();

        transHash.add(txHash);
        EtherTransResult resp = rpc.<EtherTransResult>
            callJsonRpcArr(EtherTransResult.class, "tudo_listTrans", "id", transHash);

        List<TransactionResultDTO> out = resp.fetchTrans();
        if (out != null) {
            Transaction t = transRepo.findByTxHash(txHash);
            for (TransactionResultDTO tx : out) {
                TransactionDTO dto = new TransactionDTO(t, tx);
                synchronized(cacheTrans) {
                    cacheTrans.put(tx.hash, dto);
                }
                return dto;
            }
        }
        return null;
    }

    public List<TransactionDTO>
    getTransaction(String userUuid, int start, int count, boolean from)
    {
        Sort sort = new Sort(new Sort.Order(Direction.ASC, "created"));
        Pageable pageable = new PageRequest(start, start + count, sort);

        if (from == true) {
            return transToDTO(transRepo.findAllByFromUuid(pageable, userUuid));
        }
        return transToDTO(transRepo.findAllByToUuid(pageable, userUuid));
    }

    public List<TransactionDTO>
    getTransactionAcct(String account, int start, int count, boolean from)
    {
        Sort sort = new Sort(new Sort.Order(Direction.ASC, "created"));
        Pageable pageable = new PageRequest(start, start + count, sort);

        if (from == true) {
            return transToDTO(transRepo.findAllByFromAcct(pageable, account));
        }
        return transToDTO(transRepo.findAllByToAcct(pageable, account));
    }

    public List<TransactionDTO> getAllTransaction() {
        return transToDTO(transRepo.findAll());
    }

    public List<TransactionDTO> getRecentTransaction(int start, int count)
    {
        Sort sort = new Sort(new Sort.Order(Direction.ASC, "created"));
        Pageable pageable = new PageRequest(start, start + count, sort);

        return transToDTO(transRepo.findAllByOrderByCreatedAsc(pageable));
    }

    protected List<TransactionDTO> transToDTO(List<Transaction> trans)
    {
        List<TransactionDTO> out = new LinkedList<>();
        Map<String, Transaction> missing = new HashMap<>();

        if (trans != null) {
            synchronized(cacheTrans) {
                for (Transaction t : trans) {
                    String h = t.getTxHash();
                    TransactionDTO tx = cacheTrans.get(h);
                    if (tx != null) {
                        out.add(tx);
                    } else {
                        missing.put(h, t);
                    }
                }
            }
        }
        if (!missing.isEmpty()) {
            cacheTransactionResult(missing, out);
        }
        missing.clear();
        return out;
    }

    /**
     * Cache transaction result from blockchain.
     */
    protected void
    cacheTransactionResult(Map<String, Transaction> miss, List<TransactionDTO> result)
    {
        JsonRpc rpc = new JsonRpc();
        List<String> transHash = new LinkedList<>();

        for (Transaction t : miss.values()) {
            transHash.add(t.getTxHash());
        }
        EtherTransResult resp = rpc.<EtherTransResult>
            callJsonRpcArr(EtherTransResult.class, "tudo_listTrans", "id", transHash);

        List<TransactionResultDTO> out = resp.fetchTrans();
        synchronized(cacheTrans) {
            for (TransactionResultDTO tx : out) {
                Transaction t = miss.get(tx.hash);
                if (t == null) {
                    s_log.warn("Receive invalid hash " + tx.hash);
                    continue;
                }
                TransactionDTO txDto = new TransactionDTO(t, tx);
                result.add(txDto);
                cacheTrans.put(tx.hash, txDto);
            }
        }
    }

    /**
     * Retrieve info about public accounts.
     */
    public PublicAccountDTO getPublicAccount() {
        return pubAccounts.getPublicAccount();
    }

    /**
     * Fill in Ethereum block data.
     */
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
