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
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.tvntd.service.api.IArtTagService.ArtTagList;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IAuthorService.AuthorDTO;
import com.tvntd.service.api.IProfileService.ProfileDTO;

public class StartupResponse
{
    private LoginResponse          userDTO;
    private List<ProfileDTO>       linkedUsers;
    private List<ArticleDTO>       articles;
    private List<AuthorDTO>        authors;

    private List<Language>         languages;
    private ArtTagList             publicTags;

    // Only use this list to reduce the amount of full articles fetched back from
    // one shot.
    //
    private List<ArticleRankDTO>   artRanks;

    public StartupResponse(ProfileDTO profile,
            HttpServletRequest reqt, HttpSession session, boolean annon)
    {
        initLanguages();
        userDTO = new LoginResponse(profile, reqt, session, annon);
    }

    protected void initLanguages()
    {
        languages = new ArrayList<>();
        languages.add(new Language("us", "USA", "English"));
        languages.add(new Language("vi", "Tiếng Việt", "Tiếng Việt"));
    }

    public List<String> getAllUserUuids()
    {
        Map<String, String> users = new HashMap<>();
        if (linkedUsers != null) {
            for (ProfileDTO prof : linkedUsers) {
                String uuid = prof.getUserUuid();
                if (users.get(uuid) == null) {
                    users.put(uuid, uuid);
                }
            }
        }
        if (authors != null) {
            for (AuthorDTO author : authors) {
                String uuid = author.getAuthorUuid();
                if (users.get(uuid) == null) {
                    users.put(uuid, uuid);
                }
            }
        }
        if (users.isEmpty()) {
            return null;
        }
        List<String> result = new LinkedList<>();
        for (Map.Entry<String, String> e : users.entrySet()) {
            result.add(e.getKey());
        }
        users.clear();
        return result;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("# articles ").append(articles.size())
            .append(", #ranks ").append(artRanks.size())
            .append(", #authors ").append(authors.size());
        return sb.toString();
    }

    /**
     * @return the userDTO
     */
    public LoginResponse getUserDTO() {
        return userDTO;
    }

    /**
     * @param userDTO the userDTO to set
     */
    public void setUserDTO(LoginResponse userDTO) {
        this.userDTO = userDTO;
    }

    /**
     * @return the linkedUsers
     */
    public List<ProfileDTO> getLinkedUsers() {
        return linkedUsers;
    }

    /**
     * @param linkedUsers the linkedUsers to set
     */
    public void setLinkedUsers(List<ProfileDTO> linkedUsers) {
        this.linkedUsers = linkedUsers;
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
    public void setArticles(List<ArticleDTO> list)
    {
        if (articles == null) {
            articles = list;
        } else {
            articles.addAll(list);
        }
    }

    /**
     * @return the artRanks
     */
    public List<ArticleRankDTO> getArtRanks() {
        return artRanks;
    }

    /**
     * @param artRanks the artRanks to set
     */
    public void setArtRanks(List<ArticleRankDTO> rankList)
    {
        if (artRanks == null) {
            artRanks = rankList;
        } else {
            artRanks.addAll(rankList);
        }
    }

    /**
     * @return the authors
     */
    public List<AuthorDTO> getAuthors() {
        return authors;
    }

    /**
     * @param authors the authors to set
     */
    public void setAuthors(List<AuthorDTO> authors) {
        this.authors = authors;
    }

    /**
     * @return the languages
     */
    public List<Language> getLanguages() {
        return languages;
    }

    /**
     * @return the publicTags
     */
    public ArtTagList getPublicTags() {
        return publicTags;
    }

    /**
     * @param publicTags the publicTags to set
     */
    public void setPublicTags(ArtTagList publicTags)
    {
        if (this.publicTags == null) {
            this.publicTags = publicTags;
        } else {
            this.publicTags.updateTagList(publicTags);
        }
    }

    public static class Language
    {
        private String key;
        private String alt;
        private String title;

        public Language(String key, String alt, String title)
        {
            this.key = key;
            this.alt = alt;
            this.title = title;
        }

        /**
         * @return the key
         */
        public String getKey() {
            return key;
        }

        /**
         * @return the alt
         */
        public String getAlt() {
            return alt;
        }

        /**
         * @return the title
         */
        public String getTitle() {
            return title;
        }
    }
}
