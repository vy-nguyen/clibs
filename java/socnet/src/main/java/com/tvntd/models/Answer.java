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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import com.tvntd.util.Util;

@Entity
@Table(indexes = {
    @Index(columnList = "questUuid", name = "questUuid", unique = false),
    @Index(columnList = "articleUuid", name = "articleUuid", unique = false)
})
public class Answer
{
    public static Long MultChoices      = 0x00000001L;
    public static Long ChoicesCorrect   = 0x00000002L;
    public static Long InputAnswer      = 0x00000010L;
    public static int InputFieldLen     = 1 << 10;
    public static int InputValueLen     = 1 << 14;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;

    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String questUuid;

    protected Long   inputFlags;

    @Column(length = 1 << 10)
    protected byte[] inputField;

    @Column(length = 1 << 10)
    protected byte[] inputHolder;

    @Column(length = 1 << 14)
    protected byte[] inputValue;

    public Answer() {}
    public Answer(String artUuid, String qUuid, String choice, Boolean correct)
    {
        articleUuid = artUuid;
        questUuid   = qUuid;
        inputValue  = Util.toRawByte(choice, InputValueLen);
        inputFlags  = new Long(MultChoices);

        if (correct != null && correct == true) {
            inputFlags |= ChoicesCorrect;
        }
    }

    public Answer(String artUuid, String qUuid, String field, String holder, String val)
    {
        articleUuid = artUuid;
        questUuid   = qUuid;
        inputField  = Util.toRawByte(field, InputFieldLen);
        inputHolder = Util.toRawByte(holder, InputFieldLen);
        inputValue  = Util.toRawByte(val, InputValueLen);
        inputFlags  = InputAnswer;
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
}
