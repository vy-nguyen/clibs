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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.dao.ArtTagRepo;
import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.models.ArtTag;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IAuthorService;

@Service
@Transactional
public class ArtTagService implements IArtTagService
{
    static private Logger s_log = LoggerFactory.getLogger(ArtTagService.class);

    @Autowired
    protected ArtTagRepo artTagRepo;

    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected IAuthorService authorSvc;

    @Override
    public void saveTag(ArtTagDTO tag)
    {
        artTagRepo.save(tag.fetchArtTag());
    }

    @Override
    public ArtTagDTO getTag(String tag, String uuid)
    {
        String key = ArtTagDTO.makeTagOidKey(tag, uuid);
        if (key != null) {
            ArtTag artTag = artTagRepo.findByTagOid(key);
            if (tag != null) {
                return new ArtTagDTO(artTag);
            }
        }
        return null;
    }

    @Override
    public List<ArtTagDTO> getUserTag(String uuid)
    {
        return null;
    }
}
