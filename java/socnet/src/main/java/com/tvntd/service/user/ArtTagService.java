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

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.dao.ArtTagRepo;
import com.tvntd.forms.TagForm.TagRank;
import com.tvntd.models.ArtTag;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.util.Constants;

@Service
@Transactional
public class ArtTagService implements IArtTagService
{
    static private Logger s_log = LoggerFactory.getLogger(ArtTagService.class);

    @Autowired
    protected ArtTagRepo artTagRepo;

    @Autowired
    protected IAuthorService authorSvc;

    public static List<ArtTagDTO>
    makeSubTags(List<ArtTagDTO> children, String userUuid)
    {
        List<ArtTagDTO> result = new LinkedList<>();
        Map<String, ArtTagDTO> map = new HashMap<>();

        for (ArtTagDTO tag : children) {
            map.put(tag.getTagName(), tag);
            String parent = tag.getParentTag();
            if (parent != null && parent.isEmpty()) {
                tag.setParentTag(null);
            }
            if (userUuid != null) {
                tag.setUserUuid(userUuid);
            }
        }
        for (ArtTagDTO tag : children) {
            ArtTagDTO parent = map.get(tag.getParentTag());

            if (parent != null) {
                parent.addSubTag(tag);
            }
        }
        for (ArtTagDTO tag : children) {
            String key = tag.getParentTag();
            if (map.get(key) != null) {
                map.remove(tag.getTagName());
            }
        }
        for (Map.Entry<String, ArtTagDTO> entry : map.entrySet()) {
            result.add(entry.getValue());
        }
        map.clear();
        return result;
    }

    public static Map<String, TagRank> fixupTagList(TagRank[] in)
    {
        Map<String, TagRank> dict = new HashMap<>();

        if (in == null) {
            return dict;
        }
        List<TagRank> top = new LinkedList<>();
        Map<String, List<TagRank>> levels = new HashMap<>();

        for (TagRank r : in) {
            dict.put(r.getTagName(), r);
            String parent = r.getParent();

            if (parent == null) {
                top.add(r);
            } else {
                List<TagRank> siblings = levels.get(parent);
                if (siblings == null) {
                    siblings = new LinkedList<>();
                    levels.put(parent, siblings);
                }
                siblings.add(r);
            }
        }
        levels.put("_root", top);
        for (Map.Entry<String, List<TagRank>> entry : levels.entrySet()) {
            List<TagRank> siblings = entry.getValue();
            Collections.sort(siblings);
            Long order = 0L;
            for (TagRank r : siblings) {
                r.setRank(++order);
            }
        }
        levels.clear();
        return dict;
    }

    @Override
    public void saveTag(ArtTagDTO tag)
    {
        artTagRepo.save(tag.fetchArtTag());
        List<ArtTagDTO> sub = tag.getSubTags();

        if (sub != null) {
            for (ArtTagDTO t : sub) {
                saveTag(t);
            }
        }
    }

    @Override
    public void saveTag(String uuid, String tag, String parent, Long rank)
    {
        artTagRepo.save(new ArtTag(uuid, tag, parent, rank));
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
    public ArtTagDTO getTag(byte[] tag, String uuid)
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
    public List<ArtTagDTO> getUserTags(String uuid)
    {
        List<ArtTag> all = artTagRepo.findAllByUserUuid(uuid);
        System.out.println("Return tag " + all);
        if (all != null) {
            List<ArtTagDTO> flat = new LinkedList<>();
            for (ArtTag art : all) {
                flat.add(new ArtTagDTO(art));
            }
            return makeSubTags(flat, null);
        }
        return null;
    }

    @Override
    public ArtTagList getUserTagsDTO(String uuid)
    {
        List<ArtTagDTO> tags = new LinkedList<>();
        List<ArtTag> all = artTagRepo.findAllByUserUuid(uuid);

        for (ArtTag t : all) {
            tags.add(new ArtTagDTO(t));
        }
        return new ArtTagList(tags, null);
    }

    @Override
    public void deleteTag(String tag, String uuid)
    {
        String key = ArtTagDTO.makeTagOidKey(tag, uuid);
        if (key != null) {
            artTagRepo.delete(key);
        }
    }

    @Override
    public synchronized ArtTagDTO addPublicTagPost(String pubTag, String uuid)
    {
        if (pubTag == null || uuid == null) {
            return null;
        }
        ArtTagDTO pub = getTag(pubTag, Constants.PublicUuid);
        if (pub != null) {
            pub.addArtRank(uuid);
            saveTag(pub);
            return pub;
        }
        s_log.info("Public tag " + pubTag + " doesn't exist");
        return null;
    }

    @Override
    public synchronized void deletePublicTagPost(String pubTag, String uuid)
    {
        if (pubTag == null) {
            return;
        }
        ArtTagDTO pub = getTag(pubTag, Constants.PublicUuid);
        if (pub != null) {
            pub.removeArtRank(uuid);
            saveTag(pub);
        } else {
            s_log.info("Public tag " + pubTag + " doesn't exist");
        }
    }

    @Override
    public synchronized void deletePublicTagPost(byte[] pubTag, String uuid)
    {
        if (pubTag == null) {
            return;
        }
        ArtTagDTO pub = getTag(pubTag, Constants.PublicUuid);
        if (pub != null) {
            pub.removeArtRank(uuid);
            saveTag(pub);
        } else {
            s_log.info("Public tag " + pubTag + " doesn't exist");
        }
    }
}
