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
package com.tvntd.forms;

import java.util.ArrayList;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.tvntd.util.Util;

public class UuidForm
{
    public static final String artCmt   = "artCmt";
    public static final String artRank  = "artRank";
    public static final String artType  = "article";
    public static final String prodType = "product";

    private String authorUuid;
    private String uuidType;
    private String reqKind;
    private String[] uuids;

    public boolean cleanInput()
    {
        if (uuids == null || reqKind == null) {
            return false;
        }
        Whitelist wlist = Util.allowedTags;
        for (int i = 0; i < uuids.length; i++) {
            uuids[i] = Jsoup.clean(uuids[i], wlist);
        }
        return true;
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
     * @return the uuidType
     */
    public String getUuidType() {
        return uuidType;
    }

    /**
     * @param uuidType the uuidType to set
     */
    public void setUuidType(String uuidType) {
        this.uuidType = uuidType;
    }

    /**
     * @return the reqKind
     */
    public String getReqKind() {
        return reqKind;
    }

    /**
     * @param reqKind the reqKind to set
     */
    public void setReqKind(String reqKind) {
        this.reqKind = reqKind;
    }

    /**
     * @return the uuids
     */
    public String[] getUuids() {
        return uuids;
    }

    /**
     * @param uuids the uuids to set
     */
    public void setUuids(String[] uuids) {
        this.uuids = uuids;
    }

    public void replaceUuids(ArrayList<String> uuids)
    {
        if (uuids != null) {
            int i = 0;
            this.uuids = new String[uuids.size()];
            for (String uid : uuids) {
                this.uuids[i++] = uid;
            }
        }
    }

    public static class UserRoleForm
    {
        private String[] uuids;
        private Long[] roleMasks;

        /**
         * @return the uuids
         */
        public String[] getUuids() {
            return uuids;
        }

        /**
         * @param uuids the uuids to set
         */
        public void setUuids(String[] uuids) {
            this.uuids = uuids;
        }

        /**
         * @return the roleMasks
         */
        public Long[] getRoleMasks() {
            return roleMasks;
        }

        /**
         * @param roleMasks the roleMasks to set
         */
        public void setRoleMasks(Long[] roleMasks) {
            this.roleMasks = roleMasks;
        }
    }
}
