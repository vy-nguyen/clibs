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
import com.tvntd.ether.dto.EtherBlockDTO.EtherBlock;
import com.tvntd.ether.dto.EtherBlockDTO.EtherBlockResult;
import com.tvntd.ether.dto.EtherTransDTO.EtherTransResult;
import com.tvntd.ether.dto.PublicAccountDTO;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.models.Transaction;
import com.tvntd.ether.rpc.JsonRpc;
import com.tvntd.lib.LRUCache;
import com.tvntd.lib.RawParseUtils;

@Service
@Transactional
public class TransactionSvc implements ITransactionSvc
{
    static Logger s_log = LoggerFactory.getLogger(TransactionSvc.class);
    static int maxBlockCached = 10000;
    static int maxTransCached = 30000;

    static class BlockLRU extends LRUCache<Long, String, BlockResult>
    {
        static final long serialVersionUID = 123456789L;

        public BlockLRU(int initSize, int maxSize) {
            super(initSize, maxSize);
        }

        @Override
        public String getIndexKey(BlockResult blk) {
            return blk.hash;
        }
    }

    static BlockLRU s_cacheBlock;
    static LRUCache<String, String, TransactionDTO> s_cacheTrans;

    static {
        s_cacheTrans = new LRUCache<>(1000, maxTransCached);
        s_cacheBlock = new BlockLRU(1000, maxBlockCached);
        s_cacheBlock.createIndex();
    }

    @Autowired
    protected PublicAccount pubAccounts;

    @Autowired
    protected TransactionRepo transRepo;

    public TransactionDTO getTransaction(String txHash)
    {
        TransactionDTO tx = s_cacheTrans.get(txHash);
        if (tx != null) {
            return tx;
        }
        JsonRpc rpc = new JsonRpc();
        List<String> transHash = new LinkedList<>();

        transHash.add(txHash);
        EtherTransResult resp = rpc.<EtherTransResult>
            callJsonRpcArr(EtherTransResult.class, "tudo_listTrans", "id", transHash);

        List<TransactionResultDTO> out = resp.fetchTrans();
        if (out != null) {
            Transaction t = transRepo.findByTxHash(txHash);
            for (TransactionResultDTO curTx : out) {
                TransactionDTO dto = new TransactionDTO(t, curTx);
                s_cacheTrans.put(curTx.hash, dto);
                return dto;
            }
        }
        return null;
    }

    /**
     * Return a block by hash number.
     */
    public BlockResult getBlockByHash(String hash)
    {
        BlockResult res = s_cacheBlock.getIndex(hash);
        if (res != null) {
            return res;
        }
        JsonRpc rpc = new JsonRpc();
        EtherBlock resp = rpc.<EtherBlock> callJsonRpcArg(
                EtherBlock.class, "eth_getBlockByHash", "id", hash, new Boolean(true));

        if (resp != null) {
            res = resp.getResult();
            if (res != null) {
                s_cacheBlock.put(RawParseUtils.parseLong(res.number), res);
            }
            return res;
        }
        return null;
    }

    /**
     * Return blocks based on hashes
     */
    public EtherBlockDTO getBlockByHashSet(String[] hashes)
    {
        EtherBlockDTO out = new EtherBlockDTO(null, null);
        List<String> missing = new LinkedList<>();

        for (String h : hashes) {
            BlockResult blk = s_cacheBlock.getIndex(h);
            if (blk != null) {
                out.addBlock(blk);
            } else {
                missing.add(h);
            }
        }
        if (missing.isEmpty()) {
            return out;
        }
        JsonRpc rpc = new JsonRpc();
        EtherBlockResult resp = rpc.<EtherBlockResult> callJsonRpcArr(
                EtherBlockResult.class, "tudo_listBlockHash", "id", missing);

        if (resp != null && resp.getError() == null) {
            List<BlockResult> blocks = resp.blockResult();
            if (blocks != null) {
                for (BlockResult blk : blocks) {
                    out.addBlock(blk);
                }
            }
        }
        return out;
    }

    /**
     * Return a block by block number.
     */
    public BlockResult getBlockByNumber(String number)
    {
        BlockResult res = s_cacheBlock.get(RawParseUtils.parseLong(number));
        if (res != null) {
            return res;
        }
        JsonRpc rpc = new JsonRpc();
        EtherBlock resp = rpc.<EtherBlock> callJsonRpcArg(EtherBlock.class,
                "eth_getBlockByNumber", "id", number, new Boolean(true));

        if (resp != null) {
            res = resp.getResult();
            if (res != null) {
                s_cacheBlock.put(RawParseUtils.parseLong(res.number), res);
            }
            return res;
        }
        return null;
    }

    /**
     * Get transactions for an user uuid.
     */
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

    /**
     * Get transaction for an account key.
     */
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

    /**
     * Return all transactions recorded.
     */
    public List<TransactionDTO> getAllTransaction() {
        return transToDTO(transRepo.findAll());
    }

    /**
     * Return the list of recent transaction.
     */
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
            for (Transaction t : trans) {
                String h = t.getTxHash();
                TransactionDTO tx = s_cacheTrans.get(h);
                if (tx != null) {
                    out.add(tx);
                } else {
                    missing.put(h, t);
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
        for (TransactionResultDTO tx : out) {
            Transaction t = miss.get(tx.hash);
            if (t == null) {
                s_log.warn("Receive invalid hash " + tx.hash);
                continue;
            }
            TransactionDTO txDto = new TransactionDTO(t, tx);
            result.add(txDto);
            s_cacheTrans.put(tx.hash, txDto);
        }
    }

    /**
     * Retrieve info about public accounts.
     */
    public PublicAccountDTO getPublicAccount()
    {
        PublicAccountDTO out = pubAccounts.getPublicAccount();
        out.setRecentTrans(getRecentTransaction(0, 100));
        return out;
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
        Long startBlk = RawParseUtils.parseLong(start);
        Integer num = RawParseUtils.parseNumber(count, 1, 1000);

        List<BlockResult> result = new LinkedList<>();
        for (int i = 0; i < num; i++) {
            BlockResult block = s_cacheBlock.get(startBlk - i);
            if (block == null) {
                startBlk = startBlk - i;
                num = num - i;
                break;
            }
            result.add(block);
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
        List<BlockResult> res = result.blockResult();

        if (res == null) {
            return;
        }
        for (BlockResult block : res) {
            if (block == null) {
                continue;
            }
            Long blkNo = RawParseUtils.parseLong(block.number);
            s_cacheBlock.put(blkNo, block);
        }
    }
}
