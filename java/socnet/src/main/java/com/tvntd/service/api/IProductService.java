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
import com.tvntd.service.api.ICommentService.CommentDTO;

public interface IProductService
{
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
        private List<ArtProductDTO> products;
        private List<ArtProductDTO> pendings;
        private List<CommentDTO> comments;
        private List<ArticleBriefDTO> articleRank;

        public ProductDTOResponse(List<ArtProductDTO> prods, List<ArtProductDTO> pend,
                List<ArticleBriefDTO> ranks, List<CommentDTO> comments)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.products = prods;
            this.pendings = pend;
            this.articleRank = ranks;
            this.comments = comments;
        }

        public ProductDTOResponse(List<ArticleBriefDTO> rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            articleRank = rank;
        }

        /**
         * @return the products
         */
        public List<ArtProductDTO> getProducts() {
            return products;
        }

        /**
         * @return the pendings
         */
        public List<ArtProductDTO> getPendings() {
            return pendings;
        }

        /**
         * @return the comments
         */
        public List<CommentDTO> getComments() {
            return comments;
        }

        /**
         * @param comments the comments to set
         */
        public void setComments(List<CommentDTO> comments) {
            this.comments = comments;
        }

        /**
         * @return the articleRank
         */
        public List<ArticleBriefDTO> getArticleRank() {
            return articleRank;
        }
    }
}
