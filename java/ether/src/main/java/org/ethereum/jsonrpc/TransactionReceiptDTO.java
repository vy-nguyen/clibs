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

/**
 * Created by Ruben on 5/1/2016.
 */
public class TransactionReceiptDTO {

    public String transactionHash;  // hash of the transaction.
    public int transactionIndex;    // integer of the transactions index in the block.
    public String blockHash;        // hash of the block where this transaction was in.
    public long blockNumber;        // block number where this transaction was in.

    // The total amount of gas used when this transaction was executed in the block.
    public long cumulativeGasUsed;

    // The amount of gas used by this specific transaction alone.
    public long gasUsed;

    // The contract address created, if the transaction was a contract creation,
    // otherwise  null .
    public String contractAddress;

    // Array of log objects, which this transaction generated.
    public JsonRpc.LogFilterElement[] logs;

    /*
    public  TransactionReceiptDTO(Block block, TransactionInfo txInfo){
        TransactionReceipt receipt = txInfo.getReceipt();

        transactionHash = toJsonHex(receipt.getTransaction().getHash());
        transactionIndex = txInfo.getIndex();
        cumulativeGasUsed = ByteUtil.byteArrayToLong(receipt.getCumulativeGas());
        gasUsed = ByteUtil.byteArrayToLong(receipt.getGasUsed());
        if (receipt.getTransaction().getContractAddress() != null)
            contractAddress = toJsonHex(receipt.getTransaction().getContractAddress());
        logs = new JsonRpc.LogFilterElement[receipt.getLogInfoList().size()];
        if (block != null) {
            blockNumber = block.getNumber();
            blockHash = toJsonHex(txInfo.getBlockHash());
            for (int i = 0; i < logs.length; i++) {
                LogInfo logInfo = receipt.getLogInfoList().get(i);
                logs[i] = new JsonRpc.LogFilterElement(logInfo, block, txInfo.getIndex(),
                        txInfo.getReceipt().getTransaction(), i);
            }
        }
    }
    */
}
