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
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

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
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.CommentForm;
import com.tvntd.forms.PostForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Comment;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleDTOResponse;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.ICommentService.CommentDTOResponse;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.ITimeLineService;
import com.tvntd.service.api.ImageUploadResp;
import com.tvntd.service.api.LoginResponse;
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

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public LoginResponse user(HttpSession session, HttpServletRequest reqt)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        LoginResponse resp = new LoginResponse(profile, reqt);
        ApiPath.fillLoginResponse(resp, profile, authorSvc);
        return resp;
    }

    /**
     * Get user articles.
     */
    @RequestMapping(value = "/user/get-posts/{userUuid}", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getSavedPosts(Locale locale, HttpSession session,
            @PathVariable(value = "userUuid") String uuid)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        UUID userUuid = null;
        LinkedList<ArticleDTO> saved = null;
          
        try {
            userUuid = UUID.fromString(uuid);
        } catch(Exception e) {
            s_log.info("Invalid uuid " + uuid);
            return s_noProfile;
        }
        if (!userUuid.equals(profile.getUserUuid())) {
            profile = profileSvc.getProfile(userUuid);
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
        if (form.getTopic() == null) {
            form.setTopic("");
        }
        if (form.getContent() == null) {
            form.setContent("");
        }
        ArticleDTO art = genPendPost(profile, true, form.getArticleUuid());
        art.applyForm(form, publish);

        if (publish == true) {
            art.fetchArticle().markActive();
            art.convertUTF();
            articleSvc.saveArticle(art);

            // We're done with the current post.
            profile.assignPendPost(null);
            profile.pushPublishArticle(art);

            byte[] brief = Jsoup.parse(art.getContent()).text().getBytes();
            timeLineSvc.saveTimeLine(profile.getUserUuid(),
                    UUID.fromString(art.getArticleUuid()), null,
                    Arrays.copyOfRange(brief, 0, 200));
        } else {
            articleSvc.saveArticle(art);
            profile.pushSavedArticle(art);
        }
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
    genPendPost(ProfileDTO profile, boolean creat, String artUuid)
    {
        ArticleDTO pendPost = profile.fetchPendPost();

        if (pendPost != null) {
            return pendPost;
        }
        UUID articleUuid = Util.toUuid(artUuid);
        if (articleUuid != null) {
            pendPost = articleSvc.getArticle(articleUuid);
        }
        if (creat == true && pendPost == null) {
            UUID authorUuid = profile.getUserUuid();
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
        return null;
    }
}
