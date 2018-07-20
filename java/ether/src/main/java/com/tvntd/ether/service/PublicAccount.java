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

import java.math.BigInteger;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.ethereum.jsonrpc.JsonRpc.BlockResult;
import org.ethereum.jsonrpc.TypeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.tvntd.ether.api.EtherRpcApi.EtherAcctInfo;
import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.PublicAccountDTO;
import com.tvntd.ether.rpc.JsonRpc;
import com.tvntd.ether.util.Constants;
import com.tvntd.ether.util.Convert;

@Service
public class PublicAccount
{
    // Update time interval in 5 minutes.
    //
    static long s_updateTimeInterval = (5 * 60 * 1000L);
    static Logger s_log = LoggerFactory.getLogger(PublicAccount.class);

    protected long lastPoll;
    protected boolean updateAccount;
    protected PublicAccountDTO cache;

    protected BlockResult latest;
    protected List<String> knownAccounts;
    protected Map<String, AccountInfoDTO> accounts;

    public PublicAccount()
    {
        cache = null;
        accounts = null;
        updateAccount = true;
        lastPoll = 0L;
    }

    protected boolean getAccountInfo()
    {
        if (accounts == null) {
            accounts = new HashMap<>();
            knownAccounts  = new LinkedList<>();
            for (AccountInfoDTO acct : Constants.KnownAccounts) {
                accounts.put(acct.getAccount(), acct);
                knownAccounts.add(acct.getAccount());
            }
        }
        long update = System.currentTimeMillis() - lastPoll;
        if (update < s_updateTimeInterval) {
            return false;
        }
        JsonRpc rpc = new JsonRpc();
        EtherAcctInfo result = rpc.callJsonRpcArr(EtherAcctInfo.class,
                "tudo_listAccountInfoAndBlock", "id", knownAccounts);

        if (result != null) {
            if (result.getError() == null) {
                processAccountInfo(result.accountResult());

                latest = result.getLatestBlock();
                updateAccount = false;
                lastPoll = System.currentTimeMillis();
                return true;
            }
            s_log.info("Rpc error " + result.getError().toString());
        }
        return false;
    }

    protected void processAccountInfo(List<AccountInfoDTO> result)
    {
        for (AccountInfoDTO account : result) {
            try {
                BigInteger balance = TypeConverter
                    .StringNumberAsBigInt(account.getBalance());

                AccountInfoDTO cache = accounts.get(account.getAccount());
                if (cache != null) {
                    cache.setXuBalance(Convert.toXuValue(balance));
                    cache.setBalance(account.getBalance());
                }
            } catch(Exception e) {
                System.out.println("Invaid balance " + account.getAccount());
            }
        }
    }

    public PublicAccountDTO getPublicAccount()
    {
        boolean refresh = getAccountInfo();
        if (cache == null || refresh == true) {
            cache = new PublicAccountDTO(accounts, latest);
        }
        return cache;
    }
}
