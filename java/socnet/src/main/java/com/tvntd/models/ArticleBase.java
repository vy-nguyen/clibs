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

import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", unique = false),
    @Index(columnList = "publicUrlOid", unique = false)
})
public class ArticleBase
{
    @Id
    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String authorUuid;

    protected Long authorId;
    protected Long permMask;

    @Column(length = 64)
    protected String publicUrlOid;

    @Column(length = 128)
    protected byte[] artTitle;

    @Column(length = 128)
    protected byte[] publicTag;

    protected Date createdDate;

    /**
     * Contain values from ArtTag to specify article type.
     */
    protected String artTag;
    protected String contentOid;
    protected String contentLinkUrl;

    @Column(length = 64)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "ArtPics",
            joinColumns = @JoinColumn(name = "articleId"))
    protected List<String> pictures;

    public ArticleBase()
    {
        articleUuid = UUID.randomUUID().toString();
        createdDate = new Date();
    }

    public ArticleBase(ProfileDTO profile)
    {
        this();
        if (profile != null) {
            authorUuid = profile.getUserUuid();
            authorId   = profile.fetchUserId();
            permMask   = profile.getRoleMask();
        }
    }

    /**
     * Conversion routines
     */
    public ArticleBase(ArticleRank rank)
    {
        articleUuid  = rank.getArticleUuid();
        authorUuid   = rank.getAuthorUuid();
        authorId     = rank.getAuthorId();
        permMask     = rank.getPermMask();
        publicUrlOid = rank.getPublicUrlOid();
        artTitle     = Util.toRawByte(rank.getArtTitle(), 128);
        artTag       = rank.getArtTag();
        contentOid   = rank.getContentOid();
        contentLinkUrl = rank.getContentLinkUrl();
    }

    public void setFromArticle(Article art)
    {
        publicTag = art.getPublicTag();
        pictures  = art.getPictures();
    }

    /**
     * @return the articleUuid
     */
    public String getArticleUuid() {
        return articleUuid;
    }

    /**
     * @param articleUuid the articleUuid to set
     */
    public void setArticleUuid(String articleUuid) {
        this.articleUuid = articleUuid;
    }

    /**
     * @return the authorUuid
     */
    public String getAuthorUuid() {
        return authorUuid;
    }

    /**
     * @param authorUuid the authorUuid to set
     */
    public void setAuthorUuid(String authorUuid) {
        this.authorUuid = authorUuid;
    }

    /**
     * @return the authorId
     */
    public Long getAuthorId() {
        return authorId;
    }

    /**
     * @param authorId the authorId to set
     */
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    /**
     * @return the permMask
     */
    public Long getPermMask() {
        return permMask;
    }

    /**
     * @param permMask the permMask to set
     */
    public void setPermMask(Long permMask) {
        this.permMask = permMask;
    }

    /**
     * @return the publicUrlOid
     */
    public String getPublicUrlOid() {
        return publicUrlOid;
    }

    /**
     * @param publicUrlOid the publicUrlOid to set
     */
    public void setPublicUrlOid(String publicUrlOid) {
        this.publicUrlOid = publicUrlOid;
    }

    /**
     * @return the artTitle
     */
    public byte[] getArtTitle() {
        return artTitle;
    }

    /**
     * @param artTitle the artTitle to set
     */
    public void setArtTitle(byte[] artTitle) {
        this.artTitle = artTitle;
    }

    /**
     * @return the publicTag
     */
    public byte[] getPublicTag() {
        return publicTag;
    }

    /**
     * @param publicTag the publicTag to set
     */
    public void setPublicTag(byte[] publicTag) {
        this.publicTag = publicTag;
    }

    /**
     * @return the createdDate
     */
    public Date getCreatedDate() {
        return createdDate;
    }

    /**
     * @param createdDate the createdDate to set
     */
    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    /**
     * @return the artTag
     */
    public String getArtTag() {
        return artTag;
    }

    /**
     * @param artTag the artTag to set
     */
    public void setArtTag(String artTag) {
        this.artTag = artTag;
    }

    /**
     * @return the contentOid
     */
    public String getContentOid() {
        return contentOid;
    }

    /**
     * @param contentOid the contentOid to set
     */
    public void setContentOid(String contentOid) {
        this.contentOid = contentOid;
    }

    /**
     * @return the contentLinkUrl
     */
    public String getContentLinkUrl() {
        return contentLinkUrl;
    }

    /**
     * @param contentLinkUrl the contentLinkUrl to set
     */
    public void setContentLinkUrl(String contentLinkUrl) {
        this.contentLinkUrl = contentLinkUrl;
    }

    /**
     * @return the pictures
     */
    public List<String> getPictures() {
        return pictures;
    }

    /**
     * @param pictures the pictures to set
     */
    public void setPictures(List<String> pictures) {
        this.pictures = pictures;
    }
}
