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
package com.tvntd.service.api;

import com.tvntd.models.ArtRoomAds;
import com.tvntd.models.ArticleBase;
import com.tvntd.util.Util;

public class ArtRoomAdsDTO extends ArtAdsDTO
{
    protected ArtRoomAds roomAds;

    public ArtRoomAdsDTO(ArtRoomAds ads)
    {
        super();
        roomAds = ads;
    }

    public ArtRoomAds fetchAds() {
        return roomAds;
    }

    @Override
    public ArticleBase fetchBaseAds() {
        return roomAds.getArtBase();
    }

    @Override
    public void setAdImgOid0(String oid) {
        roomAds.setAdImgOid0(oid);
    }

    @Override
    public void setAdImgOid1(String oid) {
        roomAds.setAdImgOid1(oid);
    }

    @Override
    public void setAdImgOid2(String oid) {
        roomAds.setAdImgOid2(oid);
    }

    @Override
    public void setAdImgOid3(String oid) {
        roomAds.setAdImgOid3(oid);
    }

    @Override
    public String fetchAdImgOid0() {
        return roomAds.getAdImgOid0();
    }

    @Override
    public String fetchAdImgOid1() {
        return roomAds.getAdImgOid1();
    }

    @Override
    public String fetchAdImgOid2() {
        return roomAds.getAdImgOid2();
    }

    @Override
    public String fetchAdImgOid3() {
        return roomAds.getAdImgOid3();
    }

    @Override
    public String getAdsType() {
        return "room";
    }

    @Override
    public String getArticleUuid() {
        return roomAds.getArticleUuid();
    }

    @Override
    public String getAuthorUuid() {
        return roomAds.getAuthorUuid();
    }

    @Override
    public String getBusName() {
        return Util.fromRawByte(roomAds.getOwnerName());
    }

    @Override
    public String getBusEmail() {
        return roomAds.getOwnerEmail();
    }

    @Override
    public String getBusPhone() {
        return roomAds.getOwnerPhone();
    }

    @Override
    public String getBusStreet() {
        return Util.fromRawByte(roomAds.getStreet());
    }

    @Override
    public String getBusState() {
        return roomAds.getState();
    }

    @Override
    public String getBusCity() {
        return roomAds.getCity();
    }

    @Override
    public String getBusZip() {
        return roomAds.getZip();
    }

    @Override
    public String getBusDesc() {
        return Util.fromRawByte(roomAds.getPropDesc());
    }
}
