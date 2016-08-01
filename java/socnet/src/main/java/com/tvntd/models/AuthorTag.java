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

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Transient;

@Embeddable
public class AuthorTag
{
    @Column(length = 64)
    private byte[] tag;

    @Column(length = 40)
    private String headNotif;

    private boolean  favorite;
    private Long     rank;
    private Long     notifCount;
    private String   headChain;

    @Transient
    private String   tagName;

    public AuthorTag() {}
    public AuthorTag(String name, Long rank, boolean fav)
    {
        this.tag = name.getBytes(Charset.forName("UTF-8"));
        this.favorite = fav;
        this.rank = rank;
        this.notifCount = 0L;
    }

    public byte[] fetchTag() {
        return tag;
    }

    /**
     * @return the tag
     */
    public String getTag()
    {
        if (tagName != null) {
            return tagName;
        }
        try {
            tagName = new String(tag, "UTF-8");
            return tagName;

        } catch(UnsupportedEncodingException e) {
        }
        return null;
    }

    /**
     * @param tag the tag to set
     */
    public void setTag(String tag)
    {
        this.tagName = tag;
        this.tag = tag.getBytes(Charset.forName("UTF-8"));
    }

    /**
     * @return the favorite
     */
    public boolean isFavorite() {
        return favorite;
    }

    /**
     * @return the rank
     */
    public Long getRank() {
        return rank;
    }

    /**
     * @param rank the rank to set
     */
    public void setRank(Long rank) {
        this.rank = rank;
    }

    /**
     * @return the notifCount
     */
    public Long getNotifCount() {
        return notifCount;
    }

    /**
     * @param notifCount the notifCount to set
     */
    public void setNotifCount(Long notifCount) {
        this.notifCount = notifCount;
    }

    /**
     * @return the headNotif
     */
    public String getHeadNotif() {
        return headNotif;
    }

    /**
     * @param headNotif the headNotif to set
     */
    public void setHeadNotif(String headNotif) {
        this.headNotif = headNotif;
    }

    /**
     * @return the headChain
     */
    public String getHeadChain() {
        return headChain;
    }

    /**
     * @param headChain the headChain to set
     */
    public void setHeadChain(String headChain) {
        this.headChain = headChain;
    }
}
