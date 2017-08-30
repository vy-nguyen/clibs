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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AdsPostRepo;
import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.ArticleRepository;
import com.tvntd.dao.ProductRepository;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.key.HashKey;
import com.tvntd.models.ArtTag;
import com.tvntd.models.ArtVideo;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Service
@Transactional
public class ArticleService implements IArticleService
{
    static private Logger s_log = LoggerFactory.getLogger(ArticleService.class);

    @Autowired
    protected ArticleRepository articleRepo;

    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected ICommentService commentSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @Autowired
    protected ProductRepository prodRepo;

    @Autowired
    protected AdsPostRepo adsRepo;

    /**
     * Common static methods.
     */
    public static void applyPostForm(PostForm form, ArticleDTO artDTO, boolean publish)
    {
        Article art = artDTO.fetchArticle();
        if (publish == true) {
            art.markActive();
        } else {
            art.markPending();
        }
        try {
            String str = Util.truncate(form.getTopic(), Article.MaxTitleLength);
            art.setTopic(str.getBytes("UTF-8"));

            if (form.fetchContentUrlHost() != null) {
                art = artDTO.assignVideo(form.fetchContentUrlFile());
                Article.makeUrlLink(art, form.fetchContentUrlHost(), form.fetchDocType());
            }
            if (form.getContent() != null) {
                str = Util.truncate(form.getContent(), Article.MaxContentLength);
                art.setContent(str.getBytes("UTF-8"));
                if (form.getContentBrief() != null) {
                    str = Util.truncate(form.getContentBrief(),
                            ArticleRank.MaxContentLength);
                    art.setContentBrief(str.getBytes("UTF-8"));
                }
            }
        } catch(UnsupportedEncodingException e) {
            s_log.info(e.getMessage());
        }
    }

    public static Article toArticle(PostForm form, ProfileDTO profile, boolean pub)
    {
        Article art = new Article();
        art.setAuthorId(profile.fetchUserId());
        art.setAuthorUuid(profile.getUserUuid());
        ArticleService.applyPostForm(form, new ArticleDTO(art, null), false);
        return art;
    }

    public static void toArticleRank(ArticleDTO art, ProfileDTO author, String tag)
    {
    }

    /**
     * Utilities to convert to DTO forms.
     */
    @Override
    public List<ArticleDTO> convert(List<Article> arts)
    {
        List<String> uuids = new LinkedList<>();
        for (Article a : arts) {
            uuids.add(a.getArticleUuid());
        }
        List<ArticleRank> ranks = artRankRepo.findByArticleUuidIn(uuids);
        return makeArticleDTOList(arts, ranks);
    }

    protected ArticleDTO makeArticleDTO(ArticleRank rank, Article art)
    {
        if (rank != null && rank.getArtTag() == null) {
            rank.setHasArticle(true);
            rank.setArtTag(ArtTag.BLOG);
            rank.setContentOid(art.getContentOId());
            if (art instanceof ArtVideo) {
                rank.setContentLinkUrl(((ArtVideo)art).getVideoUrl());
            }
            artRankRepo.save(rank);
        }
        return new ArticleDTO(art, rank);
    }

    protected List<ArticleDTO>
    makeArticleDTOList(List<Article> articles, List<ArticleRank> ranks)
    {
        List<ArticleDTO> result = new LinkedList<>();
        Map<String, ArticleRank> map = new HashMap<>();

        for (ArticleRank r : ranks) {
            map.put(r.getArticleUuid(), r);
        }
        for (Article a : articles) {
            result.add(makeArticleDTO(map.get(a.getArticleUuid()), a));
        }
        return result;
    }

    @Override
    public List<ArticleRankDTO> convertRank(List<ArticleRank> ranks)
    {
        List<ArticleRankDTO> result = new LinkedList<>();
        for (ArticleRank r : ranks) {
            result.add(new ArticleRankDTO(r));
        }
        return result;
    }

    /**
     * Article ranking.
     */
    @Override
    public List<ArticleRankDTO> getArtRankByAuthor(String authorUuid)
    {
        return convertRank(artRankRepo.findByAuthorUuid(authorUuid));
    }

    @Override
    public ArticleRank getRank(String artUuid) {
        return artRankRepo.findByArticleUuid(artUuid);
    }

    @Override
    public ArticleRank getRank(String tagName, String title)
    {
        String asciiTag = Util.utf8ToUrlString(tagName);
        String asciiTitle = Util.utf8ToUrlString(title);
        String key = HashKey.toSha1Key(asciiTag, asciiTitle);

        s_log.info("Lookup " + asciiTag + ", " + asciiTitle + ": " + key);
        return artRankRepo.findByPublicUrlOid(key);
    }

    @Override
    public void saveRank(ArticleRank rank) {
        artRankRepo.save(rank);
    }

    @Override
    public List<ArticleRank> getArtRank(String[] artUuids)
    {
        List<String> uuids = new LinkedList<>();
        for (String u : artUuids) {
            uuids.add(u);
        }
        return artRankRepo.findByArticleUuidIn(uuids);
    }

    @Override
    public ArticleRank updateRank(CommentChangeForm form, ProfileDTO me)
    {
        String artUuid = form.getArticleUuid();
        String myUuid = me.getUserUuid();
        String kind = form.getKind();

        ArticleRank rank = artRankRepo.findByArticleUuid(artUuid);
        if (rank == null) {
            Article article = articleRepo.findByArticleUuid(artUuid);
            if (article != null) {
                return null;
            }
            rank = authorSvc.createArticleRank(article, "Comment");
            if (rank == null) {
                return null;
            }
        }
        boolean save = false;
        
        if (kind.equals("like")) {
            Long val = rank.getLikes();
            List<String> users = rank.getUserLiked();

            if (users == null) {
                users = new ArrayList<>();
                rank.setUserLiked(users);
            }
            save = true;
            if (Util.<String>isInList(users, myUuid) == null) {
                val++;
                Util.<String>addUnique(users, myUuid);
            } else {
                val--;
                Util.<String>removeFrom(users, myUuid);
            }
            rank.setLikes(val);
            form.setAmount(val);

        } else if (kind.equals("share")) {
            Long val = rank.getShared();
            List<String> users = rank.getUserShared();

            if (users == null) {
                users = new ArrayList<>();
                rank.setUserShared(users);
            }
            save = true;
            if (Util.<String>isInList(users, myUuid) == null) {
                val++;
                Util.<String>addUnique(users, myUuid);
            } else {
                val--;
                Util.<String>removeFrom(users, myUuid);
            }
            rank.setShared(val);
            form.setAmount(val);

        } else if (kind.equals("fav")) {
            System.out.println("Set fav " + rank);
        }
        if (save == true) {
            artRankRepo.save(rank);
        }
        return rank;
    }

    public List<ArticleRankDTO> getArticleRank(UuidForm form)
    {
        List<String> uuids = new LinkedList<>();
        for (String uid : form.getUuids()) {
            uuids.add(uid);
        }
        String type = form.getUuidType();
        boolean author = true;

        if (type != null && type.equals("product")) {
            author = false;
        }
        List<ArticleRank> ranks;

        if (author == true) {
            ranks = artRankRepo.findByAuthorUuidIn(uuids);
        } else {
            ranks = artRankRepo.findByArticleUuidIn(uuids);
        }
        return convertRank(ranks);
    }

    /**
     * Article services.
     */
    @Override
    public ArticleDTO getArticleDTO(String artUuid)
    {
        Article art = articleRepo.findByArticleUuid(artUuid);

        if (art != null) {
            return makeArticleDTO(getRank(artUuid), art);
        }
        return null;
    }

    @Override
    public Article getArticle(String artUuid) {
        return articleRepo.findByArticleUuid(artUuid);
    }

    @Override
    public List<ArticleDTO> getArticles(List<String> uuids)
    {
        List<Article> arts = articleRepo.findByArticleUuidIn(uuids);
        List<ArticleDTO> result = new LinkedList<>();

        for (Article a : arts) {
            result.add(new ArticleDTO(a, null));
        }
        return result;
    }

    protected Map<String, ArticleRank> getRanks(List<Article> articles)
    {
        List<String> uuids = new LinkedList<>();

        for (Article a : articles) {
            uuids.add(a.getArticleUuid());
        }
        Map<String, ArticleRank> ranks = new HashMap<>();
        List<ArticleRank> result = artRankRepo.findByArticleUuidIn(uuids);

        for (ArticleRank r : result) {
            ranks.put(r.getArticleUuid(), r);
        }
        return ranks;
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(Long userId)
    {
        List<Article> articles =
            articleRepo.findAllByAuthorIdOrderByCreatedDateDesc(userId);
        return convert(articles);
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(String userUuid)
    {
        List<Article> articles =
            articleRepo.findAllByAuthorUuidOrderByCreatedDateAsc(userUuid.toString());
        return convert(articles);
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(List<String> uuidList)
    {
        return convert(articleRepo.findByArticleUuidIn(uuidList));
    }

    @Override
    public Page<ArticleDTO> getUserArticles(Long userId)
    {
        Pageable req = new PageRequest(0, 10, new Sort(Sort.Direction.DESC, "created"));
        Page<Article> page =
            articleRepo.findByAuthorIdOrderByCreatedDateDesc(userId, req);
        List<Article> articles = page.getContent();

        return new PageImpl<ArticleDTO>(
                convert(articles), req, page.getTotalElements());
    }

    @Override
    public Page<ArticleDTO> getUserArticles(String userUuid)
    {
        Pageable req = new PageRequest(0, 10, new Sort(Sort.Direction.DESC, "created"));
        Page<Article> page =
            articleRepo.findByAuthorUuidOrderByCreatedDateDesc(userUuid, req);
        List<Article> articles = page.getContent();

        return new PageImpl<ArticleDTO>(
                convert(articles), req, page.getTotalElements());
    }

    @Override
    public void saveArtRank(List<ArticleRank> ranks)
    {
        for (ArticleRank r : ranks) {
            artRankRepo.save(r);
        }
    }

    @Override
    public void saveArticle(ArticleDTO article) {
        articleRepo.save(article.fetchArticle());
    }

    @Override
    public void saveArticle(Article article) {
        articleRepo.save(article);
    }

    @Override
    public Article deleteArticle(Article art, ProfileDTO owner)
    {
        String uuid = art.getArticleUuid();
        String author = art.getAuthorUuid();

        if (!author.equals(owner.getUserUuid())) {
            s_log.info("Wrong owner " + author + " vs " +
                    owner.getUserUuid() + " name " + owner.getEmail());
            return null;
        }
        ArticleRank rank = artRankRepo.findByArticleUuid(uuid);
        if (rank != null) {
            try {
                artRankRepo.delete(rank);
            } catch(Exception e) {
                s_log.info("Delete rank failed " + uuid + ": " + e.getMessage());
            }
        }
        try {
            commentSvc.deleteComment(uuid);
        } catch(Exception e) {
            s_log.info("Delete comments failed " + uuid + ": " + e.getMessage());
        }

        try {
            artTagSvc.deletePublicTagPost(art.getPublicTag(), uuid);
        } catch(Exception e) {
            s_log.info("Delete pub tag failed " + uuid + ": " + e.getMessage());
        }

        try {
            articleRepo.delete(uuid);
        } catch(Exception e) {
            s_log.info("Delete article failed " + uuid + ": " + e.getMessage());
        }
        articleRepo.flush();
        artRankRepo.flush();
        return art;
    }

    @Override
    public Article deleteArticle(String uuid, ProfileDTO owner)
    {
        s_log.info("Delete article " + uuid + ", owner " + owner.getUserUuid());

        ArticleDTO art = getArticleDTO(uuid);
        if (art != null) {
            return deleteArticle(art.fetchArticle(), owner);
        }
        return null;
    }

    @Override
    public void saveArticles(String jsonFile, String rsDir)
    {
        s_log.info("Save articles");
    }
}
