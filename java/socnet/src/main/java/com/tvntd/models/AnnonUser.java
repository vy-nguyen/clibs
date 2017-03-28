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

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.tvntd.lib.ObjectId;

@Entity
public class AnnonUser
{
    @Id
    @Column(length = 64)
    private String userUuid;

    @Column(length = 64)
    private String adUuid;

    private ObjectId adImgOid0;
    private ObjectId adImgOid1;
    private ObjectId adImgOid2;
    private ObjectId adImgOid3;

    @Column(length = 64)
    private String remoteIp;

    public AnnonUser() {
        userUuid = UUID.randomUUID().toString();
    }

    public AnnonUser(String uuid) {
        userUuid = uuid;
    }

    /**
     * @return the userUuid
     */
    public String getUserUuid() {
        return userUuid;
    }

    /**
     * @param userUuid the userUuid to set
     */
    public void setUserUuid(String userUuid) {
        this.userUuid = userUuid;
    }

    /**
     * @return the adUuid
     */
    public String getAdUuid() {
        return adUuid;
    }

    /**
     * @param adUuid the adUuid to set
     */
    public void setAdUuid(String adUuid) {
        this.adUuid = adUuid;
    }

    /**
     * @return the adImgOid
     */
    public ObjectId getAdImgOid0() {
        return adImgOid0;
    }

    /**
     * @param adImgOid the adImgOid to set
     */
    public void setAdImgOid0(ObjectId adImgOid) {
        this.adImgOid0 = adImgOid;
    }

    /**
     * @return the adImgOid1
     */
    public ObjectId getAdImgOid1() {
        return adImgOid1;
    }

    /**
     * @param adImgOid1 the adImgOid1 to set
     */
    public void setAdImgOid1(ObjectId adImgOid1) {
        this.adImgOid1 = adImgOid1;
    }

    /**
     * @return the adImgOid2
     */
    public ObjectId getAdImgOid2() {
        return adImgOid2;
    }

    /**
     * @param adImgOid2 the adImgOid2 to set
     */
    public void setAdImgOid2(ObjectId adImgOid2) {
        this.adImgOid2 = adImgOid2;
    }

    /**
     * @return the adImgOid3
     */
    public ObjectId getAdImgOid3() {
        return adImgOid3;
    }

    /**
     * @param adImgOid3 the adImgOid3 to set
     */
    public void setAdImgOid3(ObjectId adImgOid3) {
        this.adImgOid3 = adImgOid3;
    }

    /**
     * @return the remoteIp
     */
    public String getRemoteIp() {
        return remoteIp;
    }

    /**
     * @param remoteIp the remoteIp to set
     */
    public void setRemoteIp(String remoteIp) {
        this.remoteIp = remoteIp;
    }
}
