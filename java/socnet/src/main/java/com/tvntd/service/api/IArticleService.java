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

import java.util.List;
import com.tvntd.service.api.IArticleSvc.ArticleBriefDTO;
import com.tvntd.service.api.IArticleSvc.ArticlePostDTO;

public interface IArticleService
{
    public static class ArticleDTOResponse extends GenericResponse
    {
        private List<ArticlePostDTO>  articles;
        private List<ArticlePostDTO>  pendPosts;
        private List<ArticleBriefDTO> articleRank;

        public ArticleDTOResponse(List<ArticlePostDTO> arts, List<ArticlePostDTO> pend)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articles = arts;
            this.pendPosts = pend;
            this.articleRank = null;
        }

        public ArticleDTOResponse(List<ArticleBriefDTO> rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.articleRank = rank;
            this.articles = null;
            this.pendPosts = null;
        }

        /**
         * @return the articles
         */
        public List<ArticlePostDTO> getArticles() {
            return articles;
        }

        /**
         * @return the pendPosts
         */
        public List<ArticlePostDTO> getPendPosts() {
            return pendPosts;
        }

        /**
         * @return the articleRank
         */
        public List<ArticleBriefDTO> getArticleRank() {
            return articleRank;
        }
    }
}
