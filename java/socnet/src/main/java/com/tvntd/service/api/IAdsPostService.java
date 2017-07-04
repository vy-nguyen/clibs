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

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.List;

import com.tvntd.models.AdsPost;
import com.tvntd.models.ArticleRank;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.ICommentService.CommentDTO;

public interface IAdsPostService
{
    AdsPostDTO getAdsPostDTO(String uuid);
    AdsPost getAdsPost(String uuid);

    List<AdsPost> getAdsPostByAuthor(String authorUuid);
    List<AdsPostDTO> getAdsPostByUuids(String[] adsUuids);

    void deleteAnnonAds(String uuid);
    void saveAds(AdsPostDTO ads);

    void deleteAds(AdsPost ads);
    AdsPost deleteAds(String uuid);

    /**
     * @return list of ads.
     */
    public static class AdsPostDTOResponse extends GenericResponse
    {
        private List<AdsPostDTO> ads;
        private List<CommentDTO> comments;

        public AdsPostDTOResponse(List<AdsPostDTO> ads, List<CommentDTO> comments)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.ads = ads;
            this.comments = comments;
        }

        /**
         * @return the ads
         */
        public List<AdsPostDTO> getAds() {
            return ads;
        }

        /**
         * @return the comments
         */
        public List<CommentDTO> getComments() {
            return comments;
        }
    }

    /**
     * @return one ad.
     */
    public static class AdsPostDTO extends GenericResponse
    {
        private AdsPost        adPost;
        private ArticleRankDTO adRank;
        private String         busName;
        private String         busInfo;
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

        public void convertUTF()
        {
            try {
                byte[] str = adPost.getBusName();
                if (str != null) {
                    busName = new String(str, "UTF-8");
                }
                str = adPost.getBusInfo();
                if (str != null) {
                    busInfo = new String(str, "UTF-8");
                }
                str = adPost.getBusCat();
                if (str != null) {
                    busCat = new String(str, "UTF-8");
                }
                str = adPost.getBusWeb();
                if (str != null) {
                    busWeb = new String(str, "UTF-8");
                }
                str = adPost.getBusEmail();
                if (str != null) {
                    busEmail = new String(str, "UTF-8");
                }
                str = adPost.getBusPhone();
                if (str != null) {
                    busPhone = new String(str, "UTF-8");
                }
                str = adPost.getBusStreet();
                if (str != null) {
                    busStreet = new String(str, "UTF-8");
                }
                str = adPost.getBusCity();
                if (str != null) {
                    busCity = new String(str, "UTF-8");
                }
                str = adPost.getBusState();
                if (str != null) {
                    busState = new String(str, "UTF-8");
                }
                str = adPost.getBusZip();
                if (str != null) {
                    busZip = new String(str, "UTF-8");
                }
                str = adPost.getBusHour();
                if (str != null) {
                    busHour = new String(str, "UTF-8");
                }
                str = adPost.getBusDesc();
                if (str != null) {
                    busDesc = new String(str, "UTF-8");
                }

            } catch(UnsupportedEncodingException e) {
            }
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
        public void setAdImgOId0(String oid) {
            adPost.setAdImgOId0(oid);
        }

        public List<String> getImageUrl()
        {
            List<String> img = new LinkedList<>();
            ObjStore store = ObjStore.getInstance();
            String url = store.imgObjPublicUri(adPost.getAdImgOId0());

            if (url != null) {
                img.add(url);
            }
            url = store.imgObjPublicUri(adPost.getAdImgOId1());
            if (url != null) {
                img.add(url);
            }
            url = store.imgObjPublicUri(adPost.getAdImgOId2());
            if (url != null) {
                img.add(url);
            }
            url = store.imgObjPublicUri(adPost.getAdImgOId3());
            if (url != null) {
                img.add(url);
            }
            return img;
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
         * @return the busInfo
         */
        public String getBusInfo() {
            return busInfo;
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
