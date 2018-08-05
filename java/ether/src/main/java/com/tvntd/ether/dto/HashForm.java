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

import java.util.Arrays;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.tvntd.lib.Util;

public class HashForm
{
    public static final String acctType  = "acct";
    public static final String blockType = "block";
    public static final String transType = "trans";

    protected String hashType;
    protected boolean trans;
    protected String[] hashes;

    public boolean cleanInput()
    {
        if (hashes == null) {
            return false;
        }
        Whitelist wlist = Util.allowedTags;
        if (hashType != null) {
            hashType = Jsoup.clean(hashType, wlist);
        }
        String[] cleanHash = new String[hashes.length];
        for (int i = 0; i < hashes.length; i++) {
            cleanHash[i] = Jsoup.clean(hashes[i], wlist);
        }
        hashes = cleanHash;
        return true;
    }

    /**
     * @return the hashType
     */
    public String getHashType() {
        return hashType;
    }

    /**
     * @return the trans
     */
    public boolean isTrans() {
        return trans;
    }

    /**
     * @return the trans
     */
    public Boolean getTrans() {
        return trans;
    }

    /**
     * @return the hashes
     */
    public String[] getHashes() {
        return hashes;
    }

    public List<String> fetchHashList() {
        return Arrays.asList(hashes);
    }
}
