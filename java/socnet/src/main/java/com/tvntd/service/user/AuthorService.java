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

import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ArtBriefRepo;
import com.tvntd.dao.AuthorRepo;
import com.tvntd.dao.AuthorTagRepo;
import com.tvntd.dao.AuthorTagRepo.AuthorTagDTO;
import com.tvntd.dao.AuthorTagRepo.AuthorTagRespDTO;
import com.tvntd.models.ArtAds;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.Author;
import com.tvntd.models.AuthorTag;
import com.tvntd.service.api.IAnnonService.AnnonUserDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Service
@Transactional
@EnableCaching
public class AuthorService implements IAuthorService
{
    static private Logger s_log = LoggerFactory.getLogger(AuthorService.class);

    @Autowired
    protected AuthorRepo authorRepo;

    @Autowired
    protected AuthorTagRepo authorTagRepo;

    @Autowired
    protected ArtBriefRepo artBriefRepo;

    @Override
    public Author getAuthor(String uuid)
    {
        Author author = authorRepo.findByAuthorUuid(uuid);
        if (author != null) {
            author.setAuthorTags(authorTagRepo.findAllByAuthorUuid(uuid));
        }
        return author;
    }

    @Override
    public AuthorDTO getAuthorDTO(String uuid)
    {
        Author author = getAuthor(uuid);
        if (author != null) {
            return new AuthorDTO(author);
        }
        return null;
    }

    @Override
    public AuthorTagRespDTO getAuthorTag(String uuid)
    {
        List<AuthorTag> raw = authorTagRepo.findAllByAuthorUuid(uuid);
        if (raw != null) {
            List<AuthorTagDTO> tags = new LinkedList<>();

            for (AuthorTag t : raw) {
                tags.add(new AuthorTagDTO(t));
            }
            return new AuthorTagRespDTO(uuid, tags);
        }
        return null;
    }

    @Override
    public void addFavoriteArticle(Author author, String articleUuid)
    {
        author.addFavoriteArticle(articleUuid);
    }

    @Override
    public void removeFavoriteArticle(Author author, String articleUuid)
    {
    }

    @Override
    public void addTimeLineArticle(Author author, String articleUuid)
    {
        author.addTimeLineArticle(articleUuid);
    }

    @Override
    public void removeTimeLineArticle(Author author, String articleUuid)
    {
    }

    @Override
    public List<Author> getAuthors(List<String> uuids)
    {
        List<Author> result = new LinkedList<>();

        for (String uid : uuids) {
            Author author = getAuthor(uid);
            if (author != null) {
                result.add(author);
            }
        }
        return result;
    }

    /**
     * Get list of authors for a news feed.
     */
    @Override
    public List<AuthorDTO> getAuthorList(ProfileDTO profile)
    {
        List<AuthorDTO> result = new LinkedList<>();
        List<String> uuids = profile.fetchNewsFeed();

        Author author = getAuthor(profile.getUserUuid());
        if (author != null) {
            result.add(new AuthorDTO(author));
        }
        if (uuids != null) {
            for (String uid : uuids) {
                if (AuthorDTO.isInList(result, uid) == true) {
                    continue;
                }
                author = getAuthor(uid);
                if (author != null) {
                    result.add(new AuthorDTO(author));
                }
            }
        }
        List<String> list = profile.getConnectList();
        if (list != null) {
            for (String uid : list) {
                if (!AuthorDTO.isInList(result, uid)) {
                    result.add(new AuthorDTO(uid.toString()));
                }
            }
        }
        list = profile.getFollowList();
        if (list != null) {
            for (String uid : profile.getFollowList()) {
                if (!AuthorDTO.isInList(result, uid)) {
                    result.add(new AuthorDTO(uid.toString()));
                }
            }
        }
        return result;
    }

    @Override
    public void saveAuthor(Author author)
    {
        List<AuthorTag> tags = author.getAuthorTags();
        for (AuthorTag t : tags) {
            saveAuthorTag(t);
        }
        authorRepo.save(author);
    }

    protected void saveAuthorTag(AuthorTag tag)
    {
        if (tag.isNeedSave()) {
            authorTagRepo.save(tag);
            tag.setNeedSave(false);
        }
    }

    @Override
    public void saveAuthorTag(AuthorTagDTO tag)
    {
        AuthorTag t = tag.fetchAuthorTag();
        authorTagRepo.save(t);
        t.setNeedSave(false);
    }

    @Override
    public void deleteAuthor(String uuid)
    {
        Author author = getAuthor(uuid);
        List<AuthorTag> tags = author.getAuthorTags();

        for (AuthorTag t : tags) {
            authorTagRepo.delete(t);
        }
        authorRepo.delete(author);
    }

    @Override
    public void deleteAuthorTag(AuthorTagDTO tag)
    {
        authorTagRepo.delete(tag.fetchAuthorTag());
    }

    public AuthorTag
    updateAuthorTag(Author author, String tagName, Long order, boolean isFav)
    {
        AuthorTag tag = author.addTag(tagName, order, isFav);
        if (tag.isNeedSave() == true) {
            s_log.debug("Save author tag " + tag.getTag());
            saveAuthorTag(tag);
        }
        return tag;
    }

    @Override
    public ArticleBrief createProductRank(ArtProduct product)
    {
        String authorUuid = product.getAuthorUuid();
        Author author = authorRepo.findByAuthorUuid(authorUuid);
        if (author == null) {
            author = new Author(authorUuid, product.getArticleUuid());
        }
        updateAuthorTag(author, Util.fromRawByte(product.getProdCat()), 0L, false);

        ArticleBrief rank = new ArticleBrief(product);
        artBriefRepo.save(rank);
        return rank;
    }

    @Override
    public ArticleBrief createAdsRank(ArtAds ads, AnnonUserDTO user)
    {
        String authorUuid = ads.getAuthorUuid();

        if (user != null) {
            // This is annonymous user.
            //
            authorUuid = com.tvntd.util.Constants.PublicUuid;
        }
        System.out.println("Create with author uuid " + authorUuid);
        Author author = authorRepo.findByAuthorUuid(authorUuid);
        if (author == null) {
            author = new Author(authorUuid, ads.getArticleUuid());
        }
        updateAuthorTag(author, Util.fromRawByte(ads.getBusCat()), 0L, false);

        ArticleBrief rank = new ArticleBrief(ads);
        artBriefRepo.save(rank);
        return rank;
    }
}
