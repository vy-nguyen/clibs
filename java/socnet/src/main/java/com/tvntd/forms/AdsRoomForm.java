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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.util.Util;
import com.tvntd.util.ValidEmail;

public class AdsRoomForm
{
    static private Logger s_log = LoggerFactory.getLogger(AdsForm.class);

    @NotNull
    @Size(max = 128)
    private String ownerName;

    @Size(max = 64)
    private String ownerPhone;

    @NotNull
    @ValidEmail
    @Size(max = 128)
    private String ownerEmail;

    @NotNull
    @Size(max = 64)
    private String rentPrice;

    @NotNull
    @Size(max = 128)
    private String street;

    @NotNull
    @Size(max = 128)
    private String city;

    @NotNull
    @Size(max = 64)
    private String state;

    @NotNull
    @Size(max = 32)
    private String zip;

    @NotNull
    @Size(max = 2048)
    private String desc;

    public boolean cleanInput()
    {
        Whitelist wlist = Util.allowedTags;
        if (ownerName == null) {
            s_log.info("Missing owner name");
            return false;
        }
        ownerName = Jsoup.clean(ownerName, wlist);
        if (ownerPhone == null) {
            s_log.info("Missing owner phone");
            return false;
        }
        ownerPhone = Jsoup.clean(ownerPhone, wlist);
        if (ownerEmail == null) {
            s_log.info("Missing owner email");
            return false;
        }
        ownerEmail = Jsoup.clean(ownerEmail, wlist);
        if (rentPrice == null) {
            s_log.info("Missing rent price");
            return false;
        }
        rentPrice = Jsoup.clean(rentPrice, wlist);
        if (street == null) {
            s_log.info("Missing street addr");
            return false;
        }
        street = Jsoup.clean(street, wlist);
        if (city == null) {
            s_log.info("Missing city addr");
            return false;
        }
        city = Jsoup.clean(city, wlist);
        if (state == null) {
            s_log.info("Missing state addr");
            return false;
        }
        state = Jsoup.clean(state, wlist);
        if (zip == null) {
            s_log.info("Missing zip addr");
            return false;
        }
        zip = Jsoup.clean(zip, wlist);
        if (desc == null) {
            s_log.info("Missing desc");
            return false;
        }
        desc = Jsoup.clean(desc, wlist);
        return true;
    }

    /**
     * @return the ownerName
     */
    public String getOwnerName() {
        return ownerName;
    }

    /**
     * @return the ownerPhone
     */
    public String getOwnerPhone() {
        return ownerPhone;
    }

    /**
     * @param ownerPhone the ownerPhone to set
     */
    public void setOwnerPhone(String ownerPhone) {
        this.ownerPhone = ownerPhone;
    }

    /**
     * @return the ownerEmail
     */
    public String getOwnerEmail() {
        return ownerEmail;
    }

    /**
     * @param ownerEmail the ownerEmail to set
     */
    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    /**
     * @return the rentPrice
     */
    public String getRentPrice() {
        return rentPrice;
    }

    /**
     * @param rentPrice the rentPrice to set
     */
    public void setRentPrice(String rentPrice) {
        this.rentPrice = rentPrice;
    }

    /**
     * @return the street
     */
    public String getStreet() {
        return street;
    }

    /**
     * @param street the street to set
     */
    public void setStreet(String street) {
        this.street = street;
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

    /**
     * @return the desc
     */
    public String getDesc() {
        return desc;
    }
}
