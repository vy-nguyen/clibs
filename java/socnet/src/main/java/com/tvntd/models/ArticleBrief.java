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

import java.util.Arrays;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import com.tvntd.forms.PostForm;
import com.tvntd.key.HashKey;
import com.tvntd.util.Util;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", unique = false)
})
public class ArticleBrief
{
    @Id
    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String authorUuid;

    @Column(length = 64)
    protected String tagHash;

    @Column(length = 64)
    protected byte[] tag;

    @Column(length = 64)
    protected String urlTag;

    @Column(length = 64)
    protected String prevArticle;

    @Column(length = 64)
    protected String nextArticle;

    @Column(length = 64)
    protected String topArticle;

    @Column(length = 256)
    protected byte[] contentBrief;

    @Column(length = 64)
    protected String transRoot;

    protected boolean favorite;
    protected boolean hasArticle;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ArticleLiked",
            joinColumns = @JoinColumn(name = "articleId"))
    private List<String> userLiked;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ArticleShared",
            joinColumns = @JoinColumn(name = "articleId"))
    private List<String> userShared;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn
    protected ArticleBase artBase;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn
    protected ArticleAttr artAttr;

    public ArticleBrief() {}

    public ArticleBrief(ArticleBase base)
    {
        if (base == null) {
            base = new ArticleBase();
        }
        artBase     = base;
        articleUuid = base.getArticleUuid();
        artAttr     = new ArticleAttr(articleUuid);
        favorite    = false;
        hasArticle  = false;
        transRoot   = null;
    }

    public ArticleBrief(ArtAds ads)
    {
        artBase      = ads.getArtBase();
        artAttr      = ads.getArtAttr();
        authorUuid   = ads.getAuthorUuid();
        articleUuid  = ads.getArticleUuid();
        favorite     = false;
        contentBrief = Arrays.copyOfRange(ads.getBusDesc(), 0, 256);
        this.tag     = ads.getBusCat();
        tagHash      = HashKey.toSha1Key(this.tag, authorUuid);
    }

    public void fromArticleRank(ArticleRank rank)
    {
        articleUuid  = rank.getArticleUuid();
        artAttr      = new ArticleAttr(articleUuid);
        artBase      = new ArticleBase(articleUuid);
        artBase.fromArticleRank(rank);

        tag          = Util.toRawByte(rank.getTag(), 64);
        authorUuid   = rank.getAuthorUuid();
        prevArticle  = rank.getPrevArticle();
        nextArticle  = rank.getNextArticle();
        topArticle   = rank.getTopArticle();
        contentBrief = Util.toRawByte(rank.getContentBrief(), 256);
        favorite     = rank.isFavorite();
        hasArticle   = rank.isHasArticle();
        userLiked    = rank.getUserLiked();
        userShared   = rank.getUserShared();
       
        if (tag != null) {
            tagHash = HashKey.toSha1Key(tag, authorUuid);
        }
    }

    public void fromArticle(Article art)
    {
        articleUuid = art.getArticleUuid();
        authorUuid  = art.getAuthorUuid();
        hasArticle  = true;

        if (artAttr == null) {
            artAttr = new ArticleAttr(articleUuid);
        }
        if (artBase == null) {
            artBase = new ArticleBase();
            artBase.fromArticle(art);
        }
        if (tag == null) {
            tag = art.getPublicTag();
            if (tag != null) {
                tagHash = HashKey.toSha1Key(tag, authorUuid);
            }
        }
        if (contentBrief == null) {
            contentBrief = Util.toRawByte(
                    PostForm.toBriefContent(null, art.getContent()), 256);
        }
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
     * @return the artBase
     */
    public ArticleBase getArtBase() {
        return artBase;
    }

    /**
     * @param artBase the artBase to set
     */
    public void setArtBase(ArticleBase artBase) {
        this.artBase = artBase;
    }

    /**
     * @return the artAttr
     */
    public ArticleAttr getArtAttr() {
        return artAttr;
    }

    /**
     * @param artAttr the artAttr to set
     */
    public void setArtAttr(ArticleAttr artAttr) {
        this.artAttr = artAttr;
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
     * @return the tagHash
     */
    public String getTagHash() {
        return tagHash;
    }

    /**
     * @param tagHash the tagHash to set
     */
    public void setTagHash(String tagHash) {
        this.tagHash = tagHash;
    }

    /**
     * @return the tag
     */
    public byte[] getTag() {
        return tag;
    }

    /**
     * @param tag the tag to set
     */
    public void setTag(byte[] tag) {
        this.tag = tag;
    }

    /**
     * @return the urlTag
     */
    public String getUrlTag() {
        return urlTag;
    }

    /**
     * @param urlTag the urlTag to set
     */
    public void setUrlTag(String urlTag) {
        this.urlTag = urlTag;
    }

    /**
     * @return the prevArticle
     */
    public String getPrevArticle() {
        return prevArticle;
    }

    /**
     * @param prevArticle the prevArticle to set
     */
    public void setPrevArticle(String prevArticle) {
        this.prevArticle = prevArticle;
    }

    /**
     * @return the nextArticle
     */
    public String getNextArticle() {
        return nextArticle;
    }

    /**
     * @param nextArticle the nextArticle to set
     */
    public void setNextArticle(String nextArticle) {
        this.nextArticle = nextArticle;
    }

    /**
     * @return the topArticle
     */
    public String getTopArticle() {
        return topArticle;
    }

    /**
     * @param topArticle the topArticle to set
     */
    public void setTopArticle(String topArticle) {
        this.topArticle = topArticle;
    }

    /**
     * @return the contentBrief
     */
    public byte[] getContentBrief() {
        return contentBrief;
    }

    /**
     * @param contentBrief the contentBrief to set
     */
    public void setContentBrief(byte[] contentBrief) {
        this.contentBrief = contentBrief;
    }

    /**
     * @return the transRoot
     */
    public String getTransRoot() {
        return transRoot;
    }

    /**
     * @param transRoot the transRoot to set
     */
    public void setTransRoot(String transRoot) {
        this.transRoot = transRoot;
    }

    /**
     * @return the favorite
     */
    public boolean isFavorite() {
        return favorite;
    }

    /**
     * @param favorite the favorite to set
     */
    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    /**
     * @return the hasArticle
     */
    public boolean isHasArticle() {
        return hasArticle;
    }

    /**
     * @param hasArticle the hasArticle to set
     */
    public void setHasArticle(boolean hasArticle) {
        this.hasArticle = hasArticle;
    }

    /**
     * @return the userLiked
     */
    public List<String> getUserLiked() {
        return userLiked;
    }

    /**
     * @param userLiked the userLiked to set
     */
    public void setUserLiked(List<String> userLiked) {
        this.userLiked = userLiked;
    }

    /**
     * @return the userShared
     */
    public List<String> getUserShared() {
        return userShared;
    }

    /**
     * @param userShared the userShared to set
     */
    public void setUserShared(List<String> userShared) {
        this.userShared = userShared;
    }
}
