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

import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IArticleService.ArticleDTO;

public interface IProfileService
{
    public ProfileDTO getProfile(Long userId);
    public ProfileDTO getProfile(UUID uuid);

    public List<ProfileDTO> getProfileList(List<UUID> userIds);
    public List<ProfileDTO> getProfileFromRaw(List<Profile> raw);
    public Page<ProfileDTO> getProfileList();

    public void followProfiles(ProfileDTO me,
            String[] uuids, HashMap<UUID, ProfileDTO> changes);
    public void connectProfiles(ProfileDTO me,
            String[] uuids, HashMap<UUID, ProfileDTO> changes);

    public void saveProfile(ProfileDTO profile);
    public void saveProfiles(List<ProfileDTO> profiles);
    public void saveUserImgUrl(ProfileDTO profile, ObjectId oid);
    public void createProfile(User user);
    public void deleteProfile(Long userId);
    public void deleteProfile(UUID userUuid);

    public static Comparator<UUID> s_uuidCompare = new Comparator<UUID>() {
        @Override
        public int compare(UUID u1, UUID u2) {
            return u1.compareTo(u2);
        }
    };

    public static class ProfileDTO
    {
        private static Logger s_log = LoggerFactory.getLogger(ProfileDTO.class);
        private static String s_baseUri = "/rs/upload";
        private Profile profile;

        private String coverImg0;
        private String coverImg1;
        private String coverImg2;
        private String userImgUrl;
        private String transRoot;
        private String mainRoot;
        private String userUrl;

        private Long connections;
        private Long follows;
        private Long followers;
        private Long chainCount;
        private Long creditEarned;
        private Long creditIssued;
        private Long moneyEarned;
        private Long moneyIssued;

        private ArticleDTO pendPost;

        public ProfileDTO(Profile prof)
        {
            profile = prof;

            ObjStore objStore = ObjStore.getInstance();
            coverImg0 = objStore.imgObjUri(prof.getCoverImg0(), s_baseUri);
            coverImg1 = objStore.imgObjUri(prof.getCoverImg1(), s_baseUri);
            coverImg2 = objStore.imgObjUri(prof.getCoverImg2(), s_baseUri);
            userImgUrl = objStore.imgObjUri(prof.getUserImgUrl(), s_baseUri);

            transRoot = prof.getTransRoot().name();
            mainRoot = prof.getTransRoot().name();
            userUrl = "/user/id/" + profile.getUserUuid().toString();

            creditEarned = 200L;
            creditIssued = 300L;
            moneyEarned = 500L;
            moneyIssued = 400L;

            connections = Long.valueOf(prof.getConnectList().size());
            follows = Long.valueOf(prof.getFollowList().size());
            followers = Long.valueOf(prof.getFollowerList().size());
            chainCount = Long.valueOf(prof.getChainLinks().size());

            if (coverImg0 == null) {
                coverImg0 = "/rs/img/demo/s1.jpg";
                coverImg1 = "/rs/img/demo/s2.jpg";
                coverImg2 = "/rs/img/demo/s3.jpg";
            }
            if (userImgUrl == null) {
                userImgUrl = "/rs/img/avatars/male.png";
            }
        }

        public Profile toProfile() {
            return profile;
        }

        /**
         * Get/set but not visible to JSON.
         */
        public ArticleDTO obtainPendPost() {
            return this.pendPost;
        }

        public void assignPendPost(ArticleDTO art) {
            this.pendPost = art;
        }

        /**
         * Update image URL with new obj id.
         */
        public void updateImgUrl(ObjectId id)
        {
            ObjStore objStore = ObjStore.getInstance();
            userImgUrl = objStore.imgObjUri(id, s_baseUri);
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();

            sb.append(profile.getLocale())
                .append("- firstName ").append(profile.getFirstName())
                .append(", username: ").append(profile.getUserName())
                .append("\nUuid: ").append(profile.getUserUuid().toString())
                .append("\nConnect : ").append(profile.getConnectList().toString())
                .append("\nFollow  : ").append(profile.getFollowList().toString())
                .append("\nFollower: ").append(profile.getFollowerList().toString())
                .append("\n");
            return sb.toString();
        }

        /**
         * @return the userId.  Use this so that it won't show up in JSON.
         */
        public Long obtainUserId() {
            return profile.getUserId();
        }

        /**
         * Common code for UUID list.
         */
        public UUID findUuid(List<UUID> src, UUID item)
        {
            synchronized(this) {
                for (UUID uuid : src) {
                    if (uuid.compareTo(item) == 0) {
                        return uuid;
                    }
                }
            }
            return null;
        }

        protected UUID removeUuid(List<UUID> src, UUID giving)
        {
            synchronized(this) {
                Iterator<UUID> iter = src.iterator();
                while (iter.hasNext()) {
                    UUID item = iter.next();
                    if (item.compareTo(giving) == 0) {
                        iter.remove();
                        return item;
                    }
                }
            }
            return null;
        }

        protected void addUuidList(List<UUID> src, UUID add)
        {
            synchronized(this) {
                Iterator<UUID> iter = src.iterator();
                while (iter.hasNext()) {
                    UUID item = iter.next();
                    if (item.compareTo(add) == 0) {
                        return;
                    }
                }
                src.add(add);
            }
        }

        /**
         * Connect this profile to the peer profile if there's mutual agreement.
         */
        public void connectProfile(ProfileDTO peer)
        {
            boolean connected = false;
            UUID myUuid = getUserUuid();
            UUID peerUuid = peer.getUserUuid();

            if (myUuid.compareTo(peerUuid) == 0) {
                return;
            }
            if ((peer.findUuid(peer.getFollowList(), myUuid) != null)) {
                connected = true;
                addUuidList(getConnectList(), peerUuid);
                peer.addUuidList(peer.getConnectList(), myUuid);

            } else if (peer.findUuid(peer.getConnectList(), myUuid) != null) {
                connected = true;
                addUuidList(getConnectList(), peerUuid);
            }
            if (connected == true) {
                cleanupAfterConnect(peer);
            } else {
                followProfile(peer);
            }
        }

        private void cleanupAfterConnect(ProfileDTO peer)
        {
            UUID myUuid = getUserUuid();
            UUID peerUuid = peer.getUserUuid();

            peer.removeUuid(peer.getFollowList(), myUuid);
            peer.removeUuid(peer.getFollowerList(), myUuid);
            removeUuid(getFollowList(), peerUuid);
            removeUuid(getFollowerList(), peerUuid);
        }

        public void unConnectProfile(ProfileDTO peer)
        {
            removeUuid(peer.getConnectList(), getUserUuid());
            removeUuid(getConnectList(), peer.getUserUuid());
        }

        /**
         * Setup my profile to follow the peer.
         */
        public void followProfile(ProfileDTO peer)
        {
            UUID myUuid = getUserUuid();
            UUID peerUuid = peer.getUserUuid();

            if (myUuid.compareTo(peerUuid) == 0) {
                return;
            }
            if (peer.findUuid(peer.getFollowList(), myUuid) != null) {
                // Both follow each other; make the connection.
                addUuidList(getConnectList(), peerUuid);
                peer.addUuidList(peer.getConnectList(), myUuid);
                cleanupAfterConnect(peer);

            } else if (findUuid(getConnectList(), peerUuid) == null &&
                       peer.findUuid(peer.getConnectList(), myUuid) == null) {
                addUuidList(getFollowList(), peer.getUserUuid());
                peer.addUuidList(peer.getFollowerList(), getUserUuid());
                s_log.debug(myUuid.toString() + " follows " + peerUuid.toString());
            }
        }

        public void unfollowProfile(ProfileDTO peer)
        {
            removeUuid(getFollowList(), peer.getUserUuid());
            peer.removeUuid(peer.getFollowerList(), getUserUuid());
        }

        /**
         * Convert list of Profile to ProfileDTO.
         */
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
            return profile.getLocale();
        }

        /**
         * @param locale the locale to set
         */
        public void setLocale(String locale) {
            profile.setLocale(locale);
        }

        public String getEmail() {
            return profile.getEmail();
        }

        /**
         * @return the userName
         */
        public String getUserName() {
            return profile.getUserName();
        }

        /**
         * @param userName the userName to set
         */
        public void setUserName(String userName) {
            profile.setUserName(userName);
        }

        /**
         * @return the firstName
         */
        public String getFirstName() {
            return profile.getFirstName();
        }

        /**
         * @param firstName the firstName to set
         */
        public void setFirstName(String firstName) {
            profile.setFirstName(firstName);
        }

        /**
         * @return the lastName
         */
        public String getLastName() {
            return profile.getLastName();
        }

        /**
         * @param lastName the lastName to set
         */
        public void setLastName(String lastName) {
            profile.setLastName(lastName);
        }

        /**
         * @return the userRole
         */
        public String getUserRole() {
            return null;
        }

        /**
         * @return the userStatus
         */
        public String getUserStatus() {
            return null;
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
        public String getTransRoot() {
            return transRoot;
        }

        /**
         * @return the mainRoot
         */
        public String getMainRoot() {
            return mainRoot;
        }

        /**
         * @return the userUuid
         */
        public UUID getUserUuid() {
            return profile.fetchUserUuid();
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
            return profile.getConnectList();
        }

        /**
         * @return the followList
         */
        public List<UUID> getFollowList() {
            return profile.getFollowList();
        }

        /**
         * @return the followerList
         */
        public List<UUID> getFollowerList() {
            return profile.getFollowerList();
        }

        /**
         * @return the chainLinks
         */
        public List<Long> getChainLinks() {
            return profile.getChainLinks();
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
