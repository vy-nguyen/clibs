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

import java.util.List;
import java.util.UUID;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.User;

public interface IProfileService
{
    public ProfileDTO getProfile(Long userId);
    public ProfileDTO getProfile(UUID uuid);
    public List<ProfileBriefDTO> getProfileList(List<Long> userIds);

    public void saveProfile(Long userId, ProfileDTO profile);
    public void createProfile(User user);
    public void deleteProfile(Long userId);

    public static class ProfileBriefDTO
    {
        private Long userId;
        private Long profileItemId;
        private String userName;
        private String coverImg;
        private ObjectId transRoot;
        private ObjectId mainRoot;
        private UUID userUuid;
        private String userImgUrl;

        public ProfileBriefDTO(Profile prof)
        {
            userId = prof.getUserId();
            userName = prof.getUserName();
            profileItemId = prof.getProfileItemId();
            coverImg = prof.getCoverImg0();
            transRoot = prof.getTransRoot();
            mainRoot = prof.getMainRoot();
            userUuid = prof.getUserUuid();
            userImgUrl = prof.getUserImgUrl();
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();

            sb.append("Id: ").append(userId).append(", profileItem: ")
                .append(profileItemId).append('\n')
                .append("Name: ").append(userName).append(", transRoot: ")
                .append(transRoot.name()).append('\n')
                .append("Uuid: ").append(userUuid.toString()).append('\n');
            return sb.toString();
        }

        /**
         * @return the userId
         */
        public Long getUserId() {
            return userId;
        }

        /**
         * @param userId the userId to set
         */
        public void setUserId(Long userId) {
            this.userId = userId;
        }

        /**
         * @return the profileItemId
         */
        public Long getProfileItemId() {
            return profileItemId;
        }

        /**
         * @param profileItemId the profileItemId to set
         */
        public void setProfileItemId(Long profileItemId) {
            this.profileItemId = profileItemId;
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
         * @return the coverImg
         */
        public String getCoverImg() {
            return coverImg;
        }

        /**
         * @param coverImg the coverImg to set
         */
        public void setCoverImg(String coverImg) {
            this.coverImg = coverImg;
        }

        /**
         * @return the transRoot
         */
        public ObjectId getTransRoot() {
            return transRoot;
        }

        /**
         * @param transRoot the transRoot to set
         */
        public void setTransRoot(ObjectId transRoot) {
            this.transRoot = transRoot;
        }

        /**
         * @return the mainRoot
         */
        public ObjectId getMainRoot() {
            return mainRoot;
        }

        /**
         * @param mainRoot the mainRoot to set
         */
        public void setMainRoot(ObjectId mainRoot) {
            this.mainRoot = mainRoot;
        }

        /**
         * @return the userUuid
         */
        public UUID getUserUuid() {
            return userUuid;
        }

        /**
         * @param userUuid the userUuid to set
         */
        public void setUserUuid(UUID userUuid) {
            this.userUuid = userUuid;
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
    }

    public static class ProfileDTO
    {
        private Long userId;
        private Long profileItemId;

        private String userName;
        private String coverImg0;
        private String coverImg1;
        private String coverImg2;
        private String coverImg3;
        private ObjectId transRoot;
        private ObjectId mainRoot;

        private UUID userUuid;
        private String userImgUrl;
        private List<Long> friendList;
        private List<Long> followList;
        private List<Long> chainLinks;

        public ProfileDTO(Profile prof)
        {
            userId = prof.getUserId();
            profileItemId = prof.getProfileItemId();
            coverImg0 = prof.getCoverImg0();
            coverImg1 = prof.getCoverImg1();
            coverImg2 = prof.getCoverImg2();
            coverImg3 = prof.getCoverImg3();
            transRoot = prof.getTransRoot();
            mainRoot = prof.getMainRoot();
            userUuid = prof.getUserUuid();
            userImgUrl = prof.getUserImgUrl();
            friendList = prof.getFriendList();
            followList = prof.getFollowList();
            chainLinks = prof.getChainLinks();
        }

        public void updateProfile(Profile ret)
        {
            ret.setCoverImg0(coverImg0);
            ret.setCoverImg1(coverImg1);
            ret.setCoverImg2(coverImg2);
            ret.setCoverImg3(coverImg3);
            ret.setTransRoot(transRoot);
            ret.setMainRoot(mainRoot);
            ret.setUserImgUrl(userImgUrl);
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();

            sb.append("Id: ").append(userId).append(", profileItem: ")
                .append(profileItemId).append('\n')
                .append("Name: ").append(userName).append(", transRoot: ")
                .append(transRoot.name()).append('\n')
                .append("Uuid: ").append(userUuid.toString()).append('\n');
            return sb.toString();
        }

        /**
         * @return the userId
         */
        public Long getUserId() {
            return userId;
        }

        /**
         * @param userId the userId to set
         */
        public void setUserId(Long userId) {
            this.userId = userId;
        }

        /**
         * @return the profileItemId
         */
        public Long getProfileItemId() {
            return profileItemId;
        }

        /**
         * @param profileItemId the profileItemId to set
         */
        public void setProfileItemId(Long profileItemId) {
            this.profileItemId = profileItemId;
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
         * @return the coverImg3
         */
        public String getCoverImg3() {
            return coverImg3;
        }

        /**
         * @param coverImg3 the coverImg3 to set
         */
        public void setCoverImg3(String coverImg3) {
            this.coverImg3 = coverImg3;
        }

        /**
         * @return the transRoot
         */
        public ObjectId getTransRoot() {
            return transRoot;
        }

        /**
         * @param transRoot the transRoot to set
         */
        public void setTransRoot(ObjectId transRoot) {
            this.transRoot = transRoot;
        }

        /**
         * @return the mainRoot
         */
        public ObjectId getMainRoot() {
            return mainRoot;
        }

        /**
         * @param mainRoot the mainRoot to set
         */
        public void setMainRoot(ObjectId mainRoot) {
            this.mainRoot = mainRoot;
        }

        /**
         * @return the userUuid
         */
        public UUID getUserUuid() {
            return userUuid;
        }

        /**
         * @param userUuid the userUuid to set
         */
        public void setUserUuid(UUID userUuid) {
            this.userUuid = userUuid;
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
         * @return the friendList
         */
        public List<Long> getFriendList() {
            return friendList;
        }

        /**
         * @param friendList the friendList to set
         */
        public void setFriendList(List<Long> friendList) {
            this.friendList = friendList;
        }

        /**
         * @return the followList
         */
        public List<Long> getFollowList() {
            return followList;
        }

        /**
         * @param followList the followList to set
         */
        public void setFollowList(List<Long> followList) {
            this.followList = followList;
        }

        /**
         * @return the chainLinks
         */
        public List<Long> getChainLinks() {
            return chainLinks;
        }

        /**
         * @param chainLinks the chainLinks to set
         */
        public void setChainLinks(List<Long> chainLinks) {
            this.chainLinks = chainLinks;
        }
    }
}
