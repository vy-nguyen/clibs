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
package com.tvntd.models;

import javax.persistence.Embeddable;

import com.tvntd.lib.ObjectId;

@Embeddable
public class ChainLinks
{
    private String   chainTag;
    private String   chainFmt;
    private ObjectId chainRoot;

    public ChainLinks() {
        super();
    }

    /**
     * @return the chainTag
     */
    public String getChainTag() {
        return chainTag;
    }

    /**
     * @param chainTag the chainTag to set
     */
    public void setChainTag(String chainTag) {
        this.chainTag = chainTag;
    }

    /**
     * @return the chainFmt
     */
    public String getChainFmt() {
        return chainFmt;
    }

    /**
     * @param chainFmt the chainFmt to set
     */
    public void setChainFmt(String chainFmt) {
        this.chainFmt = chainFmt;
    }

    /**
     * @return the chainRoot
     */
    public ObjectId getChainRoot() {
        return chainRoot;
    }

    /**
     * @param chainRoot the chainRoot to set
     */
    public void setChainRoot(ObjectId chainRoot) {
        this.chainRoot = chainRoot;
    }
}
