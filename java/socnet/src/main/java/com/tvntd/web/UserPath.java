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
package com.tvntd.web;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.dao.AuthorTagRepo.AuthorTagDTO;
import com.tvntd.dao.AuthorTagRepo.AuthorTagRespDTO;
import com.tvntd.forms.ArticleForm;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.CommentForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.ProductForm;
import com.tvntd.forms.TagForm;
import com.tvntd.forms.TagForm.TagArtRank;
import com.tvntd.forms.TagForm.TagOrderResponse;
import com.tvntd.forms.TagForm.TagRank;
import com.tvntd.forms.UserProfile;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Author;
import com.tvntd.models.Comment;
import com.tvntd.models.Product;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleDTOResponse;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.ICommentService.CommentDTOResponse;
import com.tvntd.service.api.ICommentService.CommentRespDTO;
import com.tvntd.service.api.IProductService;
import com.tvntd.service.api.IProductService.ProductDTO;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.ITimeLineService;
import com.tvntd.service.api.IUserService;
import com.tvntd.service.api.ImageUploadResp;
import com.tvntd.service.api.LoginResponse;
import com.tvntd.service.api.UuidResponse;
import com.tvntd.service.user.ArtTagService;
import com.tvntd.service.user.ArticleService;
import com.tvntd.service.user.ProductService;

@Controller
public class UserPath
{
    static private Logger s_log = LoggerFactory.getLogger(UserPath.class);
    static public  GenericResponse s_genOkResp = new GenericResponse("ok");
    static public  GenericResponse s_noProfile =
        new GenericResponse("Invalid session", "User Error");

    static public  GenericResponse s_saveObjFailed =
        new GenericResponse("Failed to save object", "System Error");

    static public GenericResponse s_invalidArticle =
        new GenericResponse("Could not retrieve article", "Invalid UUID");

    static public GenericResponse s_badInput =
        new GenericResponse("Bad input value", "Missing or invalid input values");

    @Autowired
    private IArticleService articleSvc;

    @Autowired
    private IAuthorService authorSvc;

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    private IUserService userService;

    @Autowired
    private ITimeLineService timeLineSvc;

    @Autowired
    private ICommentService commentSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @Autowired
    protected IProductService productSvc;

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public LoginResponse user(HttpSession session, HttpServletRequest reqt)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        LoginResponse resp = new LoginResponse(profile, reqt, session, false);
        ApiPath.fillLoginResponse(resp, profile);
        return resp;
    }

    /**
     * Get user articles.
     */
    @RequestMapping(value = "/user/get-posts/{userUuid}", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getUserArticles(Locale locale, HttpSession session,
            @PathVariable(value = "userUuid") String uuid)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        LinkedList<ArticleDTO> saved = null;
          
        if (!uuid.equals(profile.getUserUuid())) {
            profile = profileSvc.getProfile(uuid);
            if (profile == null) {
                s_log.info("Invalid uuid " + uuid);
                return s_noProfile;
            }
        } else {
            saved = profile.fetchSavedArts();
        }
        LinkedList<ArticleDTO> published = profile.fetchPublishedArts();

        if (published != null) {
            return new ArticleDTOResponse(published, saved);
        }
        saved = new LinkedList<>();
        published = new LinkedList<>();
        List<ArticleDTO> all = articleSvc.getArticlesByUser(profile.fetchUserId());

        for (ArticleDTO art : all) {
            if (art.isPublished()) {
                published.add(art);
            } else {
                saved.add(art);
            }
        }
        profile.assignPublishedArts(published);
        if (saved != null) {
            profile.assignSavedArts(saved);
        }
        return new ArticleDTOResponse(published, saved);
    }

    /**
     * Get list of articles.
     */
    @RequestMapping(value = "/user/get-articles",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getArticleList(@RequestBody UuidForm uuids, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return null;
    }

    /**
     * User post articles.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/save-post",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    saveUserPost(@RequestBody PostForm form, HttpSession session) {
        return savePost(form, session, false);
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/publish-post",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    publishUserPost(@RequestBody PostForm form, HttpSession session) {
        return savePost(form, session, true);
    }

    /**
     * Shared code to save/publish an article.
     */
    protected GenericResponse
    savePost(PostForm form, HttpSession session, boolean publish)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        if (form.cleanInput() == false) {
            return s_badInput;
        }
        ArticleDTO art = genPendPost(profile, true, form.getArticleUuid());
        Article article = art.fetchArticle();
        ArticleService.applyPostForm(form, article, publish);

        if (publish == true) {
            article.markActive();
            art.convertUTF();
            articleSvc.saveArticle(art);

            // We're done with the current post.
            profile.assignPendPost(null);
            profile.pushPublishArticle(art);

            timeLineSvc.saveTimeLine(profile.getUserUuid(),
                    art.getArticleUuid(), null, article.getContentBrief());
        } else {
            articleSvc.saveArticle(art);
            profile.pushSavedArticle(art);
        }
        ArticleRank artRank = authorSvc.createArticleRank(article, form.getTags());
        art.setRank(artRank);
        return art;
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/update-post/{opt}",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    updateUserPost(@RequestBody PostForm form,
            @PathVariable(value = "opt") String opt, HttpSession session)
    {
        System.out.println("Value param " + opt);
        System.out.println("Update art " + form);
        return updatePost(form, session, true);
    }

    /**
     * Handler to update/re-edit article.
     */
    protected GenericResponse
    updatePost(PostForm form, HttpSession session, boolean publish)
    {
        System.out.println("Update post " + form);
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        if (form.cleanInput() == false) {
            return s_badInput;
        }
        ArticleDTO art = articleSvc.getArticleDTO(form.getArticleUuid());
        if (art == null) {
            return s_noProfile;
        }
        Article article = art.fetchArticle();
        ArticleService.applyPostForm(form, article, publish);
        articleSvc.saveArticle(art);

        ArticleRank artRank = articleSvc.getRank(form.getArticleUuid());
        if (artRank != null) {
            String tag = form.getTags();
            if (!tag.equals(artRank.getTag())) {
                artRank.setTag(tag);
                articleSvc.saveRank(artRank);
            }
        }
        art.convertUTF();
        return art;
    }

    /**
     * Delete user articles.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/delete-post",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    deleteUserArticle(@RequestBody UuidForm uuids, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        String[] uuidList = uuids.getUuids();
        ArrayList<String> failedUuids = null, okUuids = null;

        for (int idx = 0; idx < uuidList.length; idx++) {
            String uid = uuidList[idx];
            if (articleSvc.deleteArticle(uid, profile) == null) {
                if (failedUuids == null) {
                    failedUuids = new ArrayList<>();
                    okUuids = new ArrayList<>();
                    for (int i = 0; i < idx; i++) {
                        okUuids.add(uuidList[i]);
                    }
                }
                failedUuids.add(uid);
            } else if (okUuids != null) {
                okUuids.add(uid);
            }
        }
        if (okUuids != null) {
            uuids.replaceUuids(okUuids);
        }
        return (new UuidResponse(uuids)).setFailedUuids(failedUuids);
    }

    /**
     * User publish product to estore.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/publish-product",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    publishUserProduct(@RequestBody ProductForm form, HttpSession session) {
        return saveProduct(form, session, true);
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/save-product",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    saveUserProduct(@RequestBody ProductForm form, HttpSession session) {
        return saveProduct(form, session, false);
    }

    /**
     * Shared code to save/publish a product to estore.
     */
    protected GenericResponse
    saveProduct(ProductForm form, HttpSession session, boolean publish)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        if (form.cleanInput() == false) {
            return s_noProfile;
        }
        ProductDTO prodDto = genPendProduct(profile, true, form.getArticleUuid());
        Product prod = prodDto.fetchProduct();
        ProductService.applyPostProduct(form, prodDto, publish);

        if (publish == true) {
            prod.markActive();
            productSvc.saveProduct(prod);

            profile.assignPendProduct(null);
            profile.pushPublishProduct(prodDto);
        } else {
            productSvc.saveProduct(prodDto);
            profile.pushSavedProduct(prodDto);
        }
        ArticleRank rank = authorSvc.createProductRank(prod, form);
        prodDto.assignRank(rank);

        // Publish the product to public space.
        String pubTag = form.getPubTag();
        if (publish == true && pubTag != null) {
            artTagSvc.addPublicTagPost(pubTag, rank.getArticleUuid());
        }
        return prodDto;
    }

    /**
     * Upload images for the pending article.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/upload-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImage(@RequestParam("name") String name,
            @RequestParam("authorUuid") String authorUuid,
            @RequestParam("articleUuid") String artUuid,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        ArticleDTO art = genPendPost(profile, true, artUuid);
        try {
            String uid = profile.fetchUserId().toString();
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putUserImage(is, (int)file.getSize(), uid);

            if (oid != null) {
                art.addPicture(oid);
            }
            ImageUploadResp resp =
                new ImageUploadResp(art.getArticleUuid(), art.getAuthorUuid(), oid);

            resp.setLocation(ArticleDTO.getPictureUrl(profile.fetchProfile(), oid));
            return resp;

        } catch(IOException e) {
        }
        return s_saveObjFailed;
    }

    /**
     * Upload images for product listing.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/upload-product-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadProdBrief(@RequestParam("name") String name,
            @RequestParam("authorUuid") String authorUuid,
            @RequestParam("articleUuid") String artUuid,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return uploadProduct(profile, artUuid, file, true, "/user/upload-product-img");
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/upload-product-detail", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadProdDetail(@RequestParam("name") String name,
            @RequestParam("authorUuid") String authorUuid,
            @RequestParam("articleUuid") String artUuid,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return uploadProduct(profile,
                artUuid, file, false, "/user/upload-product-detail");
    }

    private GenericResponse
    uploadProduct(ProfileDTO profile,
            String artUuid, MultipartFile file, boolean logo, String url)
    {
        if (file.getSize() <= 0) {
            return s_saveObjFailed;
        }
        ProductDTO prod = genPendProduct(profile, true, artUuid);
        try {
            String uid = profile.fetchUserId().toString();
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putUserImage(is, (int)file.getSize(), uid);

            if (oid != null) {
                ImageUploadResp resp = new ImageUploadResp(
                        prod.getArticleUuid(), prod.getAuthorUuid(), oid);

                resp.setPostUrl(url);
                resp.setLocation(ArticleDTO
                        .getPictureUrl(profile.fetchProfile(), oid));

                if (logo == true) {
                    resp.setPostType("logo");
                    prod.assignLogo(oid.name());
                } else {
                    resp.setPostType("imgs");
                    prod.addPicture(oid);
                }
                return resp;
            }
        } catch(IOException e) {
        }
        return s_saveObjFailed;
    }

    /**
     * Generate or retrieve a pending article post.
     */
    private ArticleDTO
    genPendPost(ProfileDTO profile, boolean creat, String articleUuid)
    {
        ArticleDTO pendPost = profile.fetchPendPost();

        if (pendPost != null) {
            return pendPost;
        }
        if (articleUuid != null) {
            pendPost = articleSvc.getArticleDTO(articleUuid);
        }
        if (creat == true && pendPost == null) {
            String authorUuid = profile.getUserUuid();
            pendPost = new ArticleDTO(authorUuid, profile.toProfile().getUserId());
        }
        if (pendPost != null) {
            profile.assignPendPost(pendPost);
        }
        return pendPost;
    }

    /**
     * Generate or retrieve a pending product listing.
     */
    private ProductDTO
    genPendProduct(ProfileDTO profile, boolean creat, String articleUuid)
    {
        ProductDTO product = profile.fetchPendProduct();

        if (product != null) {
            return product;
        }
        if (articleUuid != null) {
            product = productSvc.getProductDTO(articleUuid);
        }
        if (creat == true && product == null) {
            String authorUuid = profile.getUserUuid();
            product = new ProductDTO(authorUuid, profile.toProfile().getUserId());
        }
        if (product != null) {
            profile.assignPendProduct(product);
        }
        return product;
    }

    /**
     * Delete user products.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/delete-product",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    deleteUserProduct(@RequestBody UuidForm uuids, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        String[] uuidList = uuids.getUuids();
        for (String uid : uuidList) {
            productSvc.deleteProduct(uid, profile);
            /*
            if (prod != null) {
                commentSvc.deleteComment(uid);
                String pubTag = ProductDTO.convertUTF(prod.getPublicTag());
                if (pubTag != null) {
                    artTagSvc.deletePublicTagPost(pubTag, uid);
                }
            }
            */
        }
        return new UuidResponse(uuids);
    }

    /**
     * Upload user avatar.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/upload-avatar", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImage(@RequestParam("name") String name,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        if (file.isEmpty()) {
        }
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        try {
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putImage(is, (int) file.getSize());

            if (oid != null) {
                profileSvc.saveUserImgUrl(profile, oid);
                ImageUploadResp resp =
                    new ImageUploadResp(null, profile.getUserUuid().toString(), oid);

                resp.setPostType("avatar");
                resp.setPostUrl("/user/upload-avatar");
                resp.setLocation(store.imgObjUri(oid, ProfileDTO.getImgBaseUrl()));
                return resp;
            }
        } catch(IOException e) {
            s_log.info("Exception: " + e.toString());
        }
        return s_noProfile;
    }

    /**
     * Comments on article.
     */
    @RequestMapping(value = "/user/publish-comment",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    postComment(@RequestBody CommentForm form, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        // XXX: check for valid article uuid.
        Comment comment = new Comment();
        comment.setContent(Jsoup.parse(form.getComment()).text().getBytes());
        comment.setArticleUuid(form.getArticleUuid());
        comment.setUserUuid(profile.getUserUuid().toString());
        comment = commentSvc.saveComment(comment);
        return new CommentDTOResponse(comment, null);
    }

    /**
     * Add/remove comment ranking.
     */
    @RequestMapping(value = "/user/change-comment",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    postComment(@RequestBody CommentChangeForm form, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        ArticleRank rank = null;
        CommentRespDTO resp = new CommentRespDTO(form);

        if (form.isArticle() == true) {
            rank = articleSvc.updateRank(form, profile);
            if (rank == null) {
                return s_invalidArticle;
            }
        } else {
            rank = commentSvc.updateComment(form, profile);
        }
        resp.updateArticleRank(rank);
        return resp;
    }

    /**
     * Get comments for articles.
     */
    @RequestMapping(value = "/user/get-comments",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getComments(@RequestBody UuidForm uuids, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return commentSvc.getCommentPost(uuids.getUuids());
    }

    /**
     * Get article rankings.
     */
    @RequestMapping(value = "/user/get-art-rank",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getArticleRank(@RequestBody UuidForm uuids, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return new ArticleDTOResponse(articleSvc.getArticleRank(uuids));
    }

    /**
     * Change article attributes/tags.
     */
    @RequestMapping(value = "/user/update-art-rank",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    updateArticle(@RequestBody ArticleForm form, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        ArticleRankDTO rank = new ArticleRankDTO();
        Author author = authorSvc.updateAuthor(profile, form, rank);
        if (author != null) {
            return rank;
        }
        return s_invalidArticle;
    }

    /**
     * Update tag ranking.
     */
    @RequestMapping(value = "/user/update-tag-rank",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    updateTagRanking(@RequestBody TagForm form, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }

        String uuid = form.getUserUuid();
        if (!profile.getUserUuid().equals(uuid)) {
            s_log.info("Not author " + profile.getUserUuid() + " request " + uuid);
            return s_noProfile;
        }

        System.out.println("User admin " + profile.isAdmin());
        Map<String, TagRank> dict = ArtTagService.fixupTagList(form.getTagRanks());
        for (TagRank r : form.getTagRanks()) {
            if (r.isPubTag() == false && r.isArticle() == false) {
                System.out.println("Save tag " + r.getTagName() +
                        ", parent " + r.getParent() + ", rank " + r.getRank());
                artTagSvc.saveTag(uuid, r.getTagName(), r.getParent(), r.getRank());
            }
        }

        AuthorTagRespDTO ownerTags = authorSvc.getAuthorTag(uuid);
        TagOrderResponse resp =
            new TagOrderResponse(form.getTagRanks(), form.getArtList());

        if (ownerTags == null) {
            return resp;
        }
        List<AuthorTagDTO> tags = ownerTags.getAuthorTags();
        for (AuthorTagDTO t : tags) {
            TagRank rank = dict.get(t.getTagName());
            if (rank != null) {
                t.setRank(rank.getRank());
                authorSvc.saveAuthorTag(t);
            }
        }

        TagArtRank[] artList = form.getArtList();
        for (TagArtRank r : artList) {
            Long order = 0L;
            List<ArticleRank> artRank = articleSvc.getArtRank(r.getArtUuid());

            for (ArticleRank rank : artRank) {
                rank.setRank(order);
                order++;
            }
            articleSvc.saveArtRank(artRank);
        }
        return resp;
    }

    /**
     */
    @RequestMapping(value = "/user/update-profile",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    updateProfile(@RequestBody UserProfile form,
            HttpServletRequest request, HttpSession session)
    {
        if (form.cleanInput() == false) {
            System.out.println("Bad clean input");
            return s_badInput;
        }
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        String uuid = form.getUserUuid();
        if (!profile.getUserUuid().equals(uuid)) {
            s_log.info("Not author " + profile.getUserUuid() + " request " + uuid);
            return s_noProfile;
        }
        boolean save = false;
        String name = form.getFirstName();

        if (name != null) {
            save = true;
            profile.setFirstName(name);
        }
        name = form.getLastName();
        if (name != null) {
            save = true;
            profile.setLastName(name);
        }
        name = form.getHomeTown();
        if (name != null) {
            save = true;
            profile.setHomeTown(name);
        }
        name = form.getState();
        if (name != null) {
            save = true;
            profile.setState(name);
        }
        name = form.getCountry();
        if (name != null) {
            save = true;
            profile.setCountry(name);
        }
        if (save == true) {
            profileSvc.saveProfile(profile);
        }
        LoginResponse res = new LoginResponse(profile, request, session, false);
        name = form.getPassword0();
        if (name != null) {
            String verf = form.getPassword1();
            if (verf == null || !verf.equals(name)) {
                res.setMessage("Password verification failed");
            } else {
                String mesg = userService.changePassword(
                        profile.fetchUserId(), form.getCurPasswd(), name);
                res.setMessage(mesg);
            }
        } else {
            res.setMessage("ok");
        }
        return res;
    }
}
