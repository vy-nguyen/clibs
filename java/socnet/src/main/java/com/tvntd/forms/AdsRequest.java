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

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import com.tvntd.util.Util;

public class AdsRequest
{
    @Size(max = 64)
    private String rentPriceLo;

    @Size(max = 64)
    private String rentPriceHi;

    @Size(max = 128)
    private String city;

    @Size(max = 64)
    private String state;

    @Size(max = 32)
    private String zip;

    public boolean cleanInput()
    {
        Whitelist wlist = Util.allowedTags;

        if (rentPriceLo != null) {
            rentPriceLo = Jsoup.clean(rentPriceLo, wlist);
        } else {
            rentPriceLo = "0";
        }
        if (rentPriceHi != null) {
            rentPriceHi = Jsoup.clean(rentPriceLo, wlist);
        } else {
            rentPriceHi = "10000000000";
        }
        if (city != null) {
            city = Jsoup.clean(city, wlist);
        } else {
            city = null;
        }
        if (state != null) {
            state = Jsoup.clean(state, wlist);
        } else {
            state = null;
        }
        if (zip != null) {
            zip = Jsoup.clean(zip, wlist);
        } else {
            zip = null;
        }
        return true;
    }

    /**
     * @return the rentPriceLo
     */
    public String getRentPriceLo() {
        return rentPriceLo;
    }

    /**
     * @return the rentPriceHi
     */
    public String getRentPriceHi() {
        return rentPriceHi;
    }

    /**
     * @return the city
     */
    public String getCity() {
        return city;
    }

    /**
     * @param city the city to set
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * @return the state
     */
    public String getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(String state) {
        this.state = state;
    }

    /**
     * @return the zip
     */
    public String getZip() {
        return zip;
    }
}
