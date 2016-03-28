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

import com.tvntd.models.User;

public class LoginResponse extends GenericResponse
{
    private String authVerifToken;
    private String authToken;
    private UserInfo userSelf;

    public LoginResponse(String type, String message, String error, String token)
    {
        super(type, message, error);
        this.authVerifToken = token;
        this.authToken = null;
    }

    public LoginResponse(User user)
    {
        super(GenericResponse.USER_HOME, null, null);
        this.authToken = "abc1234";
        this.userSelf = new UserInfo(user);
    }

    /**
     * @return the authVerifToken
     */
    public String getAuthVerifToken() {
        return authVerifToken;
    }

    /**
     * @return the authToken
     */
    public String getAuthToken() {
        return authToken;
    }

    /**
     * @return the userSelf
     */
    public UserInfo getUserSelf() {
        return userSelf;
    }

    public static class UserInfo
    {
        private String email;
        private String firstName;
        private String lastName;
        private String locale;
        private String userUuid;
        private String userImgUrl;
        private String transRoot;
        private Long   creditEarned;
        private Long   creditIssued;
        private Long   moneyEarned;
        private Long   moneyIssued;

        public UserInfo(User user)
        {
            this.email = user.getEmail();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.locale = user.getLocale();
            this.userUuid = user.getUserUuid();
            this.userImgUrl = user.getUserImgUrl();
            this.transRoot = user.getTransRoot();
            this.creditEarned = 100L;
            this.creditIssued = 200L;
            this.moneyEarned = 100L;
            this.moneyIssued = 300L;
        }

        /**
         * @return the email
         */
        public String getEmail() {
            return email;
        }

        /**
         * @return the firstName
         */
        public String getFirstName() {
            return firstName;
        }

        /**
         * @return the lastName
         */
        public String getLastName() {
            return lastName;
        }

        /**
         * @return the locale
         */
        public String getLocale() {
            return locale;
        }

        /**
         * @return the userUuid
         */
        public String getUserUuid() {
            return userUuid;
        }

        /**
         * @return the userImgUrl
         */
        public String getUserImgUrl() {
            return userImgUrl;
        }

        /**
         * @return the transRoot
         */
        public String getTransRoot() {
            return transRoot;
        }

        /**
         * @return the creditEarned
         */
        public Long getCreditEarned() {
            return creditEarned;
        }

        /**
         * @return the creditIssued
         */
        public Long getCreditIssued() {
            return creditIssued;
        }

        /**
         * @return the moneyEarned
         */
        public Long getMoneyEarned() {
            return moneyEarned;
        }

        /**
         * @return the moneyIssued
         */
        public Long getMoneyIssued() {
            return moneyIssued;
        }
    }
}
