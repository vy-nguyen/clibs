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
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
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
    /*
     * contentOId format:
     * HEX:abcdef123... for OID
     * DOC:docs.google.com for doc link.
     * VID:youtube.com for video link.
     */
    public static int MaxTitleLength = 128;
    public static int MaxContentLength = 1 << 16;
    public static int DOC_TYPE = 100;
    public static int VID_TYPE = 200;
    public static int DRV_TYPE = 300;

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

    @OneToOne(optional = true)
    @PrimaryKeyJoinColumn
    protected ArticleBase artBase;

    @OneToOne(optional = true)
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
        hasArticle   = true;
        contentBrief = Arrays.copyOfRange(ads.getBusDesc(), 0, 256);
        this.tag     = ads.getBusCat();
        tagHash      = HashKey.toSha1Key(this.tag, authorUuid);

        artBase.setArtTitle(ads.getBusName());
    }

    public ArticleBrief(ArtProduct prod)
    {
        artBase      = prod.getArtBase();
        artAttr      = prod.getArtAttr();
        authorUuid   = prod.getAuthorUuid();
        articleUuid  = prod.getArticleUuid();
        favorite     = false;
        hasArticle   = true;
        tag          = prod.getProdCat();
        tagHash      = HashKey.toSha1Key(tag, authorUuid);
        contentBrief = Arrays.copyOfRange(prod.getProdDesc(), 0, 256);

        artBase.setArtTitle(prod.getProdName());
    }

    public ArticleBrief(ArticlePost post, PostForm form)
    {
        artBase      = post.getArtBase();
        artAttr      = new ArticleAttr(artBase.getArticleUuid());
        authorUuid   = post.getAuthorUuid();
        articleUuid  = post.getArticleUuid();
        favorite     = false;
        hasArticle   = true;

        updateFrom(form);
        if (post.isPending() == true) {
            artBase.setPermMask(ArticleBase.PERM_PRIVATE);
        }
    }

    public void updateFrom(PostForm form)
    {
        tag          = Util.toRawByte(form.getTags(), 64);
        tagHash      = HashKey.toSha1Key(tag, authorUuid);
        contentBrief = Util.toRawByte(form.getContentBrief(), 256);

        String host  = form.fetchContentUrlHost();
        String url   = form.fetchContentUrlFile();
        if (host != null && url != null) {
            hasArticle = false;
            artBase.setContentLinkUrl(url);
            artBase.setContentOid(
                ArticleBase.makeUrlLink(null, host, form.fetchDocType())
            );
        }
        if (form.getContent().length() < 256) {
            hasArticle = false;
        }
        artBase.setArtTitle(Util.toRawByte(form.getTopic(), 128));
    }

    static public String makeUrlLink(ArticleBrief self, String host, int mode)
    {
        String oid;

        if (mode == DOC_TYPE) {
            oid = "DOC:" + host;
        } else if (mode == VID_TYPE) {
            oid = "VID:" + host;
        } else if (mode == DRV_TYPE) {
            oid = "DRV:" + host;
        } else {
            oid = "HEX:" + host;
        }
        if (self != null) {
            self.artBase.setContentOid(oid);
        }
        return oid;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();

        sb.append("Uuid: ").append(articleUuid).append(", author: ").append(authorUuid)
            .append(", title: ").append(artBase.getArtTitle())
            .append(", permMask: ").append(artBase.getPermMask())
            .append(", hasArt: ").append(hasArticle).append("\n");
        return sb.toString();
    }

    public void setPublish(boolean pub)
    {
        Long mask = pub == true ? 0L : ArticleBase.PERM_PRIVATE;
        artBase.setPermMask(mask);
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
        return artAttr.getUserLiked();
    }

    /**
     * @param userLiked the userLiked to set
     */
    public void setUserLiked(List<String> userLiked) {
        artAttr.setUserLiked(userLiked);
    }

    /**
     * @return the userShared
     */
    public List<String> getUserShared() {
        return artAttr.getUserShared();
    }

    /**
     * @param userShared the userShared to set
     */
    public void setUserShared(List<String> userShared) {
        artAttr.setUserShared(userShared);
    }
}
