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

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.objstore.ObjStore;

public interface IProfileService
{
    public ProfileDTO getProfile(Long userId);
    public ProfileDTO getProfile(UUID uuid);

    public List<ProfileDTO> getProfileList(List<UUID> userIds);
    public List<ProfileDTO> getProfileList(ProfileDTO user);
    public Page<ProfileDTO> getProfileList();

    public void saveUserImgUrl(ProfileDTO profile, ObjectId oid);
    public void createProfile(User user);
    public void deleteProfile(Long userId);

    public static class ProfileDTO
    {
        private Long userId;
        private String locale;
        private String userName;
        private String firstName;
        private String lastName;

        private String userRole;
        private String userStatus;
        private String userUrl;

        private String coverImg0;
        private String coverImg1;
        private String coverImg2;
        private String userImgUrl;
        private ObjectId transRoot;
        private ObjectId mainRoot;

        private UUID userUuid;
        private List<UUID> connectList;
        private List<UUID> followList;
        private List<UUID> followerList;
        private List<Long> chainLinks;

        private Long connections;
        private Long follows;
        private Long followers;
        private Long chainCount;
        private Long creditEarned;
        private Long creditIssued;
        private Long moneyEarned;
        private Long moneyIssued;

        public ProfileDTO(Profile prof)
        {
            String baseUri = "/rs/upload";
            userId = prof.getUserId();
            locale = prof.getLocale();
            userName = prof.getUserName();
            firstName = prof.getFirstName();
            lastName = prof.getLastName();
            
            ObjStore objStore = ObjStore.getInstance();
            coverImg0 = objStore.imgObjUri(prof.getCoverImg0(), baseUri);
            coverImg1 = objStore.imgObjUri(prof.getCoverImg1(), baseUri);
            coverImg2 = objStore.imgObjUri(prof.getCoverImg2(), baseUri);
            userImgUrl = objStore.imgObjUri(prof.getUserImgUrl(), baseUri);

            userUuid = prof.getUserUuid();
            userUrl = "/user/id/" + userUuid.toString();

            transRoot = prof.getTransRoot();
            mainRoot = prof.getMainRoot();
            connectList = prof.getConnectList();
            followList = prof.getFollowList();
            followerList = prof.getFollowerList();
            chainLinks = prof.getChainLinks();

            creditEarned = 200L;
            creditIssued = 300L;
            moneyEarned = 500L;
            moneyIssued = 400L;

            connections = Long.valueOf(connectList.size());
            follows = Long.valueOf(followList.size());
            followers = Long.valueOf(followerList.size());
            chainCount = Long.valueOf(chainLinks.size());

            if (coverImg0 == null) {
                coverImg0 = "/rs/img/demo/s1.jpg";
                coverImg1 = "/rs/img/demo/s2.jpg";
                coverImg2 = "/rs/img/demo/s3.jpg";
            }
            if (userImgUrl == null) {
                userImgUrl = "/rs/img/avatars/male.png";
            }
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();

            sb.append(locale).append(", firstName ")
                .append(firstName).append('\n')
                .append("Name: ").append(userName).append(", transRoot: ")
                .append(transRoot.name()).append('\n')
                .append("Uuid: ").append(userUuid.toString()).append('\n');
            return sb.toString();
        }

        /**
         * @return the userId.  Use this so that it won't show up in JSON.
         */
        public Long obtainUserId() {
            return userId;
        }

        public static List<ProfileDTO> convert(List<Profile> list)
        {
            List<ProfileDTO> result = new LinkedList<>();

            if (list != null) {
                for (Profile prof : list) {
                    result.add(new ProfileDTO(prof));
                }
            }
            return result;
        }

        /**
         * @return the locale
         */
        public String getLocale() {
            return locale;
        }

        /**
         * @param locale the locale to set
         */
        public void setLocale(String locale) {
            this.locale = locale;
        }

        /**
         * @return the userName
         */
        public String getUserName() {
            return userName;
        }

        /**
         * @param userName the userName to set
         */
        public void setUserName(String userName) {
            this.userName = userName;
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
         * @return the userRole
         */
        public String getUserRole() {
            return userRole;
        }

        /**
         * @return the userStatus
         */
        public String getUserStatus() {
            return userStatus;
        }

        /**
         * @return the userUrl
         */
        public String getUserUrl() {
            return userUrl;
        }

        /**
         * @return the coverImg0
         */
        public String getCoverImg0() {
            return coverImg0;
        }

        /**
         * @param coverImg0 the coverImg0 to set
         */
        public void setCoverImg0(String coverImg0) {
            this.coverImg0 = coverImg0;
        }

        /**
         * @return the coverImg1
         */
        public String getCoverImg1() {
            return coverImg1;
        }

        /**
         * @param coverImg1 the coverImg1 to set
         */
        public void setCoverImg1(String coverImg1) {
            this.coverImg1 = coverImg1;
        }

        /**
         * @return the coverImg2
         */
        public String getCoverImg2() {
            return coverImg2;
        }

        /**
         * @param coverImg2 the coverImg2 to set
         */
        public void setCoverImg2(String coverImg2) {
            this.coverImg2 = coverImg2;
        }

        /**
         * @return the transRoot
         */
        public ObjectId getTransRoot() {
            return transRoot;
        }

        /**
         * @return the mainRoot
         */
        public ObjectId getMainRoot() {
            return mainRoot;
        }

        /**
         * @return the userUuid
         */
        public UUID getUserUuid() {
            return userUuid;
        }

        /**
         * @return the userImgUrl
         */
        public String getUserImgUrl() {
            return userImgUrl;
        }

        /**
         * @param userImgUrl the userImgUrl to set
         */
        public void setUserImgUrl(String userImgUrl) {
            this.userImgUrl = userImgUrl;
        }

        /**
         * @return the connectList
         */
        public List<UUID> getConnectList() {
            return connectList;
        }

        /**
         * @return the followList
         */
        public List<UUID> getFollowList() {
            return followList;
        }

        /**
         * @return the followerList
         */
        public List<UUID> getFollowerList() {
            return followerList;
        }

        /**
         * @return the chainLinks
         */
        public List<Long> getChainLinks() {
            return chainLinks;
        }

        /**
         * @return the connections
         */
        public Long getConnections() {
            return connections;
        }

        /**
         * @return the follows
         */
        public Long getFollows() {
            return follows;
        }

        /**
         * @return the followers
         */
        public Long getFollowers() {
            return followers;
        }

        /**
         * @return the chainCount
         */
        public Long getChainCount() {
            return chainCount;
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
