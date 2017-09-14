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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.ArticleAttr;
import com.tvntd.models.ArticleBase;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IProductService.LikeStat;
import com.tvntd.util.Util;

public class ArtProductDTO
{
    public static String s_baseUri = "/rs/user/";

    protected ArtProduct  product;

    public ArtProductDTO(ArtProduct prod)
    {
        product = prod;
    }

    public ArtProduct fetchProduct() {
        return product;
    }

    /**
     * Get/set methods.
     */
    public String getArticleUuid() {
        return product.getArticleUuid();
    }

    public String getAuthorUuid() {
        return product.getAuthorUuid();
    }

    public boolean isPending() {
        return product.isPending();
    }

    public String getProdPrice() {
        Long price = product.getProdPrice();
        return price != null ? price.toString() : "0.0";
    }

    public String getPriceUnit() {
        return product.getPriceUnit();
    }

    public String getProdCat() {
        return Util.fromRawByte(product.getProdCat());
    }

    public String getProdName() {
        return Util.fromRawByte(product.getProdName());
    }

    public String getProdNotice() {
        return Util.fromRawByte(product.getProdNotice());
    }

    public String getProdTitle() {
        return Util.fromRawByte(product.getProdTitle());
    }

    public String getProdSub() {
        return Util.fromRawByte(product.getProdSub());
    }

    public String getProdDesc() {
        return Util.fromRawByte(product.getProdDesc());
    }

    public String getProdDetail() {
        return Util.fromRawByte(product.getProdDetail());
    }

    public String getProdSpec() {
        return Util.fromRawByte(product.getProdSpec());
    }

    public String getPublicTag() {
        return Util.fromRawByte(product.getPublicTag());
    }

    public String getCreatedDate() {
        DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
        return df.format(product.getArtBase().getCreatedDate());
    }

    protected String toImgUrl(String rawOId, Long id)
    {
        if (rawOId != null) {
            String store = s_baseUri + Long.toString(id);
            return ObjStore.getInstance().imgObjUri(ObjectId.fromString(rawOId), store);
        }
        return null;
    }

    public String getLogoImg() {
        return toImgUrl(product.getLogoImg(), product.getArtBase().getAuthorId());
    }

    public List<String> getPictureUrl()
    {
        ArticleBase base = product.getArtBase();
        Long userId = base.getAuthorId();
        List<String> pictures = base.getPictures();
        List<String> result = new LinkedList<>();

        if (pictures != null) {
            for (String poid : pictures) {
                result.add(toImgUrl(poid, userId));
            }
        }
        return result;
    }

    public LikeStat getLikeStat()
    {
        DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
        ArticleAttr attr = product.getArtAttr();

        if (attr == null) {
            return new LikeStat(0L, 0L, 0L, df.format(new Date()));
        }
        return new LikeStat(0L, attr.getLikes(), attr.getShared(), getCreatedDate());
    }
}
