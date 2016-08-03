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

import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.Role;
import com.tvntd.models.User;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.util.Constants;
import com.tvntd.util.Util;

public interface IProfileService
{
    public ProfileDTO getProfile(User user);
    public ProfileDTO getProfile(String uuid);

    public List<ProfileDTO> getProfileList(List<String> userIds);
    public List<ProfileDTO> getProfileFromRaw(List<Profile> raw);
    public Page<ProfileDTO> getProfileList();

    public void followProfiles(ProfileDTO me,
            String[] uuids, HashMap<String, ProfileDTO> changes);
    public void connectProfiles(ProfileDTO me,
            String[] uuids, HashMap<String, ProfileDTO> changes);

    public void saveProfile(ProfileDTO profile);
    public void saveProfiles(List<ProfileDTO> profiles);
    public void saveUserImgUrl(ProfileDTO profile, ObjectId oid);
    public void createProfile(User user);
    public void deleteProfile(Long userId);
    public void deleteProfile(String userUuid);

    /*
     * Transfer profile to front-end.
     */
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
        private String role;

        private Long roleMask;
        private Long connections;
        private Long follows;
        private Long followers;
        private Long chainCount;
        private Long creditEarned;
        private Long creditIssued;
        private Long moneyEarned;
        private Long moneyIssued;

        private ArticleDTO pendPost;
        private LinkedList<ArticleDTO> publishedArts;
        private LinkedList<ArticleDTO> savedArts;

        // NewsFeed for this profile.
        //
        private Future<List<String>> task;
        private List<String> authors;

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
            userUrl = "/user/id/" + profile.getUserUuid();
            role = Role.User;
            roleMask = Constants.Role_User;

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

        public ProfileDTO(Profile prof, User user)
        {
            this(prof);
            roleMask = 0L;
            StringBuilder sb = new StringBuilder();
            Collection<Role> roles = user.getRoles();

            for (Role r : roles) {
                String rname = r.getName();
                if (rname.equals(Role.AuthUser)) {
                    sb.append(Role.User).append(" ");
                    roleMask |= Constants.Role_User;

                } else if (rname.equals(Role.AuthAdmin)) {
                    sb.append(Role.Admin).append(" ");
                    roleMask |= Constants.Role_Admin;
                }
            }
            role = sb.toString();
        }

        public Profile toProfile() {
            return profile;
        }

        /**
         * Get/set but not visible to JSON.
         */
        public ArticleDTO fetchPendPost() {
            return this.pendPost;
        }

        public void assignPendPost(ArticleDTO art) {
            this.pendPost = art;
        }

        public void assignPendTask(Future<List<String>> task)
        {
            this.task = task;
            this.authors = null;
        }

        public List<String> fetchNewsFeed()
        {
            if (authors == null && task != null) {
                try {
                    authors = task.get();
                    task = null;

                } catch(InterruptedException | ExecutionException e) {
                    s_log.info("Async error: " + e.toString());
                    return null;
                }
            }
            return authors;
        }

        public void assignNewsFeed(List<String> authors) {
            this.authors = authors;
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
                .append(", username: ").append(profile.getLastName())
                .append("\nUuid: ").append(profile.getUserUuid().toString())
                .append("\nConnect : ").append(profile.getConnectList().toString())
                .append("\nFollow  : ").append(profile.getFollowList().toString())
                .append("\nFollower: ").append(profile.getFollowerList().toString())
                .append("\nPublish : ").append(publishedArts)
                .append("\n");
            return sb.toString();
        }

        static public String getImgBaseUrl() {
            return s_baseUri;
        }

        /**
         * @return the userId.  Use this so that it won't show up in JSON.
         */
        public Long fetchUserId() {
            return profile.getUserId();
        }

        public String findUuid(List<String> src, String item)
        {
            synchronized(this) {
                return Util.<String>isInList(src, item);
            }
        }

        protected String removeUuid(List<String> src, String giving)
        {
            synchronized(this) {
                return Util.<String>removeFrom(src, giving);
            }
        }

        protected void addUuidList(List<String> src, String add)
        {
            synchronized(this) {
                Util.<String>addUnique(src, add);
            }
        }

        /**
         * Connect this profile to the peer profile if there's mutual agreement.
         */
        public void connectProfile(ProfileDTO peer)
        {
            boolean connected = false;
            String myUuid = getUserUuid();
            String peerUuid = peer.getUserUuid();

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
            String myUuid = getUserUuid();
            String peerUuid = peer.getUserUuid();

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
            String myUuid = getUserUuid();
            String peerUuid = peer.getUserUuid();

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
         * @return the publishedArts
         */
        public LinkedList<ArticleDTO> fetchPublishedArts() {
            return publishedArts;
        }

        /**
         * @param publishedArts the publishedArts to set
         */
        public void assignPublishedArts(LinkedList<ArticleDTO> publishedArts) {
            this.publishedArts = publishedArts;
        }

        public void pushPublishArticle(ArticleDTO article)
        {
            if (publishedArts == null) {
                publishedArts = new LinkedList<>();
            }
            publishedArts.addFirst(article);
        }

        /**
         * @return the savedArts
         */
        public LinkedList<ArticleDTO> fetchSavedArts() {
            return savedArts;
        }

        /**
         * @param savedArts the savedArts to set
         */
        public void assignSavedArts(LinkedList<ArticleDTO> savedArts) {
            this.savedArts = savedArts;
        }

        public void pushSavedArticle(ArticleDTO article)
        {
            if (savedArts == null) {
                savedArts = new LinkedList<>();
            }
            savedArts.addFirst(article);
        }

        /**
         * Getters and Setters.
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
        public String getUserUuid() {
            return profile.getUserUuid();
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
        public List<String> getConnectList() {
            return profile.getConnectList();
        }

        /**
         * @return the followList
         */
        public List<String> getFollowList() {
            return profile.getFollowList();
        }

        /**
         * @return the followerList
         */
        public List<String> getFollowerList() {
            return profile.getFollowerList();
        }

        /**
         * @return the chainLinks
         */
        public List<Long> getChainLinks() {
            return profile.getChainLinks();
        }

        /**
         * @return the role
         */
        public String getRole() {
            return role;
        }

        /**
         * @return the roleMask
         */
        public Long getRoleMask() {
            return roleMask;
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
