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
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;

import com.tvntd.models.Article;

public interface IArticleService
{
    public ArticleDTO getArticle(Long artId);
    public ArticleDTO getArticle(String uuid);
    public List<ArticleDTO> getArticlesByUser(Long userId);

    public Page<ArticleDTO> getUserArticles(String email);
    public Page<ArticleDTO> getUserArticles(Long userId);

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

    public static class ArticleDTO
    {
        private static Logger s_log = LoggerFactory.getLogger(ArticleDTO.class);
        private Long articleId;
        private Long authorId;
        private String authorUuid;
        private String articleUuid;
        private String articleUrl;
        private Long   picturesId;
        private String transRoot;
        private String creditEarned;
        private String moneyEarned;
        private String contentOId;
        private Date created;
        private String content;

        public ArticleDTO(Article art)
        {
            articleId = art.getArticleId();
            authorId = art.getUserId();
            authorUuid = art.getAuthorUuid();
            articleUuid = art.getArticleUuid();
            articleUrl = art.getArticleUrl();
            picturesId = art.getPicturesId();
            transRoot = art.getTransRoot();
            creditEarned = art.getCreditEarned();
            moneyEarned = art.getMoneyEarned();
            contentOId = art.getContentOId();
            created = art.getCreated();
            try {
                content = new String(art.getContent(), "UTF-8");
            } catch(UnsupportedEncodingException e) {
                s_log.error(e.toString());
            }
        }

        public Article toArticle()
        {
            try {
                return toArticle(content.getBytes("UTF-8"));

            } catch(UnsupportedEncodingException e) {
                s_log.error(e.toString());
            }
            return null;
        }

        public Article toArticle(byte[] content)
        {
            Article art = new Article();
            art.setUserId(authorId);
            art.setAuthorUuid(authorUuid);
            art.setArticleUuid(articleUuid);
            art.setArticleUrl(articleUrl);
            art.setPicturesId(picturesId);
            art.setTransRoot(transRoot);
            art.setCreditEarned(creditEarned);
            art.setMoneyEarned(moneyEarned);
            art.setContentOId(contentOId);
            art.setCreated(created);
            art.setContent(content);
            return art;
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();
            sb.append("Author uuid: ").append(authorUuid).append('\n');
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

        /**
         * @return the articleId
         */
        public Long getArticleId() {
            return articleId;
        }

        /**
         * @param articleId the articleId to set
         */
        public void setArticleId(Long articleId) {
            this.articleId = articleId;
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
         * @return the articleUrl
         */
        public String getArticleUrl() {
            return articleUrl;
        }

        /**
         * @param articleUrl the articleUrl to set
         */
        public void setArticleUrl(String articleUrl) {
            this.articleUrl = articleUrl;
        }

        /**
         * @return the picturesId
         */
        public Long getPicturesId() {
            return picturesId;
        }

        /**
         * @param picturesId the picturesId to set
         */
        public void setPicturesId(Long picturesId) {
            this.picturesId = picturesId;
        }

        /**
         * @return the transRoot
         */
        public String getTransRoot() {
            return transRoot;
        }

        /**
         * @param transRoot the transRoot to set
         */
        public void setTransRoot(String transRoot) {
            this.transRoot = transRoot;
        }

        /**
         * @return the creditEarned
         */
        public String getCreditEarned() {
            return creditEarned;
        }

        /**
         * @param creditEarned the creditEarned to set
         */
        public void setCreditEarned(String creditEarned) {
            this.creditEarned = creditEarned;
        }

        /**
         * @return the moneyEarned
         */
        public String getMoneyEarned() {
            return moneyEarned;
        }

        /**
         * @param moneyEarned the moneyEarned to set
         */
        public void setMoneyEarned(String moneyEarned) {
            this.moneyEarned = moneyEarned;
        }

        /**
         * @return the contentOId
         */
        public String getContentOId() {
            return contentOId;
        }

        /**
         * @param contentOId the contentOId to set
         */
        public void setContentOId(String contentOId) {
            this.contentOId = contentOId;
        }

        /**
         * @return the created
         */
        public Date getCreated() {
            return created;
        }

        /**
         * @param created the created to set
         */
        public void setCreated(Date created) {
            this.created = created;
        }

        /**
         * @return the content
         */
        public String getContent() {
            return content;
        }

        /**
         * @param content the content to set
         */
        public void setContent(String content) {
            this.content = content;
        }
    }
}
