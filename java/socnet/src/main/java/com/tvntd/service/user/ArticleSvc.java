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

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ArtBriefRepo;
import com.tvntd.dao.ArticleAttrRepo;
import com.tvntd.dao.ArticleBaseRepo;
import com.tvntd.dao.ArticlePostRepo;
import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.ArticleRepository;
import com.tvntd.forms.PostForm;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleAttr;
import com.tvntd.models.ArticleBase;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.ArticleRank;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.IProfileService.ProfileDTO;

@Service
@Transactional
public class ArticleSvc implements IArticleSvc
{
    @Autowired
    protected ArticleBaseRepo artBaseRepo;

    @Autowired
    protected ArtBriefRepo artBriefRepo;

    @Autowired
    protected ArticlePostRepo artPostRepo;

    @Autowired
    protected ArticleAttrRepo artAttrRepo;

    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected ArticleRepository artRepo;

    // Query
    //
    public ArticlePostDTO getArticleDTO(String uuid)
    {
        return null;
    }

    public List<ArticlePostDTO> getArticleDTO(List<String> artUuids)
    {
        return null;
    }

    public List<ArticlePostDTO> getArticleDTOByAuthor(String authorUuid)
    {
        return null;
    }

    public List<ArticlePostDTO> getArticleDTOByAuthor(List<String> authorUuid)
    {
        return null;
    }

    public ArticleBriefDTO getArticleBriefDTO(String uuid)
    {
        ArticleBase base = artBaseRepo.findByArticleUuid(uuid);
        if (base == null) {
            return null;
        }
        ArticleBrief art = artBriefRepo.findByArticleUuid(uuid);
        if (art == null) {
            return null;
        }
        ArticleAttr attr = artAttrRepo.findByArticleUuid(uuid);
        if (attr == null) {
            attr = new ArticleAttr(uuid);
        }
        art.setArtAttr(attr);
        art.setArtBase(base);
        return new ArticleBriefDTO(art);
    }

    public List<ArticleBriefDTO> getArticleBriefDTO(List<String> artUuids)
    {
        return null;
    }

    public List<ArticleBriefDTO> getArticleBriefDTOByAuthor(List<String> authorUuids)
    {
        return null;
    }

    // Save, update
    //
    public void saveArticlePost(ArticlePostDTO art)
    {
    }

    public void saveArticleBrief(ArticleBriefDTO rank) {
        saveArticleBrief(rank.fetchArtRank());
    }
  
    protected void saveArticleBrief(ArticleBrief art)
    {
        artBaseRepo.save(art.getArtBase());
        artAttrRepo.save(art.getArtAttr());
        artBriefRepo.save(art);
    }

    public void saveArticlePost(List<ArticlePostDTO> arts)
    {
    }

    public void saveArticleBrief(List<ArticleBriefDTO> ranks)
    {
    }

    public void savePost(PostForm form, ArticleBriefDTO artBrief,
            ProfileDTO profile, boolean publish, boolean update)
    {
    }

    // Delete
    //
    public void deleteArticlePost(ArticlePostDTO art)
    {
    }

    public void deleteArticlePost(List<ArticlePostDTO> arts)
    {
    }

    public void deleteArticleBrief(ArticleBriefDTO rank)
    {
    }

    public void deleteArticleBrief(List<ArticleBriefDTO> ranks)
    {
    }

    public void auditArticleTable()
    {
        List<ArticleRank> all = artRankRepo.findAll();

        int i = 0;
        for (ArticleRank r : all) {
            Article art = artRepo.findByArticleUuid(r.getArticleUuid());
            ArticleBase base = new ArticleBase(r);

            if (art != null) {
                base.setFromArticle(art);
            }
            ArticleBrief brief = new ArticleBrief(base);
            brief.fromArticleRank(r);

            saveArticleBrief(brief);

            String artUuid = base.getArticleUuid();
            System.out.println("Saved brief " + artUuid);

            ArticleBriefDTO verf = getArticleBriefDTO(artUuid);
            if (verf != null) {
                i++;
                System.out.println("Read back " + verf + ", artUuid " +
                        verf.getArticleUuid() + " author " + verf.getAuthorUuid() +
                        " img " + verf.getImageUrl());
            }
        }
        System.out.println("Find all ranks, result " + all.size());
        System.out.println("Verify back " + i);
    }
}
