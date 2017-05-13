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

public class UserProfile
{
    @NotNull
    @Size(max = 64)
    protected String userUuid;

    @Size(max = 128)
    protected String firstName;

    @Size(max = 128)
    protected String lastName;

    @Size(max = 128)
    protected String homeTown;

    @Size(max = 128)
    protected String state;

    @Size(max = 128)
    protected String country;

    @Size(max = 128)
    protected String curPasswd;

    @Size(max = 128)
    protected String password0;

    @Size(max = 128)
    protected String password1;

    public boolean cleanInput()
    {
        if (userUuid == null) {
            return false;
        }
        Whitelist wlist = Util.allowedTags;
        userUuid = Jsoup.clean(userUuid, wlist);

        if (firstName != null) {
            firstName = Jsoup.clean(firstName, wlist);
        }
        if (lastName != null) {
            lastName = Jsoup.clean(lastName, wlist);
        }
        if (homeTown != null) {
            homeTown = Jsoup.clean(homeTown, wlist);
        }
        if (state != null) {
            state = Jsoup.clean(state, wlist);
        }
        if (country != null) {
            country = Jsoup.clean(country, wlist);
        }
        if (curPasswd != null) {
            curPasswd = Jsoup.clean(curPasswd, wlist);
        }
        if (password0 != null) {
            password0 = Jsoup.clean(password0, wlist);
        }
        if (password1 != null) {
            password1 = Jsoup.clean(password1, wlist);
        }
        return true;
    }

    /**
     * @return the userUuid
     */
    public String getUserUuid() {
        return userUuid;
    }

    /**
     * @param userUuid the userUuid to set
     */
    public void setUserUuid(String userUuid) {
        this.userUuid = userUuid;
    }

    /**
     * @return the firstName
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * @param firstName the firstName to set
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * @return the lastName
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * @param lastName the lastName to set
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * @return the homeTown
     */
    public String getHomeTown() {
        return homeTown;
    }

    /**
     * @param homeTown the homeTown to set
     */
    public void setHomeTown(String homeTown) {
        this.homeTown = homeTown;
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
     * @return the country
     */
    public String getCountry() {
        return country;
    }

    /**
     * @param country the country to set
     */
    public void setCountry(String country) {
        this.country = country;
    }

    /**
     * @return the curPasswd
     */
    public String getCurPasswd() {
        return curPasswd;
    }

    /**
     * @param curPasswd the curPasswd to set
     */
    public void setCurPasswd(String curPasswd) {
        this.curPasswd = curPasswd;
    }

    /**
     * @return the password0
     */
    public String getPassword0() {
        return password0;
    }

    /**
     * @param password0 the password0 to set
     */
    public void setPassword0(String password0) {
        this.password0 = password0;
    }

    /**
     * @return the password1
     */
    public String getPassword1() {
        return password1;
    }

    /**
     * @param password1 the password1 to set
     */
    public void setPassword1(String password1) {
        this.password1 = password1;
    }
}
