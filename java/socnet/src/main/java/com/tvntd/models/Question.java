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

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import com.tvntd.forms.QuestionForm;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", name = "authorUuid", unique = false),
    @Index(columnList = "articleUuid", name = "articleUuid", unique = false)
})
public class Question
{
    public static Long Question     = 0x00000L;
    public static Long HelpModal    = 0x00001L;
    public static Long ResultLink   = 0x00002L;

    @Id
    @Column(length = 64)
    protected String questUuid;

    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String authorUuid;

    @Column(length = 512)
    protected byte[] contentHeader;

    @Column(length = 4096)
    protected byte[] content;

    protected Long quesType;

    @Column(length = 64)
    protected String linkUuid;

    protected transient Question linkQuestion;
    protected transient Question linkResult;
    protected transient List<Answer> answer;

    public Question()
    {
        questUuid = UUID.randomUUID().toString();
    }

    public Question(QuestionForm form, ProfileDTO profile)
    {
        this();
        quesType    = Question;
        articleUuid = form.getArticleUuid();
        authorUuid  = profile.getUserUuid();
        content     = Util.toRawByte(form.getContent(), 4096);

        String header = form.getModalHdr();
        String body   = form.getModalContent();
        if (header != null && body != null) {
            // Need to link with another Question record.
            //
            linkQuestion = new Question(articleUuid, authorUuid, header, body);
            linkUuid     = linkQuestion.questUuid;
        } else {
            linkUuid     = form.getModalArtUuid();
        }
    }

    protected Question(String artUuid, String userUuid, String hdr, String content)
    {
        this();
        quesType      = HelpModal;
        linkUuid      = null;
        articleUuid   = artUuid;
        authorUuid    = userUuid;
        contentHeader = Util.toRawByte(hdr, 512);
        this.content  = Util.toRawByte(content, 4096);
    }

    public boolean connectLink(Question link)
    {
        if ((link.quesType & HelpModal) != 0) {
            linkQuestion = link;
            return true;

        } else if ((link.quesType & ResultLink) != 0) {
            linkResult = link;
            return true;
        }
        return false;
    }

    /**
     * @return the questUuid
     */
    public String getQuestUuid() {
        return questUuid;
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
     * @return the contentHeader
     */
    public byte[] getContentHeader() {
        return contentHeader;
    }

    /**
     * @param contentHeader the contentHeader to set
     */
    public void setContentHeader(byte[] contentHeader) {
        this.contentHeader = contentHeader;
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
     * @return the quesType
     */
    public Long getQuesType() {
        return quesType;
    }

    /**
     * @param quesType the quesType to set
     */
    public void setQuesType(Long quesType) {
        this.quesType = quesType;
    }

    /**
     * @return the linkUuid
     */
    public String getLinkUuid() {
        return linkUuid;
    }

    /**
     * @return the linkQuestion
     */
    public Question getLinkQuestion() {
        return linkQuestion;
    }

    /**
     * @param linkQuestion the linkQuestion to set
     */
    public void setLinkQuestion(Question linkQuestion) {
        this.linkQuestion = linkQuestion;
    }

    /**
     * @return the linkResult
     */
    public Question getLinkResult() {
        return linkResult;
    }

    /**
     * @param linkResult the linkResult to set
     */
    public void setLinkResult(Question linkResult) {
        this.linkResult = linkResult;
    }

    /**
     * @return the answer
     */
    public List<Answer> getAnswer() {
        return answer;
    }

    /**
     * @param answer the answer to set
     */
    public void setAnswer(Answer answer)
    {
        if (this.answer == null) {
            this.answer = new LinkedList<>();
        }
        this.answer.add(answer);
    }
}
