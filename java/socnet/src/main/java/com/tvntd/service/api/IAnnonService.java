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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.AnnonUser;
import com.tvntd.models.ArtAds;
import com.tvntd.objstore.ObjStore;
import com.tvntd.util.Constants;

public interface IAnnonService
{
    static public final String annonKey = "annon-user";

    AnnonUserDTO getAnnonUser(HttpServletRequest reqt,
            HttpServletResponse resp, HttpSession session);

    void saveAnnonUser(AnnonUserDTO user);
    void saveAnnonUserImgUrl(AnnonUserDTO user, ObjectId oid, int index);

    AnnonUserDTO createAnnonUser();
    void deleteAnnonUser(AnnonUserDTO user);
    void deleteAnnonUser(String uuid);

    public static class AnnonUserDTO
    {
        private static String s_baseUri = "/rs/objs";
        private AnnonUser user;
        private ArtAdsDTO pendArtAds;

        public AnnonUserDTO(AnnonUser user) {
            this.user = user;
        }

        public AnnonUser fetchAnnonUser() {
            return this.user;
        }

        public void assignPendAds(ArtAdsDTO ads) {
            pendArtAds = ads;
        }

        public ArtAdsDTO genPendArtAds()
        {
            if (pendArtAds == null) {
                ArtAds ads = new ArtAds(user.getUserUuid(), Constants.PublicId);
                pendArtAds = new ArtAdsDTO(ads);
            }
            return pendArtAds;
        }

        /**
         * Getters JSON fields.
         */
        public String getUserUuid() {
            return user.getUserUuid();
        }

        public String getAdUuid() {
            return user.getAdUuid();
        }

        public boolean okLoginEmail()
        {
            if (user != null && user.getVisitSessions() > 2) {
                return true;
            }
            return false;
        }

        public String getAdImgOid0()
        {
            ObjStore objStore = ObjStore.getInstance();
            return objStore.imgObjUri(user.getAdImgOid0(), s_baseUri);
        }

        public String getAdImgOid1()
        {
            ObjStore objStore = ObjStore.getInstance();
            return objStore.imgObjUri(user.getAdImgOid1(), s_baseUri);
        }

        public String getAdImgOid2()
        {
            ObjStore objStore = ObjStore.getInstance();
            return objStore.imgObjUri(user.getAdImgOid2(), s_baseUri);
        }

        public String getAdImgOid3()
        {
            ObjStore objStore = ObjStore.getInstance();
            return objStore.imgObjUri(user.getAdImgOid3(), s_baseUri);
        }
    }
}
