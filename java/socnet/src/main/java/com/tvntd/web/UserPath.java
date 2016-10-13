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
import com.tvntd.forms.ArticleForm;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.CommentForm;
import com.tvntd.forms.PostForm;
import com.tvntd.forms.TagForm;
import com.tvntd.forms.TagForm.TagArtRank;
import com.tvntd.forms.TagForm.TagRank;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Author;
import com.tvntd.models.Comment;
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
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.ITimeLineService;
import com.tvntd.service.api.ImageUploadResp;
import com.tvntd.service.api.LoginResponse;
import com.tvntd.service.user.ArticleService;

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

    @Autowired
    private IArticleService articleSvc;

    @Autowired
    private IAuthorService authorSvc;

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    private ITimeLineService timeLineSvc;

    @Autowired
    private ICommentService commentSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public LoginResponse user(HttpSession session, HttpServletRequest reqt)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        LoginResponse resp = new LoginResponse(profile, reqt);
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
            return s_noProfile;
        }
        ArticleDTO art = genPendPost(profile, true, form.getArticleUuid());
        Article article = art.fetchArticle();
        ArticleService.applyPostForm(form, article, publish);

        if (publish == true) {
            art.fetchArticle().markActive();
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
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putUserImage(is,
                    (int)file.getSize(), profile.fetchUserId() .toString());

            if (oid != null) {
                art.addPicture(oid);
            }
            ImageUploadResp resp = new ImageUploadResp(art.getArticleUuid(),
                    profile.getUserUuid().toString(), oid);

            resp.setImgObjUrl(store.imgUserObjUri(oid,
                        profile.fetchUserId().toString()));
            return resp;

        } catch(IOException e) {
        }
        return s_saveObjFailed;
    }

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

                resp.setImgObjUrl(store.imgObjUri(oid, ProfileDTO.getImgBaseUrl()));
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
        if (!form.getTitle().isEmpty()) {
            System.out.println("Change title to " + form.getTitle());
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

        Map<String, TagRank> req = new HashMap<>();
        for (TagRank r : form.getTagRanks()) {
            req.put(r.getTagName(), r);
        }

        AuthorTagRespDTO ownerTags = authorSvc.getAuthorTag(uuid);
        if (ownerTags == null) {
            return s_genOkResp;
        }
        List<AuthorTagDTO> tags = ownerTags.getAuthorTags();
        for (AuthorTagDTO t : tags) {
            TagRank rank = req.get(t.getTagName());
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
        return s_genOkResp;
    }
}
