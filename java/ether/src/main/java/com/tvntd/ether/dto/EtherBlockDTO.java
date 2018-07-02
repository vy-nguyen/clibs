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

import java.util.List;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tvntd.ether.api.EtherRpcApi.RpcResponse;

public class EtherBlockDTO extends GenericResponse
{
    protected String startBlock;
    protected String count;
    protected List<BlockResult> blocks;

    public EtherBlockDTO(String start, String count)
    {
        super("Ok");
        this.startBlock = start;
        this.count = count;
    }

    public void addBlockResult(List<BlockResult> blocks) {
        this.blocks = blocks;
    }

    public String fetchStartBlock() {
        return startBlock;
    }

    public String fetchCount() {
        return count;
    }

    /*
     * JSON values
     */
    public Long getStartBlock() {
        return Long.parseLong(startBlock);
    }

    public Integer getCount() {
        return Integer.parseInt(count);
    }

    /**
     * @return the blocks
     */
    public List<BlockResult> getBlocks() {
        return blocks;
    }

    public void dumpOut()
    {
        if (blocks == null) {
            System.out.println("Empty");
            return;
        }
        for (BlockResult b : blocks) {
            System.out.println(b);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EtherBlockResult extends RpcResponse
    {
        protected Result result;

        @JsonProperty(value = "result")
        public Result getResult() {
            return result;
        }

        public List<BlockResult> blockResult()
        {
            if (result != null) {
                return result.getBlocks();
            }
            return null;
        }

        static class Result
        {
            protected String error;
            protected List<BlockResult> blocks;

            /**
             * @return the error
             */
            public String getError() {
                return error;
            }

            /**
             * @return the blocks
             */
            @JsonProperty(value = "blocks")
            public List<BlockResult> getBlocks() {
                return blocks;
            }
        }
    }
}
