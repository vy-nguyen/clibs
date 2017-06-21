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
package com.tvntd.forms;

import javax.validation.constraints.Size;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public class ArticleForm
{
    @Size(max = 64)
    private String tagName;

    private boolean favorite;
    private Long articleRank;
    private Long tagRank;
    private Long likeInc;
    private Long shareInc;
    private String userUuid;
    private String articleUuid;
    private String prevArticle;
    private String nextArticle;
    private String topArticle;

    @Size(max = 128)
    private String title;

    public ArticleForm() {}
    public ArticleForm(String tagName, boolean fav,
            Long artRank, String userUuid, String articleUuid)
    {
        this.tagName = tagName;
        this.favorite = fav;
        this.articleRank = artRank;
        this.tagRank = 0L;
        this.likeInc = 0L;
        this.shareInc = 0L;
        this.userUuid = userUuid;
        this.articleUuid = articleUuid;
    }

    public boolean cleanInput()
    {
        if (userUuid == null || articleUuid == null) {
            return false;
        }
        Whitelist wlist = Whitelist.basic();
        userUuid = Jsoup.clean(userUuid, wlist);
        articleUuid = Jsoup.clean(articleUuid, wlist);
        return true;
    }

    /**
     * @return the tagName
     */
    public String getTagName() {
        return tagName;
    }

    /**
     * @param tagName the tagName to set
     */
    public void setTagName(String tagName) {
        this.tagName = tagName;
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
     * @return the articleRank
     */
    public Long getArticleRank() {
        return articleRank;
    }

    /**
     * @param articleRank the articleRank to set
     */
    public void setArticleRank(Long articleRank) {
        this.articleRank = articleRank;
    }

    /**
     * @return the tagRank
     */
    public Long getTagRank() {
        return tagRank;
    }

    /**
     * @return the likeInc
     */
    public Long getLikeInc() {
        return likeInc;
    }

    /**
     * @param likeInc the likeInc to set
     */
    public void setLikeInc(Long likeInc) {
        this.likeInc = likeInc;
    }

    /**
     * @return the shareInc
     */
    public Long getShareInc() {
        return shareInc;
    }

    /**
     * @param shareInc the shareInc to set
     */
    public void setShareInc(Long shareInc) {
        this.shareInc = shareInc;
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
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * @param title the title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }
}
