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
import java.util.UUID;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AuthorRepo;
import com.tvntd.models.Author;
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

    @Override
    public Author getAuthor(UUID uuid)
    {
        return authorRepo.findByAuthorUuid(uuid.toString());
    }

    @Override
    public Author getAuthor(String uuid)
    {
        return authorRepo.findByAuthorUuid(uuid);
    }

    @Override
    public void addFavoriteArticle(Author author, UUID articleUuid)
    {
        author.addFavoriteArticle(articleUuid);
    }

    @Override
    public void removeFavoriteArticle(Author author, UUID articleUuid)
    {
    }

    @Override
    public void addTimeLineArticle(Author author, UUID articleUuid)
    {
        author.addTimeLineArticle(articleUuid);
    }

    @Override
    public void removeTimeLineArticle(Author author, UUID articleUuid)
    {
    }

    @Override
    public List<Author> getAuthors(List<UUID> uuids)
    {
        List<Author> result = new LinkedList<>();

        for (UUID uid : uuids) {
            Author author = authorRepo.findByAuthorUuid(uid.toString());
            if (author != null) {
                result.add(author);
            }
        }
        return result;
    }

    @Override
    public List<AuthorDTO> getAuthorList(ProfileDTO profile)
    {
        List<AuthorDTO> result = new LinkedList<>();
        List<UUID> uuids = profile.fetchNewsFeed();

        for (UUID uid : uuids) {
            Author author = authorRepo.findByAuthorUuid(uid.toString());
            if (author != null) {
                result.add(new AuthorDTO(author));
                s_log.info("Debug author: " + author.toString());
            }
        }
        for (UUID uid : profile.getConnectList()) {
            result.add(new AuthorDTO(uid.toString()));
        }
        for (UUID uid : profile.getFollowList()) {
            result.add(new AuthorDTO(uid.toString()));
        }
        return result;
    }

    @Override
    public void saveAuthor(Author author)
    {
        authorRepo.save(author);
    }

    @Override
    public void deleteAuthor(String uuid)
    {
        authorRepo.delete(uuid);
    }
}
