/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
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
 * Fill in template notification-fmt.jsp
 */
@Embeddable
public class NotifyItem
{
    public String fmtMesg;
    public String mesgUrl;
    public String mesgContent;

    public NotifyItem() {}
    public NotifyItem(String fmt, String url, String content)
    {
        fmtMesg = fmt;
        mesgUrl = url;
        mesgContent = content;
    }

    /**
     * @return the fmtMesg
     */
    public String getFmtMesg() {
        return fmtMesg;
    }

    /**
     * @param fmtMesg the fmtMesg to set
     */
    public void setFmtMesg(String fmtMesg) {
        this.fmtMesg = fmtMesg;
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
