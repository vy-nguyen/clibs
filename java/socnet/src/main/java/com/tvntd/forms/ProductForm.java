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
package com.tvntd.forms;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public class ProductForm
{
    private boolean estore;
    private String  authorUuid;
    private String  articleUuid;

    @Size(max = 140)
    private String  prodCat;

    @NotNull
    @Size(max = 140)
    private String  prodName;

    private String  prodTitle;
    private String  prodPrice;
    private String  prodNotice;
    private String  prodDesc;
    private String  prodDetail;
    private String  prodSpec;

    public boolean cleanInput()
    {
        if (prodName == null || prodCat == null || prodTitle == null ||
            prodPrice == null || prodDesc == null || prodDetail == null ||
            prodSpec == null || authorUuid == null || articleUuid == null) {
            return false;
        }
        Whitelist wlist = Whitelist.basic();
        prodName = Jsoup.clean(prodName, wlist);
        prodCat = Jsoup.clean(prodCat, wlist);
        prodTitle = Jsoup.clean(prodTitle, wlist);
        authorUuid = Jsoup.clean(authorUuid, wlist);
        articleUuid = Jsoup.clean(articleUuid, wlist);

        return true;
    }

    /**
     * @return the estore
     */
    public boolean isEstore() {
        return estore;
    }

    /**
     * @param estore the estore to set
     */
    public void setEstore(boolean estore) {
        this.estore = estore;
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
     * @return the prodCat
     */
    public String getProdCat() {
        return prodCat;
    }

    /**
     * @param prodCat the prodCat to set
     */
    public void setProdCat(String prodCat) {
        this.prodCat = prodCat;
    }

    /**
     * @return the prodName
     */
    public String getProdName() {
        return prodName;
    }

    /**
     * @param prodName the prodName to set
     */
    public void setProdName(String prodName) {
        this.prodName = prodName;
    }

    /**
     * @return the prodTitle
     */
    public String getProdTitle() {
        return prodTitle;
    }

    /**
     * @param prodTitle the prodTitle to set
     */
    public void setProdTitle(String prodTitle) {
        this.prodTitle = prodTitle;
    }

    /**
     * @return the prodPrice
     */
    public String getProdPrice() {
        return prodPrice;
    }

    /**
     * @param prodPrice the prodPrice to set
     */
    public void setProdPrice(String prodPrice) {
        this.prodPrice = prodPrice;
    }

    /**
     * @return the prodNotice
     */
    public String getProdNotice() {
        return prodNotice;
    }

    /**
     * @param prodNotice the prodNotice to set
     */
    public void setProdNotice(String prodNotice) {
        this.prodNotice = prodNotice;
    }

    /**
     * @return the prodDesc
     */
    public String getProdDesc() {
        return prodDesc;
    }

    /**
     * @param prodDesc the prodDesc to set
     */
    public void setProdDesc(String prodDesc) {
        this.prodDesc = prodDesc;
    }

    /**
     * @return the prodDetail
     */
    public String getProdDetail() {
        return prodDetail;
    }

    /**
     * @param prodDetail the prodDetail to set
     */
    public void setProdDetail(String prodDetail) {
        this.prodDetail = prodDetail;
    }

    /**
     * @return the prodSpec
     */
    public String getProdSpec() {
        return prodSpec;
    }

    /**
     * @param prodSpec the prodSpec to set
     */
    public void setProdSpec(String prodSpec) {
        this.prodSpec = prodSpec;
    }
}
