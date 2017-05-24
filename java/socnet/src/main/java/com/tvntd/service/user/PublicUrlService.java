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

import com.tvntd.dao.PublicUrlRepo;
import com.tvntd.key.HashKey;
import com.tvntd.models.PublicUrl;
import com.tvntd.service.api.IPublicUrlService;
import com.tvntd.util.Util;

@Service
@Transactional
public class PublicUrlService implements IPublicUrlService
{
    @Autowired
    protected PublicUrlRepo urlRepo;

    @Override
    public PublicUrl getPublicUrl(String tag, String title)
    {
        String asciiTag = Util.utf8ToUrlString(tag);
        String asciiTitle = Util.utf8ToUrlString(title);

        System.out.println("Get Tag " + asciiTag + " title " + asciiTitle + ", key " +
                HashKey.toSha1Key(asciiTag, asciiTitle));

        return urlRepo.findByUrlOid(HashKey.toSha1Key(asciiTag, asciiTitle));
    }

    @Override
    public PublicUrl
    savePublicUrl(String author, String article, String tag, String title)
    {
        String asciiTag = Util.utf8ToUrlString(tag);
        String asciiTitle = Util.utf8ToUrlString(title);
        PublicUrl url =
            new PublicUrl(HashKey.toSha1Key(asciiTag, asciiTitle), author, article);

        System.out.println("Save Tag " + asciiTag + " title " + asciiTitle + ", key " +
                url.getUrlOid());
        urlRepo.save(url);
        return url;
    }

    @Override
    public void deletePublicUrl(PublicUrl url)
    {
        urlRepo.delete(url);
    }

    @Override
    public void deletePublicUrl(String tag, String title)
    {
        String asciiTag = Util.utf8ToUrlString(tag);
        String asciiTitle = Util.utf8ToUrlString(title);
        urlRepo.delete(new PublicUrl(HashKey.toSha1Key(asciiTag, asciiTitle), null, null));
    }

    @Override
    public List<PublicUrl> getUserPublicUrl(String authorUuid)
    {
        return urlRepo.findAllByAuthorUuid(authorUuid);
    }
}
