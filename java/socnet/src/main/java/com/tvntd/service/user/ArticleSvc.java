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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AdsPostRepo;
import com.tvntd.dao.ArtAdsRepo;
import com.tvntd.dao.ArtBriefRepo;
import com.tvntd.dao.ArtProductRepo;
import com.tvntd.dao.ArticleAttrRepo;
import com.tvntd.dao.ArticleBaseRepo;
import com.tvntd.dao.ArticlePostRepo;
import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.ArticleRepository;
import com.tvntd.dao.ProductRepository;
import com.tvntd.dao.ProfileRepository;
import com.tvntd.forms.PostForm;
import com.tvntd.models.AdsPost;
import com.tvntd.models.ArtAds;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.ArticlePost;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Product;
import com.tvntd.service.api.ArtAdsDTO;
import com.tvntd.service.api.ArtProductDTO;
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
    protected ArtAdsRepo artAdsRepo;

    @Autowired
    protected ArtProductRepo artProdRepo;

    // Will depreicate these tables.
    //
    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected ArticleRepository artRepo;

    @Autowired
    protected AdsPostRepo adsRepo;

    @Autowired
    protected ProductRepository prodRepo;

    @Autowired
    protected ProfileRepository profileRepo;

    // Query
    //
    // ArticlePost for posts in blog page.
    //
    @Override
    public ArticlePostDTO getArticleDTO(String articleUuid)
    {
        ArticlePost art = artPostRepo.findByArticleUuid(articleUuid);
        if (art == null) {
            return null;
        }
        return new ArticlePostDTO(art);
    }

    protected List<ArticlePostDTO> convertArtPost(List<ArticlePost> arts)
    {
        List<ArticlePostDTO> result = new LinkedList<>();

        for (ArticlePost a : arts) {
            result.add(new ArticlePostDTO(a));
        }
        return result;
    }

    @Override
    public List<ArticlePostDTO> getArticleDTO(List<String> artUuids) {
        return convertArtPost(artPostRepo.findByArticleUuidIn(artUuids));
    }

    @Override
    public List<ArticlePostDTO> getArticleDTOByAuthor(String authorUuid) {
        return convertArtPost(artPostRepo.findByAuthorUuid(authorUuid));
    }

    @Override
    public List<ArticlePostDTO> getArticleDTOByAuthor(List<String> authorUuid) {
        return convertArtPost(artPostRepo.findByAuthorUuidIn(authorUuid));
    }

    // ArticleBrief for ArticlePost summary.
    //
    @Override
    public ArticleBriefDTO getArticleBriefDTO(String uuid)
    {
        ArticleBrief art = artBriefRepo.findByArticleUuid(uuid);
        if (art == null) {
            return null;
        }
        return new ArticleBriefDTO(art);
    }

    protected List<ArticleBriefDTO> convertArtBrief(List<ArticleBrief> raw)
    {
        List<ArticleBriefDTO> result = new LinkedList<>();

        if (raw != null) {
            for (ArticleBrief r : raw) {
                result.add(new ArticleBriefDTO(r));
            }
        }
        return result;
    }

    @Override
    public List<ArticleBriefDTO> getArticleBriefDTOByAuthor(String authorUuid) {
        return convertArtBrief(artBriefRepo.findByAuthorUuid(authorUuid));
    }

    @Override
    public List<ArticleBriefDTO> getArticleBriefDTO(List<String> artUuids) {
        return convertArtBrief(artBriefRepo.findByArticleUuidIn(artUuids));

    }

    @Override
    public List<ArticleBriefDTO> getArticleBriefDTOByAuthor(List<String> authorUuids) {
        return convertArtBrief(artBriefRepo.findByAuthorUuidIn(authorUuids));
    }

    // ArtProduct for products in e-store page.
    //
    protected List<ArtProductDTO> convertProductDTO(List<ArtProduct> prods)
    {
        List<ArtProductDTO> result = new LinkedList<>();

        for (ArtProduct p : prods) {
            result.add(new ArtProductDTO(p));
        }
        return result;
    }

    @Override
    public ArtProductDTO getArtProductDTO(String productUuid)
    {
        ArtProduct prod = artProdRepo.findByArticleUuid(productUuid);

        if (prod != null) {
            return new ArtProductDTO(prod);
        }
        return null;
    }

    @Override
    public List<ArtProductDTO> getArtProductDTO(List<String> productUuids) {
        return convertProductDTO(artProdRepo.findByArticleUuidIn(productUuids));
    }

    @Override
    public List<ArtProductDTO> getArtProductDTOByOwner(String authorUuid) {
        return convertProductDTO(artProdRepo.findByAuthorUuid(authorUuid));
    }

    @Override
    public List<ArtProductDTO> getArtProductDTOByOnwer(List<String> ownerUuids) {
        return convertProductDTO(artProdRepo.findByAuthorUuidIn(ownerUuids));
    }

    // ArtAds for ads in ad page.
    //
    protected List<ArtAdsDTO> convertArticleAds(List<ArtAds> artList)
    {
        List<ArtAdsDTO> result = new LinkedList<>();

        for (ArtAds a : artList) {
            result.add(new ArtAdsDTO(a));
        }
        return result;
    }

    @Override
    public ArtAdsDTO getArtAdsDTO(String adUuid)
    {
        ArtAds ads = artAdsRepo.findByArticleUuid(adUuid);

        if (ads != null) {
            return new ArtAdsDTO(ads);
        }
        return null;
    }

    @Override
    public List<ArtAdsDTO> getArtAdsDTO(List<String> adUuids) {
        return convertArticleAds(artAdsRepo.findByArticleUuidIn(adUuids));
    }

    @Override
    public List<ArtAdsDTO> getArtAdsDTOByOwner(String ownerUuid) {
        return convertArticleAds(artAdsRepo.findByAuthorUuid(ownerUuid));
    }

    @Override
    public List<ArtAdsDTO> getArtAdsDTOByOwner(List<String> ownerUuids) {
        return convertArticleAds(artAdsRepo.findByAuthorUuidIn(ownerUuids));
    }

    // Save/update ArticleBrief/ArticlePost
    //
    @Override
    public void saveArticlePost(ArticlePostDTO art) {
        artPostRepo.save(art.fetchArticlePost());
    }

    @Override
    public void saveArticleBrief(ArticleBriefDTO rank) {
        artBriefRepo.save(rank.fetchArtRank());
    }
  
    // Save/update list of ArticlePost/ArticleBrief.
    //
    @Override
    public void saveArticlePost(List<ArticlePostDTO> arts)
    {
        for (ArticlePostDTO a : arts) {
            artPostRepo.save(a.fetchArticlePost());
        }
    }

    @Override
    public void saveArticleBrief(List<ArticleBriefDTO> ranks)
    {
        for (ArticleBriefDTO r : ranks) {
            artBriefRepo.save(r.fetchArtRank());
        }
    }

    // Save/update Ads
    @Override
    public void saveArtAds(ArtAdsDTO ads) {
        artAdsRepo.save(ads.fetchAds());
    }

    @Override
    public void saveArtAds(List<ArtAdsDTO> adsList)
    {
        for (ArtAdsDTO ads : adsList) {
            artAdsRepo.save(ads.fetchAds());
        }
    }

    @Override
    public void saveArtProduct(ArtProductDTO prod) {
        artProdRepo.save(prod.fetchProduct());
    }

    @Override
    public void saveArtProduct(List<ArtProductDTO> prodList)
    {
        for (ArtProductDTO p : prodList) {
            artProdRepo.save(p.fetchProduct());
        }
    }

    // Save article post
    @Override
    public void savePost(PostForm form, ArticleBriefDTO artBrief,
            ProfileDTO profile, boolean publish, boolean update)
    {
    }

    // Delete
    //
    @Override
    public void deleteArticlePost(ArticlePostDTO art) {
        artPostRepo.delete(art.fetchArticlePost());
    }

    @Override
    public void deleteArticlePost(List<ArticlePostDTO> arts)
    {
        for (ArticlePostDTO a : arts) {
            deleteArticlePost(a);
        }
    }

    @Override
    public void deleteArticleBrief(ArticleBriefDTO rank) {
        artBriefRepo.delete(rank.fetchArtRank());
    }

    @Override
    public void deleteArticleBrief(List<ArticleBriefDTO> ranks)
    {
        for (ArticleBriefDTO r : ranks) {
            deleteArticleBrief(r);
        }
    }

    @Override
    public void deleteArtAds(ArtAdsDTO ads) {
        artAdsRepo.delete(ads.fetchAds());
    }

    @Override
    public void deleteArtAds(List<ArtAdsDTO> adsList)
    {
        for (ArtAdsDTO ads : adsList) {
            artAdsRepo.delete(ads.fetchAds());
        }
    }

    @Override
    public void deleteArtProduct(ArtProductDTO prod) {
        artProdRepo.delete(prod.fetchProduct());
    }

    @Override
    public void deleteArtProduct(List<ArtProductDTO> prodList)
    {
        for (ArtProductDTO p : prodList) {
            artProdRepo.delete(p.fetchProduct());
        }
    }

    @Override
    public void auditArticleTable()
    {
        Map<String, String> uuids = new HashMap<>();
        Map<String, String> authors = new HashMap<>();
        List<ArticleRank> all = artRankRepo.findAll();

        for (ArticleRank r : all) {
            ArticleBrief brief = new ArticleBrief();
            brief.fromArticleRank(r);

            Article art = artRepo.findByArticleUuid(r.getArticleUuid());
            if (art != null) {
                brief.getArtBase().fromArticle(art);
            } else {
                uuids.put(brief.getArticleUuid(), brief.getAuthorUuid());
            }
            authors.put(brief.getAuthorUuid(), brief.getArticleUuid());
            artBriefRepo.save(brief);
        }
        List<Article> arts = artRepo.findAll();
        for (Article a : arts) {
            ArticlePost post = new ArticlePost(a.getAuthorUuid(), a.getArticleUuid());

            post.setContent(a.getContent());
            post.setPending(false);
            artPostRepo.save(post);

            if (uuids.get(a.getArticleUuid()) == null) {
                ArticleBrief brief = new ArticleBrief();

                brief.fromArticle(a);
                artBriefRepo.save(brief);
            }
        }
        List<AdsPost> ads = adsRepo.findAll();
        for (AdsPost a : ads) {
            ArtAds artAd = new ArtAds();

            artAd.fromAdsPost(a);
            artAd.fromProfile(profileRepo.findByUserUuid(artAd.getAuthorUuid()));
            artAdsRepo.save(artAd);
        }
        List<Product> products = prodRepo.findAll();
        for (Product p : products) {
            ArtProduct prod = new ArtProduct();
            prod.fromProduct(p);
            artProdRepo.save(prod);
        }
        /*
        for (Map.Entry<String, String> e : authors.entrySet()) {
            List<ArticlePostDTO> fulls   = getArticleDTOByAuthor(e.getKey());
            List<ArticleBriefDTO> briefs = getArticleBriefDTOByAuthor(e.getKey());

            System.out.println("Author " + e.getKey() + " has brief " +
                    briefs.size() + ", full " + fulls.size());
            for (ArticleBriefDTO b : briefs) {
                ArticleBrief r = b.fetchArtRank();
                System.out.println("\tArt " + b.getArticleUuid() + ", base " +
                        r.getArtBase() + " attr " + r.getArtAttr());
            }
        }
        */
    }
}
