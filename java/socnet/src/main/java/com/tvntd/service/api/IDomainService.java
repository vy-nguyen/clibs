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

import com.tvntd.lib.ObjectId;
import com.tvntd.models.Domain;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

public interface IDomainService
{
    Domain getDomain(String domain);
    void saveDomain(String name, String authorUuid);
    void deleteDomain(Domain domain);

    void fillLoginResponse(LoginResponse resp, ProfileDTO profile);
    void fillStartupDomain(StartupResponse resp, String domain, ProfileDTO prof);
    void fillStartupAccount(StartupResponse resp, String domain, ProfileDTO prof);

    public static class DomainDTO
    {
        private Domain domain;
        private String loginHdr;
        private String loginTxt;
        private String footHdr;
        private String footTxt;

        public DomainDTO(Domain domain)
        {
            this.domain = domain;
            convertUTF();
        }

        public void convertUTF()
        {
            loginHdr = Util.fromRawByte(domain.getLoginHdr());
            loginTxt = Util.fromRawByte(domain.getLoginTxt());
            footHdr  = Util.fromRawByte(domain.getFootHdr());
            footTxt  = Util.fromRawByte(domain.getFootTxt());
        }

        public Domain fetchDomain() {
            return domain;
        }

        public String getDomain() {
            return domain.getDomain();
        }

        public String getLoginMainImg()
        {
            String path = ArticleDTO.s_baseUri + Long.toString(domain.getAuthorId());
            ObjectId oid = ObjectId.fromString(domain.getLoginMainImg());
            return ObjStore.getInstance().imgObjUri(oid, path);
        }

        public void setLoginMainImg(String oid) {
            domain.setLoginMainImg(oid);
        }

        public String getLoginFootImg()
        {
            String path = ArticleDTO.s_baseUri + Long.toString(domain.getAuthorId());
            ObjectId oid = ObjectId.fromString(domain.getLoginFootImg());
            return ObjStore.getInstance().imgObjUri(oid, path);
        }

        public void setLoginFootImg(String oid) {
            domain.setLoginFootImg(oid);
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
        public void setLoginHdr(String loginHdr)
        {
            this.loginHdr = loginHdr;
            domain.setLoginHdr(Util.toRawByte(loginHdr, 128));
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
}
