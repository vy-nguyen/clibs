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

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(indexes = {
    @Index(columnList = "authorUuid", unique = false)
})
public class ArtAds
{
    @Id
    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String authorUuid;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn
    protected ArticleBase artBase;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn
    protected ArticleAttr artAttr;

    @Column(length = 64)
    protected String adImgOid0;

    @Column(length = 64)
    protected String adImgOid1;

    @Column(length = 64)
    protected String adImgOid2;

    @Column(length = 64)
    protected String adImgOid3;

    @Column(length = 128)
    private byte[]   busName;

    @Column(length = 128)
    private byte[]   busInfo;

    @Column(length = 128)
    private byte[]   busCat;

    @Column(length = 128)
    private byte[]   busWeb;

    @Column(length = 128)
    private byte[]   busEmail;

    @Column(length = 128)
    private byte[]   busPhone;

    @Column(length = 128)
    private byte[]   busStreet;

    @Column(length = 64)
    private byte[]   busCity;

    @Column(length = 32)
    private byte[]   busState;

    @Column(length = 32)
    private byte[]   busZip;

    @Column(length = 1024)
    private byte[]   busHour;

    @Lob
    @Column(length = 1 << 14)
    private byte[] busDesc;

    public ArtAds() {}
    public ArtAds(String authorUuid, Long authorId)
    {
        artBase     = new ArticleBase();
        articleUuid = artBase.getArticleUuid();
        artAttr     = new ArticleAttr(articleUuid);

        this.authorUuid = authorUuid;
        artBase.setAuthorId(authorId);
        artBase.setArtTag(ArtTag.ADS);
        artBase.setCreatedDate(new Date());
    }

    public ArtAds(ArticleBase base)
    {
        if (base == null) {
            base = new ArticleBase();
            base.setCreatedDate(new Date());
        }
        artBase     = base;
        articleUuid = base.getArticleUuid();
        artAttr     = new ArticleAttr(articleUuid);
    }

    public void fromProfile(Profile prof)
    {
        if (prof == null) {
            artBase.setAuthorId(0L);
        } else {
            artBase.setAuthorId(prof.getUserId());
        }
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
     * @return the artAttr
     */
    public ArticleAttr getArtAttr() {
        return artAttr;
    }

    /**
     * @param artAttr the artAttr to set
     */
    public void setArtAttr(ArticleAttr artAttr) {
        this.artAttr = artAttr;
    }

    /**
     * @return the adImgOid0
     */
    public String getAdImgOid0() {
        return adImgOid0;
    }

    /**
     * @param adImgOid0 the adImgOid0 to set
     */
    public void setAdImgOid0(String adImgOid0) {
        this.adImgOid0 = adImgOid0;
    }

    /**
     * @return the adImgOid1
     */
    public String getAdImgOid1() {
        return adImgOid1;
    }

    /**
     * @param adImgOid1 the adImgOid1 to set
     */
    public void setAdImgOid1(String adImgOid1) {
        this.adImgOid1 = adImgOid1;
    }

    /**
     * @return the adImgOid2
     */
    public String getAdImgOid2() {
        return adImgOid2;
    }

    /**
     * @param adImgOid2 the adImgOid2 to set
     */
    public void setAdImgOid2(String adImgOid2) {
        this.adImgOid2 = adImgOid2;
    }

    /**
     * @return the adImgOid3
     */
    public String getAdImgOid3() {
        return adImgOid3;
    }

    /**
     * @param adImgOid3 the adImgOid3 to set
     */
    public void setAdImgOid3(String adImgOid3) {
        this.adImgOid3 = adImgOid3;
    }

    /**
     * @return the busName
     */
    public byte[] getBusName() {
        return busName;
    }

    /**
     * @param busName the busName to set
     */
    public void setBusName(byte[] busName) {
        this.busName = busName;
    }

    /**
     * @return the busInfo
     */
    public byte[] getBusInfo() {
        return busInfo;
    }

    /**
     * @param busInfo the busInfo to set
     */
    public void setBusInfo(byte[] busInfo) {
        this.busInfo = busInfo;
    }

    /**
     * @return the busCat
     */
    public byte[] getBusCat() {
        return busCat;
    }

    /**
     * @param busCat the busCat to set
     */
    public void setBusCat(byte[] busCat) {
        this.busCat = busCat;
    }

    /**
     * @return the busWeb
     */
    public byte[] getBusWeb() {
        return busWeb;
    }

    /**
     * @param busWeb the busWeb to set
     */
    public void setBusWeb(byte[] busWeb) {
        this.busWeb = busWeb;
    }

    /**
     * @return the busEmail
     */
    public byte[] getBusEmail() {
        return busEmail;
    }

    /**
     * @param busEmail the busEmail to set
     */
    public void setBusEmail(byte[] busEmail) {
        this.busEmail = busEmail;
    }

    /**
     * @return the busPhone
     */
    public byte[] getBusPhone() {
        return busPhone;
    }

    /**
     * @param busPhone the busPhone to set
     */
    public void setBusPhone(byte[] busPhone) {
        this.busPhone = busPhone;
    }

    /**
     * @return the busStreet
     */
    public byte[] getBusStreet() {
        return busStreet;
    }

    /**
     * @param busStreet the busStreet to set
     */
    public void setBusStreet(byte[] busStreet) {
        this.busStreet = busStreet;
    }

    /**
     * @return the busCity
     */
    public byte[] getBusCity() {
        return busCity;
    }

    /**
     * @param busCity the busCity to set
     */
    public void setBusCity(byte[] busCity) {
        this.busCity = busCity;
    }

    /**
     * @return the busState
     */
    public byte[] getBusState() {
        return busState;
    }

    /**
     * @param busState the busState to set
     */
    public void setBusState(byte[] busState) {
        this.busState = busState;
    }

    /**
     * @return the busZip
     */
    public byte[] getBusZip() {
        return busZip;
    }

    /**
     * @param busZip the busZip to set
     */
    public void setBusZip(byte[] busZip) {
        this.busZip = busZip;
    }

    /**
     * @return the busHour
     */
    public byte[] getBusHour() {
        return busHour;
    }

    /**
     * @param busHour the busHour to set
     */
    public void setBusHour(byte[] busHour) {
        this.busHour = busHour;
    }

    /**
     * @return the busDesc
     */
    public byte[] getBusDesc() {
        return busDesc;
    }

    /**
     * @param busDesc the busDesc to set
     */
    public void setBusDesc(byte[] busDesc) {
        this.busDesc = busDesc;
    }
}
