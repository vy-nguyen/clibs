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

import javax.validation.constraints.Size;

public class AdsForm
{
    @Size(max = 128)
    private String busName;

    private String articleUuid;
    private String authorUuid;
    private String busCat;
    private String busWeb;
    private String busEmail;
    private String busPhone;
    private String busStreet;
    private String busCity;
    private String busState;
    private String busZip;
    private String busHour;
    private String busDesc;

    public boolean cleanInput()
    {
        return false;
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
