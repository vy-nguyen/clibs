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
 * Created by Ruben on 8/1/2016.
 */
public class TransactionResultDTO {

    public String hash;
    public String nonce;
    public String blockHash;
    public String blockNumber;
    public String transactionIndex;

    public String from;
    public String to;
    public String gas;
    public String gasPrice;
    public String value;
    public String input;
    public String v;
    public String r;
    public String s;

    public TransactionResultDTO() {}

    @Override
    public String toString() {
        return "TransactionResultDTO{" +
                "hash='" + hash + '\'' +
                ", nonce='" + nonce + '\'' +
                ", blockHash='" + blockHash + '\'' +
                ", blockNumber='" + blockNumber + '\'' +
                ", transactionIndex='" + transactionIndex + '\'' +
                ", from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", gas='" + gas + '\'' +
                ", gasPrice='" + gasPrice + '\'' +
                ", value='" + value + '\'' +
                ", input='" + input + '\'' +
                '}';
    }
}
