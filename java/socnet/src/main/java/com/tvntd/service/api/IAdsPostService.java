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
import java.util.List;

import com.tvntd.models.AdsPost;
import com.tvntd.models.ArticleRank;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;

public interface IAdsPostService
{
    AdsPostDTO getAdsPostDTO(String uuid);
    AdsPost getAdsPost(String uuid);

    void saveAds(AdsPostDTO ads);
    AdsPost deleteAds(String uuid);

    public static class AdsPostDTO extends GenericResponse
    {
        private AdsPost        adPost;
        private ArticleRankDTO adRank;
        private String         busName;
        private String         busCat;
        private String         busWeb;
        private String         busEmail;
        private String         busPhone;
        private String         busStreet;
        private String         busCity;
        private String         busState;
        private String         busZip;
        private String         busHour;
        private String         busDesc;

        public AdsPostDTO(AdsPost ad, ArticleRankDTO rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            adPost = ad;
            adRank = rank;
        }

        /**
         * Get internal data.
         */
        public AdsPost fetchAdPost() {
            return adPost;
        }

        public ArticleRank fetchArtRank() {
            return adRank.fetchArtRank();
        }

        /**
         * Getters/setters.
         */
        public void setAdsRank(ArticleRankDTO rank) {
            adRank = rank;
        }

        public ArticleRankDTO getAdsRank() {
            return adRank;
        }

        public String getArticleUuid() {
            return adPost.getArticleUuid();
        }

        public void setAuthorUuid(String uuid) {
            adPost.setAuthorUuid(uuid);
        }

        public String getAuthorUuid() {
            return adPost.getAuthorUuid();
        }

        /**
         * Set ad images.
         */
        public void setAdImgOid0(String oid) {
            adPost.setAdImgOid0(oid);
        }

        public List<String> getImageUrl() {
            return null;
        }

        public String getCreatedDate() {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(adPost.getCreatedDate());
        }

        /**
         * @return the busName
         */
        public String getBusName() {
            return busName;
        }

        /**
         * @return the busCat
         */
        public String getBusCat() {
            return busCat;
        }

        /**
         * @return the busWeb
         */
        public String getBusWeb() {
            return busWeb;
        }

        /**
         * @return the busEmail
         */
        public String getBusEmail() {
            return busEmail;
        }

        /**
         * @return the busPhone
         */
        public String getBusPhone() {
            return busPhone;
        }

        /**
         * @return the busStreet
         */
        public String getBusStreet() {
            return busStreet;
        }

        /**
         * @return the busCity
         */
        public String getBusCity() {
            return busCity;
        }

        /**
         * @return the busState
         */
        public String getBusState() {
            return busState;
        }

        /**
         * @return the busZip
         */
        public String getBusZip() {
            return busZip;
        }

        /**
         * @return the busHour
         */
        public String getBusHour() {
            return busHour;
        }

        /**
         * @return the busDesc
         */
        public String getBusDesc() {
            return busDesc;
        }

    }
}
