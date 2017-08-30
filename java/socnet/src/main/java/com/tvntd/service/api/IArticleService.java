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
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;

import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.ArtVideo;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.AuthorTag;
import com.tvntd.models.Profile;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.user.ArticleService;
import com.tvntd.util.Util;

public interface IArticleService
{
    ArticleDTO getArticleDTO(String uuid);
    Article getArticle(String artUuid);

    ArticleRank getRank(String artUuid);
    ArticleRank getRank(String tagName, String title);
    List<ArticleRank> getArtRank(String[] artUuids);
    void saveRank(ArticleRank rank);

    ArticleRank updateRank(CommentChangeForm form, ProfileDTO user);
    List<ArticleRankDTO> getArticleRank(UuidForm uuids);
    List<ArticleRankDTO> convertRank(List<ArticleRank> ranks);

    List<ArticleDTO> convert(List<Article> arts);
    List<ArticleDTO> getArticles(List<String> uuids);
    List<ArticleDTO> getArticlesByUser(Long userId);
    List<ArticleDTO> getArticlesByUser(String userUuidId);
    List<ArticleDTO> getArticlesByUser(List<String> userUuidIds);

    Page<ArticleDTO> getUserArticles(Long userId);
    Page<ArticleDTO> getUserArticles(String userUuid);

    void saveArtRank(List<ArticleRank> ranks);
    void saveArticle(Article article);
    void saveArticle(ArticleDTO article);
    void saveArticles(String josnFile, String dir);

    Article deleteArticle(Article article, ProfileDTO owner);
    Article deleteArticle(String uuid, ProfileDTO owner);

    public static class ArticleDTOResponse extends GenericResponse
    {
        private List<ArticleDTO> articles;
        private List<ArticleDTO> pendPosts;
        private List<ArticleRankDTO> articleRank;

        public ArticleDTOResponse(List<ArticleDTO> arts, List<ArticleDTO> pend)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articles = arts;
            this.pendPosts = pend;
            this.articleRank = null;
        }

        public ArticleDTOResponse(List<ArticleRankDTO> rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articleRank = rank;
            this.articles = null;
            this.pendPosts = null;
        }

        /**
         * @return the articles
         */
        public List<ArticleDTO> getArticles() {
            return articles;
        }

        /**
         * @return the pendPosts
         */
        public List<ArticleDTO> getPendPosts() {
            return pendPosts;
        }

        /**
         * @return the articleRank
         */
        public List<ArticleRankDTO> getArticleRank() {
            return articleRank;
        }
    }

    /**
     * Transfer article to client.
     */
    public static class ArticleDTO extends GenericResponse
    {
        public  static String s_baseUri = "/rs/user/";

        private Article article;
        private ArticleRank rank;

        private String  topic;
        private String  content;
        private String  articleUrl;
        private String  uploadFormId;
        private Map<String, ObjectId> uploadImgMap;

        public ArticleDTO(Article art, ArticleRank rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.article = art;
            this.rank = rank;
            convertUTF();
        }

        public ArticleDTO(String author, Long id)
        {
            super(GenericResponse.USER_HOME, null, null);
            article = new Article();
            article.setAuthorId(id);
            article.setAuthorUuid(author);
        }

        public ArticleDTO(PostForm form, ProfileDTO profile)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.article = ArticleService.toArticle(form, profile, false);
            convertUTF();
        }

        public void convertUTF()
        {
            topic   = Util.fromRawByte(article.getTopic());
            content = Util.fromRawByte(article.getContent());

            if (rank != null) {
                String urlTag = rank.getUrlTag();
                if (urlTag != null) {
                    StringBuilder sb = new StringBuilder();
                    sb.append("https://www.tudoviet.com/public/article/")
                        .append(Util.utf8ToUrlString(rank.getUrlTag()))
                        .append("/")
                        .append(Util.utf8ToUrlString(topic));
                    articleUrl = sb.toString();
                }
            }
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();
            sb.append("Author uuid: ").append(getAuthorUuid()).append("\n");
            sb.append("Content: ").append(content).append('\n');

            if (article.getPictures() != null) {
                sb.append("Pic [");
                for (String oid : article.getPictures()) {
                    sb.append(oid);
                }
                sb.append("]\n");
            }
            return sb.toString();
        }

        /**
         * Methods to construct fields in the article.
         */
        public void assignAuthorId(Long id) {
            article.setAuthorId(id);
        }

        public void addPicture(ObjectId img) {
            article.addPicture(img);
        }

        public void removePicture(ObjectId img) {
            article.removePicture(img);
        }

        /**
         * Get/set upload image identified by field id.
         */
        public ObjectId fetchUploadImg(String name)
        {
            if (uploadImgMap != null) {
                return uploadImgMap.get(name);
            }
            return null;
        }

        public void assignUploadImg(String name, ObjectId oid)
        {
            if (uploadImgMap == null) {
                uploadImgMap = new HashMap<>();
            }
            if (name != null && oid != null) {
                uploadImgMap.put(name, oid);
            }
        }

        /**
         * @return the uploadFormId
         */
        public String fetchUploadFormId() {
            return uploadFormId;
        }

        /**
         * @param uploadFormId the uploadFormId to set
         */
        public void assignUploadFormId(String uploadFormId) {
            this.uploadFormId = uploadFormId;
        }

        /**
         * @return the uploadImgMap
         */
        public Map<String, ObjectId> fetchUploadImgMap() {
            return uploadImgMap;
        }

        /**
         * @return the article
         */
        public Article fetchArticle() {
            return article;
        }

        public Article assignVideo(String link)
        {
            if (link != null && !link.isEmpty()) {
                article = new ArtVideo(article, link);
            }
            return article;
        }

        /**
         * @return the authorUuid
         */
        public String getAuthorUuid() {
            return article.getAuthorUuid();
        }

        /**
         * @return the articleUuid
         */
        public String getArticleUuid() {
            return article.getArticleUuid();
        }

        /**
         * @return the articleUrl
         */
        public String getArticleUrl() {
            return articleUrl;
        }

        /**
         * @return the published
         */
        public boolean isPublished() {
            return !article.isPending();
        }

        public String getTransRoot() {
            return null;
        }

        public String getContentOid() {
            return article.getContentOId();
        }

        public String getCreatedDate() {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(article.getCreatedDate());
        }

        /**
         * @return the rank
         */
        public ArticleRankDTO getRank() {
            return rank != null ? new ArticleRankDTO(rank) : null;
        }

        /**
         * @param rank the rank to set
         */
        public void setRank(ArticleRank rank) {
            this.rank = rank;
        }

        public String getTopic() {
            return this.topic;
        }

        public String getContent() {
            return this.content;
        }

        public String getYoutube()
        {
            if (article instanceof ArtVideo) {
                return ((ArtVideo)article).getVideoUrl();
            }
            return null;
        }

        public List<String> getCommentList() {
            return new LinkedList<String>();
        }

        public List<String> getPictureUrl()
        {
            List<String> ret = new LinkedList<>();
            List<String> pictures = article.getPictures();

            if (pictures != null) {
                ObjStore objStore = ObjStore.getInstance();
                String store = s_baseUri + Long.toString(article.getAuthorId());

                for (String poid : pictures) {
                    ObjectId oid = ObjectId.fromString(poid);
                    ret.add(objStore.imgObjUri(oid, store));
                }
            }
            return ret;
        }

        public static String getPictureUrl(Profile profile, ObjectId oid)
        {
            if (oid != null) {
                ObjStore objStore = ObjStore.getInstance();
                String store = s_baseUri + Long.toString(profile.getUserId());
                return objStore.imgObjUri(oid, store);
            }
            return null;
        }
    }

    public static class ArticleRankDTO extends GenericResponse
    {
        private ArticleRank artRank;

        public ArticleRankDTO() {
            super(GenericResponse.USER_HOME, null, null);
        }

        public ArticleRankDTO(ArticleRank rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            artRank = rank;
        }

        public ArticleRank fetchArtRank() {
            return artRank;
        }

        public void setRank(ArticleRank rank, AuthorTag tag) {
            artRank = rank;
        }

        public boolean setPublicUrl(String publicTag) {
            return artRank.setPublicUrl(publicTag);
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

        /**
         * @return the articleUuid
         */
        public String getArticleUuid() {
            return artRank.getArticleUuid();
        }

        /**
         * @return the authorUuid
         */
        public String getAuthorUuid() {
            return artRank.getAuthorUuid();
        }

        /**
         * @return the tagName
         */
        public String getTagName() {
            return artRank.getTag();
        }

        /**
         * @return the artTitle
         */
        public String getArtTitle() {
            return artRank.getArtTitle();
        }

        /**
         * @return the contentBrief
         */
        public String getContentBrief() {
            return artRank.getContentBrief();
        }

        /**
         * @return the timeStamp
         */
        public String getTimeStamp()
        {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(artRank.getTimeStamp());
        }

        /**
         * @return the creditEarned
         */
        public Long getCreditEarned() {
            return artRank.getCreditEarned();
        }

        /**
         * @return the moneyEarned
         */
        public Long getMoneyEarned() {
            return artRank.getMoneyEarned();
        }

        /**
         * @return the likes
         */
        public Long getLikes() {
            return artRank.getLikes();
        }

        /**
         * @return the shares
         */
        public Long getShares() {
            return artRank.getShared();
        }

        /**
         * @return the rank
         */
        public Long getRank() {
            return artRank.getRank();
        }

        /**
         * @return the score
         */
        public Long getScore() {
            return artRank.getScore();
        }

        /**
         * @return the favorite
         */
        public boolean isFavorite() {
            return artRank.isFavorite();
        }

        public boolean isHasArticle() {
            return artRank.isHasArticle();
        }

        public String getArtTag() {
            return artRank.getArtTag();
        }

        public String getContentOid() {
            return artRank.getContentOid();
        }

        public String getContentLinkUrl() {
            return artRank.getContentLinkUrl();
        }

        public String getTransRoot() {
            return artRank.getTransRoot();
        }

        /**
         * @return the userLiked
         */
        public List<String> getUserLiked()
        {
            List<String> liked = artRank.getUserLiked();
            if (liked == null) {
                return new LinkedList<String>();
            }
            return liked;
        }

        /**
         * @return the userShared
         */
        public List<String> getUserShared()
        {
            List<String> shared = artRank.getUserShared();
            if (shared == null) {
                return new LinkedList<String>();
            }
            return shared;
        }
    }
}
