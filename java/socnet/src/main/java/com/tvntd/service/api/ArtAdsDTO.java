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
import com.tvntd.models.ArticleBase;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IMapService.AddressMapDTO;
import com.tvntd.util.Util;

public abstract class ArtAdsDTO extends GenericResponse
{
    protected int currImgOid;
    protected AddressMapDTO location;

    public ArtAdsDTO() {
        super(null);
        currImgOid = 0;
    }

    public void setLocation(AddressMapDTO loc) {
        location = loc;
    }

    public AddressMapDTO fetchLocation() {
        return location;
    }

    /**
     * External JSON gets.
     */
    public abstract String getAdsType();
    public abstract String getArticleUuid();
    public abstract String getAuthorUuid();
    public abstract String getBusName();
    public abstract String getBusEmail();
    public abstract String getBusPhone();
    public abstract String getBusStreet();
    public abstract String getBusState();
    public abstract String getBusCity();
    public abstract String getBusZip();
    public abstract String getBusDesc();

    public Double getLat() {
        return location != null ? location.getLat() : 0.0;
    }

    public Double getLng() {
        return location != null ? location.getLng() : 0.0;
    }

    public String getPlaceId() {
        return location != null ? location.getPlaceId() : null;
    }

    public List<String> getImageUrl()
    {
        List<String> img = new LinkedList<>();
        ObjStore store = ObjStore.getInstance();
        String url = store.imgObjPublicUri(this.fetchAdImgOid0());

        if (url != null) {
            img.add(url);
        }
        url = store.imgObjPublicUri(this.fetchAdImgOid1());
        if (url != null) {
            img.add(url);
        }
        url = store.imgObjPublicUri(this.fetchAdImgOid2());
        if (url != null) {
            img.add(url);
        }
        url = store.imgObjPublicUri(this.fetchAdImgOid3());
        if (url != null) {
            img.add(url);
        }
        return img;
    }

    public abstract void setAdImgOid0(String oid);
    public abstract void setAdImgOid1(String oid);
    public abstract void setAdImgOid2(String oid);
    public abstract void setAdImgOid3(String oid);

    public void assignAdImgOid(String oid)
    {
        if (currImgOid == 0) {
            setAdImgOid0(oid);
        } else if (currImgOid == 1) {
            setAdImgOid1(oid);
        } else if (currImgOid == 2) {
            setAdImgOid2(oid);
        } else {
            setAdImgOid3(oid);
        }
        currImgOid++;
    }

    /**
     * Internal fetches.
     */
    public abstract String fetchAdImgOid0();
    public abstract String fetchAdImgOid1();
    public abstract String fetchAdImgOid2();
    public abstract String fetchAdImgOid3();
    protected abstract ArticleBase fetchBaseAds();

    public String getArtTag() {
        return fetchBaseAds().getArtTag();
    }

    public String getCreatedDate() {
        DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
        return df.format(fetchBaseAds().getCreatedDate());
    }

    /**
     * Business Ads.
     */
    public static class BusAdsDTO extends ArtAdsDTO
    {
        protected ArtAds adPost;

        public BusAdsDTO(ArtAds ads)
        {
            super();
            adPost = ads;
        }

        public ArtAds fetchAds() {
            return adPost;
        }

        @Override
        public void setAdImgOid0(String oid) {
            adPost.setAdImgOid0(oid);
        }

        @Override
        public void setAdImgOid1(String oid) {
            adPost.setAdImgOid1(oid);
        }

        @Override
        public void setAdImgOid2(String oid) {
            adPost.setAdImgOid2(oid);
        }

        @Override
        public void setAdImgOid3(String oid) {
            adPost.setAdImgOid3(oid);
        }

        @Override
        public String fetchAdImgOid0() {
            return adPost.getAdImgOid0();
        }

        @Override
        public String fetchAdImgOid1() {
            return adPost.getAdImgOid1();
        }

        @Override
        public String fetchAdImgOid2() {
            return adPost.getAdImgOid2();
        }

        @Override
        public String fetchAdImgOid3() {
            return adPost.getAdImgOid3();
        }

        @Override
        protected ArticleBase fetchBaseAds() {
            return adPost.getArtBase();
        }

        /**
         * Json gets
         */
        @Override
        public String getAdsType() {
            return "bus";
        }

        @Override
        public String getArticleUuid() {
            return adPost.getArticleUuid();
        }

        @Override
        public String getAuthorUuid() {
            return adPost.getAuthorUuid();
        }

        @Override
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

        @Override
        public String getBusEmail() {
            return Util.fromRawByte(adPost.getBusEmail());
        }

        @Override
        public String getBusPhone() {
            return Util.fromRawByte(adPost.getBusPhone());
        }

        @Override
        public String getBusStreet() {
            return Util.fromRawByte(adPost.getBusStreet());
        }

        @Override
        public String getBusState() {
            return Util.fromRawByte(adPost.getBusState());
        }

        @Override
        public String getBusCity() {
            return Util.fromRawByte(adPost.getBusCity());
        }

        @Override
        public String getBusZip() {
            return Util.fromRawByte(adPost.getBusZip());
        }

        public String getBusHour() {
            return Util.fromRawByte(adPost.getBusHour());
        }

        @Override
        public String getBusDesc() {
            return Util.fromRawByte(adPost.getBusDesc());
        }
    }
}
