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
package com.tvntd.service.user;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.tvntd.dao.ArticleRepository;
import com.tvntd.dao.UserRepository;
import com.tvntd.models.Article;
import com.tvntd.models.User;
import com.tvntd.service.api.IArticleService;

@Service
@Transactional
public class ArticleService implements IArticleService
{
    static private Logger s_log = LoggerFactory.getLogger(ArticleService.class);

    @Autowired
    protected ArticleRepository articleRepo;

    @Autowired
    protected UserRepository userRepo;

    @Override
    public ArticleDTO getArticle(Long artId)
    {
        Article art = articleRepo.findByArticleId(artId);
        return new ArticleDTO(art);
    }

    @Override
    public ArticleDTO getArticle(String artUuid)
    {
        Article art = articleRepo.findByArticleUuid(artUuid);
        return new ArticleDTO(art);
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(Long userId)
    {
        List<Article> articles = articleRepo.findAllByUserId(userId);
        List<ArticleDTO> result = new LinkedList<>();

        for (Article art : articles) {
            result.add(new ArticleDTO(art));
        }
        return result;
    }

    @Override
    public Page<ArticleDTO> getUserArticles(Long userId)
    {
        Pageable req = new PageRequest(0, 10, new Sort(Sort.Direction.DESC, "created"));
        Page<Article> page = articleRepo.findByUserId(userId, req);

        List<Article> articles = page.getContent();
        return new PageImpl<ArticleDTO>(
                ArticleDTO.convert(articles), req, page.getTotalElements());
    }

    @Override
    public Page<ArticleDTO> getUserArticles(String email)
    {
        User user = userRepo.findByEmail(email);
        if (user != null) {
            return getUserArticles(user.getId());
        }
        return null;
    }

    @Override
    public void saveArticle(ArticleDTO article)
    {
        Article art = article.toArticle();
        articleRepo.save(art);
    }

    @Override
    public void saveArticles(String jsonFile)
    {
        s_log.info("Save from json " + jsonFile);
        Gson gson = new Gson();
        try {
            Long userId = 0L;
            BufferedReader brd = new BufferedReader(new FileReader(jsonFile));
            ArticleList arts = gson.fromJson(brd, ArticleList.class);
            brd.close();

            // Fix up the userId based on uuid (func as email).
            for (ArticleDTO at : arts.getArticles()) {
                User user = userRepo.findByEmail(at.getAuthorUuid());
                if (user != null) {
                    userId = user.getId();
                    at.setAuthorId(user.getId());
                } else {
                    s_log.error("Invalid user " + at.getAuthorUuid());
                }
            }
            for (ArticleDTO at : arts.getArticles()) {
                saveArticle(at);
            }
            if (!userId.equals(0L)) {
                List<ArticleDTO> articles = getArticlesByUser(userId);
                Gson out = new GsonBuilder().setPrettyPrinting().create();
                s_log.info(out.toJson(articles));
            }
        } catch(IOException | JsonSyntaxException e) {
            System.out.println(e.toString());
            s_log.info(e.getMessage() + ": " + e.toString());
        }
    }

    static class ArticleList
    {
        private List<ArticleDTO> articles;

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
}
