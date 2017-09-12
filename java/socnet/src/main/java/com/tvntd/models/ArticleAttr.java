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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ArticleAttr
{
    @Id
    @Column(length = 64)
    protected String articleUuid;

    protected Long creditEarned;
    protected Long moneyEarned;
    protected Long likes;
    protected Long shared;
    protected Long rank;
    protected Long score;

    public ArticleAttr() {}
    public ArticleAttr(String uuid)
    {
        articleUuid  = uuid;
        creditEarned = 0L;
        moneyEarned  = 0L;
        likes        = 0L;
        shared       = 0L;
        score        = 0L;
        rank         = 0L;
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
}
