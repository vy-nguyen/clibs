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

import java.util.Date;
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

@Entity
@Table(indexes = {
    @Index(columnList = "userUuid", unique = false),
    @Index(columnList = "lastUpdate", unique = false)
})
public class ArtTag
{
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

    @Column(length = 64)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "SubTags",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "tagOid", "subTags"
            }),
            joinColumns = @JoinColumn(name = "tagOid"))
    private List<String> subTags;;

    public void makeTagOid() {
        tagOid = HashKey.toSha1Key(tagName, userUuid);
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
    public void setUserUuid(String userUuid) {
        this.userUuid = userUuid;
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
     * @return the subTags
     */
    public List<String> getSubTags() {
        return subTags;
    }

    /**
     * @param subTags the subTags to set
     */
    public void setSubTags(List<String> subTags) {
        this.subTags = subTags;
    }
}
