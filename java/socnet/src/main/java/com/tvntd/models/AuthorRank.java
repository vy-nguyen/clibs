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
import javax.persistence.Index;
import javax.persistence.Table;

import com.tvntd.lib.ObjectId;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", name = "authorUuid", unique = true)
})
public class AuthorRank
{
    @Id
    @Column
    private Long authorId;

    private long publicScore;
    private long groupScore;
    private long topicScore;
    private long promoteScore;

    private ObjectId chainRoot;

    @Column(name = "authorUuid")
    private String authorUuid;

    /**
     * @return the authorId
     */
    public Long getAuthorId() {
        return authorId;
    }

    /**
     * @return the publicScore
     */
    public long getPublicScore() {
        return publicScore;
    }

    /**
     * @param publicScore the publicScore to set
     */
    public void setPublicScore(long publicScore) {
        this.publicScore = publicScore;
    }

    /**
     * @return the groupScore
     */
    public long getGroupScore() {
        return groupScore;
    }

    /**
     * @param groupScore the groupScore to set
     */
    public void setGroupScore(long groupScore) {
        this.groupScore = groupScore;
    }

    /**
     * @return the topicScore
     */
    public long getTopicScore() {
        return topicScore;
    }

    /**
     * @param topicScore the topicScore to set
     */
    public void setTopicScore(long topicScore) {
        this.topicScore = topicScore;
    }

    /**
     * @return the promoteScore
     */
    public long getPromoteScore() {
        return promoteScore;
    }

    /**
     * @param promoteScore the promoteScore to set
     */
    public void setPromoteScore(long promoteScore) {
        this.promoteScore = promoteScore;
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
     * @return the chainRoot
     */
    public ObjectId getChainRoot() {
        return chainRoot;
    }

    /**
     * @param chainRoot the chainRoot to set
     */
    public void setChainRoot(ObjectId chainRoot) {
        this.chainRoot = chainRoot;
    }
}
