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

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ArticleSavedRepo;
import com.tvntd.models.Article;
import com.tvntd.service.api.IArtSavedService;
import com.tvntd.service.api.IArticleService.ArticleDTO;

@Service
@Transactional
public class ArtSavedService implements IArtSavedService
{
    static private Logger s_log = LoggerFactory.getLogger(ArticleService.class);

    @Autowired
    protected ArticleSavedRepo articleRepo;

    @Override
    public ArticleDTO getArticle(Long artId)
    {
        Article art = articleRepo.findByArticleId(artId);
        return new ArticleDTO(art);
    }

    @Override
    public ArticleDTO getArticle(UUID artUuid)
    {
        Article art = articleRepo.findByArticleUuid(artUuid);
        return new ArticleDTO(art);
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(Long userId)
    {
        List<Article> articles = articleRepo.findAllByAuthorId(userId);
        return ArticleDTO.convert(articles);
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(UUID userUuid)
    {
        List<Article> articles = articleRepo.findAllByAuthorId(userUuid);
        return ArticleDTO.convert(articles);
    }

    @Override
    public void saveArticle(ArticleDTO article)
    {
        Article art = article.fetchArticle();
        articleRepo.save(art);
    }

    @Override
    public void deleteArticle(ArticleDTO article)
    {
        articleRepo.deleteByArticleId(article.fetchArticleId());
    }
}
