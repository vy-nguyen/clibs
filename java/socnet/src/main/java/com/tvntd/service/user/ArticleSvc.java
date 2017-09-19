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
import com.tvntd.forms.AdsForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.ProductForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.key.HashKey;
import com.tvntd.models.AdsPost;
import com.tvntd.models.ArtAds;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.ArtTag;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleBase;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.ArticlePost;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Product;
import com.tvntd.service.api.ArtAdsDTO;
import com.tvntd.service.api.ArtProductDTO;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Service
@Transactional
public class ArticleSvc implements IArticleSvc
{
    private static Logger s_log = LoggerFactory.getLogger(ArticleSvc.class);

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

    @Autowired
    protected ICommentService commentSvc;

    @Autowired
    protected IArtTagService artTagSvc;

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

    // --------------------------------------------------------------------------------
    // Static APIs
    //
    public static void applyPostAds(AdsForm form, ArtAdsDTO adsDTO)
    {
        ArtAds ads = adsDTO.fetchAds();
        ads.setBusName(Util.toRawByte(form.getBusName(), 128));
        ads.setBusInfo(Util.toRawByte(form.getBusInfo(), 128));
        ads.setBusCat(Util.toRawByte(form.getBusCat(), 128));
        ads.setBusWeb(Util.toRawByte(form.getBusWeb(), 128));
        ads.setBusEmail(Util.toRawByte(form.getBusEmail(), 128));
        ads.setBusPhone(Util.toRawByte(form.getBusPhone(), 128));
        ads.setBusStreet(Util.toRawByte(form.getBusStreet(), 128));
        ads.setBusCity(Util.toRawByte(form.getBusCity(), 64));
        ads.setBusState(Util.toRawByte(form.getBusState(), 32));
        ads.setBusZip(Util.toRawByte(form.getBusZip(), 32));
        ads.setBusHour(Util.toRawByte(form.getBusHour(), 1024));
        ads.setBusDesc(Util.toRawByte(form.getBusDesc(), 1 << 14));
    }
   
    public static void
    applyPostProduct(ProductForm form, ArtProductDTO prodDTO, boolean publish)
    {
        ArtProduct prod = prodDTO.fetchProduct();
        
        prod.markPending(!publish);
        String str = form.getProdNotice();
        if (str != null) {
            prod.setProdNotice(Util.toRawByte(str, 128));
        }
        prod.setProdName(Util.toRawByte(form.getProdName(), 128));
        prod.setProdTitle(Util.toRawByte(form.getProdTitle(), 128));
        prod.setProdDesc(Util.toRawByte(form.getProdDesc(), 1 << 16));
        prod.setProdSpec(Util.toRawByte(form.getProdSpec(), 1 << 16));
        prod.setProdDetail(Util.toRawByte(form.getProdDetail(), 1 << 16));
        prod.setPublicTag(Util.toRawByte(form.getPubTag(), 128));
        prod.setProdSub(Util.toRawByte(form.getProdSub(), 128));

        prod.setProdPrice(0L);
        prod.setPriceUnit("$");
        prod.setLogoTag("");
    }

    // --------------------------------------------------------------------------------
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

    @Override
    public ArticleBriefDTO getArticleBriefDTO(String tagName, String title)
    {
        String asciiTag = Util.utf8ToUrlString(tagName);
        String asciiTitle = Util.utf8ToUrlString(title);
        String key = HashKey.toSha1Key(asciiTag, asciiTitle);

        s_log.info("Lookup " + asciiTag + ", " + asciiTitle + ": " + key);
        ArticleBase base = artBaseRepo.findByPublicUrlOid(key);

        if (base != null) {
            ArticleBrief rank = artBriefRepo.findByArticleUuid(base.getArticleUuid());
            return new ArticleBriefDTO(rank);
        }
        return null;
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
    public List<ArticleBriefDTO> getArticleBriefDTO(UuidForm form)
    {
        List<String> uuids = new LinkedList<>();

        for (String uid : uuids) {
            uuids.add(uid);
        }
        String type = form.getUuidType();
        if (type != null && type.equals("product")) {
            return getArticleBriefDTO(uuids);
        }
        return getArticleBriefDTOByAuthor(uuids);
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

    // --------------------------------------------------------------------------------
    // Save/update ArticleBrief/ArticlePost
    //
    @Override
    public void saveArticlePost(ArticlePostDTO art) {
        artPostRepo.save(art.fetchArticlePost());
    }

    @Override
    public void saveArticlePost(List<ArticlePostDTO> arts)
    {
        for (ArticlePostDTO a : arts) {
            artPostRepo.save(a.fetchArticlePost());
        }
    }

    @Override
    public void saveArticleBrief(ArticleBriefDTO rank) {
        artBriefRepo.save(rank.fetchArtRank());
    }
  
    @Override
    public void saveArticleBrief(ArticleBrief rank) {
        artBriefRepo.save(rank);
    }

    @Override
    public void saveArticleBrief(List<ArticleBriefDTO> ranks)
    {
        for (ArticleBriefDTO r : ranks) {
            artBriefRepo.save(r.fetchArtRank());
        }
    }

    @Override
    public void saveArticleBrief(ArtProductDTO prod, ProductForm form)
    {
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

    // --------------------------------------------------------------------------------
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
    public void deleteAnnonAds(String authorUuid)
    {
        List<ArtAds> adsList = artAdsRepo.findByAuthorUuid(authorUuid);

        if (adsList != null) {
            System.out.println("Delete ads " + adsList.size());
            for (ArtAds a : adsList) {
                s_log.info("Delete ads " + a.getBusName());
                artAdsRepo.delete(a);
            }
        }
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
    public ArtProduct deleteArtProduct(String articleUuid, ProfileDTO owner)
    {
        ArtProduct prod = artProdRepo.findByArticleUuid(articleUuid);

        if (prod == null || !prod.getAuthorUuid().equals(owner.getUserUuid())) {
            return null;
        }
        s_log.info("Delete product " +
                prod.getArticleUuid() + ", name " + prod.getProdName());

        ArticleBrief brief = artBriefRepo.findByArticleUuid(articleUuid);
        if (brief != null) {
            artBriefRepo.delete(brief);
        }
        commentSvc.deleteComment(articleUuid);
        artTagSvc.deletePublicTagPost(prod.getPublicTag(), articleUuid);
        artProdRepo.delete(prod);

        return prod;
    }

    // --------------------------------------------------------------------------------
    // Internal API
    //
    @Override
    public void auditArticleTable()
    {
        Map<String, String> uuids = new HashMap<>();
        Map<String, String> authors = new HashMap<>();
        Map<String, ArticleBrief> artBriefs = new HashMap<>();
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
            artBriefs.put(brief.getArticleUuid(), brief);
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
                ArticleBrief brief = artBriefs.get(a.getArticleUuid());

                if (brief == null) {
                    brief = new ArticleBrief();
                }
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

    public void cleanupDatabase()
    {
        List<ArticlePost> arts = artPostRepo.findAll();

        for (ArticlePost a : arts) {
            if (profileRepo.findByUserUuid(a.getAuthorUuid()) == null) {
                System.out.println("Delete stale art " + a.getArticleUuid());
                artPostRepo.delete(a);
            }
        }

        List<ArticleBrief> briefs = artBriefRepo.findAll();
        for (ArticleBrief a : briefs) {
            ArticleBase b = a.getArtBase();
            if (b.getArtTag() == null) {
                String artUuid = b.getArticleUuid();
                if (artPostRepo.findByArticleUuid(artUuid) == null &&
                    artAdsRepo.findByArticleUuid(artUuid) == null &&
                    artProdRepo.findByArticleUuid(artUuid) == null) {
                    System.out.println("Delete invalid art " + b.getArtTitle());
                    artBriefRepo.delete(a);
                    continue;
                }
            }
            if (profileRepo.findByUserId(b.getAuthorId()) == null) {
                System.out.println("Delete invalid art userId " + b.getAuthorId());
                artBriefRepo.delete(a);
            }
        }

        List<ArtProduct> products = artProdRepo.findAll();
        for (ArtProduct p : products) {
            ArticleBase b = p.getArtBase();
            if (b.getArtTag() == null) {
                b.setArtTag(ArtTag.ESTORE);
                System.out.println("Update artTag prod for " + b.getArtTitle());
                artBaseRepo.save(b);
            }
        }

        List<ArtAds> ads = artAdsRepo.findAll();
        for (ArtAds a : ads) {
            ArticleBase b = a.getArtBase();
            if (b.getArtTag() == null) {
                b.setArtTag(ArtTag.ADS);
                System.out.println("Update artTag ads for " + b.getArtTitle());
                artBaseRepo.save(b);
            }
        }
    }
}
