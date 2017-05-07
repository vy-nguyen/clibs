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
import com.tvntd.models.AdsPost;
import com.tvntd.models.Profile;
import com.tvntd.models.Role;
import com.tvntd.models.User;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IAdsPostService.AdsPostDTO;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IProductService.ProductDTO;
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
    public void createProfile(User user, String uuid);
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
        private ObjStore objStore;

        private String role;
        private String startPage;
        private Long roleMask;

        private ArticleDTO             pendPost;
        private LinkedList<ArticleDTO> publishedArts;
        private LinkedList<ArticleDTO> savedArts;

        private ProductDTO             pendProd;
        private LinkedList<ProductDTO> publishedProds;
        private LinkedList<ProductDTO> savedProds;

        private AdsPostDTO             pendAds;

        // NewsFeed for this profile.
        //
        private Future<List<String>> task;
        private List<String> authors;

        public ProfileDTO(Profile prof)
        {
            profile = prof;
            objStore = ObjStore.getInstance();

            role = Role.User;
            roleMask = Constants.Role_User;
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

        public boolean isAdmin() {
            return (roleMask & Constants.Role_Admin) != 0;
        }

        public Profile toProfile() {
            return profile;
        }

        /**
         * Get/set but not visible to JSON.
         */
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
         * Update image URL with the new obj id.
         */
        public void updateImgUrl(ObjectId id) {
            profile.setUserImgUrl(id.name());
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

        public Profile fetchProfile() {
            return profile;
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
         * ------------------- Article Posting ------------------------
         */
        public LinkedList<ArticleDTO> fetchPublishedArts() {
            return publishedArts;
        }

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

        public LinkedList<ArticleDTO> fetchSavedArts() {
            return savedArts;
        }

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

        public ArticleDTO fetchPendPost() {
            return this.pendPost;
        }

        public void assignPendPost(ArticleDTO art) {
            this.pendPost = art;
        }

        /**
         * ------------------ Product Posting ----------------------
         */
        public LinkedList<ProductDTO> fetchPublishProds() {
            return publishedProds;
        }

        public void assignPublishedProds(LinkedList<ProductDTO> products) {
            this.publishedProds = products;
        }

        public void pushPublishProduct(ProductDTO product)
        {
            if (publishedProds == null) {
                publishedProds = new LinkedList<>();
            }
            publishedProds.addFirst(product);
        }

        public LinkedList<ProductDTO> fetchSavedProducts() {
            return savedProds;
        }

        public void assignSavedProducts(LinkedList<ProductDTO> products) {
            this.savedProds = products;
        }

        public void pushSavedProduct(ProductDTO product)
        {
            if (savedProds == null) {
                savedProds = new LinkedList<>();
            }
            savedProds.addFirst(product);
        }

        public ProductDTO fetchPendProduct() {
            return pendProd;
        }

        public void assignPendProduct(ProductDTO product) {
            this.pendProd = product;
        }

        /**
         * ------------------ Ads Posting ----------------------
         */
        public AdsPostDTO genPendAds()
        {
            if (pendAds != null) {
                return pendAds;
            }
            AdsPost ads = new AdsPost();
            ads.setAuthorUuid(getUserUuid());
            pendAds = new AdsPostDTO(ads, null);
            return pendAds;
        }

        public void assignPendAds(AdsPostDTO ads) {
            pendAds = ads;
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
            return "/usr/id/" + profile.getUserUuid();
        }

        /**
         * @return the coverImg0
         */
        public String getCoverImg0()
        {
            String coverImg = objStore.imgObjUri(profile.fetchCoverImg0(), s_baseUri);
            if (coverImg == null) {
                coverImg = "/rs/img/demo/s1.jpg";
            }
            return coverImg;
        }

        /**
         * @return the coverImg1
         */
        public String getCoverImg1()
        {
            String coverImg = objStore.imgObjUri(profile.fetchCoverImg1(), s_baseUri);
            if (coverImg == null) {
                coverImg = "/rs/img/demo/s2.jpg";
            }
            return coverImg;
        }

        /**
         * @return the coverImg2
         */
        public String getCoverImg2()
        {
            String coverImg = objStore.imgObjUri(profile.fetchCoverImg2(), s_baseUri);
            if (coverImg == null) {
                coverImg = "/rs/img/demo/s3.jpg";
            }
            return coverImg;
        }

        /**
         * @return the transRoot
         */
        public String getTransRoot() {
            return profile.getTransRoot();
        }

        /**
         * @return the mainRoot
         */
        public String getMainRoot() {
            return profile.getMainRoot();
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
        public String getUserImgUrl()
        {
            String imgUrl = objStore.imgObjUri(profile.fetchUserImgUrl(), s_baseUri);
            if (imgUrl == null) {
                imgUrl = "/rs/img/avatars/male.png";
            }
            return imgUrl;
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
         * @return the startPage
         */
        public String getStartPage() {
            return startPage;
        }

        /**
         * @param startPage the startPage to set
         */
        public void setStartPage(String startPage) {
            this.startPage = startPage;
        }

        /**
         * @return the roleMask
         */
        public Long getRoleMask() {
            return roleMask;
        }

        /**
         * @return the pendAds
         */
        public AdsPostDTO getPendAds() {
            return pendAds;
        }

        /**
         * @param pendAds the pendAds to set
         */
        public void setPendAds(AdsPostDTO pendAds) {
            this.pendAds = pendAds;
        }

        /**
         * @return the connections
         */
        public Long getConnections()
        {
            List<String> con = profile.getConnectList();
            return (con != null) ? Long.valueOf(con.size()) : 0L;
        }

        /**
         * @return the follows
         */
        public Long getFollows()
        {
            List<String> fl = profile.getFollowList();
            return (fl != null) ? Long.valueOf(fl.size()) : 0L;
        }

        /**
         * @return the followers
         */
        public Long getFollowers()
        {
            List<String> fl = profile.getFollowerList();
            return (fl != null) ? Long.valueOf(fl.size()) : 0L;
        }

        /**
         * @return the chainCount
         */
        public Long getChainCount()
        {
            List<Long> chain = profile.getChainLinks();
            return (chain != null) ? Long.valueOf(chain.size()) : 0L;
        }

        /**
         * @return the creditEarned
         */
        public Long getCreditEarned() {
            return 0L;
        }

        /**
         * @return the creditIssued
         */
        public Long getCreditIssued() {
            return 0L;
        }

        /**
         * @return the moneyEarned
         */
        public Long getMoneyEarned() {
            return 0L;
        }

        /**
         * @return the moneyIssued
         */
        public Long getMoneyIssued() {
            return 0L;
        }
    }
}
