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
package com.tvntd.models;

import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Transient;

import com.tvntd.lib.ObjectId;

@Entity
public class Profile
{
    @Id
    private Long userId;
    private Long profileItemId;

    private String coverImg0;
    private String coverImg1;
    private String coverImg2;
    private String coverImg3;
    private String userUuid;
    private ObjectId transRoot;

    @Column(length = 512)
    private String userImgUrl;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "FriendList", joinColumns = @JoinColumn(name="userId"))
    private List<Long> friendList;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "FollowList", joinColumns = @JoinColumn(name="userId"))
    private List<Long> followList;

    public Profile() {
        super();
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
}
