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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.models.Profile;
import com.tvntd.models.User;

public class LoginResponse extends GenericResponse
{
    static private Logger s_log = LoggerFactory.getLogger(LoginResponse.class);

    private String authVerifToken;
    private String authToken;
    private UserDTO userSelf;

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
        this.userSelf = new UserDTO(user, null);
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
    public UserDTO getUserSelf() {
        return userSelf;
    }

    public static class UserDTO
    {
        private String email;
        private String firstName;
        private String lastName;
        private String locale;
        private String userUuid;
        private String userImgUrl;
        private String transRoot;
        private Long   connections;
        private Long   followers;
        private Long   follows;
        private Long   creditEarned;
        private Long   creditIssued;
        private Long   moneyEarned;
        private Long   moneyIssued;

        public UserDTO(User user, Profile profile)
        {
            this.email = user.getEmail();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.locale = user.getLocale();
            this.userUuid = user.getEmail(); // user.getUserUuid();
            this.userImgUrl = ""; // user.getUserImgUrl();
            this.transRoot = ""; // user.getTransRoot();
            this.connections = user.getConnections();
            this.followers = user.getFollowers();
            this.follows = user.getFollows();
            this.creditEarned = 100L;
            this.creditIssued = 200L;
            this.moneyEarned = 100L;
            this.moneyIssued = 300L;

            if (connections == null) {
                connections = 0L;
                followers = 0L;
                follows = 0L;
            }
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
         * @param userUuid the userUuid to set
         */
        public void setUserUuid(String userUuid) {
            this.userUuid = userUuid;
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
         * @return the connections
         */
        public Long getConnections() {
            return connections;
        }

        /**
         * @param connections the connections to set
         */
        public void setConnections(Long connections) {
            this.connections = connections;
        }

        /**
         * @return the followers
         */
        public Long getFollowers() {
            return followers;
        }

        /**
         * @param followers the followers to set
         */
        public void setFollowers(Long followers) {
            this.followers = followers;
        }

        /**
         * @return the follows
         */
        public Long getFollows() {
            return follows;
        }

        /**
         * @param follows the follows to set
         */
        public void setFollows(Long follows) {
            this.follows = follows;
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
