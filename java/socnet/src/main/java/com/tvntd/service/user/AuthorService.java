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

import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.ArticleRepository;
import com.tvntd.dao.AuthorRepo;
import com.tvntd.forms.ArticleForm;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Author;
import com.tvntd.models.AuthorTag;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IProfileService.ProfileDTO;

@Service
@Transactional
@EnableCaching
public class AuthorService implements IAuthorService
{
    static private Logger s_log = LoggerFactory.getLogger(AuthorService.class);

    @Autowired
    protected AuthorRepo authorRepo;

    @Autowired
    protected ArticleRankRepo rankRepo;

    @Autowired
    protected ArticleRepository articleRepo;

    @Override
    public Author getAuthor(String uuid)
    {
        return authorRepo.findByAuthorUuid(uuid);
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
            Author author = authorRepo.findByAuthorUuid(uid);
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

        Author author = authorRepo.findByAuthorUuid(profile.getUserUuid().toString());
        if (author != null) {
            result.add(new AuthorDTO(author));
        }
        for (String uid : uuids) {
            author = authorRepo.findByAuthorUuid(uid.toString());
            if (author != null) {
                result.add(new AuthorDTO(author));
            }
        }
        for (String uid : profile.getConnectList()) {
            result.add(new AuthorDTO(uid.toString()));
        }
        for (String uid : profile.getFollowList()) {
            result.add(new AuthorDTO(uid.toString()));
        }
        return result;
    }

    @Override
    public void saveAuthor(Author author, boolean flush)
    {
        if (flush == false) {
            authorRepo.save(author);
        } else {
            authorRepo.saveAndFlush(author);
        }
    }

    @Override
    public void deleteAuthor(String uuid)
    {
        authorRepo.delete(uuid);
    }

    @Override
    public Author updateAuthor(ProfileDTO me, ArticleForm form, ArticleRankDTO rankDto)
    {
        String artUuid = form.getArticleUuid();
        String authorUuid = me.getUserUuid().toString();
        Author author = authorRepo.findByAuthorUuid(authorUuid);

        if (author == null || artUuid == null || artUuid.isEmpty()) {
            return null;
        }
        AuthorTag tag = updateAuthorTag(author, form.getTagName(),
                            form.getTagRank(), form.isFavorite());
        ArticleRank rank = rankRepo.findByArticleUuid(artUuid);
        if (rank == null) {
            form.setUserUuid(authorUuid);
            Article article = articleRepo.findByArticleUuid(artUuid);

            if (article == null) {
                return null;
            }
            rank = new ArticleRank(tag, article);
        } else {
            rank.updateFromUser(form);
        }
        rankRepo.save(rank);
        rankDto.setRank(rank, tag);
        return author;
    }

    public AuthorTag
    updateAuthorTag(Author author, String tagName, Long order, boolean isFav)
    {
        AuthorTag tag = author.addTag(tagName, order, isFav);
        if (author.isNeedSave() == true) {
            authorRepo.save(author);
        }
        s_log.debug("Save author tag " + author.isNeedSave());
        return tag;
    }

    public ArticleRank createArticleRank(Article article, String tagName)
    {
        String authorUuid = article.getAuthorUuid();
        Author author = authorRepo.findByAuthorUuid(authorUuid);
        if (author == null) {
            author = new Author(authorUuid, article.getArticleUuid());
        }
        AuthorTag tag = updateAuthorTag(author, tagName, 0L, false);
        ArticleRank rank = new ArticleRank(tag, article);

        rankRepo.save(rank);
        return rank;
    }
}
