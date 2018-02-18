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
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", unique = false)
})
public class ArticlePost
{
    @Id
    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String authorUuid;

    @Lob
    @Column(length = (1 << 16))
    protected byte[] content;

    @Column
    protected boolean pending;

    protected transient ArticleBase artBase;

    public ArticlePost() {}

    public ArticlePost(String author, String uuid)
    {
        articleUuid = uuid;
        authorUuid  = author;
    }

    public ArticlePost(String authorUuid, Long authorId)
    {
        this.artBase     = new ArticleBase();
        this.pending     = true;
        this.authorUuid  = authorUuid;
        this.articleUuid = artBase.getArticleUuid();

        artBase.setAuthorId(authorId);
    }

    public ArticlePost(String articleUuid, String authorUuid, Long authorId)
    {
        this.artBase = new ArticleBase(articleUuid);
        this.pending     = true;
        this.authorUuid  = authorUuid;
        this.articleUuid = artBase.getArticleUuid();

        artBase.setAuthorId(authorId);
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();

        sb.append("articleUuid: ").append(articleUuid)
            .append(", author ").append(authorUuid).append("\n");
        return sb.toString();
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
     * @return the pending
     */
    public boolean isPending() {
        return pending;
    }

    /**
     * @param pending the pending to set
     */
    public void setPending(boolean pending) {
        this.pending = pending;
    }
}
