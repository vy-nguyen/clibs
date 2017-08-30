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

import java.io.UnsupportedEncodingException;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AdsPostRepo;
import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.AuthorRepo;
import com.tvntd.dao.AuthorTagRepo;
import com.tvntd.forms.AdsForm;
import com.tvntd.models.AdsPost;
import com.tvntd.models.ArtTag;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Author;
import com.tvntd.models.AuthorTag;
import com.tvntd.service.api.IAdsPostService;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.ICommentService;
import com.tvntd.util.Util;

@Service
@Transactional
public class AdsPostService implements IAdsPostService
{
    static private Logger s_log = LoggerFactory.getLogger(AdsPostService.class);

    @Autowired
    protected AdsPostRepo  adsRepo;

    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected ICommentService commentSvc;

    @Autowired
    private IArtTagService artTagSvc;

    @Autowired
    private AuthorRepo authorRepo;

    @Autowired
    private AuthorTagRepo authorTagRepo;

    /**
     * Common static methods.
     */
    public static void applyPostAds(AdsForm form, AdsPostDTO adsDTO)
    {
        s_log.info("Apply ad form " + form.getBusName());
        AdsPost ads = adsDTO.fetchAdPost();
        try {
            ads.setBusName(form.getBusName().getBytes("UTF-8"));
            ads.setBusInfo(form.getBusInfo().getBytes("UTF-8"));
            ads.setBusCat(form.getBusCat().getBytes("UTF-8"));
            ads.setBusWeb(form.getBusWeb().getBytes("UTF-8"));
            ads.setBusEmail(form.getBusEmail().getBytes("UTF-8"));
            ads.setBusPhone(form.getBusPhone().getBytes("UTF-8"));
            ads.setBusStreet(form.getBusStreet().getBytes("UTF-8"));
            ads.setBusCity(form.getBusCity().getBytes("UTF-8"));
            ads.setBusState(form.getBusState().getBytes("UTF-8"));
            ads.setBusZip(form.getBusZip().getBytes("UTF-8"));
            ads.setBusHour(form.getBusHour().getBytes("UTF-8"));
            ads.setBusDesc(form.getBusDesc().getBytes("UTF-8"));

        } catch(UnsupportedEncodingException e) {
            s_log.info(e.getMessage());
        }
    }

    @Override
    public List<AdsPost> getAdsPostByAuthor(String authorUuid) {
        return adsRepo.findAllByAuthorUuid(authorUuid);
    }

    @Override
    public List<AdsPostDTO> getAdsPostByUuids(String[] adsUuids)
    {
        List<AdsPostDTO> result = new LinkedList<>();

        if (adsUuids != null) {
            for (String u : adsUuids) {
                AdsPostDTO ads = getAdsPostDTO(u);
                if (ads != null) {
                    result.add(ads);
                }
            }
        }
        return result;
    }

    @Override
    public void deleteAnnonAds(String uuid)
    {
        List<AdsPost> ads = getAdsPostByAuthor(uuid);
        System.out.println("Delete ads " + ads.size());
        if (ads != null) {
            for (AdsPost a : ads) {
                System.out.println("Delete " + a.getBusName());
                deleteAds(a);
            }
        }
    }

    @Override
    public AdsPostDTO getAdsPostDTO(String uuid)
    {
        AdsPost ads = adsRepo.findByArticleUuid(uuid);
        if (ads != null) {
            ArticleRank rank = artRankRepo.findByArticleUuid(uuid);
            if (rank != null && rank.getArtTag() == null) {
                rank.setHasArticle(true);
                rank.setArtTag(ArtTag.ADS);
                artRankRepo.save(rank);
            }
            AdsPostDTO result = new AdsPostDTO(ads, new ArticleRankDTO(rank));

            result.convertUTF();
            return result;
        }
        return null;
    }

    @Override
    public AdsPost getAdsPost(String uuid)
    {
        return adsRepo.findByArticleUuid(uuid);
    }

    @Override
    public void saveAds(AdsPostDTO ads)
    {
        adsRepo.save(ads.fetchAdPost());
    }

    @Override
    public void deleteAds(AdsPost ads)
    {
        String uuid = ads.getArticleUuid();
        ArticleRank rank = artRankRepo.findByArticleUuid(uuid);

        if (rank != null) {
            artRankRepo.delete(rank);
        }
        artTagSvc.deletePublicTagPost(ads.getBusCat(), uuid);
        commentSvc.deleteComment(uuid);
        adsRepo.delete(ads);
    }

    @Override
    public AdsPost deleteAds(String uuid)
    {
        AdsPost ads = adsRepo.findByArticleUuid(uuid);
        ArticleRank rank = artRankRepo.findByArticleUuid(uuid);

        if (ads != null) {
            s_log.info("Delete ad " + uuid);
            adsRepo.delete(ads);
        }
        if (rank != null) {
            artRankRepo.delete(rank);
        }
        return ads;
    }

    @Override
    public void auditAdsTable()
    {
        List<AdsPost> ads = adsRepo.findAll();

        for (AdsPost ad : ads) {
            String authorUuid = ad.getAuthorUuid();
            String articleUuid = ad.getArticleUuid();
            ArticleRank rank = artRankRepo.findByArticleUuid(articleUuid);

            if (rank != null) {
                continue;
            }
            Author author = authorRepo.findByAuthorUuid(authorUuid);
            if (author == null) {
                author = new Author(authorUuid, ad.getArticleUuid());
            }
            String busCat = Util.fromRawByte(ad.getBusCat());
            AuthorTag tag = author.addTag(busCat, 0L, false);

            rank = new ArticleRank(tag, ad);
            artRankRepo.save(rank);
            if (tag.isNeedSave() == true) {
                authorTagRepo.save(tag);
            }
        }
    }
}
