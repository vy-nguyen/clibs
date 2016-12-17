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

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import com.tvntd.lib.ObjectId;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Product;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;

public interface IProductService
{
    ProductDTO getProductDTO(String uuid);
    Product getProduct(String uuid);

    List<ProductDTO> convert(List<Product> products);
    List<ProductDTO> getProducts(List<String> uuids);
    List<ProductDTO> getProductsByUser(Long userId);
    List<ProductDTO> getProductsByUser(String userUuid);
    List<ProductDTO> getProductsByUser(List<String> userUuids);

    Page<ProductDTO> getUserProducts(Long userId);
    Page<ProductDTO> getUserProducts(String userUuid);

    void saveProduct(Product prod);
    void saveProduct(ProductDTO prod);

    void deleteProduct(Product prod);
    void deleteProduct(String uuid);

    public static class LikeStat
    {
        private Long   commentCount;
        private Long   likesCount;
        private Long   sharesCount;
        private String dateString;

        public LikeStat(Long comment, Long likes, Long shares, String date)
        {
            commentCount = comment;
            likesCount = likes;
            sharesCount = shares;
            dateString = date;
        }

        /**
         * @return the commentCount
         */
        public Long getCommentCount() {
            return commentCount;
        }

        /**
         * @return the likesCount
         */
        public Long getLikesCount() {
            return likesCount;
        }

        /**
         * @return the sharesCount
         */
        public Long getSharesCount() {
            return sharesCount;
        }

        /**
         * @return the dateString
         */
        public String getDateString() {
            return dateString;
        }
    }

    public static class ProductDTOResponse extends GenericResponse
    {
        private List<ProductDTO> products;
        private List<ProductDTO> pendings;
        private List<ArticleRankDTO> articleRank;

        public ProductDTOResponse(List<ProductDTO> prods, List<ProductDTO> pend)
        {
            super(GenericResponse.USER_HOME, null, null);
            products = prods;
            pendings = pend;
            articleRank = new LinkedList<>();
            for (ProductDTO p : products) {
                articleRank.add(new ArticleRankDTO(p.fetchRank()));
            }
        }

        public ProductDTOResponse(List<ArticleRankDTO> rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            articleRank = rank;
        }

        /**
         * @return the products
         */
        public List<ProductDTO> getProducts() {
            return products;
        }

        /**
         * @return the pendings
         */
        public List<ProductDTO> getPendings() {
            return pendings;
        }

        /**
         * @return the articleRank
         */
        public List<ArticleRankDTO> getArticleRank() {
            return articleRank;
        }
    }

    public static class ProductDTO extends GenericResponse
    {
        private static Logger s_log = LoggerFactory.getLogger(ProductDTO.class);
        private static String s_baseUri = "/rs/user/";

        private Product     product;
        private ArticleRank rank;
        private String      prodCat;
        private String      prodName;
        private String      prodNotice;
        private String      prodTitle;
        private String      prodSub;
        private String      prodDesc;
        private String      prodSpec;

        public ProductDTO(Product prod)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.product = prod;
        }

        public ProductDTO(Product prod, ArticleRank rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.product = prod;
            this.rank = rank;
        }

        public ProductDTO(String author, Long id)
        {
            super(GenericResponse.USER_HOME, null, null);
            product = new Product();
            product.setAuthorId(id);
            product.setAuthorUuid(author);
        }

        public static String convertUTF(byte[] utf)
        {
            if (utf != null) {
                try {
                    return new String(utf, "UTF-8");

                } catch(UnsupportedEncodingException e) {
                    s_log.info("Exception " + e.getMessage());
                }
            }
            return null;
        }

        public static byte[] convertUTF(String src)
        {
            if (src != null) {
                try {
                    return src.getBytes("UTF-8");

                } catch(UnsupportedEncodingException e) {
                    s_log.info("Exception " + e.getMessage());
                }
            }
            return null;
        }

        /**
         * Methods to construct fields in Product object.
         */
        public void assignAuthorId(Long id) {
            product.setAuthorId(id);
        }

        public void assignLogo(String img, String tag)
        {
            product.setLogoImg(img);
            product.setLogoTag(tag);
        }

        public void addPicture(ObjectId img) {
            product.addPicture(img);
        }

        public void removePicture(ObjectId img) {
            product.removePicture(img);
        }

        public Product fetchProduct() {
            return product;
        }

        public ArticleRank fetchRank() {
            return rank;
        }

        public void assignRank(ArticleRank rank) {
            this.rank = rank;
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

        public String getLogoImg() {
            return product.getLogoImg();
        }

        public String getProdPrice() {
            return product.getProdPrice().toString();
        }

        public String getPriceUnit() {
            return product.getPriceUnit();
        }

        /**
         * @return the prodCat
         */
        public String getProdCat()
        {
            if (prodCat == null) {
                prodCat = convertUTF(product.getProdCat());
            }
            return prodCat;
        }

        /**
         * @return the prodName
         */
        public String getProdName()
        {
            if (prodName == null) {
                prodName = convertUTF(product.getProdName());
            }
            return prodName;
        }

        /**
         * @return the prodNotice
         */
        public String getProdNotice()
        {
            if (prodNotice == null) {
                prodNotice = convertUTF(product.getProdNotice());
            }
            return prodNotice;
        }

        /**
         * @return the prodTitle
         */
        public String getProdTitle()
        {
            if (prodTitle == null) {
                prodTitle = convertUTF(product.getProdTitle());
            }
            return prodTitle;
        }

        /**
         * @return the prodSub
         */
        public String getProdSub()
        {
            if (prodSub == null) {
                prodSub = convertUTF(product.getProdSub());
            }
            return prodSub;
        }

        /**
         * @return the prodDesc
         */
        public String getProdDesc()
        {
            if (prodDesc != null) {
                prodDesc = convertUTF(product.getProdDesc());
            }
            return prodDesc;
        }

        /**
         * @return the prodSpec
         */
        public String getProdSpec()
        {
            if (prodSpec != null) {
                prodSpec = convertUTF(product.getProdSpec());
            }
            return prodSpec;
        }

        public String getCreatedDate() {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(product.getCreatedDate());
        }

        public List<String> getPictureUrl()
        {
            List<String> pictures = product.getImages();
            List<String> ret = new LinkedList<>();

            if (pictures != null) {
                ObjStore objStore = ObjStore.getInstance();
                String store = s_baseUri + Long.toString(product.getAuthorId());

                for (String poid : pictures) {
                    ObjectId oid = ObjectId.fromString(poid);
                    ret.add(objStore.imgObjUri(oid, store));
                }
            }
            return ret;
        }

        public LikeStat getLikeStat()
        {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return new LikeStat(
                    0L,
                    rank.getLikes(),
                    rank.getShared(),
                    df.format(rank.getTimeStamp()));
        }
    }
}
