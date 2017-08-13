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

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.tvntd.key.HashKey;
import com.tvntd.util.Util;

@Entity
@Table(indexes = {
    @Index(columnList = "userUuid", unique = false),
    @Index(columnList = "lastUpdate", unique = false)
})
public class ArtTag
{
    public static String EDU    = "edu";
    public static String ADS    = "ads";
    public static String BLOG   = "blog";
    public static String NEWS   = "news";
    public static String ESTORE = "estore";
    public static int TagLength = 128;

    /**
     * TagName hashed to sha1 form for efficiency lookup.
     */
    @Id
    @Column(length = 64)
    private String tagOid;

    @Column(length = 64)
    private String userUuid;

    /**
     * Raw tag to preserve encoding because we can't use it as key.
     */
    @Column(length = 128)
    private byte[] tagName;

    private Date lastUpdate;
    private Long rankScore;

    @Column(length = 64)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "TagArticleRanks",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "tagOid", "tagArtRanks"
            }),
            joinColumns = @JoinColumn(name = "tagOid"))
    private List<String> tagArtRanks;

    @Column(length = 128)
    private byte[] parentTag;

    @Column(length = 16)
    private String tagKind;

    @Column(length = 64)
    private String imgOid;

    @Column(length = 128)
    private String routeLink;

    public ArtTag()
    {
        this.lastUpdate = new Date();
        this.rankScore = 0L;
    }

    public ArtTag(String uuid, String tag, String parent, Long rank)
    {
        lastUpdate = new Date();
        rankScore = rank;
        userUuid = uuid;
        try {
            tagName = tag.getBytes("UTF-8");

            if (parent != null && !parent.isEmpty()) {
                parentTag = parent.getBytes("UTF-8");
            } else {
                parentTag = null;
            }
        } catch(UnsupportedEncodingException e) {
            tagName = null;
            parentTag = null;
        }
        makeTagOid();
    }

    protected void makeTagOid() {
        tagOid = HashKey.toSha1Key(tagName, userUuid);
    }

    public void addArtRank(String rankKey)
    {
        if (tagArtRanks == null) {
            tagArtRanks = new LinkedList<>();
        }
        Util.<String> addUnique(tagArtRanks, rankKey);
    }

    public void removeArtRank(String rankKey)
    {
        if (tagArtRanks != null) {
            Util.<String> removeFrom(tagArtRanks, rankKey);
        }
    }

    /**
     * @return the tagOid
     */
    public String getTagOid() {
        return tagOid;
    }

    /**
     * @param tagOid the tagOid to set
     */
    public void setTagOid(String tagOid) {
        this.tagOid = tagOid;
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
    public void setUserUuid(String userUuid)
    {
        this.userUuid = userUuid;
        makeTagOid();
    }

    /**
     * @return the tagName
     */
    public byte[] getTagName() {
        return tagName;
    }

    /**
     * @param tagName the tagName to set
     */
    public void setTagName(byte[] tagName) {
        this.tagName = tagName;
    }

    /**
     * @return the lastUpdate
     */
    public Date getLastUpdate() {
        return lastUpdate;
    }

    /**
     * @param lastUpdate the lastUpdate to set
     */
    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    /**
     * @return the rankScore
     */
    public Long getRankScore() {
        return rankScore;
    }

    /**
     * @param rankScore the rankScore to set
     */
    public void setRankScore(Long rankScore) {
        this.rankScore = rankScore;
    }

    /**
     * @return the tagArtRanks
     */
    public List<String> getTagArtRanks() {
        return tagArtRanks;
    }

    /**
     * @param tagArtRanks the tagArtRanks to set
     */
    public void setTagArtRanks(List<String> tagArtRanks) {
        this.tagArtRanks = tagArtRanks;
    }

    /**
     * @return the parentTag
     */
    public byte[] getParentTag() {
        return parentTag;
    }

    /**
     * @param parentTag the parentTag to set
     */
    public void setParentTag(byte[] parentTag) {
        this.parentTag = parentTag;
    }

    /**
     * @return the tagKind
     */
    public String getTagKind() {
        return tagKind;
    }

    /**
     * @param tagKind the tagKind to set
     */
    public void setTagKind(String tagKind) {
        this.tagKind = tagKind;
    }

    /**
     * @return the imgOid
     */
    public String getImgOid() {
        return imgOid;
    }

    /**
     * @param imgOid the imgOid to set
     */
    public void setImgOid(String imgOid) {
        this.imgOid = imgOid;
    }

    /**
     * @return the routeLink
     */
    public String getRouteLink() {
        return routeLink;
    }

    /**
     * @param routeLink the routeLink to set
     */
    public void setRouteLink(String routeLink) {
        this.routeLink = routeLink;
    }
}
