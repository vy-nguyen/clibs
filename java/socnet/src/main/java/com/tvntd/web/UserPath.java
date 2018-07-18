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
import java.util.HashMap;
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
import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.dto.TransactionDTO.TransListDTO;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.forms.ArticleForm;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.CommentForm;
import com.tvntd.forms.DomainForm;
import com.tvntd.forms.EtherPay;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.ProductForm;
import com.tvntd.forms.QuestionForm;
import com.tvntd.forms.TagForm;
import com.tvntd.forms.TagForm.ArtRankInfo;
import com.tvntd.forms.TagForm.TagArtRank;
import com.tvntd.forms.TagForm.TagOrderResponse;
import com.tvntd.forms.TagForm.TagRank;
import com.tvntd.forms.UserProfile;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.lib.RawParseUtils;
import com.tvntd.models.ArtProduct;
import com.tvntd.models.ArticleAttr;
import com.tvntd.models.Comment;
import com.tvntd.models.Profile;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.ArtProductDTO;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleService.ArticleDTOResponse;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.IArticleSvc.ArticleBriefDTO;
import com.tvntd.service.api.IArticleSvc.ArticlePostDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.ICommentService.CommentDTOResponse;
import com.tvntd.service.api.ICommentService.CommentRespDTO;
import com.tvntd.service.api.IDomainService;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.IQuestionSvc;
import com.tvntd.service.api.IQuestionSvc.QuestionDTO;
import com.tvntd.service.api.IQuestionSvc.QuestionDTOResponse;
import com.tvntd.service.api.IUserService;
import com.tvntd.service.api.ImageUploadResp;
import com.tvntd.service.api.LoginResponse;
import com.tvntd.service.api.UuidResponse;
import com.tvntd.service.api.WalletResponse;
import com.tvntd.service.user.ArtTagService;
import com.tvntd.service.user.ArticleSvc;
import com.tvntd.util.Constants;
import com.tvntd.util.Util;

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
    private IAuthorService authorSvc;

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    private IUserService userService;

    @Autowired
    private ICommentService commentSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @Autowired
    protected IDomainService domainSvc;

    @Autowired
    protected IArticleSvc artSvc;

    @Autowired
    protected IQuestionSvc questSvc;

    @Autowired
    protected IAccountSvc acctSvc;

    @Autowired
    protected ITransactionSvc transSvc;

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public LoginResponse user(HttpSession session, HttpServletRequest reqt)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        LoginResponse resp = new LoginResponse(profile, reqt, session, false);

        domainSvc.fillLoginResponse(resp, profile);
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
        LinkedList<ArticlePostDTO> saved = null;
          
        if (!uuid.equals(profile.getUserUuid())) {
            profile = profileSvc.getProfile(uuid);
            if (profile == null) {
                s_log.info("Invalid uuid " + uuid);
                return s_noProfile;
            }
        } else {
            saved = profile.fetchSavedArts();
        }
        LinkedList<ArticlePostDTO> published = profile.fetchPublishedArts();
        if (published != null) {
            return new ArticleDTOResponse(published, saved);
        }
        if (saved == null) {
            saved = new LinkedList<>();
        }
        published = new LinkedList<>();
        List<ArticlePostDTO> all = artSvc.getArticleDTOByAuthor(profile.getUserUuid());

        for (ArticlePostDTO art : all) {
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
        /*
        if (uuids.cleanInput() == false) {
            return s_noProfile;
        }
        */
        List<String> input = new LinkedList<>();
        for (String u : uuids.getUuids()) {
            input.add(u);
        }
        List<ArticlePostDTO> arts = artSvc.getArticleDTO(input);
        return new ArticleDTOResponse(arts, null);
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
        ArticlePostDTO art = genPendPost(profile, true, form.getArticleUuid());
        art.assignArtBrief(artSvc.savePost(form, art, profile, publish, false));
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
        return updatePost(form, session, true);
    }

    /**
     * Handler to update/re-edit article.
     */
    protected GenericResponse
    updatePost(PostForm form, HttpSession session, boolean publish)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        if (form.cleanInput() == false) {
            return s_badInput;
        }
        String artUuid = form.getArticleUuid();
        ArticlePostDTO art = artSvc.getArticleDTO(artUuid);

        if (art == null) {
            Long id = profile.fetchUserId();
            art = new ArticlePostDTO(artUuid, profile.getUserUuid(), id);
        }
        artSvc.savePost(form, art, profile, publish, true);
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
            if (artSvc.deleteArticlePost(uid, profile) == null) {
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
        ArtProductDTO artProd = genPendProduct(profile, true, form.getArticleUuid());
        ArticleSvc.applyPostProduct(form, artProd, publish);
        artSvc.saveArtProduct(artProd);

        if (publish == true) {
            profile.assignPendProduct(null);
            profile.pushPublishProduct(artProd);
        } else {
            artSvc.saveArtProduct(artProd);
            profile.pushSavedProduct(artProd);
        }
        authorSvc.createProductRank(artProd.fetchProduct());

        // Publish the product to public space.
        //
        String pubTag = form.getPubTag();
        if (publish == true && pubTag != null) {
            artTagSvc.addPublicTagPost(pubTag, artProd.getArticleUuid());
        }
        return artProd;
    }

    /**
     * Upload images for the pending article.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/upload-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImage(@RequestParam("name") String name,
            @RequestParam("formId") String formId,
            @RequestParam("imageId") String imgId,
            @RequestParam("authorUuid") String authorUuid,
            @RequestParam("articleUuid") String artUuid,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        ArticlePostDTO art = genPendPost(profile, true, artUuid);
        try {
            Long userId = profile.fetchUserId();
            String uid  = userId.toString();
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putUserImage(is, (int)file.getSize(), uid);

            if (oid != null) {
                art.addPicture(oid);
                art.assignUploadImg(imgId, oid);
            }
            if (formId != null) {
                art.assignUploadFormId(formId);
            }
            ImageUploadResp resp =
                new ImageUploadResp(art.getArticleUuid(), art.getAuthorUuid(), oid);

            resp.setLocation(ArticleBriefDTO.getPictureUrl(userId, oid));
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
        ArtProductDTO prod = genPendProduct(profile, true, artUuid);
        try {
            Long userId    = profile.fetchUserId();
            String uid     = userId.toString();
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid   = store.putUserImage(is, (int)file.getSize(), uid);

            if (oid != null) {
                ImageUploadResp resp = new ImageUploadResp(
                        prod.getArticleUuid(), prod.getAuthorUuid(), oid);

                resp.setPostUrl(url);
                resp.setLocation(ArticleBriefDTO.getPictureUrl(userId, oid));

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
    private ArticlePostDTO
    genPendPost(ProfileDTO profile, boolean creat, String articleUuid)
    {
        ArticlePostDTO pendPost = profile.fetchPendPost();

        if (pendPost != null) {
            return pendPost;
        }
        if (articleUuid != null) {
            pendPost = artSvc.getArticleDTO(articleUuid);
        }
        if (creat == true && pendPost == null) {
            String authorUuid = profile.getUserUuid();
            pendPost = new ArticlePostDTO(authorUuid, profile.toProfile().getUserId());
        }
        if (pendPost != null) {
            profile.assignPendPost(pendPost);
        }
        return pendPost;
    }

    /**
     * Generate or retrieve a pending product listing.
     */
    private ArtProductDTO
    genPendProduct(ProfileDTO profile, boolean creat, String articleUuid)
    {
        ArtProductDTO product = profile.fetchPendProduct();

        if (product != null) {
            return product;
        }
        if (articleUuid != null) {
            product = artSvc.getArtProductDTO(articleUuid);
        }
        if (creat == true && product == null) {
            String authorUuid = profile.getUserUuid();
            Long userId = profile.toProfile().getUserId();
            product = new ArtProductDTO(new ArtProduct(authorUuid, userId));
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
        for (String uid : uuids.getUuids()) {
            artSvc.deleteArtProduct(uid, profile);
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
        ArticleAttr attr = null;
        CommentRespDTO resp = new CommentRespDTO(form);

        if (form.isArticle() == true) {
            attr = artSvc.updateArtAttr(form, profile);
            resp.updateArticleAttr(attr);
        } else {
            attr = commentSvc.updateComment(form, profile);
            resp.updateArticleAttr(attr);
        }
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
        List<String> uuidList = new LinkedList<>();
        for (String uid : uuids.getUuids()) {
            uuidList.add(uid);
        }
        return new ArticleDTOResponse(artSvc.getArticleBriefDTO(uuidList));
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
        return artSvc.updateArtBrief(form);
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
            s_log.info("Session doesn't have profile");
            return s_noProfile;
        }
        String uuid = form.getUserUuid();
        if (!profile.getUserUuid().equals(uuid)) {
            s_log.info("Not author " + profile.getUserUuid() + " request " + uuid);
            return s_noProfile;
        }

        TagRank[] tagRanks = form.getTagRanks();
        Map<String, TagRank> dict = ArtTagService.fixupTagList(tagRanks);
        if (tagRanks != null) {
            for (TagRank r : tagRanks) {
                if (r.isPubTag() == false && r.isArticle() == false) {
                    artTagSvc.saveTag(uuid, r.getTagName(), r.getParent(), r.getRank());
                }
            }
        }
        AuthorTagRespDTO ownerTags = authorSvc.getAuthorTag(uuid);
        TagOrderResponse resp =
            new TagOrderResponse(uuid, form.getTagRanks(), form.getArtList());

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
            String tagName = r.getTagName();
            List<String> artUuids = new LinkedList<>();
            Map<String, ArtRankInfo> artOrder = new HashMap<>();
            String[] uuidList = r.getArtUuid();

            if (uuidList != null) {
                Long order = 10L;
                for (String s : uuidList) {
                    artOrder.put(s, new ArtRankInfo(tagName, s, order));
                    artUuids.add(s);
                    order++;
                }
            }
            ArtRankInfo[] ranks = r.getArtRanks();
            if (ranks != null) {
                for (ArtRankInfo info : ranks) {
                    String s = info.getArtUuid();
                    artUuids.add(s);
                    artOrder.put(s, info); 
                }
            }
            List<ArticleBriefDTO> artRank = artSvc.getArticleBriefDTO(artUuids);
            for (ArticleBriefDTO rank : artRank) {
                ArtRankInfo info = artOrder.get(rank.getArticleUuid());

                if (info == null) {
                    rank.setRank(10L);
                } else {
                    rank.setRank(info.getOrder());
                    rank.setTagName(info.getTagName());
                }
                artSvc.saveArticleBrief(artRank);
            }
            artOrder.clear();
            artRank.clear();
        }
        return resp;
    }

    /**
     * Update tag ranking.
     */
    @RequestMapping(value = "/user/delete-tag",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    deleteTag(@RequestBody TagForm form, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            s_log.info("Session doesn't have profile");
            return s_noProfile;
        }
        String uuid = form.getUserUuid();
        if (!profile.getUserUuid().equals(uuid)) {
            s_log.info("Not author " + profile.getUserUuid() + " request " + uuid);
            return s_noProfile;
        }
        TagRank[] tagRanks = form.getTagRanks();
        if (tagRanks != null) {
            for (TagRank r : tagRanks) {
                artTagSvc.deleteTag(r.getTagName(), uuid);
            }
        }
        return new TagOrderResponse(uuid, form.getTagRanks(), null);
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
        boolean save = form.updateProfile(profile);
        if (save == true) {
            profileSvc.saveProfile(profile);
        }
        LoginResponse res = new LoginResponse(profile, request, session, false);

        String name = form.getPassword0();
        if (name != null && !name.isEmpty()) {
            String verf = form.getPassword1();
            if (verf == null || !verf.equals(name)) {
                res.setError(GenericResponse.REG_FAILED, "Passwords don't match");
            } else {
                String mesg = userService.changePassword(
                        profile.fetchUserId(), form.getCurPasswd(), name);
                if (mesg != null) {
                    res.setError(GenericResponse.REG_FAILED, mesg);
                }
            }
        }
        name = Util.toMaxString(form.getDomain(), 64);
        if (name != null) {
            if (domainSvc.saveDomain(name, profile) == false) {
                res.setError(GenericResponse.USER_ERROR, "Domain was taken");
            }
        }
        return res;
    }

    /**
     * Change domain info.
     */
    @RequestMapping(value = "/user/update-domain",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    updateDomain(@RequestBody DomainForm form,
            HttpServletRequest request, HttpSession session)
    {
        if (form.cleanInput() == false) {
            return s_badInput;
        }
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        ArticlePostDTO pend = profile.fetchPendPost();
        if (pend == null) {
            pend = new ArticlePostDTO(profile.getUserUuid(), profile.fetchUserId());
        }
        domainSvc.updateDomain(profile.getDomain(), form, pend, profile);
        profile.assignPendPost(null);

        return new LoginResponse(profile, request, session, false);
    }

    /**
     * Post questions for an article.
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/post-question",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    postQuestionForm(@RequestBody QuestionForm form, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        if (form.cleanInput() == false) {
            return s_noProfile;
        }
        List<String> pictures = null;
        ArticlePostDTO art = genPendPost(profile, false, null);

        if (art != null) {
            // Have upload pictures.  Clear out the pending post.
            //
            pictures = art.fetchPictureOids();
            profile.assignPendPost(null);
        }
        QuestionDTO out = questSvc.processForm(form, profile, pictures);
        return new QuestionDTOResponse(out);
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/get-question",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getQuestion(@RequestBody UuidForm form, HttpSession session)
    {
        if (form.cleanInput() == false) {
            return s_badInput;
        }
        return questSvc.getQuestion(form);
    }

    /**
     * User Wallet and Accounts
     */
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/tudo/create/{walletUuid}/{name}",
            method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    createEtherAccount(HttpSession session,
            @PathVariable(value = "walletUuid") String walletUuid,
            @PathVariable(value = "name") String name)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        Profile p = profile.fetchProfile();
        WalletInfoDTO w = acctSvc.createWallet(Util.fromRawByte(p.getFirstName()),
                Constants.TudoAcct, "password", walletUuid, profile.getUserUuid());

        List<WalletInfoDTO> wallets = new LinkedList<>();
        wallets.add(w);
        return new WalletResponse(wallets);
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/tudo/wallet", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse getWallet(HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return new WalletResponse(acctSvc.getWallet(profile.getUserUuid()));
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/tudo/pay",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public Object payEther(@RequestBody EtherPay pay, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        if (pay.cleanInput() == false) {
            return s_badInput;
        }
        String ownerUuid = profile.getUserUuid();
        if (!ownerUuid.equals(pay.getOwnerUuid())) {
            return s_badInput;
        }
        TransactionDTO tx = acctSvc.payAccount(ownerUuid, pay.getToUuid(),
                pay.getFromAccount(), pay.getToAccount(),
                pay.getXuAmount(), pay.getText());

        if (tx != null) {
            return tx;
        }
        return new GenericResponse("Failed to submit transaction");
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/tudo/trans-from/{start}/{count}",
            method = RequestMethod.GET)
    @ResponseBody
    public Object getEtherTransaction(HttpSession session,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return getEtherTransaction(profile, true, start, count);
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/tudo/trans-to/{start}/{count}",
            method = RequestMethod.GET)
    @ResponseBody
    public Object getEtherTransactionTo(HttpSession session,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return getEtherTransaction(profile, false, start, count);
    }

    protected TransListDTO
    getEtherTransaction(ProfileDTO profile, boolean from, String start, String count)
    {
        int beg = RawParseUtils.parseNumber(start, 0, Integer.MAX_VALUE);
        int cnt = RawParseUtils.parseNumber(count, 1, 1000);

        return new TransListDTO(transSvc
                .getTransactionAcct(profile.getUserUuid(), beg, cnt, from));
    }
}
