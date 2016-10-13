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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(indexes = {
    @Index(columnList = "userUuid", name = "userUuid", unique = false),
    @Index(columnList = "articleUuid", name = "articleUuid", unique = false)
})
public class Comment
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private boolean favorite;
    private boolean hashRank;

    @Column(length = 1024)
    private byte[] content;

    @Column(length = 64, name = "articleUuid")
    private String articleUuid;

    @Column(name = "userUuid")
    private String userUuid;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;

    public Comment()
    {
        timeStamp = new Date();
    }

    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
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
     * @return the hashRank
     */
    public boolean isHashRank() {
        return hashRank;
    }

    /**
     * @param hashRank the hashRank to set
     */
    public void setHashRank(boolean hashRank) {
        this.hashRank = hashRank;
    }

    /**
     * @return the content
     */
    public byte[] getContent() {
        return content;
    }

    /**
     * @param content the content to set
     */
    public void setContent(byte[] content) {
        this.content = content;
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
     * @return the userId
     */
    public String getUserUuid() {
        return userUuid;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserUuid(String userUuid) {
        this.userUuid = userUuid;
    }

    /**
     * @return the timeStamp
     */
    public Date getTimeStamp() {
        return timeStamp;
    }
}
