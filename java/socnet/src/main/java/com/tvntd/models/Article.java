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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.tvntd.lib.ObjectId;

@Entity
@Table(indexes = {
    @Index(columnList = "articleUuid", name = "articleUuid", unique = true),
    @Index(columnList = "authorUuid", name = "authorUuid", unique = false)
})
public class Article
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long articleId;

    private Long     authorId;
    private UUID     authorUuid;
    private UUID     articleUuid;
    private Long     creditEarned;
    private Long     moneyEarned;

    private ObjectId transRoot;
    private ObjectId contentOId;

    @Column(name="DATE_CREATED")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column
    private byte[] topic;

    @Lob
    @Column
    private byte[] content;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ArtPics", joinColumns = @JoinColumn(name="articleId"))
    private List<ObjectId> pictures;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ArtComnts", joinColumns = @JoinColumn(name="articleId"))
    private List<Long> comments;

    public Article()
    {
        super();
        articleUuid = UUID.randomUUID();
        transRoot = ObjectId.zeroId();
        contentOId = ObjectId.zeroId();
    }

    /**
     * @return the articleId
     */
    public Long getArticleId() {
        return articleId;
    }

    /**
     * @param articleId the articleId to set
     */
    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    /**
     * @return the authorId
     */
    public Long getAuthorUserId() {
        return authorId;
    }

    /**
     * @param authorId the authorId to set
     */
    public void setAuthorId(Long userId) {
        this.authorId = userId;
    }

    /**
     * @return the authorUuid
     */
    public UUID getAuthorUuid() {
        return authorUuid;
    }

    /**
     * @param authorUuid the authorUuid to set
     */
    public void setAuthorUuid(UUID authorUuid) {
        this.authorUuid = authorUuid;
    }

    /**
     * @return the articleUuid
     */
    public UUID getArticleUuid() {
        return articleUuid;
    }

    /**
     * @param articleUuid the articleUuid to set
     */
    public void setArticleUuid(UUID articleUuid) {
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
     * @return the transRoot
     */
    public ObjectId getTransRoot() {
        return transRoot;
    }

    /**
     * @param transRoot the transRoot to set
     */
    public void setTransRoot(ObjectId transRoot) {
        this.transRoot = transRoot;
    }

    /**
     * @return the contentOId
     */
    public ObjectId getContentOId() {
        return contentOId;
    }

    /**
     * @param contentOId the contentOId to set
     */
    public void setContentOId(ObjectId contentOId) {
        this.contentOId = contentOId;
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
     * @return the topic
     */
    public byte[] getTopic() {
        return topic;
    }

    /**
     * @param topic the topic to set
     */
    public void setTopic(byte[] topic) {
        this.topic = topic;
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
     * @return the pictures
     */
    public List<ObjectId> getPictures() {
        return pictures;
    }

    /**
     * @param pictures the pictures to set
     */
    public void setPictures(List<ObjectId> pictures) {
        this.pictures = pictures;
    }

    /**
     * @return the comments
     */
    public List<Long> getComments() {
        return comments;
    }

    /**
     * @param comments the comments to set
     */
    public void setComments(List<Long> comments) {
        this.comments = comments;
    }
}
