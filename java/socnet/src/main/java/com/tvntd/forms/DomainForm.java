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
package com.tvntd.forms;

import javax.validation.constraints.Size;

public class DomainForm
{
    @Size(max = 64)
    private String authorUuid;;

    @Size(max = 64)
    private String domain;

    @Size(max = 64)
    private String loginMainImg;

    @Size(max = 64)
    private String loginFootImg;

    @Size(max = 128)
    private String loginHdr;

    @Size(max = 512)
    private String loginTxt;

    @Size(max = 128)
    private String footHdr;

    @Size(max = 512)
    private String footTxt;

    /**
     * @return the authorUuid
     */
    public String getAuthorUuid() {
        return authorUuid;
    }

    public boolean cleanInput()
    {
        return true;
    }

    /**
     * @param authorUuid the authorUuid to set
     */
    public void setAuthorUuid(String authorUuid) {
        this.authorUuid = authorUuid;
    }

    /**
     * @return the domain
     */
    public String getDomain() {
        return domain;
    }

    /**
     * @param domain the domain to set
     */
    public void setDomain(String domain) {
        this.domain = domain;
    }

    /**
     * @return the loginMainImg
     */
    public String getLoginMainImg() {
        return loginMainImg;
    }

    /**
     * @param loginMainImg the loginMainImg to set
     */
    public void setLoginMainImg(String loginMainImg) {
        this.loginMainImg = loginMainImg;
    }

    /**
     * @return the loginFootImg
     */
    public String getLoginFootImg() {
        return loginFootImg;
    }

    /**
     * @param loginFootImg the loginFootImg to set
     */
    public void setLoginFootImg(String loginFootImg) {
        this.loginFootImg = loginFootImg;
    }

    /**
     * @return the loginHdr
     */
    public String getLoginHdr() {
        return loginHdr;
    }

    /**
     * @param loginHdr the loginHdr to set
     */
    public void setLoginHdr(String loginHdr) {
        this.loginHdr = loginHdr;
    }

    /**
     * @return the loginTxt
     */
    public String getLoginTxt() {
        return loginTxt;
    }

    /**
     * @param loginTxt the loginTxt to set
     */
    public void setLoginTxt(String loginTxt) {
        this.loginTxt = loginTxt;
    }

    /**
     * @return the footHdr
     */
    public String getFootHdr() {
        return footHdr;
    }

    /**
     * @param footHdr the footHdr to set
     */
    public void setFootHdr(String footHdr) {
        this.footHdr = footHdr;
    }

    /**
     * @return the footTxt
     */
    public String getFootTxt() {
        return footTxt;
    }

    /**
     * @param footTxt the footTxt to set
     */
    public void setFootTxt(String footTxt) {
        this.footTxt = footTxt;
    }
}
