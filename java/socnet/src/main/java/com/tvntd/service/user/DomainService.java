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

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

import com.tvntd.dao.DomainRepo;
import com.tvntd.models.Domain;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArtTagService.ArtTagDTO;
import com.tvntd.service.api.IArtTagService.ArtTagList;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IDomainService;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.web.ApiPath;

@Service
@Transactional
@EnableCaching
public class DomainService implements IDomainService
{
    static private Logger s_log = LoggerFactory.getLogger(DomainService.class);

    @Autowired
    protected DomainRepo domainRepo;

    @Autowired
    protected IArtTagService artTagSvc;

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected IArticleService articleSvc;

    @Autowired
    protected IProfileService profileSvc;

    public Domain getDomain(String domain)
    {
        s_log.info("Get domain " + domain);
        return domainRepo.findByDomain(domain);
    }

    public void saveDomain(String name, String authorUuid)
    {
        s_log.info("Save domain " + name + ", user " + authorUuid);
        Domain domain = new Domain(name, authorUuid);
        domainRepo.save(domain);
    }

    public void deleteDomain(Domain domain)
    {
        domainRepo.delete(domain);
    }

    public void fillStartupDomain(StartupResponse resp, String name, ProfileDTO prof)
    {
        Domain domain = domainRepo.findByDomain(name);
        Map<String, String> artUuids = new HashMap<>();
        Map<String, String> authorUuids = new HashMap<>();

        if (domain != null) {
            String authorUuid = domain.getAuthorUuid();
            resp.setDomainUuid(authorUuid);

            List<ArticleDTO> articles = articleSvc.getArticlesByUser(authorUuid);
            resp.setArticles(articles);
            authorUuids.put(authorUuid, authorUuid);
        }
        fillStartupResponse(resp, prof, artUuids, authorUuids);
    }

    private void fillStartupResponse(StartupResponse resp, ProfileDTO profile,
            Map<String, String> artUuids, Map<String, String> authorUuids)
    {
        String publicUuid = com.tvntd.util.Constants.PublicUuid;
        ArtTagList tags = artTagSvc.getUserTagsDTO(publicUuid);
        resp.setPublicTags(tags);

        List<ArtTagDTO> tagList = tags.getPublicTags();

        // Get all authors and articles from public tags.
        //
        for (ArtTagDTO t : tagList) {
            String u = t.getUserUuid();
            if (!u.equals(publicUuid) && (authorUuids.get(u) == null)) {
                authorUuids.put(u, u);
            }
            List<String> ranks = t.getArticleRank();
            for (String r : ranks) {
                if (artUuids.get(r) == null) {
                    artUuids.put(r, r);
                }
            }
        }
        // Get all articles.
        //
        List<ArticleDTO> artList = new LinkedList<>();
        List<ArticleRankDTO> rankList = new LinkedList<>();
        for (Map.Entry<String, String> entry : artUuids.entrySet()) {
            ArticleDTO art = articleSvc.getArticleDTO(entry.getKey());
            if (art != null) {
                artList.add(art);
                String author = art.getAuthorUuid();

                if (authorUuids.get(author) == null) {
                    authorUuids.put(author, author);
                }
                ArticleRankDTO rank = art.getRank();
                if (rank == null) {
                }
            }
        }
        resp.setArtRanks(rankList);
        resp.setArticles(artList);

        // Get all authors.
        //
        List<String> uuids = new LinkedList<>();
        List<ProfileDTO> userList = new LinkedList<>();
        for (Map.Entry<String, String> entry : authorUuids.entrySet()) {
            ProfileDTO user = profileSvc.getProfile(entry.getKey());
            if (user != null) {
                userList.add(user);
                uuids.add(entry.getKey());
            }
        }
        resp.setLinkedUsers(userList);
        ApiPath.fillAuthorTags(resp, profile, uuids, authorSvc);
    }
}
