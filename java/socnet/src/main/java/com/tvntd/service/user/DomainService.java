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
import com.tvntd.forms.DomainForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Domain;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArtTagService.ArtTagDTO;
import com.tvntd.service.api.IArtTagService.ArtTagList;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IAuthorService.AuthorDTO;
import com.tvntd.service.api.IDomainService;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.LoginResponse;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.util.Util;

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

    @Override
    public boolean saveDomain(String name, ProfileDTO profile)
    {
        String authorUuid = profile.getUserUuid();
        s_log.info("Save domain " + name + ", user " + authorUuid);
        try {
            domainRepo.deleteByAuthorUuid(authorUuid);
        } catch(Exception e) {
            System.out.println("Delete domain " + e.getMessage());
        }
        Domain domain = getDomain(name);
        if (domain != null) {
            return false;
        }
        try {
            domain = new Domain(name, authorUuid, profile.fetchUserId());
            domainRepo.save(domain);

        } catch(Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public void deleteDomain(Domain domain)
    {
        domainRepo.delete(domain);
    }

    @Override
    public boolean
    updateDomain(String name, DomainForm form, ArticleDTO pend, ProfileDTO profile)
    {
        Domain domain = getDomain(name);
        if (domain == null) {
            s_log.info("Can't find domain name " + name);
            return false;
        }
        domain.setAuthorId(profile.fetchUserId());
        ObjectId oid = pend.fetchUploadImg("mainImg");
        if (oid != null) {
            domain.setLoginMainImg(oid.name());
        }
        oid = pend.fetchUploadImg("imageRec");
        if (oid != null) {
            domain.setLoginFootImg(oid.name());
        }
        String field = form.getLoginHdr();
        if (field != null) {
            domain.setLoginHdr(Util.toRawByte(field, 128));
        }
        field = form.getLoginTxt();
        if (field != null) {
            domain.setLoginTxt(Util.toRawByte(field, 512));
        }
        field = form.getFootHdr();
        if (field != null) {
            domain.setFootHdr(Util.toRawByte(field, 64));
        }
        field = form.getFootTxt();
        if (field != null) {
            domain.setFootTxt(Util.toRawByte(field, 512));
        }
        try {
            domainRepo.save(domain);

        } catch(Exception e) {
            return false;
        }
        return true;
    }

    /**
     * Shared code for public/user/admin startup.
     */
    public void fillDomainInfo(StartupResponse resp, String name, ProfileDTO prof,
            Map<String, String> artUuids, Map<String, String> authorUuids)
    {
        if (name == null) {
            name = prof.getDomain();
        }
        Domain domain = domainRepo.findByDomain(name);
        if (domain == null) {
            return;
        }
        String authorUuid = domain.getAuthorUuid();
        List<ArticleRankDTO> artRanks = articleSvc.getArtRankByAuthor(authorUuid);

        resp.setDomainUuid(authorUuid);
        resp.setDomain(new DomainDTO(domain));
        resp.setArtRanks(artRanks);
        authorUuids.put(authorUuid, authorUuid);

        // List<ArticleDTO> articles = articleSvc.getArticlesByUser(authorUuid);
        // resp.setArticles(articles);
    }

    @Override
    public void
    fillLoginResponse(LoginResponse resp, ProfileDTO profile)
    {
    }

    /**
     * Startup response when access through public url without account.
     */
    @Override
    public void fillStartupDomain(StartupResponse resp, String name, ProfileDTO prof)
    {
        Map<String, String> artUuids = new HashMap<>();
        Map<String, String> authorUuids = new HashMap<>();

        fillDomainInfo(resp, name, prof, artUuids, authorUuids);
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
        // Get all public articles.
        //
        List<String> articleUuids = new LinkedList<>();
        for (Map.Entry<String, String> entry : artUuids.entrySet()) {
            articleUuids.add(entry.getKey());
        }
        List<ArticleRankDTO> rankList = articleSvc.getArticleRank(articleUuids);
        resp.setArtRanks(rankList);
        for (ArticleRankDTO rank : rankList) {
            String authorUuid = rank.getAuthorUuid();
            if (authorUuids.get(authorUuid) == null) {
                authorUuids.put(authorUuid, authorUuid);
            }
        }

        /*
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
        */

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
        fillAuthorTags(resp, profile, uuids);
    }

    /**
     * Get domain data for a domain through public URL.
     */
    @Override
    public void fillDomainData(StartupResponse resp, UuidForm uuids)
    {
        String[] author = { resp.getDomainUuid() };
        uuids.setUuids(author);

        List<ArticleRankDTO> artRanks = articleSvc.getArticleRank(uuids);
        List<ArticleDTO> articles = new LinkedList<>();

        resp.setArticles(articles);
        resp.setArtRanks(artRanks);
    }

    /**
     * Startup response when login with a valid user account.
     */
    @Override
    public void fillStartupAccount(StartupResponse resp, String name, ProfileDTO prof)
    {
        Map<String, String> artUuids = new HashMap<>();
        Map<String, String> authorUuids = new HashMap<>();

        fillDomainInfo(resp, name, prof, artUuids, authorUuids);

        // For now, get all profiles from the database.
        //
        resp.setLinkedUsers(profileSvc.getProfileFromRaw(null));
        fillLoginResponse(resp.getUserDTO(), prof);

        List<String> uuids = resp.getAllUserUuids();
        fillAuthorTags(resp, prof, uuids);

        String publicUuid = com.tvntd.util.Constants.PublicUuid;
        resp.setPublicTags(artTagSvc.getUserTagsDTO(publicUuid));
        resp.setArticles(articleSvc.getArticlesByUser(uuids));
    }

    private void
    fillAuthorTags(StartupResponse resp, ProfileDTO profile, List<String> userUuids)
    {
        String myUuid = profile.getUserUuid();
        List<AuthorDTO> authorList = new LinkedList<>();
        AuthorDTO author = authorSvc.getAuthorDTO(myUuid);

        if (author != null) {
            authorList.add(author);
        }
        if (userUuids == null) {
            userUuids = resp.getAllUserUuids();
            if (userUuids == null) {
                resp.setAuthors(authorList);
                return;
            }
        }
        for (String uuid : userUuids) {
            if (!myUuid.equals(uuid)) {
                author = authorSvc.getAuthorDTO(uuid);
                if (author != null) {
                    authorList.add(author);
                }
            }
        }
        resp.setAuthors(authorList);
    }
}
