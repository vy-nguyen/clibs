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

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.tvntd.forms.AdsForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.Constants;
import com.tvntd.lib.FileResources;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Profile;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IAdsPostService;
import com.tvntd.service.api.IAdsPostService.AdsPostDTO;
import com.tvntd.service.api.IAdsPostService.AdsPostDTOResponse;
import com.tvntd.service.api.IAnnonService;
import com.tvntd.service.api.IAnnonService.AnnonUserDTO;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArtTagService.ArtTagDTO;
import com.tvntd.service.api.IArtTagService.ArtTagList;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleRankDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.ICommentService.CommentDTOResponse;
import com.tvntd.service.api.IProductService;
import com.tvntd.service.api.IProductService.ProductDTO;
import com.tvntd.service.api.IProductService.ProductDTOResponse;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.ImageUploadResp;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.service.user.AdsPostService;

@Controller
public class PublicPath
{
    static private Logger s_log = LoggerFactory.getLogger(PublicPath.class);
    static ProfileDTO s_publicDto = null;
    static Profile s_public = Profile.publicProfile();

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    private IAuthorService authorSvc;

    @Autowired
    private IArticleService articleSvc;

    @Autowired
    private IArtTagService artTagSvc;

    @Autowired
    private ICommentService commentSvc;

    @Autowired
    private IProductService productSvc;

    @Autowired
    private IAnnonService annonSvc;

    @Autowired
    private IAdsPostService adsSvc;

    /**
     * Handle public pages.
     */
    @RequestMapping(value = "/public/start", method = RequestMethod.GET)
    @ResponseBody
    public StartupResponse
    getStartupMenu(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile != null) {
            StartupResponse result = new StartupResponse(profile, reqt, session, false);
            ApiPath.fillStartupResponse(result, profile,
                    profileSvc, authorSvc, articleSvc, artTagSvc);
            session.removeAttribute("startPage");
            return result;
        }
        if (s_publicDto == null) {
            s_publicDto = new ProfileDTO(s_public);
        }
        annonSvc.getAnnonUser(reqt, resp, session);
        StartupResponse result = new StartupResponse(s_publicDto, reqt, session, true);
        fillStartupPublicResponse(result, s_publicDto);
        session.removeAttribute("startPage");
        return result;
    }

    protected void fillStartupPublicResponse(StartupResponse resp, ProfileDTO profile)
    {
        String publicUuid = com.tvntd.util.Constants.PublicUuid;
        ArtTagList tags = artTagSvc.getUserTagsDTO(publicUuid);
        resp.setPublicTags(tags);

        Map<String, String> artUuids = new HashMap<>();
        Map<String, String> authorUuids = new HashMap<>();
        List<ArtTagDTO> tagList = tags.getPublicTags();

        // Get all authors and articles from public tags.
        //
        for (ArtTagDTO t : tagList) {
            String u = t.getUserUuid();
            if (!u.equals(publicUuid) && (authorUuids.get(u) == null)) {
                authorUuids.put(u, u);
            }
            List<String> ranks = t.getArticleRank();
            for (String r : ranks) {
                if (artUuids.get(r) == null) {
                    artUuids.put(r, r);
                }
            }
        }
        // Get all articles.
        //
        List<ArticleDTO> artList = new LinkedList<>();
        List<ArticleRankDTO> rankList = new LinkedList<>();
        for (Map.Entry<String, String> entry : artUuids.entrySet()) {
            ArticleRank rank = articleSvc.getRank(entry.getKey());
            if (rank != null) {
                rankList.add(new ArticleRankDTO(rank));
            }
            ArticleDTO art = articleSvc.getArticleDTO(entry.getKey());
            if (art != null) {
                artList.add(art);
                String author = art.getAuthorUuid();
                if (authorUuids.get(author) == null) {
                    authorUuids.put(author, author);
                }
            }
        }
        resp.setArtRanks(rankList);
        resp.setArticles(artList);

        // Get all authors.
        //
        List<String> uuids = new LinkedList<>();
        List<ProfileDTO> userList = new LinkedList<>();
        for (Map.Entry<String, String> entry : authorUuids.entrySet()) {
            ProfileDTO user = profileSvc.getProfile(entry.getKey());
            if (user != null) {
                userList.add(user);
                uuids.add(entry.getKey());
            }
        }
        resp.setLinkedUsers(userList);
        ApiPath.fillAuthorTags(resp, profile, uuids, authorSvc);
    }

    /**
     * Get JSON files.
     */
    @RequestMapping(value = "/public/get-json/{dir}/{json}",
            method = RequestMethod.GET, produces = "application/json")
    public void
    getJson(HttpServletRequest reqt,
            @PathVariable(value = "dir") String dirName,
            @PathVariable(value = "json") String fileName,
            HttpServletResponse resp)
    {
        String relPath = dirName + "/" + fileName + ".json";
        URL url = getClass().getClassLoader().getResource(relPath);
        if (url == null) {
            s_log.info("Invalid request " + relPath);
            return;
        }
        File f = new File(url.getFile());

        resp.setContentType("text/html;charset=UTF-8");
        resp.setCharacterEncoding("utf-8");
        try {
            int flen = (int)f.length();
            byte[] buf = FileResources.getBuffer(Constants.FileIOBufferSize);

            DataInputStream dis = new DataInputStream(new FileInputStream(f));
            dis.readFully(buf, 0, flen);
            dis.close();
            resp.getOutputStream().write(buf, 0, flen);

        } catch(IOException e) {
            s_log.info(e.getMessage());
        }
    }

    /**
     * Get comments for articles.
     */
    @RequestMapping(value = "/public/get-comments",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getComments(@RequestBody UuidForm uuids, HttpSession session)
    {
        return commentSvc.getCommentPost(uuids.getUuids());
    }

    /**
     * Get EStore for list of users.
     */
    @RequestMapping(value = "/public/get-estores",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getEStores(@RequestBody UuidForm uuids, HttpSession session)
    {
        if (uuids == null) {
            return UserPath.s_genOkResp;
        }
        List<ProductDTO> list = null;
        String type = uuids.getUuidType();

        if (type.equals("user")) {
            list = productSvc.getProductsByUser(uuids.getUuids());
        } else {
            list = productSvc.getProductsByUuids(uuids.getUuids());
        }
        List<ArticleRankDTO> ranks = articleSvc.getArticleRank(uuids);
        ArrayList<String> artUuids = new ArrayList<>(list.size());
        for (ProductDTO prod : list) {
            artUuids.add(prod.getArticleUuid());
        }
        CommentDTOResponse co = commentSvc.getCommentPost(artUuids);
        return new ProductDTOResponse(list, null, ranks, co.getComments());
    }

    /**
     * Get Articles for list of users.
     */
    @RequestMapping(value = "/public/get-articles",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getArticles(@RequestBody UuidForm uuids, HttpSession session)
    {
        if (uuids == null) {
            return UserPath.s_genOkResp;
        }
        return null;
    }

    /**
     * Get public html files.
     */
    @RequestMapping(value = "/public/get-html/{html}",
            method = RequestMethod.GET, produces = "text/html; charset=utf-8")
    public String getHtml(Map<String, Object> model,
            @PathVariable(value = "html") String html, HttpSession session) {
        return html;
    }

    /**
     * Get public tags and sub tags.
     */
    @RequestMapping(value = "/public/get-tags/{userUuid}", method = RequestMethod.GET)
    @ResponseBody
    public ArtTagList getTagsUser(Locale locale, HttpSession session,
            @PathVariable(value = "userUuid") String uuid) {
        return getUserTags(locale, session, uuid);
    }

    @RequestMapping(value = "/public/get-tags", method = RequestMethod.GET)
    @ResponseBody
    public ArtTagList getPublicTags(Locale locale, HttpSession session) {
        return getUserTags(locale, session, null);
    }

    protected ArtTagList getUserTags(Locale locale, HttpSession session, String uuid)
    {
        if (uuid == null) {
            uuid = com.tvntd.util.Constants.PublicUuid;
        }
        List<ArtTagDTO> result = artTagSvc.getUserTags(uuid);
        return new ArtTagList(result, null);
    }

    /**
     * Upload anonymous ad images for self-service ad posting.
     */
    @RequestMapping(value = "/public/upload-ad-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadAdImage(@RequestParam("name") String name,
            @RequestParam("authorUuid") String authorUuid,
            @RequestParam("articleUuid") String artUuid,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt,
            HttpServletResponse resp, HttpSession session)
    {
        AdsPostDTO ads;
        ObjStore store = ObjStore.getInstance();
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            AnnonUserDTO user = annonSvc.getAnnonUser(reqt, resp, session);
            ads = user.genPendAds();
        } else {
            ads = profile.genPendAds();
        }
        try {
            InputStream is = file.getInputStream();
            ObjectId oid = store.putPublicImg(is, (int)file.getSize());

            if (oid != null) {
                ads.setAdImgOId0(oid.name());
            }
            ImageUploadResp out =
                new ImageUploadResp(ads.getArticleUuid(), ads.getAuthorUuid(), oid);

            out.setLocation(store.imgObjPublicUri(oid));
            return out;

        } catch(IOException e) {
        }
        return UserPath.s_saveObjFailed;
    }

    /**
     * Handle public upload for ads.
     */
    @RequestMapping(value = "/public/publish-ads",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    publishAds(@RequestBody AdsForm form,
            HttpServletRequest reqt, HttpServletResponse resp, HttpSession session)
    {
        AdsPostDTO ads = null;
        AnnonUserDTO user = null;
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            user = annonSvc.getAnnonUser(reqt, resp, session);
            profile = profileSvc.getProfile(user.getUserUuid());
            if (profile == null) {
                // Annon user can only have 1 ad/cookie.
                //
                adsSvc.deleteAnnonAds(user.getUserUuid());
            }
            ads = user.genPendAds();
        } else {
            ads = profile.genPendAds();
        }
        if (form.cleanInput() == false) {
            return UserPath.s_saveObjFailed;
        }
        AdsPostService.applyPostAds(form, ads);
        adsSvc.saveAds(ads);

        ArticleRank rank = authorSvc.createAdsRank(ads.fetchAdPost(), form, user);
        ads.setAdsRank(new ArticleRankDTO(rank));

        artTagSvc.addPublicTagPost(form.getBusCat(), ads.getArticleUuid());
        if (profile != null) {
            profile.assignPendAds(null);
        }
        if (user != null) {
            user.assignPendAds(null);
        }
        ads.convertUTF();
        return ads;
    }

    /**
     * Get ads based on requested uuids.
     */
    @RequestMapping(value = "/public/get-ads",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    getPublicAds(@RequestBody UuidForm uuids, HttpSession session)
    {
        if (uuids == null) {
            return UserPath.s_genOkResp;
        }
        /*
        if (uuids.cleanInput() == false) {
            return UserPath.s_invalidArticle;
        }
        */
        List<AdsPostDTO> ads = adsSvc.getAdsPostByUuids(uuids.getUuids());
        ArrayList<String> artUuids = new ArrayList<>(ads.size());

        for (AdsPostDTO a : ads) {
            artUuids.add(a.getArticleUuid());
        }
        CommentDTOResponse co = commentSvc.getCommentPost(artUuids);
        return new AdsPostDTOResponse(ads, co.getComments());
    }

    /**
     * Get a public URL article.
     */
    @RequestMapping(value = "/public/article/{tag}/{title}", method = RequestMethod.GET)
    public String
    getPublicUrl(@PathVariable(value = "tag") String tag,
            @PathVariable(value = "title") String title,
            HttpSession session, HttpServletRequest request, HttpServletResponse resp)
    {
        session.setAttribute("startPage", "load tag=" + tag + " title=" + title);
        return "tvntd";
    }

    /**
     * Test hook
     */
    @RequestMapping(value = "/public/api/{x}/{y}", method = RequestMethod.GET)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public void
    postApiTest(HttpSession session, HttpServletResponse resp,
            @PathVariable(value = "x") String x,
            @PathVariable(value = "y") String y)
    {
        String buf = "hello world x = " + x + ", y = " + y;
        System.out.println("Input x = " + x + ", y = " + y);
        resp.setContentType("text/html;charset=UTF-8");
        resp.setCharacterEncoding("utf-8");
        try {
            resp.getOutputStream().write(buf.getBytes("utf-8"), 0, buf.length());
        } catch(IOException e) {
        }
    }
}
