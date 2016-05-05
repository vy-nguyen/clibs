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

    public Page<ArticleDTO> getUserArticles(Long userId);
    public Page<ArticleDTO> getUserArticles(UUID userUuid);

    public void saveArticle(ArticleDTO article);
    public void saveArticles(String josnFile, String dir);

    public static class ArticleDTOResponse
    {
        private List<ArticleDTO> articles;

        public ArticleDTOResponse(List<ArticleDTO> arts) {
            this.articles = arts;
        }

        /**
         * @return the articles
         */
        public List<ArticleDTO> getArticles() {
            return articles;
        }

        /**
         * @param articles the articles to set
         */
        public void setArticles(List<ArticleDTO> articles) {
            this.articles = articles;
        }
    }
    /**
     * Transfer article to client.
     */
    public static class ArticleDTO
    {
        private static Logger s_log = LoggerFactory.getLogger(ArticleDTO.class);
        private static String s_baseUri = "/rs/upload/user";

        private Article article;
        private String  topic;
        private String  content;
        private String  articleUrl;

        public ArticleDTO(Article art)
        {
            this.article = art;
            convertUTF();
        }

        public ArticleDTO(PostForm form, ProfileDTO profile)
        {
            this.article = toArticle(form, profile);
            convertUTF();
        }

        private void convertUTF()
        {
            try {
                topic = new String(article.getTopic(), "UTF-8");
                content = new String(article.getContent(), "UTF-8");

            } catch(UnsupportedEncodingException e) {
                s_log.error(e.toString());
            }
        }

        public static Article toArticle(PostForm form, ProfileDTO profile)
        {
            Article art = new Article();

            art.setAuthorId(profile.obtainUserId());
            art.setAuthorUuid(profile.getUserUuid());
            art.setArticleUuid(UUID.randomUUID());
            art.setCreditEarned(0L);
            art.setMoneyEarned(0L);
            art.setTransRoot(ObjectId.zeroId());
            art.setContentOId(ObjectId.zeroId());
            art.setContentOId(ObjectId.zeroId());

            art.setCreatedDate(new Date());
            art.setTopic(form.getTopic().getBytes(Charset.forName("UTF-8")));
            art.setContent(form.getContent().getBytes(Charset.forName("UTF-8")));
            return art;
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();
            sb.append("Author uuid: ").append(getAuthorUuid()).append("\n");
            sb.append("Content: ").append(content).append('\n');
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

        public Long obtainArticleId() {
            return article.getArticleId();
        }

        public void assignAuthorId(Long id) {
            article.setAuthorId(id);
        }

        /**
         * @return the authorUuid
         */
        public String getAuthorUuid() {
            return article.getAuthorUuid().toString();
        }

        /**
         * @return the articleUuid
         */
        public String getArticleUuid() {
            return article.getArticleUuid().toString();
        }

        /**
         * @return the articleUrl
         */
        public String getArticleUrl() {
            return articleUrl;
        }

        public Long getCreditEarned() {
            return article.getCreditEarned();
        }

        public Long getMoneyEarned() {
            return article.getMoneyEarned();
        }

        public String getTransRoot() {
            return article.getTransRoot().name();
        }

        public String getContentOid() {
            return article.getContentOId().name();
        }

        public Date getCreateDate() {
            return article.getCreatedDate();
        }

        /**
         * @return the article
         */
        public Article getArticle() {
            return article;
        }

        public String getTopic() {
            return this.topic;
        }

        public String getContent() {
            return this.content;
        }

        public List<String> getPictureUrl()
        {
            ObjStore objStore = ObjStore.getInstance();
            List<String> ret = new LinkedList<>();
            List<ObjectId> pictures = article.getPictures();

            for (ObjectId oid : pictures) {
                ret.add(objStore.imgObjUri(oid, s_baseUri));
            }
            return ret;
        }

        public List<Long> getComments() {
            return article.getComments();
        }
    }
}
