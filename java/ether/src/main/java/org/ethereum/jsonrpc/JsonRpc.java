/*
 * Copyright (c) [2016] [ <ether.camp> ]
 * This file is part of the ethereumJ library.
 *
 * The ethereumJ library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ethereumJ library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with the ethereumJ library. If not, see <http://www.gnu.org/licenses/>.
 */
package org.ethereum.jsonrpc;

import java.util.Arrays;

/**
 * Created by Anton Nashatyrev on 25.11.2015.
 */
public interface JsonRpc
{
    public class SyncingResult {
        public String startingBlock;
        public String currentBlock;
        public String highestBlock;

        @Override
        public String toString() {
            return "SyncingResult{" +
                    "startingBlock='" + startingBlock + '\'' +
                    ", currentBlock='" + currentBlock + '\'' +
                    ", highestBlock='" + highestBlock + '\'' +
                    '}';
        }
    }

    public class CallArguments {
        public String from;
        public String to;
        public String gas;
        public String gasPrice;
        public String value;
        public String data; // compiledCode
        public String nonce;

        @Override
        public String toString() {
            return "CallArguments{" +
                    "from='" + from + '\'' +
                    ", to='" + to + '\'' +
                    ", gasLimit='" + gas + '\'' +
                    ", gasPrice='" + gasPrice + '\'' +
                    ", value='" + value + '\'' +
                    ", data='" + data + '\'' +
                    ", nonce='" + nonce + '\'' +
                    '}';
        }
    }

    public class BlockResult {
        public String mixHash;
        public String number;     // QUANTITY - the block number. null when pending
        public String hash;       // DATA, 32 Bytes - hash of the block. null pending
        public String parentHash; // DATA, 32 Bytes - hash of the parent block.
        public String nonce;      // DATA, 8 Bytes
        public String sha3Uncles; // DATA, 32 Bytes - SHA3 of uncles data in the block.

        // DATA, 256 Bytes - bloom filter for logs of the block. null when pending
        public String logsBloom;

        // DATA, 32 Bytes - the root of the transaction trie of the block.
        public String transactionsRoot;

        // DATA, 32 Bytes - the root of the final state trie of the block.
        public String stateRoot;

        // DATA, 32 Bytes - the root of the receipts trie of the block.
        public String receiptsRoot;

        // DATA, 20 Bytes - the address of the miner
        public String miner;

        // QUANTITY - integer of the difficulty for this block.
        public String difficulty;

        // QUANTITY - integer of the total difficulty of the chain until this block.
        public String totalDifficulty;

        public String extraData; // DATA - the "extra data" field of this block
        public String size;      // QUANTITY - integer the size of this block in bytes.
        public String gasLimit;  // QUANTITY - the maximum gas allowed in this block.

        // QUANTITY - the total used gas by all transactions in this block.
        public String gasUsed;

        // QUANTITY - the unix timestamp for when the block was collated.
        public String timestamp;

        // Array - Array of transaction objects, or 32 Bytes transaction hashes
        // depending on the last given parameter.
        public Object[] transactions;

        public String[] uncles;  // Array - Array of uncle hashes.

        @Override
        public String toString() {
            return "BlockResult{" +
                    "number='" + number + '\'' +
                    ", hash='" + hash + '\'' +
                    ", parentHash='" + parentHash + '\'' +
                    ", nonce='" + nonce + '\'' +
                    ", sha3Uncles='" + sha3Uncles + '\'' +
                    ", logsBloom='" + logsBloom + '\'' +
                    ", transactionsRoot='" + transactionsRoot + '\'' +
                    ", stateRoot='" + stateRoot + '\'' +
                    ", receiptsRoot='" + receiptsRoot + '\'' +
                    ", miner='" + miner + '\'' +
                    ", difficulty='" + difficulty + '\'' +
                    ", totalDifficulty='" + totalDifficulty + '\'' +
                    ", extraData='" + extraData + '\'' +
                    ", size='" + size + '\'' +
                    ", gasLimit='" + gasLimit + '\'' +
                    ", gasUsed='" + gasUsed + '\'' +
                    ", timestamp='" + timestamp + '\'' +
                    ", transactions=" + Arrays.toString(transactions) +
                    ", uncles=" + Arrays.toString(uncles) +
                    '}';
        }
    }

    class CompilationResult {
        public String code;
        public CompilationInfo info;

        @Override
        public String toString() {
            return "CompilationResult{" +
                    "code='" + code + '\'' +
                    ", info=" + info +
                    '}';
        }
    }

    class CompilationInfo {
        public String source;
        public String language;
        public String languageVersion;
        public String compilerVersion;
        public String userDoc;
        public String developerDoc;

        @Override
        public String toString() {
            return "CompilationInfo{" +
                    "source='" + source + '\'' +
                    ", language='" + language + '\'' +
                    ", languageVersion='" + languageVersion + '\'' +
                    ", compilerVersion='" + compilerVersion + '\'' +
                    ", userDoc='" + userDoc + '\'' +
                    ", developerDoc='" + developerDoc + '\'' +
                    '}';
        }
    }

    class FilterRequest {
        public String fromBlock;
        public String toBlock;
        public Object address;
        public Object[] topics;

        @Override
        public String toString() {
            return "FilterRequest{" +
                    "fromBlock='" + fromBlock + '\'' +
                    ", toBlock='" + toBlock + '\'' +
                    ", address=" + address +
                    ", topics=" + Arrays.toString(topics) +
                    '}';
        }
    }

    class LogFilterElement {
        public String logIndex;
        public String blockNumber;
        public String blockHash;
        public String transactionHash;
        public String transactionIndex;
        public String address;
        public String data;
        public String[] topics;

        @Override
        public String toString() {
            return "LogFilterElement{" +
                    "logIndex='" + logIndex + '\'' +
                    ", blockNumber='" + blockNumber + '\'' +
                    ", blockHash='" + blockHash + '\'' +
                    ", transactionHash='" + transactionHash + '\'' +
                    ", transactionIndex='" + transactionIndex + '\'' +
                    ", address='" + address + '\'' +
                    ", data='" + data + '\'' +
                    ", topics=" + Arrays.toString(topics) +
                    '}';
        }
    }
}
