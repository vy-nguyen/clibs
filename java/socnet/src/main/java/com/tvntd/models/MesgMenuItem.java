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

/**
 * Items under message menu.
 */
@Embeddable
public class MesgMenuItem
{
    public String mesgUrl;
    public String mesgImgUrl;
    public String mesgHeader;
    public String mesgTime;
    public String mesgContent;

    public MesgMenuItem() {}
    public MesgMenuItem(String url, String imgUrl, String hdr,
            String time, String content)
    {
        mesgUrl = url;
        mesgImgUrl = imgUrl;
        mesgHeader = hdr;
        mesgTime = time;
        mesgContent = content;
    }

    /**
     * @return the mesgUrl
     */
    public String getMesgUrl() {
        return mesgUrl;
    }

    /**
     * @param mesgUrl the mesgUrl to set
     */
    public void setMesgUrl(String mesgUrl) {
        this.mesgUrl = mesgUrl;
    }

    /**
     * @return the mesgImg
     */
    public String getMesgImgUrl() {
        return mesgImgUrl;
    }

    /**
     * @param mesgImg the mesgImg to set
     */
    public void setMesgImgUrl(String mesgImg) {
        this.mesgImgUrl = mesgImg;
    }

    /**
     * @return the mesgHeader
     */
    public String getMesgHeader() {
        return mesgHeader;
    }

    /**
     * @param mesgHeader the mesgHeader to set
     */
    public void setMesgHeader(String mesgHeader) {
        this.mesgHeader = mesgHeader;
    }

    /**
     * @return the mesgTime
     */
    public String getMesgTime() {
        return mesgTime;
    }

    /**
     * @param mesgTime the mesgTime to set
     */
    public void setMesgTime(String mesgTime) {
        this.mesgTime = mesgTime;
    }

    /**
     * @return the mesgContent
     */
    public String getMesgContent() {
        return mesgContent;
    }

    /**
     * @param mesgContent the mesgContent to set
     */
    public void setMesgContent(String mesgContent) {
        this.mesgContent = mesgContent;
    }
}
