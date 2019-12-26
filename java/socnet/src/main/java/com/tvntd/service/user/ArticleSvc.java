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

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ArtAdsRepo;
import com.tvntd.dao.ArtBriefRepo;
import com.tvntd.dao.ArtProductRepo;
import com.tvntd.dao.ArtRoomAdsRepo;
import com.tvntd.dao.ArticleAttrRepo;
import com.tvntd.dao.ArticleBaseRepo;
import com.tvntd.dao.ArticlePostRepo;
import com.tvntd.forms.AdsForm;
import com.tvntd.forms.AdsRoomForm;
import com.tvntd.forms.ArticleForm;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.ProductForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.key.HashKey;
import com.tvntd.models.ArtAds;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.ArtRoomAds;
import com.tvntd.models.ArtTag;
import com.tvntd.models.ArticleAttr;
import com.tvntd.models.ArticleBase;
import com.tvntd.models.ArticleBrief;
import com.tvntd.models.ArticlePost;
import com.tvntd.service.api.ArtAdsDTO;
import com.tvntd.service.api.ArtAdsDTO.BusAdsDTO;
import com.tvntd.service.api.ArtProductDTO;
import com.tvntd.service.api.ArtRoomAdsDTO;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.IMapService;
import com.tvntd.service.api.IMapService.AddressMapDTO;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Service
@Transactional
public class ArticleSvc implements IArticleSvc
{
    private static Logger s_log = LoggerFactory.getLogger(ArticleSvc.class);
    private static ArticlePost s_defPost = new ArticlePost();

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

    @Autowired
    protected ArtRoomAdsRepo adRoomRepo;

    @Autowired
    protected IMapService mapSvc;

    // --------------------------------------------------------------------------------
    // Static APIs
    //
    public static void applyPostAds(AdsForm form, BusAdsDTO adsDTO, IMapService map)
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

        adsDTO.setLocation(
                map.saveAddress(
                    ads.getArticleUuid(),
                    Util.makeAddress(form.getBusStreet(), form.getBusCity(),
                        form.getBusState(), form.getBusZip()),
                    adsDTO));
    }
  
    public static ArtRoomAdsDTO
    applyPostAds(AdsRoomForm form, BusAdsDTO inDTO, IMapService map)
    {
        ArtRoomAds ads = new ArtRoomAds(inDTO.fetchAds());

        ads.setOwnerEmail(form.getOwnerEmail());
        ads.setOwnerName(Util.toRawByte(form.getOwnerName(), 128));
        ads.setOwnerPhone(form.getOwnerPhone());
        ads.setRentPrice(form.getRentPrice());
        ads.setStreet(Util.toRawByte(form.getStreet(), 128));
        ads.setState(form.getState());
        ads.setCity(form.getCity());
        ads.setZip(form.getZip());
        ads.setPropDesc(Util.toRawByte(form.getDesc(), 2048));
        ads.setAdImgOid0(inDTO.fetchAdImgOid0());
        ads.setAdImgOid1(inDTO.fetchAdImgOid1());
        ads.setAdImgOid2(inDTO.fetchAdImgOid2());
        ads.setAdImgOid3(inDTO.fetchAdImgOid3());

        System.out.println("Save " + ads + " orig " + inDTO.fetchAds());

        ArtRoomAdsDTO adsDTO = new ArtRoomAdsDTO(ads);
        adsDTO.setLocation(
                map.saveAddress(
                    ads.getArticleUuid(),
                    Util.makeAddress(form.getStreet(), form.getCity(),
                        form.getState(), form.getZip()),
                    adsDTO));
        return adsDTO;
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
        prod.setProdCat(Util.toRawByte(form.getProdCat(), 128));
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
            BusAdsDTO bus = new BusAdsDTO(a);
            bus.setLocation(mapSvc.getAddressFromUuid(a.getArticleUuid()));
            result.add(bus);
        }
        return result;
    }

    @Override
    public ArtAdsDTO getArtAdsDTO(String adUuid)
    {
        ArtAds ads = artAdsRepo.findByArticleUuid(adUuid);

        if (ads != null) {
            BusAdsDTO result = new BusAdsDTO(ads);
            result.setLocation(mapSvc.getAddressFromUuid(adUuid));
            return result;
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

    protected List<ArtRoomAdsDTO> convertRoomAds(List<ArtRoomAds> list)
    {
        List<ArtRoomAdsDTO> out = new LinkedList<>();

        for (ArtRoomAds a : list) {
            ArtRoomAdsDTO ads = new ArtRoomAdsDTO(a);
            ads.setLocation(mapSvc.getAddressFromUuid(a.getArticleUuid()));
            out.add(ads);
        }
        return out;
    }

    @Override
    public List<ArtRoomAdsDTO> getRoomAdsByPrice(String lo, String hi) {
        return convertRoomAds(adRoomRepo.findAll());
    }

    @Override
    public List<ArtRoomAdsDTO> getRoomAds(String name, int type)
    {
        if (type == IArticleSvc.CITY) {
            return convertRoomAds(adRoomRepo.findByCityIgnoreCase(name));
        }
        if (type == IArticleSvc.STATE) {
            return convertRoomAds(adRoomRepo.findByStateIgnoreCase(name));
        }
        return convertRoomAds(adRoomRepo.findByZipIgnoreCase(name));
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
    public void saveArticleBrief(ArticleBriefDTO rank)
    {
        ArticleBrief brief = rank.fetchArtRank();
	ArticleBase base = brief.getArtBase();

        artBaseRepo.save(base);
        artBriefRepo.save(brief);
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
    //
    @Override
    public void saveArtAds(ArtAdsDTO ads)
    {
        if (ads instanceof BusAdsDTO) {
            System.out.println("Save ad " + ((BusAdsDTO)ads).fetchAds());
            artAdsRepo.save(((BusAdsDTO) ads).fetchAds());
            return;
        }
        if (ads instanceof ArtRoomAdsDTO) {
            adRoomRepo.save(((ArtRoomAdsDTO) ads).fetchAds());
        }
    }

    @Override
    public void saveArtAds(List<ArtAdsDTO> adsList)
    {
        for (ArtAdsDTO ads : adsList) {
            saveArtAds(ads);
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

    // Save/update article post
    //
    @Override
    public ArticleBriefDTO savePost(PostForm form, ArticlePostDTO artPost,
            ProfileDTO profile, boolean publish, boolean update)
    {
        ArticlePost art = artPost.fetchArticlePost();
        ArticleBrief brief = null;
        ArticleBriefDTO briefDTO = null;
        
        if (update == true) {
            briefDTO = getArticleBriefDTO(art.getArticleUuid());
            brief = briefDTO.fetchArtRank();
            brief.updateFrom(form);
        } else {
            brief = new ArticleBrief(art, form);
            briefDTO = new ArticleBriefDTO(brief);
        }
        art.setPending(!publish);
        brief.setPublish(publish);
        brief.getArtBase().setArtTag(ArtTag.BLOG);

        if (publish == true) {
            // Record in timeline.
        }
        // We've done with the article.
        //
        profile.assignPendPost(null);

        if (brief.isHasArticle() == false) {
            saveArticleBrief(briefDTO);
            if (update == true) {
                artPostRepo.delete(art);
            }
            return briefDTO;
        }
        art.setContent(Util.toRawByte(form.getContent(), 1 << 16));
        saveArticleBrief(briefDTO);
        saveArticlePost(artPost);
        return briefDTO;
    }

    public ArticleBriefDTO updateArtBrief(ArticleForm form)
    {
        String artUuid = form.getArticleUuid();
        ArticleBrief brief = artBriefRepo.findByArticleUuid(artUuid);

        if (brief == null) {
            return null;
        }
        ArticleAttr attr = brief.getArtAttr();
        Long likeInc     = form.getLikeInc();
        Long likes       = attr.getLikes();
        Long shares      = attr.getShared();
        Long shareInc    = form.getShareInc();

        if (likeInc > 0) {
            attr.setLikes(likes + 1);

        } else if (likeInc < 0 && likes > 0) {
            attr.setLikes(likes - 1);
        }
        if (shareInc > 0) {
            attr.setShared(shares + 1);

        } else if (shareInc < 0 && shares > 0) {
            attr.setShared(shares - 1);
        }
        String oid = form.getPrevArticle();
        if (oid != null) {
            brief.setPrevArticle(oid);
        }
        oid = form.getNextArticle();
        if (oid != null) {
            brief.setNextArticle(oid);
        }
        oid = form.getTopArticle();
        if (oid != null) {
            brief.setTopArticle(oid);
        }
        artBriefRepo.save(brief);
        return new ArticleBriefDTO(brief);
    }

    protected Long toggleList(List<String> users, Long val, String myUuid)
    {
        if (Util.<String>isInList(users, myUuid) == null) {
            val++;
            Util.<String>addUnique(users, myUuid);
        } else {
            val--;
            Util.<String>removeFrom(users, myUuid);
        }
        return val;
    }

    @Override
    public ArticleAttr updateArtAttr(CommentChangeForm form, ProfileDTO profile)
    {
        String artUuid = form.getArticleUuid();
        ArticleAttr attr = artAttrRepo.findByArticleUuid(artUuid);
        
        if (attr == null) {
            s_log.info("Failed to locate uuid " + artUuid);
            return null;
        }
        boolean save  = false;
        String kind   = form.getKind();
        String myUuid = profile.getUserUuid();

        if (kind.equals("like")) {
            List<String> users = attr.getUserLiked();

            if (users == null) {
                users = new ArrayList<>();
                attr.setUserLiked(users);
            }
            save = true;
            Long val = toggleList(users, attr.getLikes(), myUuid);

            attr.setLikes(val);
            form.setAmount(val);

        } else if (kind.equals("share")) {
            List<String> users = attr.getUserShared();

            if (users == null) {
                users = new ArrayList<>();
                attr.setUserShared(users);
            }
            save = true;
            Long val = toggleList(users, attr.getShared(), myUuid);

            attr.setShared(val);
            form.setAmount(val);

        } else if (kind.equals("fav")) {
            save = true;
            attr.setFavorite(true);
        }
        if (save == true) {
            artAttrRepo.save(attr);
        }
        return attr;
    }

    // --------------------------------------------------------------------------------
    // Delete post
    //
    private void commonDelete(ArticleBrief brief, byte[] tag)
    {
        String artUuid = brief.getArticleUuid();

        ArticleBase base = brief.getArtBase();
        artTagSvc.deletePublicTagPost(tag, artUuid);

        brief.setArtBase(null);
        artBriefRepo.delete(brief);
        commentSvc.deleteComment(artUuid);

	artBaseRepo.delete(base);
        s_log.info("Delete article uuid " + artUuid);
    }

    private void deleteArticlePost(ArticlePost post)
    {
        ArticleBase base = artBaseRepo.findByArticleUuid(post.getArticleUuid());

        if (base != null) {
            ArticleBrief brief = new ArticleBrief(base);
            commonDelete(brief, base.getPublicTag());
        }
        artPostRepo.delete(post);
    }

    @Override
    public void deleteArticlePost(ArticlePostDTO art) {
        deleteArticlePost(art.fetchArticlePost());
    }

    @Override
    public void deleteArticlePost(List<ArticlePostDTO> arts)
    {
        for (ArticlePostDTO a : arts) {
            deleteArticlePost(a);
        }
    }

    @Override
    public void deleteArticleBrief(ArticleBriefDTO rank)
    {
        ArticleBrief brief = rank.fetchArtRank();
        ArticlePost post = new ArticlePost(brief.getAuthorUuid(), rank.getArticleUuid());

        commonDelete(brief, brief.getArtBase().getPublicTag());
        if (post != null) {
            artPostRepo.delete(post);
        }
    }

    @Override
    public void deleteArticleBrief(List<ArticleBriefDTO> ranks)
    {
        for (ArticleBriefDTO r : ranks) {
            deleteArticleBrief(r);
        }
    }

    @Override
    public ArticlePost deleteArticlePost(String artUuid, ProfileDTO owner)
    {
        ArticlePost post = artPostRepo.findByArticleUuid(artUuid);

        if (post == null) {
            ArticleBrief brief = artBriefRepo.findByArticleUuid(artUuid);
            if (brief == null) {
                return null;
            }
            ArticleBase base = brief.getArtBase();
            String artTag = base.getArtTag();

            if (artTag.equals(ArtTag.ADS)) {
                ArtAds ads = artAdsRepo.findByArticleUuid(artUuid);
                if (ads != null) {
                    deleteArtAds(ads);
                }
                return s_defPost;
            }
            if (artTag.equals(ArtTag.ESTORE)) {
                System.out.println("Delete product " + base);
                return s_defPost;
            }
            deleteArticleBrief(new ArticleBriefDTO(brief));
            return new ArticlePost(owner.getUserUuid(), owner.fetchUserId());
        }
        String author = post.getAuthorUuid();
        if (!author.equals(owner.getUserUuid())) {
            s_log.info("Owner miss-match " + author + " vs " + owner.getUserUuid());
            return null;
        }
        deleteArticlePost(post);
        return post;
    }
 
    // --------------------------------------------------------------------------------
    // Delete ads
    //
    private void deleteArtAds(ArtAds ads)
    {
        ArticleBrief brief = new ArticleBrief(ads.getArtBase());

        s_log.info("Delete ads uuid " + ads.getArticleUuid());
        commonDelete(brief, ads.getBusCat());
        artAdsRepo.delete(ads);
    }

    private void deleteArtAds(ArtRoomAds ads)
    {
        ArticleBrief brief = new ArticleBrief(ads.getArtBase());

        s_log.info("Delete ads uuid " + ads.getArticleUuid());
        commonDelete(brief, null);
        adRoomRepo.delete(ads);
    }

    @Override
    public void deleteArtAds(ArtAdsDTO adsDTO)
    {
        if (adsDTO instanceof BusAdsDTO) {
            deleteArtAds(((BusAdsDTO) adsDTO).fetchAds());
            return;
        }
        if (adsDTO instanceof ArtRoomAdsDTO) {
            deleteArtAds(((ArtRoomAdsDTO) adsDTO).fetchAds());
        }
        mapSvc.deleteAddress(adsDTO.getArticleUuid());
    }

    @Override
    public void deleteAnnonAds(String authorUuid)
    {
        List<ArtAds> adsList = artAdsRepo.findByAuthorUuid(authorUuid);

        if (adsList != null) {
            System.out.println("Delete ads " + adsList.size());
            for (ArtAds a : adsList) {
                s_log.info("Delete ads " + a.getBusName());
                deleteArtAds(a);
            }
        }
    }

    @Override
    public void deleteArtAds(List<ArtAdsDTO> adsList)
    {
        for (ArtAdsDTO ads : adsList) {
            deleteArtAds(ads);
        }
    }

    // --------------------------------------------------------------------------------
    // Delete products
    //
    private void deleteArtProduct(ArtProduct prod)
    {
        ArticleBrief brief = new ArticleBrief(prod.getArtBase());

        s_log.info("Delete product uuid " + prod.getArticleUuid());
        commonDelete(brief, prod.getPublicTag());
        artProdRepo.delete(prod);
    }

    @Override
    public void deleteArtProduct(ArtProductDTO prod) {
        deleteArtProduct(prod.fetchProduct());
    }

    @Override
    public void deleteArtProduct(List<ArtProductDTO> prodList)
    {
        for (ArtProductDTO p : prodList) {
            deleteArtProduct(p);
        }
    }
   
    @Override
    public ArtProduct deleteArtProduct(String articleUuid, ProfileDTO owner)
    {
        ArtProduct prod = artProdRepo.findByArticleUuid(articleUuid);

        if (prod == null || !prod.getAuthorUuid().equals(owner.getUserUuid())) {
            return null;
        }
        s_log.info("Delete product " + prod.getArticleUuid());
        deleteArtProduct(prod);
        return prod;
    }

    // --------------------------------------------------------------------------------
    // Internal API
    //
    @Override
    public void auditArticleTable() {}

    @Override
    public void cleanupDatabase() {}
}
