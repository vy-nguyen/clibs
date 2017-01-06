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
import java.nio.charset.Charset;
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

import com.tvntd.forms.ArticleForm;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.key.HashKey;
import com.tvntd.util.Constants;
import com.tvntd.util.Util;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", unique = false)
})
public class ArticleRank
{
    public static int MaxTitleLength = 128;
    public static int MaxContentLength = 256;

    @Id
    @Column(length = 64)
    private String articleUuid;

    @Column(length = 64)
    private String tagHash;

    @Column(length = 64)
    private byte[] tag;

    @Column(length = 64)
    private String authorUuid;

    @Column(length = 128)
    private byte[] artTitle;

    @Column(length = 256)
    private byte[] contentBrief;

    private Date timeStamp;
    private Long creditEarned;
    private Long moneyEarned;
    private Long likes;
    private Long shared;
    private Long rank;
    private Long score;
    private Long permMask;
    private boolean favorite;
    private String transRoot;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ArticleLiked",
            joinColumns = @JoinColumn(name = "articleId"))
    private List<String> userLiked;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ArticleShared",
            joinColumns = @JoinColumn(name = "articleId"))
    private List<String> userShared;

    public ArticleRank()
    {
        this.creditEarned = 0L;
        this.moneyEarned = 0L;
        this.likes = 0L;
        this.shared = 0L;
        this.score = 0L;
        this.rank = 0L;
        this.favorite = false;
        this.artTitle = Util.DefaultTopic;
        this.contentBrief = null;
        this.timeStamp = new Date();
        this.tag = Util.DefaultTag;
    }

    public ArticleRank(AuthorTag tag, Article article)
    {
        this();
        this.articleUuid = article.getArticleUuid();
        this.authorUuid = article.getAuthorUuid();
        this.favorite = tag.isFavorite();
        this.rank = tag.getRank();
        this.artTitle = article.getTopic();
        this.tag = tag.fetchTag();
        this.tagHash = HashKey.toSha1Key(this.tag, authorUuid);
        this.contentBrief = article.getContentBrief();
    }

    public ArticleRank(AuthorTag tag, Product product)
    {
        this();
        this.articleUuid = product.getArticleUuid();
        this.authorUuid = product.getAuthorUuid();
        this.favorite = tag.isFavorite();
        this.rank = tag.getRank();
        this.tagHash = HashKey.toSha1Key(this.tag, authorUuid);

        // XXX: trim the length here.
        this.contentBrief = product.getProdDesc();
        this.tag = product.getProdCat();
    }

    public ArticleRank(CommentChangeForm form, String authorUuid)
    {
        this();
        this.articleUuid = form.getArticleUuid();
        this.authorUuid = authorUuid;
        this.favorite = form.isFavorite();
        this.creditEarned = form.getCommentId();
    }

    public void updateFromUser(ArticleForm form)
    {
        String title = form.getTitle();
        if (artTitle == null) {
            artTitle = Util.DefaultTopic;
        }
        if (title != null && !title.isEmpty()) {
            artTitle = title.getBytes(Charset.forName("UTF-8"));
        }
        favorite = form.isFavorite();
        rank = form.getArticleRank();

        if (form.getTagName() != null) {
            tag = form.getTagName().getBytes(Charset.forName("UTF-8"));
        }
        Long likeCnt = form.getLikeInc();
        if (likeCnt > 0) {
            likes++;
            // TODO: update userLiked
            //
        } else if (likeCnt < 0 && likes > 0) {
            likes--;
        }

        Long shareCnt = form.getShareInc();
        if (shareCnt > 0) {
            shared++;
        } else if (shareCnt < 0 && shared > 0) {
            shared--;
        }
    }

    /**
     * @return the articleId
     */
    public String getArticleUuid() {
        return articleUuid;
    }

    /**
     * @param articleId the articleId to set
     */
    public void setArticleId(String articleUuid) {
        this.articleUuid = articleUuid;
    }

    /**
     * @return the tag
     */
    public String getTag()
    {
        if (tag != null) {
            try {
                return new String(tag, "UTF-8");

            } catch(UnsupportedEncodingException e) {
            }
        }
        return Constants.DefaultTag;
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
     * @return the artTitle
     */
    public String getArtTitle()
    {
        return artTitle == null ?
            "Post" : new String(artTitle, Charset.forName("UTF-8"));
    }

    /**
     * @param artTitle the artTitle to set
     */
    public void setArtTitle(String artTitle)
    {
        if (artTitle == null) {
            artTitle = "Post";
        }
        this.artTitle = artTitle.getBytes(Charset.forName("UTF-8"));
    }

    /**
     * @return the contentBrief
     */
    public String getContentBrief()
    {
        if (contentBrief != null) {
            return new String(contentBrief, Charset.forName("UTF-8"));
        }
        return "...";
    }

    /**
     * @return the timeStamp
     */
    public Date getTimeStamp() {
        return timeStamp;
    }

    /**
     * @param timeStamp the timeStamp to set
     */
    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    /**
     * @return the creditEarned
     */
    public Long getCreditEarned() {
        return creditEarned;
    }

    /**
     * @param creditEarned the creditEarned to set
     */
    public void setCreditEarned(Long creditEarned) {
        this.creditEarned = creditEarned;
    }

    /**
     * @return the moneyEarned
     */
    public Long getMoneyEarned() {
        return moneyEarned;
    }

    /**
     * @param moneyEarned the moneyEarned to set
     */
    public void setMoneyEarned(Long moneyEarned) {
        this.moneyEarned = moneyEarned;
    }

    /**
     * @return the likes
     */
    public Long getLikes() {
        return likes;
    }

    /**
     * @param likes the likes to set
     */
    public void setLikes(Long likes) {
        this.likes = likes;
    }

    /**
     * @return the shared
     */
    public Long getShared() {
        return shared;
    }

    /**
     * @param shared the shared to set
     */
    public void setShared(Long shared) {
        this.shared = shared;
    }

    /**
     * @return the rank
     */
    public Long getRank() {
        return rank;
    }

    /**
     * @param rank the rank to set
     */
    public void setRank(Long rank) {
        this.rank = rank;
    }

    /**
     * @return the score
     */
    public Long getScore() {
        return score;
    }

    /**
     * @param score the score to set
     */
    public void setScore(Long score) {
        this.score = score;
    }

    /**
     * @return the permMask
     */
    public Long getPermMask() {
        return permMask;
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
}
