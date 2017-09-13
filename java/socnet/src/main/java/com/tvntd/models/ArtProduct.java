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
public class ArtProduct
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
    protected String     logoImg;

    @Column(length = 64)
    protected String     logoTag;

    protected Long       prodPrice;
    protected String     priceUnit;

    @Column(length = 128)
    protected byte[]     prodCat;

    @Column(length = 128)
    protected byte[]     prodName;

    @Column(length = 128)
    protected byte[]     prodNotice;

    @Column(length = 128)
    protected byte[]     prodTitle;

    @Column(length = 128)
    protected byte[]     prodSub;

    @Column(length = 128)
    protected byte[]     publicTag;

    @Lob
    @Column(length = 1 << 16)
    protected byte[]     prodDesc;

    @Lob
    @Column(length = 1 << 16)
    protected byte[]     prodDetail;

    @Lob
    @Column(length = 1 << 16)
    protected byte[]     prodSpec;

    protected boolean    pending;

    public ArtProduct() {}
    public ArtProduct(ArticleBase base)
    {
        if (base == null) {
            base = new ArticleBase();
        }
        articleUuid = base.getArticleUuid();
        artBase     = base;
        artAttr     = new ArticleAttr(articleUuid);
    }

    public void fromProduct(Product prod)
    {
        if (artBase == null) {
            articleUuid = prod.getArticleUuid();
            artBase     = new ArticleBase(articleUuid);
            artAttr     = new ArticleAttr(articleUuid);
        }
        articleUuid = prod.getArticleUuid();
        authorUuid  = prod.getAuthorUuid();
        artBase.setAuthorId(prod.getAuthorId());
      
        pending    = prod.isPending();
        logoImg    = prod.getLogoImg();
        logoTag    = prod.getLogoTag();
        prodPrice  = prod.getProdPrice();
        priceUnit  = prod.getPriceUnit();
        prodCat    = prod.getProdCat();
        prodName   = prod.getProdName();
        prodNotice = prod.getProdNotice();
        prodTitle  = prod.getProdTitle();
        prodSub    = prod.getProdSub();
        publicTag  = prod.getPublicTag();
        prodDesc   = prod.getProdDesc();
        prodDetail = prod.getProdDetail();
        prodSpec   = prod.getProdSpec();

        List<String> imgs = prod.getImages();
        if (imgs != null && !imgs.isEmpty()) {
            List<String> pics = artBase.getPictures();

            if (pics != null) {
                pics.size();
            } else {
                pics = new LinkedList<>();
                artBase.setPictures(pics);
            }
            for (String uuid : imgs) {
                pics.add(uuid);
            }
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
