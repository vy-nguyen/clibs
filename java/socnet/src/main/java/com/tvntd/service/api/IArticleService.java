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
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import com.tvntd.forms.PostForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Article;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.IProfileService.ProfileDTO;

public interface IArticleService
{
    public ArticleDTO getArticle(Long artId);
    public ArticleDTO getArticle(UUID uuid);

    public List<ArticleDTO> getArticles(List<UUID> uuids);
    public List<ArticleDTO> getArticlesByUser(Long userId);
    public List<ArticleDTO> getArticlesByUser(UUID userUuidId);
    public List<ArticleDTO> getArticlesByUser(List<UUID> userUuidIds);

    public Page<ArticleDTO> getUserArticles(Long userId);
    public Page<ArticleDTO> getUserArticles(UUID userUuid);

    public void saveArticle(Article article);
    public void saveArticle(ArticleDTO article);
    public void saveArticles(String josnFile, String dir);

    public void deleteArticle(Article article);
    public void deleteArticle(UUID uuid);

    public static class ArticleDTOResponse extends GenericResponse
    {
        private List<ArticleDTO> articles;
        private List<ArticleDTO> pendPosts;

        public ArticleDTOResponse(List<ArticleDTO> arts, List<ArticleDTO> pend)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articles = arts;
            this.pendPosts = pend;
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
    }

    /**
     * Transfer article to client.
     */
    public static class ArticleDTO extends GenericResponse
    {
        private static Logger s_log = LoggerFactory.getLogger(ArticleDTO.class);
        private static String s_baseUri = "/rs/user/";

        private Article article;
        private String  topic;
        private String  content;
        private String  articleUrl;

        public ArticleDTO(Article art)
        {
            super(GenericResponse.USER_HOME, null, null);
            article = art;
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
            this.article = toArticle(form, profile, false);
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

        public static Article toArticle(PostForm form, ProfileDTO profile, boolean pub)
        {
            Article art = new Article();

            art.setAuthorId(profile.fetchUserId());
            art.setAuthorUuid(profile.getUserUuid());
            applyForm(form, art, false);
            return art;
        }

        private static void applyForm(PostForm form, Article art, boolean publish)
        {
            if (publish == true) {
                art.markActive();
            } else {
                art.markPending();
            }
            art.setCreatedDate(new Date());
            art.setTopic(form.getTopic().getBytes(Charset.forName("UTF-8")));
            art.setContent(form.getContent().getBytes(Charset.forName("UTF-8")));
        }

        public void applyForm(PostForm form, boolean publish) {
            applyForm(form, article, publish);
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

        public static List<ArticleDTO> convert(List<Article> arts)
        {
            List<ArticleDTO> result = new LinkedList<>();
            for (Article at : arts) {
                result.add(new ArticleDTO(at));
            }
            return result;
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

        public Long getCreditEarned() {
            return article.getCreditEarned();
        }

        public Long getMoneyEarned() {
            return article.getMoneyEarned();
        }

        public Long getLikeCount() {
            return 0L;
        }

        public Long getRankCount() {
            return 0L;
        }

        public String getTransRoot() {
            return article.getTransRoot().name();
        }

        public String getContentOid() {
            return article.getContentOId().name();
        }

        public String getCreatedDate() {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(article.getCreatedDate());
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
}
