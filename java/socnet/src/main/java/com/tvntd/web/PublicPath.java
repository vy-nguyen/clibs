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
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.maps.model.GeocodingResult;
import com.tvntd.forms.AdsForm;
import com.tvntd.forms.AdsRequest;
import com.tvntd.forms.AdsRoomForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.lib.Constants;
import com.tvntd.lib.FileResources;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.ArtAdsDTO;
import com.tvntd.service.api.ArtAdsDTO.BusAdsDTO;
import com.tvntd.service.api.ArtProductDTO;
import com.tvntd.service.api.ArtRoomAdsDTO;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IAdsPostService.AdsPostDTOResponse;
import com.tvntd.service.api.IAnnonService;
import com.tvntd.service.api.IAnnonService.AnnonUserDTO;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArtTagService.ArtTagDTO;
import com.tvntd.service.api.IArtTagService.ArtTagList;
import com.tvntd.service.api.IArticleService.ArticleDTOResponse;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.IArticleSvc.ArticleBriefDTO;
import com.tvntd.service.api.IArticleSvc.ArticlePostDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.ICommentService.CommentDTOResponse;
import com.tvntd.service.api.IDomainService;
import com.tvntd.service.api.IMapService;
import com.tvntd.service.api.IProductService.ProductDTOResponse;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.ImageUploadResp;
import com.tvntd.service.api.RoomAdsResponse;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.service.user.ArticleSvc;

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
    private IArtTagService artTagSvc;

    @Autowired
    private ICommentService commentSvc;

    @Autowired
    private IAnnonService annonSvc;

    @Autowired
    private IDomainService domainSvc;

    @Autowired
    private IArticleSvc artSvc;

    @Autowired
    private IMapService mapSvc;

    /**
     * Handle public pages.
     */
    @RequestMapping(value = "/domain/{name}", method = RequestMethod.GET)
    public String letamanh(Map<String, Object> model,
            @PathVariable(value = "name") String name, HttpSession session)
    {
        System.out.println("Hit domain page " + name);
        session.setAttribute("domain", name);
        model.put("domain", name);
        return "tvntd";
    }

    @RequestMapping(value = "/public/start", method = RequestMethod.GET)
    @ResponseBody
    public StartupResponse
    getStartupMenu(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        StartupResponse result;
        String domain = (String) session.getAttribute("domain");
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile != null) {
            result = new StartupResponse(profile, reqt, session, false);
            domainSvc.fillStartupAccount(result, domain, profile);
        } else {
            if (s_publicDto == null) {
                s_publicDto = new ProfileDTO(s_public);
            }
            annonSvc.getAnnonUser(reqt, resp, session);
            result = new StartupResponse(s_publicDto, reqt, session, true);
            domainSvc.fillStartupDomain(result, domain, s_publicDto);
        }
        session.removeAttribute("startPage");
        return result;
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
        String type = uuids.getUuidType();
        List<ArtProductDTO> prodList = null;
        List<String> uuidList = new LinkedList<>();

        for (String uid : uuids.getUuids()) {
            uuidList.add(uid);
        }
        if (type.equals("user")) {
            prodList = artSvc.getArtProductDTOByOnwer(uuidList);
        } else {
            prodList = artSvc.getArtProductDTO(uuidList);
        }
        List<ArticleBriefDTO> ranks = artSvc.getArticleBriefDTO(uuids);
        CommentDTOResponse co = commentSvc.getCommentPost(uuidList);
        return new ProductDTOResponse(prodList, null, ranks, co.getComments());
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
        List<String> input = new ArrayList<>();
        for (String u : uuids.getUuids()) {
            input.add(u);
        }
        List<ArticlePostDTO> arts = artSvc.getArticleDTO(input);
        System.out.println("Result art lengh " + arts.size());
        return new ArticleDTOResponse(arts, null);
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
        ArtAdsDTO ads;
        ObjStore store = ObjStore.getInstance();
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            AnnonUserDTO user = annonSvc.getAnnonUser(reqt, resp, session);
            ads = user.genPendArtAds();
        } else {
            ads = profile.genPendArtAds();
        }
        try {
            InputStream is = file.getInputStream();
            ObjectId oid = store.putPublicImg(is, (int)file.getSize());

            System.out.println("Save oid img " + oid.name());
            if (oid != null) {
                ads.setAdImgOid0(oid.name());
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
        BusAdsDTO ads = null;
        AnnonUserDTO user = null;
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            user = annonSvc.getAnnonUser(reqt, resp, session);
            profile = profileSvc.getProfile(user.getUserUuid());
            if (profile == null) {
                // Annon user can only have 1 ad/cookie.
                //
                artSvc.deleteAnnonAds(user.getUserUuid());
            }
            ads = user.genPendArtAds();
        } else {
            ads = profile.genPendArtAds();
        }
        if (form.cleanInput() == false) {
            System.out.println("Failed to validate ads input...");
            return UserPath.s_saveObjFailed;
        }
        ArticleSvc.applyPostAds(form, ads, mapSvc);
        authorSvc.createAdsRank(ads.fetchAds(), user);
        artSvc.saveArtAds(ads);
        artTagSvc.addPublicTagPost(form.getBusCat(), ads.getArticleUuid());

        if (profile != null) {
            profile.assignPendAds(null);
        }
        if (user != null) {
            user.assignPendAds(null);
        }
        return ads;
    }

    @RequestMapping(value = "/public/publish-room-ads",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    publishRoomAds(@RequestBody AdsRoomForm form,
            HttpServletRequest reqt, HttpServletResponse resp, HttpSession session)
    {
        BusAdsDTO ads = null;
        AnnonUserDTO user = null;
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            user = annonSvc.getAnnonUser(reqt, resp, session);
            profile = profileSvc.getProfile(user.getUserUuid());
            ads = user.genPendArtAds();
        } else {
            ads = profile.genPendArtAds();
        }
        if (form.cleanInput() == false) {
            s_log.info("Failed to validate ads form");
            return UserPath.s_saveObjFailed;
        }
        ArtRoomAdsDTO save = ArticleSvc.applyPostAds(form, ads, mapSvc);
        if (save.getError() == null) {
            artSvc.saveArtAds(save);
        }
        if (profile != null) {
            profile.assignPendAds(null);
        }
        if (user != null) {
            user.assignPendAds(null);
        }
        return save;
    }

    @RequestMapping(value = "/public/get-room-ads",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    publicGetRoomAds(@RequestBody AdsRequest form)
    {
        List<ArtRoomAdsDTO> ads = new LinkedList<>();
        RoomAdsResponse out = new RoomAdsResponse(null);

        form.cleanInput();
        if (form.getState() != null) {
            ads.addAll(artSvc.getRoomAds(form.getState(), IArticleSvc.STATE));
        } else {
            if (form.getCity() != null) {
                ads.addAll(artSvc.getRoomAds(form.getCity(), IArticleSvc.CITY));
            }
            if (form.getZip() != null) {
                ads.addAll(artSvc.getRoomAds(form.getZip(), IArticleSvc.ZIP));
            }
        }
        if (ads.isEmpty()) {
            ads.addAll(artSvc.getRoomAdsByPrice(
                        form.getRentPriceLo(), form.getRentPriceHi()));
        }
        for (ArtRoomAdsDTO a : ads) {
            out.addAds(a);
        }
        return out;
    }

    @RequestMapping(value = "/public/get-feature-ads",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    publicGetFeatureAds(@RequestBody AdsRequest form)
    {
        List<ArtRoomAdsDTO> ads;
        System.out.println(">>> get feature ads");

        RoomAdsResponse out = new RoomAdsResponse("ok");

        ads = artSvc.getRoomAdsByPrice(null, null);
        out.loadJson("adfeature.json");

        for (ArtRoomAdsDTO a : ads) {
            out.addAds(a);
        }
        return out;
    }
 
    @RequestMapping(value = "/public/ads/room", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    publicGetRoomAds(HttpSession session, HttpServletResponse resp)
    {
        List<ArtRoomAdsDTO> ads;
        RoomAdsResponse out = new RoomAdsResponse(null);

        ads = artSvc.getRoomAdsByPrice(null, null);
        for (ArtRoomAdsDTO a : ads) {
            out.addAds(a);
        }
        return out;
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
        List<String> artUuids = new LinkedList<>();
        for (String uid : uuids.getUuids()) {
            artUuids.add(uid);
        }
        List<ArtAdsDTO> ads = artSvc.getArtAdsDTO(artUuids);
        CommentDTOResponse co = commentSvc.getCommentPost(artUuids);
        return new AdsPostDTOResponse(ads, co.getComments());
    }

    @RequestMapping(value = "/public/get-domain",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public StartupResponse
    getDomainData(@RequestBody UuidForm uuids, HttpSession session)
    {
        if (uuids == null) {
            return new StartupResponse(null);
        }
        System.out.println("Request domain " + uuids.getAuthorUuid() +
                ", type " + uuids.getUuidType());
        StartupResponse resp = new StartupResponse(uuids.getAuthorUuid());
        domainSvc.fillDomainData(resp, uuids);
        return resp;
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
        ArticleBriefDTO rank = artSvc.getArticleBriefDTO(tag, title);
        if (rank != null) {
            session.setAttribute("startPage", "load author=" +
                    rank.getAuthorUuid() + " articleUuid=" + rank.getArticleUuid());
        } else {
            session.setAttribute("startPage", "load author=0 articleUuid=0");
        }
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

        if (x.equals("gen")) {
            System.out.println("Generate dbase for known locations...");
            mapSvc.genKnownLocations();
        } else {
            GenericResponse out = new GenericResponse("");
            GeocodingResult result = mapSvc.mapZipLocation("94566", out);
            if (result != null) {
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                System.out.println(gson.toJson(result.addressComponents));
            } else {
                System.out.println("Invalid zip: " + out.getMessage());
            }
        }
        resp.setContentType("text/html;charset=UTF-8");
        resp.setCharacterEncoding("utf-8");

        try {
            resp.getOutputStream().write(buf.getBytes("utf-8"), 0, buf.length());
        } catch(IOException e) {
        }
    }
}
