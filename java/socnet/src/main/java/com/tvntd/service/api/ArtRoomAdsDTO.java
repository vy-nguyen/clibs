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

import com.tvntd.models.ArtRoomAds;
import com.tvntd.objstore.ObjStore;
import com.tvntd.util.Util;

public class ArtRoomAdsDTO extends GenericResponse
{
    protected ArtRoomAds adPost;

    public ArtRoomAdsDTO(ArtRoomAds ads)
    {
        super(null);
        adPost = ads;
    }

    public ArtRoomAds fetchAds() {
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

    public List<String> getImageUrl()
    {
        List<String> imgs = adPost.getArtBase().getPictures();

        if (imgs == null) {
            return null;
        }
        ObjStore store = ObjStore.getInstance();
        List<String> res = new LinkedList<>();

        for (String oid : imgs) {
            res.add(store.imgObjPublicUri(oid));
        }
        return null;
    }

    public String getArtTag() {
        return adPost.getArtBase().getArtTag();
    }

    public String getCreatedDate() {
        DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
        return df.format(adPost.getArtBase().getCreatedDate());
    }

    public String getOwnerName() {
        return Util.fromRawByte(adPost.getOwnerName());
    }

    public String getOwnerPhone() {
        return adPost.getOwnerPhone();
    }

    public String getOwnerEmail() {
        return adPost.getOwnerEmail();
    }

    public String getRentPrice() {
        return adPost.getRentPrice();
    }

    public String getStreet() {
        return Util.fromRawByte(adPost.getStreet());
    }

    public String getCity() {
        return adPost.getCity();
    }

    public String getState() {
        return adPost.getState();
    }

    public String getZip() {
        return adPost.getZip();
    }

    public String getDesc() {
        return Util.fromRawByte(adPost.getPropDesc());
    }
}
