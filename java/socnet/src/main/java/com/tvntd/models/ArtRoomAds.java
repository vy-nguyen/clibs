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
    @Index(columnList = "ownerEmail", unique = false),
    @Index(columnList = "city", unique = false),
    @Index(columnList = "state", unique = false),
    @Index(columnList = "zip", unique = false)
})
public class ArtRoomAds
{
    @Id
    @Column(length = 64)
    protected String articleUuid;

    @Column(length = 64)
    protected String authorUuid;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn
    protected ArticleBase artBase;

    @Column(length = 128)
    protected byte[] ownerName;

    @Column(length = 64)
    protected String ownerPhone;

    @Column(length = 128)
    protected String ownerEmail;

    @Column(length = 64)
    protected String rentPrice;

    @Column(length = 128)
    protected byte[] street;

    @Column(length = 128)
    protected String city;

    @Column(length = 64)
    protected String state;

    @Column(length = 32)
    protected String zip;

    @Column(length = 64)
    protected String adImgOid0;

    @Column(length = 64)
    protected String adImgOid1;

    @Column(length = 64)
    protected String adImgOid2;

    @Column(length = 64)
    protected String adImgOid3;

    @Lob
    @Column(length = 2048)
    protected byte[] propDesc;

    public ArtRoomAds() {}

    public ArtRoomAds(ArtAds ads)
    {
        this(ads.getArtBase());
        authorUuid = ads.getAuthorUuid();
    }

    public ArtRoomAds(String authorUuid, Long authorId)
    {
        artBase     = new ArticleBase();
        articleUuid = artBase.getArticleUuid();

        artBase.setCreatedDate(new Date());
        this.authorUuid = authorUuid;
        artBase.setAuthorId(authorId);
        artBase.setArtTag(ArtTag.ADS);
    }

    public ArtRoomAds(ArticleBase base)
    {
        if (base == null) {
            base = new ArticleBase();
            base.setCreatedDate(new Date());
        }
        artBase     = base;
        articleUuid = base.getArticleUuid();
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();

        sb.append("Name ").append(ownerName).append(", oid ")
            .append(adImgOid0).append(", ").append(adImgOid1).append("\n");
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
     * @return the ownerName
     */
    public byte[] getOwnerName() {
        return ownerName;
    }

    /**
     * @param ownerName the ownerName to set
     */
    public void setOwnerName(byte[] ownerName) {
        this.ownerName = ownerName;
    }

    /**
     * @return the ownerPhone
     */
    public String getOwnerPhone() {
        return ownerPhone;
    }

    /**
     * @param ownerPhone the ownerPhone to set
     */
    public void setOwnerPhone(String ownerPhone) {
        this.ownerPhone = ownerPhone;
    }

    /**
     * @return the ownerEmail
     */
    public String getOwnerEmail() {
        return ownerEmail;
    }

    /**
     * @param ownerEmail the ownerEmail to set
     */
    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    /**
     * @return the rentPrice
     */
    public String getRentPrice() {
        return rentPrice;
    }

    /**
     * @param rentPrice the rentPrice to set
     */
    public void setRentPrice(String rentPrice) {
        this.rentPrice = rentPrice;
    }

    /**
     * @return the street
     */
    public byte[] getStreet() {
        return street;
    }

    /**
     * @param street the street to set
     */
    public void setStreet(byte[] street) {
        this.street = street;
    }

    /**
     * @return the city
     */
    public String getCity() {
        return city;
    }

    /**
     * @param city the city to set
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * @return the state
     */
    public String getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(String state) {
        this.state = state;
    }

    /**
     * @return the zip
     */
    public String getZip() {
        return zip;
    }

    /**
     * @param zip the zip to set
     */
    public void setZip(String zip) {
        this.zip = zip;
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
     * @return the propDesc
     */
    public byte[] getPropDesc() {
        return propDesc;
    }

    /**
     * @param propDesc the propDesc to set
     */
    public void setPropDesc(byte[] propDesc) {
        this.propDesc = propDesc;
    }
}
