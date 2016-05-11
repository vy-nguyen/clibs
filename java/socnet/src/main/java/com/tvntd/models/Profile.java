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
import java.util.UUID;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import com.tvntd.lib.ObjectId;

@Entity
@Table(indexes = {@Index(columnList = "userUuid", unique = true)})
public class Profile
{
    @Id
    @Column(updatable = false)
    private Long userId;
    private Long profileItemId;

    private String locale;
    private String userName;
    private String email;
    private String firstName;
    private String lastName;
    private ObjectId coverImg0;
    private ObjectId coverImg1;
    private ObjectId coverImg2;
    private ObjectId userImgUrl;
    private ObjectId transRoot;
    private ObjectId mainRoot;

    @Column(name = "userUuid") //, updatable = false)
    private String userUuid;

    @Transient
    private UUID m_userUuid;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ConnectList",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "userId", "connectList"
            }),
            joinColumns = @JoinColumn(name="userId"))
    private List<UUID> connectList;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "FollowerList",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "userId", "followerList"
            }),
            joinColumns = @JoinColumn(name="userId"))
    private List<UUID> followerList;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "FollowList",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "userId", "followList"
            }),
            joinColumns = @JoinColumn(name="userId"))
    private List<UUID> followList;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ChainLinks",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "userId", "chainLinks"
            }),
            joinColumns = @JoinColumn(name="userId"))
    private List<Long> chainLinks;

    public Profile() {
        super();
    }

    public static Profile createProfile(User user)
    {
        Profile prof = new Profile();
      
        prof.locale = "VI";
        prof.userId = user.getId();
        prof.userName = user.getLastName() + " " + user.getFirstName();
        prof.email = user.getEmail();
        prof.firstName = user.getFirstName();
        prof.lastName = user.getLastName();
        prof.transRoot = ObjectId.zeroId();
        prof.mainRoot = ObjectId.zeroId();
        prof.m_userUuid = UUID.randomUUID();
        prof.userUuid = prof.m_userUuid.toString();

        prof.coverImg0 = null;
        prof.coverImg1 = null;
        prof.coverImg2 = null;
        prof.userImgUrl = null;
        return prof;
    }

    /**
     * Return the transparent field in UUID type.
     */
    public UUID fetchUserUuid()
    {
        if (m_userUuid == null) {
            m_userUuid = UUID.fromString(userUuid);
        }
        return m_userUuid;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();

        sb.append("Id: ").append(userId).append(", profileItem: ")
            .append(profileItemId).append('\n')
            .append("Name: ").append(userName).append(", transRoot: ")
            .append(transRoot.name()).append('\n')
            .append("Uuid: ").append(userUuid).append('\n')
            .append("Connect : ").append(connectList).append('\n')
            .append("Follow  : ").append(followList).append('\n')
            .append("Follower: ").append(followerList).append('\n');
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
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
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
     * @return the coverImg0
     */
    public ObjectId getCoverImg0() {
        return coverImg0;
    }

    /**
     * @param coverImg0 the coverImg0 to set
     */
    public void setCoverImg0(ObjectId coverImg0) {
        this.coverImg0 = coverImg0;
    }

    /**
     * @return the coverImg1
     */
    public ObjectId getCoverImg1() {
        return coverImg1;
    }

    /**
     * @param coverImg1 the coverImg1 to set
     */
    public void setCoverImg1(ObjectId coverImg1) {
        this.coverImg1 = coverImg1;
    }

    /**
     * @return the coverImg2
     */
    public ObjectId getCoverImg2() {
        return coverImg2;
    }

    /**
     * @param coverImg2 the coverImg2 to set
     */
    public void setCoverImg2(ObjectId coverImg2) {
        this.coverImg2 = coverImg2;
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
     * @return the userImgUrl
     */
    public ObjectId getUserImgUrl() {
        return userImgUrl;
    }

    /**
     * @param userImgUrl the userImgUrl to set
     */
    public void setUserImgUrl(ObjectId userImgUrl) {
        this.userImgUrl = userImgUrl;
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
        this.m_userUuid = UUID.fromString(userUuid);
    }

    /**
     * @return the connectList
     */
    public List<UUID> getConnectList() {
        return connectList;
    }

    /**
     * @param connectList the connectList to set
     */
    public void setConnectList(List<UUID> connectList) {
        this.connectList = connectList;
    }

    /**
     * @return the followerList
     */
    public List<UUID> getFollowerList() {
        return followerList;
    }

    /**
     * @param followerList the followerList to set
     */
    public void setFollowerList(List<UUID> followerList) {
        this.followerList = followerList;
    }

    /**
     * @return the followList
     */
    public List<UUID> getFollowList() {
        return followList;
    }

    /**
     * @param followList the followList to set
     */
    public void setFollowList(List<UUID> followList) {
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
