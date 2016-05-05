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
package com.tvntd.service.api;

import java.util.UUID;

import com.tvntd.lib.ObjectId;

public class ImageUploadResp extends GenericResponse
{
    private String articleUuid;
    private String authorUuid;
    private String imgObjId;
    private String imgObjUrl;

    public ImageUploadResp(String type, String message, String error) {
        super(GenericResponse.USER_HOME, message, error);
    }

    public ImageUploadResp(String artUuid, String authorUuid, ObjectId imgOid)
    {
        super(GenericResponse.USER_HOME, null, null);
        this.articleUuid = artUuid;
        this.authorUuid = authorUuid;
        this.imgObjId = imgOid.name();
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
     * @return the imgObjId
     */
    public String getImgObjId() {
        return imgObjId;
    }

    /**
     * @param imgObjId the imgObjId to set
     */
    public void setImgObjId(String imgObjId) {
        this.imgObjId = imgObjId;
    }

    /**
     * @return the imgObjUrl
     */
    public String getImgObjUrl() {
        return imgObjUrl;
    }

    /**
     * @param imgObjUrl the imgObjUrl to set
     */
    public void setImgObjUrl(String imgObjUrl) {
        this.imgObjUrl = imgObjUrl;
    }
}
