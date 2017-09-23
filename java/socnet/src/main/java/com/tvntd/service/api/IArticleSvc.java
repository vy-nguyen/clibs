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

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.tvntd.forms.ArticleForm;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.ProductForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.ArtTag;
import com.tvntd.models.ArticleAttr;
import com.tvntd.models.ArticleBase;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.ArticlePost;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

public interface IArticleSvc
{
    public static String s_baseUri = "/rs/user/";

    // Query
    //
    ArticlePostDTO        getArticleDTO(String uuid);
    List<ArticlePostDTO>  getArticleDTO(List<String> artUuids);

    List<ArticlePostDTO>  getArticleDTOByAuthor(String authorUuid);
    List<ArticlePostDTO>  getArticleDTOByAuthor(List<String> authorUuid);

    ArticleBriefDTO       getArticleBriefDTO(String artUuid);
    ArticleBriefDTO       getArticleBriefDTO(String tagName, String title);
    List<ArticleBriefDTO> getArticleBriefDTO(UuidForm form);
    List<ArticleBriefDTO> getArticleBriefDTOByAuthor(String authorUuid);
    List<ArticleBriefDTO> getArticleBriefDTO(List<String> artUuids);
    List<ArticleBriefDTO> getArticleBriefDTOByAuthor(List<String> authorUuids);

    ArtProductDTO         getArtProductDTO(String productUuid);
    List<ArtProductDTO>   getArtProductDTO(List<String> productUuids);
    List<ArtProductDTO>   getArtProductDTOByOwner(String authorUuid);
    List<ArtProductDTO>   getArtProductDTOByOnwer(List<String> ownerUuids);

    ArtAdsDTO             getArtAdsDTO(String adUuid);
    List<ArtAdsDTO>       getArtAdsDTO(List<String> adUuids);
    List<ArtAdsDTO>       getArtAdsDTOByOwner(String ownerUuid);
    List<ArtAdsDTO>       getArtAdsDTOByOwner(List<String> ownerUuids);

    // Save, update
    //
    void saveArticlePost(ArticlePostDTO art);
    void saveArticlePost(List<ArticlePostDTO> arts);

    void saveArticleBrief(ArticleBrief rank);
    void saveArticleBrief(ArticleBriefDTO rank);
    void saveArticleBrief(List<ArticleBriefDTO> ranks);
    void saveArticleBrief(ArtProductDTO prod, ProductForm form);

    void saveArtAds(ArtAdsDTO ads);
    void saveArtAds(List<ArtAdsDTO> adsList);

    void saveArtProduct(ArtProductDTO prod);
    void saveArtProduct(List<ArtProductDTO> prodList);

    // Save post
    //
    ArticleAttr     updateArtAttr(CommentChangeForm form, ProfileDTO profile);
    ArticleBriefDTO updateArtBrief(ArticleForm form);

    ArticleBriefDTO savePost(PostForm form, ArticlePostDTO artPost,
            ProfileDTO profile, boolean publish, boolean update);

    // Delete
    //
    void deleteArticlePost(ArticlePostDTO art);
    void deleteArticlePost(List<ArticlePostDTO> arts);

    void deleteArticleBrief(ArticleBriefDTO rank);
    void deleteArticleBrief(List<ArticleBriefDTO> ranks);

    void deleteAnnonAds(String authorUuid);
    void deleteArtAds(ArtAdsDTO ads);
    void deleteArtAds(List<ArtAdsDTO> adsList);

    void deleteArtProduct(ArtProductDTO prod);
    void deleteArtProduct(List<ArtProductDTO> prodList);

    ArticlePost deleteArticlePost(String artUuid, ProfileDTO profile);
    ArtProduct deleteArtProduct(String articleUuid, ProfileDTO owner);

    void auditArticleTable();
    void cleanupDatabase();

    // Collection of article DTOs to send back to user.
    //
    public static class ArticleDTOResponse extends GenericResponse
    {
        protected List<ArticlePostDTO>  articles;
        protected List<ArticlePostDTO>  pendPosts;
        protected List<ArticleBriefDTO> articleRank;

        public ArticleDTOResponse(List<ArticlePostDTO> arts,
                List<ArticlePostDTO> pend, List<ArticleBriefDTO> ranks)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articles    = arts;
            this.pendPosts   = pend;
            this.articleRank = ranks;
        }

        public ArticleDTOResponse(List<ArticleBriefDTO> ranks)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articleRank = ranks;
        }

        /**
         * @return the articles
         */
        public List<ArticlePostDTO> getArticles() {
            return articles;
        }

        /**
         * @param articles the articles to set
         */
        public void setArticles(List<ArticlePostDTO> articles) {
            this.articles = articles;
        }

        /**
         * @return the pendPosts
         */
        public List<ArticlePostDTO> getPendPosts() {
            return pendPosts;
        }

        /**
         * @param pendPosts the pendPosts to set
         */
        public void setPendPosts(List<ArticlePostDTO> pendPosts) {
            this.pendPosts = pendPosts;
        }

        /**
         * @return the articleRank
         */
        public List<ArticleBriefDTO> getArticleRank() {
            return articleRank;
        }

        /**
         * @param articleRank the articleRank to set
         */
        public void setArticleRank(List<ArticleBriefDTO> articleRank) {
            this.articleRank = articleRank;
        }
    }

    // DTO for ArticlePost
    //
    public static class ArticlePostDTO extends GenericResponse
    {
        public static String s_baseUri = "/rs/user/";

        protected ArticlePost           article;
        protected ArticleBriefDTO       artBrief;
        protected String                articleUrl;
        protected String                uploadFormId;
        protected Map<String, ObjectId> uploadImgMap;

        public ArticlePostDTO(ArticlePost article)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.article = article;
        }

        public ArticlePostDTO(String authorUuid, Long authorId)
        {
            super(GenericResponse.USER_HOME, null, null);
            article = new ArticlePost(authorUuid, authorId);
        }

        public ArticlePostDTO(String artUuid, String authorUuid, Long authorId)
        {
            super(GenericResponse.USER_HOME, null, null);
            article = new ArticlePost(artUuid, authorUuid, authorId);
        }

        public ObjectId fetchUploadImg(String name)
        {
            if (uploadImgMap != null) {
                return uploadImgMap.get(name);
            }
            return null;
        }

        public void assignUploadImg(String name, ObjectId oid)
        {
            if (name != null && oid != null) {
                if (uploadImgMap == null) {
                    uploadImgMap = new HashMap<>();
                }
                uploadImgMap.put(name, oid);
            }
        }

        public String fetchUploadFormId() {
            return uploadFormId;
        }

        public void assignUploadFormId(String formId) {
            uploadFormId = formId;
        }

        public Map<String, ObjectId> fetchUploadImgMap() {
            return uploadImgMap;
        }

        public ArticlePost fetchArticlePost() {
            return article;
        }

        public void addPicture(ObjectId oid) {
            article.getArtBase().addPicture(oid);
        }

        public void removePicture(ObjectId oid) {
            article.getArtBase().removePicture(oid);
        }

        public void assignArtBrief(ArticleBriefDTO brief) {
            artBrief = brief;
        }

        /**
         * JSON Get
         */
        public String getArtTag() {
            return ArtTag.BLOG;
        }

        public String getArticleUuid() {
            return article.getArticleUuid();
        }

        public String getAuthorUuid() {
            return article.getAuthorUuid();
        }

        public String getContent() {
            return Util.fromRawByte(article.getContent());
        }

        public boolean isPublished() {
            return !article.isPending();
        }

        public ArticleBriefDTO getRank() {
            return artBrief;
        }
    }

    // DTO for ArticleBrief, if article is small, it may not have ArticlePost.
    //
    public static class ArticleBriefDTO extends GenericResponse
    {
        protected ArticleBrief artRank;

        public ArticleBriefDTO(ArticleBrief rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            artRank = rank;
        }

        public ArticleBrief fetchArtRank() {
            return artRank;
        }

        public void assignRank(ArticleBrief rank) {
            artRank = rank;
        }

        public String getPrevArticle() {
            return artRank.getPrevArticle();
        }

        public String getNextArticle() {
            return artRank.getNextArticle();
        }

        public String getTopArticle() {
            return artRank.getTopArticle();
        }

        public String getArticleUuid() {
            return artRank.getArticleUuid();
        }

        public String getAuthorUuid() {
            return artRank.getAuthorUuid();
        }

        public String getTagName() {
            return Util.fromRawByte(artRank.getTag());
        }

        public String getArtTitle() {
            return Util.fromRawByte(artRank.getArtBase().getArtTitle());
        }

        public String getContentBrief() {
            return Util.fromRawByte(artRank.getContentBrief());
        }

        public Long getTimeStamp()
        {
            Date date = artRank.getArtBase().getCreatedDate();
            if (date == null) {
                date = new Date();
            }
            return date.getTime();
        }

        public Long getPermMask() {
            return artRank.getArtBase().getPermMask();
        }

        public Long getCreditEarned() {
            return artRank.getArtAttr().getCreditEarned();
        }

        public Long getMoneyEarned() {
            return artRank.getArtAttr().getMoneyEarned();
        }

        public Long getLikes() {
            return artRank.getArtAttr().getLikes();
        }

        public Long getShares() {
            return artRank.getArtAttr().getShared();
        }

        public Long getRank() {
            return artRank.getArtAttr().getRank();
        }

        public void setRank(Long rank) {
            artRank.getArtAttr().setRank(rank);
        }

        public Long getScore() {
            return artRank.getArtAttr().getScore();
        }

        public boolean isFavorite() {
            return artRank.isFavorite();
        }

        public boolean isHasArticle() {
            return artRank.isHasArticle();
        }

        public String getArtTag() {
            return artRank.getArtBase().getArtTag();
        }

        public String getContentOid() {
            return artRank.getArtBase().getContentOid();
        }

        public String getContentLinkUrl() {
            return artRank.getArtBase().getContentLinkUrl();
        }

        public String getImageUrl()
        {
            ArticleBase base = artRank.getArtBase();
            List<String> imgs = base.getPictures();

            if (imgs != null && !imgs.isEmpty()) {
                String img = imgs.get(0);
                ObjStore objStore = ObjStore.getInstance();
                String store = s_baseUri + Long.toString(base.getAuthorId());

                return objStore.imgObjUri(ObjectId.fromString(img), store);
            }
            return null;
        }

        public List<String> getUserLiked()
        {
            List<String> liked = artRank.getUserLiked();
            if (liked == null) {
                return new LinkedList<String>();
            }
            return liked;
        }

        public List<String> getUserShared()
        {
            List<String> shared = artRank.getUserShared();
            if (shared == null) {
                return new LinkedList<String>();
            }
            return shared;
        }

        public boolean setPublicUrl(String publicTag)
        {
            String urlTag = Util.utf8ToUrlString(publicTag);

            artRank.setUrlTag(urlTag);
            return artRank.getArtBase().setPublicUrl(urlTag);
        }
    }
}
