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

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.tvntd.util.Util;
import com.tvntd.util.ValidEmail;

public class AdsForm
{
    @NotNull
    @Size(max = 128)
    private String busName;

    @Size(max = 128)
    private String busInfo;

    @NotNull
    @Size(max = 64)
    private String articleUuid;

    @NotNull
    @Size(max = 64)
    private String authorUuid;

    @NotNull
    @Size(max = 128)
    private String busCat;

    @NotNull
    @Size(max = 128)
    private String busWeb;

    @NotNull
    @Size(max = 128)
    @ValidEmail
    private String busEmail;

    @NotNull
    @Size(max = 128)
    private String busPhone;

    @NotNull
    @Size(max = 128)
    private String busStreet;

    @NotNull
    @Size(max = 128)
    private String busCity;

    @NotNull
    @Size(max = 128)
    private String busState;

    @NotNull
    @Size(max = 128)
    private String busZip;

    @NotNull
    @Size(max = 1024)
    private String busHour;

    @NotNull
    @Size(max = 1 << 14)
    private String busDesc;

    public boolean cleanInput()
    {
        Whitelist wlist = Util.allowedTags;
        if (articleUuid == null) {
            return false;
        }
        articleUuid = Jsoup.clean(articleUuid, wlist);
        if (busCat == null) {
            return false;
        }
        busCat = Jsoup.clean(busCat, wlist);
        if (busName == null) {
            return false;
        }
        busName = Jsoup.clean(busName, wlist);
        if (busInfo == null) {
            return false;
        }
        busInfo = Jsoup.clean(busInfo, wlist);
        if (busWeb == null) {
            return false;
        }
        busWeb = Jsoup.clean(busWeb, wlist);
        if (busEmail == null) {
            return false;
        }
        busEmail = Jsoup.clean(busEmail, wlist);
        if (busPhone == null) {
            return false;
        }
        busPhone = Jsoup.clean(busPhone, wlist);
        if (busStreet == null) {
            return false;
        }
        busStreet = Jsoup.clean(busStreet, wlist);
        if (busCity == null) {
            return false;
        }
        busCity = Jsoup.clean(busCity, wlist);
        if (busState == null) {
            return false;
        }
        busState = Jsoup.clean(busState, wlist);
        if (busZip == null) {
            return false;
        }
        busZip = Jsoup.clean(busZip, wlist);
        if (busHour == null) {
            return false;
        }
        busHour = Jsoup.clean(busHour, wlist);
        if (busDesc == null) {
            return false;
        }
        busDesc = Jsoup.clean(busDesc, wlist);

        if (authorUuid != null) {
            authorUuid = Jsoup.clean(authorUuid, wlist);
        }
        return true;
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
     * @param busInfo the busInfo to set
     */
    public void setBusInfo(String busInfo) {
        this.busInfo = busInfo;
    }

    /**
     * @return the articleUuid
     */
    public String getArticleUuid() {
        return articleUuid;
    }

    /**
     * @return the authorUuid
     */
    public String getAuthorUuid() {
        return authorUuid;
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
