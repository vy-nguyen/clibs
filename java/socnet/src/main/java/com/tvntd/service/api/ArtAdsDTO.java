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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.List;

import com.tvntd.models.ArtAds;
import com.tvntd.objstore.ObjStore;
import com.tvntd.util.Util;

public class ArtAdsDTO
{
    protected ArtAds adPost;

    public ArtAdsDTO(ArtAds ads) {
        adPost = ads;
    }

    public ArtAds fetchAds() {
        return adPost;
    }

    /**
     * Json gets
     */
    public String getArticleUuid() {
        return adPost.getArticleUuid();
    }

    public String getAuthorUuid() {
        return adPost.getAuthorUuid();
    }

    public void setAdImgOid0(String oid) {
        adPost.setAdImgOid0(oid);
    }


    public List<String> getImageUrl()
    {
        List<String> img = new LinkedList<>();
        ObjStore store = ObjStore.getInstance();
        String url = store.imgObjPublicUri(adPost.getAdImgOid0());

        if (url != null) {
            img.add(url);
        }
        url = store.imgObjPublicUri(adPost.getAdImgOid1());
        if (url != null) {
            img.add(url);
        }
        url = store.imgObjPublicUri(adPost.getAdImgOid2());
        if (url != null) {
            img.add(url);
        }
        url = store.imgObjPublicUri(adPost.getAdImgOid3());
        if (url != null) {
            img.add(url);
        }
        return img;
    }

    public String getCreatedDate() {
        DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
        return df.format(adPost.getArtBase().getCreatedDate());
    }

    public String getBusName() {
        return Util.fromRawByte(adPost.getBusName());
    }

    public String getBusInfo() {
        return Util.fromRawByte(adPost.getBusInfo());
    }

    public String getBusCat() {
        return Util.fromRawByte(adPost.getBusCat());
    }

    public String getBusWeb() {
        return Util.fromRawByte(adPost.getBusWeb());
    }

    public String getBusEmail() {
        return Util.fromRawByte(adPost.getBusEmail());
    }

    public String getBusPhone() {
        return Util.fromRawByte(adPost.getBusPhone());
    }

    public String getBusStreet() {
        return Util.fromRawByte(adPost.getBusStreet());
    }

    public String getBusState() {
        return Util.fromRawByte(adPost.getBusState());
    }

    public String getBusCity() {
        return Util.fromRawByte(adPost.getBusCity());
    }

    public String getBusZip() {
        return Util.fromRawByte(adPost.getBusZip());
    }

    public String getBusHour() {
        return Util.fromRawByte(adPost.getBusHour());
    }

    public String getBusDesc() {
        return Util.fromRawByte(adPost.getBusDesc());
    }
}
