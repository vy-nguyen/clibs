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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Inheritance;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.tvntd.lib.ObjectId;
import com.tvntd.service.api.IProductService.ProductDTO;

@Entity
@Inheritance
@DiscriminatorColumn(name = "ProdType")
@Table(indexes = {
    @Index(columnList = "authorUuid", name = "authorUuid", unique = false)
})
public class Product
{
    static public int MaxHeaderLength = 128;
    static public int MaxContentLength = 1 << 16;

    @Id
    @Column(length = 64)
    private String     articleUuid;

    @Column(length = 64)
    private String     authorUuid;

    private Long       authorId;
    private boolean    pending;

    @Column(length = 64)
    private String     logoImg;

    @Column(length = 64)
    private String     logoTag;

    private Long       prodPrice;
    private String     priceUnit;

    @Column(length = 128)
    private byte[]     prodCat;

    @Column(length = 128)
    private byte[]     prodName;

    @Column(length = 128)
    private byte[]     prodNotice;

    @Column(length = 128)
    private byte[]     prodTitle;

    @Column(length = 128)
    private byte[]     prodSub;

    @Column(length = 128)
    private byte[]     publicTag;

    @Lob
    @Column(length = 1 << 16)
    private byte[]     prodDesc;

    @Lob
    @Column(length = 1 << 16)
    private byte[]     prodDetail;

    @Lob
    @Column(length = 1 << 16)
    private byte[]     prodSpec;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date       createdDate;

    @Column(length = 64)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ProductImages",
            joinColumns = @JoinColumn(name = "articleId"))
    private List<String> images;

    /**
     * Methods.
     */
    public Product()
    {
        super();
        articleUuid = UUID.randomUUID().toString();
        createdDate = new Date();
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("articleUuid: ").append(articleUuid)
            .append(", authorUuid: ").append(authorUuid)
            .append(", logo image: ").append(logoImg).append("\n");

        for (String s : images) {
            sb.append("Image: ").append(s);
        }
        sb.append("\nprodCat  : ").append(ProductDTO.convertUTF(prodCat));
        sb.append("\nprodName : ").append(ProductDTO.convertUTF(prodName));
        sb.append("\nprodTitle: ").append(ProductDTO.convertUTF(prodTitle));
        sb.append("\nprodDesc : ").append(ProductDTO.convertUTF(prodDesc));
        sb.append("\nprodSpec : ").append(ProductDTO.convertUTF(prodSpec));
        sb.append("\n");
        return sb.toString();
    }

    public void markPending() {
        pending = true;
    }

    public void markActive() {
        pending = false;
    }

    public void addPicture(ObjectId img)
    {
        if (images == null) {
            images = new ArrayList<>();
        }
        images.add(img.name());
    }

    public void removePicture(ObjectId img)
    {
        if (images != null) {
            images.remove(img.name());
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
     * @return the authorId
     */
    public Long getAuthorId() {
        return authorId;
    }

    /**
     * @param authorId the authorId to set
     */
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
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

    /**
     * @return the logoImg
     */
    public String getLogoImg() {
        return logoImg;
    }

    /**
     * @param logoImg the logoImg to set
     */
    public void setLogoImg(String logoImg) {
        this.logoImg = logoImg;
    }

    /**
     * @return the logoTag
     */
    public String getLogoTag() {
        return logoTag;
    }

    /**
     * @param logoTag the logoTag to set
     */
    public void setLogoTag(String logoTag) {
        this.logoTag = logoTag;
    }

    /**
     * @return the prodPrice
     */
    public Long getProdPrice() {
        return prodPrice;
    }

    /**
     * @param prodPrice the prodPrice to set
     */
    public void setProdPrice(Long prodPrice) {
        this.prodPrice = prodPrice;
    }

    /**
     * @return the priceUnit
     */
    public String getPriceUnit() {
        return priceUnit;
    }

    /**
     * @param priceUnit the priceUnit to set
     */
    public void setPriceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
    }

    /**
     * @return the prodCat
     */
    public byte[] getProdCat() {
        return prodCat;
    }

    /**
     * @param prodCat the prodCat to set
     */
    public void setProdCat(byte[] prodCat) {
        this.prodCat = prodCat;
    }

    /**
     * @return the prodName
     */
    public byte[] getProdName() {
        return prodName;
    }

    /**
     * @param prodName the prodName to set
     */
    public void setProdName(byte[] prodName) {
        this.prodName = prodName;
    }

    /**
     * @return the prodNotice
     */
    public byte[] getProdNotice() {
        return prodNotice;
    }

    /**
     * @param prodNotice the prodNotice to set
     */
    public void setProdNotice(byte[] prodNotice) {
        this.prodNotice = prodNotice;
    }

    /**
     * @return the prodTitle
     */
    public byte[] getProdTitle() {
        return prodTitle;
    }

    /**
     * @param prodTitle the prodTitle to set
     */
    public void setProdTitle(byte[] prodTitle) {
        this.prodTitle = prodTitle;
    }

    /**
     * @return the prodSub
     */
    public byte[] getProdSub() {
        return prodSub;
    }

    /**
     * @param prodSub the prodSub to set
     */
    public void setProdSub(byte[] prodSub) {
        this.prodSub = prodSub;
    }

    /**
     * @return the publicTag
     */
    public byte[] getPublicTag() {
        return publicTag;
    }

    /**
     * @param publicTag the publicTag to set
     */
    public void setPublicTag(byte[] publicTag) {
        this.publicTag = publicTag;
    }

    /**
     * @return the prodDesc
     */
    public byte[] getProdDesc() {
        return prodDesc;
    }

    /**
     * @param prodDesc the prodDesc to set
     */
    public void setProdDesc(byte[] prodDesc) {
        this.prodDesc = prodDesc;
    }

    /**
     * @return the prodDetail
     */
    public byte[] getProdDetail() {
        return prodDetail;
    }

    /**
     * @param prodDetail the prodDetail to set
     */
    public void setProdDetail(byte[] prodDetail) {
        this.prodDetail = prodDetail;
    }

    /**
     * @return the prodSpec
     */
    public byte[] getProdSpec() {
        return prodSpec;
    }

    /**
     * @param prodSpec the prodSpec to set
     */
    public void setProdSpec(byte[] prodSpec) {
        this.prodSpec = prodSpec;
    }

    /**
     * @return the createdDate
     */
    public Date getCreatedDate() {
        return createdDate;
    }

    /**
     * @return the images
     */
    public List<String> getImages() {
        return images;
    }
}
