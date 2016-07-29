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
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.AuthorTag;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.user.ArticleService;

public interface IArticleService
{
    ArticleDTO getArticle(Long artId);
    ArticleDTO getArticle(UUID uuid);
    Article getArticle(String artUuid);

    ArticleRank getRank(String artUuid);
    ArticleRank updateRank(CommentChangeForm form, ProfileDTO user);
    List<ArticleRankDTO> getArticleRank(UuidForm uuids);
    List<ArticleRankDTO> convertRank(List<ArticleRank> ranks);

    List<ArticleDTO> convert(List<Article> arts);
    List<ArticleDTO> getArticles(List<UUID> uuids);
    List<ArticleDTO> getArticlesByUser(Long userId);
    List<ArticleDTO> getArticlesByUser(UUID userUuidId);
    List<ArticleDTO> getArticlesByUser(List<UUID> userUuidIds);

    Page<ArticleDTO> getUserArticles(Long userId);
    Page<ArticleDTO> getUserArticles(UUID userUuid);

    void saveArticle(Article article);
    void saveArticle(ArticleDTO article);
    void saveArticles(String josnFile, String dir);

    void deleteArticle(Article article);
    void deleteArticle(UUID uuid);

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
        private static Logger s_log = LoggerFactory.getLogger(ArticleDTO.class);
        private static String s_baseUri = "/rs/user/";

        private Article article;
        private ArticleRank rank;

        private String  topic;
        private String  content;
        private String  articleUrl;

        public ArticleDTO(Article art, ArticleRank rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.article = art;
            this.rank = rank;
            convertUTF();
        }

        public ArticleDTO(UUID author, Long id)
        {
            super(GenericResponse.USER_HOME, null, null);
            article = new Article();
            article.setAuthorId(id);
            article.setAuthorUuid(author);
            convertUTF();
        }

        public ArticleDTO(PostForm form, ProfileDTO profile)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.article = ArticleService.toArticle(form, profile, false);
            convertUTF();
        }

        public void convertUTF()
        {
            try {
                byte[] str = article.getTopic();
                if (str != null) {
                    topic = new String(str, "UTF-8");
                }
                str = article.getContent();
                if (str != null) {
                    content = new String(str, "UTF-8");
                }

            } catch(UnsupportedEncodingException e) {
                s_log.error(e.toString());
            }
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();
            sb.append("Author uuid: ").append(getAuthorUuid()).append("\n");
            sb.append("Content: ").append(content).append('\n');

            if (article.getPictures() != null) {
                sb.append("Pic [");
                for (ObjectId oid : article.getPictures()) {
                    sb.append(oid.name());
                }
                sb.append("]\n");
            }
            return sb.toString();
        }

        /**
         * Methods to construct fields in the article.
         */
        public Long fetchArticleId() {
            return article.getArticleId();
        }

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
         * @return the article
         */
        public Article fetchArticle() {
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
            return article.getContentOId().name();
        }

        public String getCreatedDate() {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(article.getCreatedDate());
        }

        /**
         * @return the rank
         */
        public ArticleRank getRank() {
            return rank;
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

        public List<String> getCommentList() {
            return new LinkedList<String>();
        }

        public List<String> getPictureUrl()
        {
            ObjStore objStore = ObjStore.getInstance();
            List<String> ret = new LinkedList<>();
            List<ObjectId> pictures = article.getPictures();
            String store = s_baseUri + Long.toString(article.getAuthorId());

            if (pictures != null) {
                for (ObjectId oid : pictures) {
                    ret.add(objStore.imgObjUri(oid, store));
                }
            }
            return ret;
        }
    }

    public static class ArticleRankDTO extends GenericResponse
    {
        private String  articleUuid;
        private String  authorUuid;
        private String  tagName;
        private String  artTitle;
        private String  contentBrief;

        private String  timeStamp;
        private String  notifHead;
        private Long    creditEarned;
        private Long    moneyEarned;
        private Long    likes;
        private Long    shares;
        private Long    rank;
        private Long    score;
        private Long    notifCount;
        private Long    tagRank;
        private boolean favorite;

        private List<String> userLiked;
        private List<String> userShared;

        public ArticleRankDTO() {
            super(GenericResponse.USER_HOME, null, null);
        }

        public ArticleRankDTO(ArticleRank rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            setRank(rank);
        }

        public void setRank(ArticleRank rank, AuthorTag tag)
        {
            setRank(rank);
            tagName = tag.getTag();
            tagRank = tag.getRank();
            notifHead = tag.getHeadNotif();
            notifCount = tag.getNotifCount();
        }

        protected void setRank(ArticleRank rank)
        {
            articleUuid = rank.getArticleUuid();
            authorUuid = rank.getAuthorUuid();
            creditEarned = rank.getCreditEarned();
            moneyEarned = rank.getMoneyEarned();
            likes = rank.getLikes();
            shares = rank.getShared();
            this.rank = rank.getRank();
            favorite = rank.isFavorite();
            score = rank.getScore();
            userLiked = ProfileDTO.toStringList(rank.getUserLiked());
            userShared = ProfileDTO.toStringList(rank.getUserShared());

            artTitle = rank.getArtTitle();
            tagName = rank.getTag();
            contentBrief = rank.getContentBrief();

            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            timeStamp = df.format(rank.getTimeStamp());
        }

        /**
         * @return the articleUuid
         */
        public String getArticleUuid() {
            return articleUuid;
        }

        /**
         * @return the authorUuid
         */
        public String getAuthorUuid() {
            return authorUuid;
        }

        /**
         * @return the tagName
         */
        public String getTagName() {
            return tagName;
        }

        /**
         * @return the artTitle
         */
        public String getArtTitle() {
            return artTitle;
        }

        /**
         * @return the contentBrief
         */
        public String getContentBrief() {
            return contentBrief;
        }

        /**
         * @return the timeStamp
         */
        public String getTimeStamp() {
            return timeStamp;
        }

        /**
         * @return the notifHead
         */
        public String getNotifHead() {
            return notifHead;
        }

        /**
         * @return the creditEarned
         */
        public Long getCreditEarned() {
            return creditEarned;
        }

        /**
         * @return the moneyEarned
         */
        public Long getMoneyEarned() {
            return moneyEarned;
        }

        /**
         * @return the likes
         */
        public Long getLikes() {
            return likes;
        }

        /**
         * @return the shares
         */
        public Long getShares() {
            return shares;
        }

        /**
         * @return the rank
         */
        public Long getRank() {
            return rank;
        }

        /**
         * @return the score
         */
        public Long getScore() {
            return score;
        }

        /**
         * @return the notifCount
         */
        public Long getNotifCount() {
            return notifCount;
        }

        /**
         * @return the tagRank
         */
        public Long getTagRank() {
            return tagRank;
        }

        /**
         * @return the favorite
         */
        public boolean isFavorite() {
            return favorite;
        }

        /**
         * @return the userLiked
         */
        public List<String> getUserLiked() {
            return userLiked;
        }

        /**
         * @return the userShared
         */
        public List<String> getUserShared() {
            return userShared;
        }
    }
}
