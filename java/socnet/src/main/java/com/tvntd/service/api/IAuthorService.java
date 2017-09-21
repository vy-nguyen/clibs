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

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import com.tvntd.dao.AuthorTagRepo.AuthorTagDTO;
import com.tvntd.dao.AuthorTagRepo.AuthorTagRespDTO;
import com.tvntd.forms.ArticleForm;
import com.tvntd.models.ArtAds;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Author;
import com.tvntd.models.AuthorTag;
import com.tvntd.service.api.IAnnonService.AnnonUserDTO;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IProfileService.ProfileDTO;

public interface IAuthorService
{
    Author getAuthor(String uuid);
    AuthorDTO getAuthorDTO(String uuid);
    AuthorTagRespDTO getAuthorTag(String uuid);

    Author updateAuthor(ProfileDTO me, ArticleForm form, ArticleRankDTO rank);
    void addFavoriteArticle(Author author, String articleUuid);
    void removeFavoriteArticle(Author author, String articleUuid);

    void addTimeLineArticle(Author author, String articleUuid);
    void removeTimeLineArticle(Author author, String articleUuid);

    List<Author> getAuthors(List<String> uuids);
    List<AuthorDTO> getAuthorList(ProfileDTO profile);

    void saveAuthorTag(AuthorTagDTO tag);
    void deleteAuthorTag(AuthorTagDTO tag);

    void saveAuthor(Author author);
    void deleteAuthor(String uuid);

    ArticleRank createArticleRank(Article article, String tagName);
    ArticleBrief createAdsRank(ArtAds ads, AnnonUserDTO user);
    ArticleBrief createProductRank(ArtProduct product);

    /**
     *
     */
    public static class AuthorDTO
    {
        private Author author;
        private String authorUuid;

        public String toString() {
            return author.toString();
        }

        public AuthorDTO(Author author) {
            this.author = author;
        }

        public AuthorDTO(String userUuid)
        {
            this.author = null;
            this.authorUuid = userUuid;
        }

        public boolean equals(AuthorDTO that) {
            return getAuthorUuid().equals(that.getAuthorUuid());
        }

        public static boolean isInList(List<AuthorDTO> list, String authorUuid)
        {
            for (AuthorDTO it : list) {
                if (authorUuid.equals(it.getAuthorUuid())) {
                    return true;
                }
            }
            return false;
        }

        /**
         * JSON getters.
         */
        public String getAuthorUuid() {
            return author != null ? author.getAuthorUuid() : authorUuid;
        }

        public String getFrontArticleUuid() {
            return author != null ? author.getFrontArtUuid() : null;
        }

        public List<String> getFavoriteArticles() {
            return author != null ? author.getFavArticles() : null;
        }

        public List<String> getTimeLineArticles() {
            return author != null ? author.getTimeLineArticles() : null;
        }

        public String getAppUuid() {
            return author != null ? author.getAppUuid() : null;
        }

        public List<AuthorTagDTO> getAuthorTags()
        {
            if (author == null) {
                return null;
            }
            List<AuthorTagDTO> result = new ArrayList<>();
            List<AuthorTag> tags = author.getAuthorTags();

            for (AuthorTag t : tags) {
                result.add(new AuthorTagDTO(t));
            }
            return result;
        }

        /**
         * Common methods.
         */
        public static List<String> convertUuid(List<UUID> src)
        {
            List<String> ret = new LinkedList<>();
            for (UUID art : src) {
                ret.add(art.toString());
            }
            return ret;
        }

        public static List<AuthorDTO> convertDTO(List<Author> list)
        {
            List<AuthorDTO> ret = new LinkedList<>();

            for (Author author : list) {
                ret.add(new AuthorDTO(author));
            }
            return ret;
        }
    }
}
