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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Domain
{
    @Id
    @Column(length = 64)
    String domain;

    Long authorId;

    @Column(length = 64)
    String authorUuid;

    @Column(length = 64)
    String loginMainImg;

    @Column(length = 64)
    String loginFootImg;

    @Column(length = 128)
    byte[] loginHdr;

    @Column(length = 512)
    byte[] loginTxt;

    @Column(length = 64)
    byte[] footHdr;

    @Column(length = 512)
    byte[] footTxt;

    public Domain() {}
    public Domain(String name, String authorUuid, Long authorId)
    {
        this.domain     = name;
        this.authorId   = authorId;
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
     * @return the authorId
     */
    public Long getAuthorId() {
        return authorId;
    }

    /**
     * @param authorId the authorId to set
     */
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    /**
     * @return the authorUuid
     */
    public String getAuthorUuid() {
        return authorUuid;
    }

    /**
     * @param authorUuid the authorUuid to set
     */
    public void setAuthorUuid(String authorUuid) {
        this.authorUuid = authorUuid;
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
    public byte[] getLoginHdr() {
        return loginHdr;
    }

    /**
     * @param loginHdr the loginHdr to set
     */
    public void setLoginHdr(byte[] loginHdr) {
        this.loginHdr = loginHdr;
    }

    /**
     * @return the loginTxt
     */
    public byte[] getLoginTxt() {
        return loginTxt;
    }

    /**
     * @param loginTxt the loginTxt to set
     */
    public void setLoginTxt(byte[] loginTxt) {
        this.loginTxt = loginTxt;
    }

    /**
     * @return the footHdr
     */
    public byte[] getFootHdr() {
        return footHdr;
    }

    /**
     * @param footHdr the footHdr to set
     */
    public void setFootHdr(byte[] footHdr) {
        this.footHdr = footHdr;
    }

    /**
     * @return the footTxt
     */
    public byte[] getFootTxt() {
        return footTxt;
    }

    /**
     * @param footTxt the footTxt to set
     */
    public void setFootTxt(byte[] footTxt) {
        this.footTxt = footTxt;
    }
}
