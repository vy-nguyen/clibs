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
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dto.WalletInfoDTO;
import com.tvntd.forms.UserConnectionForm;
import com.tvntd.forms.UserEmailForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.IArticleSvc.ArticleDTOResponse;
import com.tvntd.service.api.IArticleSvc.ArticlePostDTO;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IDomainService;
import com.tvntd.service.api.IMenuItemService;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.IUserNotifService;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.service.api.UserConnectionChange;
import com.tvntd.service.api.UserNotifResponse;
import com.tvntd.service.api.WalletResponse;
import com.tvntd.util.Constants;
import com.tvntd.util.Util;

@Controller
public class ApiPath
{
    static private Logger s_log = LoggerFactory.getLogger(ApiPath.class);
    static private GenericResponse s_genOkResp = new GenericResponse("ok");

    @Autowired
    private IMenuItemService menuItemSvc;

    @Autowired
    private IUserNotifService userNotifSvc;

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @Autowired
    protected IDomainService domainSvc;

    @Autowired
    protected CommonsMultipartResolver multipartResolver;

    @Autowired
    protected IProfileService profileSvc;

    @Autowired
    protected IArticleSvc artSvc;

    @Autowired
    protected ITransactionSvc etherSvc;

    @Autowired
    protected IAccountSvc acctSvc;

    /**
     * Handle Api REST calls.
     */
    @RequestMapping(value = "/api/user-notification", method = RequestMethod.GET)
    @ResponseBody
    public UserNotifResponse
    getUserNotification(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        Long userId = menuItemSvc.getPublicId();
        User user = (User) session.getAttribute("user");

        if (user != null) {
            userId = 0L;
        }
        return userNotifSvc.getUserNotif(userId);
    }

    /**
     * Get public user articles.
     */
    @RequestMapping(value = "/api/user-articles", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getUserArticles(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return UserPath.s_noProfile;
        }
        List<ArticlePostDTO> articles =
            artSvc.getArticleDTOByAuthor(profile.getUserUuid());
        
        return new ArticleDTOResponse(articles, null, null);
    }

    /**
     * Get user profile.
     */
    @RequestMapping(value = "/api/user", method = RequestMethod.GET)
    @ResponseBody
    public StartupResponse
    getStartupMenu(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (session.getAttribute("user") == null || profile == null) {
            return null;
        }
        String domain = (String) session.getAttribute("domain");
        StartupResponse result = new StartupResponse(profile, reqt, session, false);
        domainSvc.fillStartupAccount(result, domain, profile);
        result.setPublicAcct(etherSvc.getPublicAccount());
        return result;
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/api/upload-img", method = RequestMethod.POST)
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
            return null;
        }
        try {
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putImage(is, (int) file.getSize());

            if (oid != null) {
                profileSvc.saveUserImgUrl(profile, oid);
            }
        } catch(IOException e) {
            s_log.info("Exception: " + e.toString());
        }
        return s_genOkResp;
    }

    @RequestMapping(value = "/api/upload-img-list", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImageList(@RequestParam("name") String[] names,
            @RequestParam("file") MultipartFile[] files)
    {
        if (files.length != names.length) {
            return new GenericResponse("failure", "Miss-match input length");
        }
        return s_genOkResp;
    }

    /**
     * Request connect, follow other users.
     */
    @RequestMapping(value = "/api/user-connections",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    changeUserConnections(@RequestBody UserConnectionForm form,
            HttpServletRequest request, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            return new GenericResponse("failure", "Invalid session");
        }
        String[] uuids = form.getFollow();
        HashMap<String, ProfileDTO> pending = new HashMap<>();

        if (uuids != null) {
            profileSvc.followProfiles(profile, uuids, pending);
        }
        uuids = form.getConnect();
        if (uuids != null) {
            profileSvc.connectProfiles(profile, uuids, pending);
        }
        if (!pending.isEmpty()) {
            pending.put(profile.getUserUuid(), profile);
            for (Map.Entry<String, ProfileDTO> entry : pending.entrySet()) {
                profileSvc.saveProfile(entry.getValue());
            }
            int i = 0;
            List<String> connect = profile.getConnectList();
            String[] connUuid = new String[connect.size()];
            for (String uuid : connect) {
                connUuid[i++] = uuid.toString();
            }
            i = 0;
            List<String> follow = profile.getFollowList();
            String[] followUuid = new String[follow.size()];
            for (String uuid : follow) {
                followUuid[i++] = uuid.toString();
            }
            form.setFollow(followUuid);
            form.setConnect(connUuid);
        } else {
            form.setFollow(null);
            form.setConnect(null);
        }
        return new UserConnectionChange(form);
    }

    /**
     * Note, disable this API in production
     */
    @RequestMapping(value = "/api/create-wallet",
        consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse createWallet(@RequestBody UserEmailForm emails)
    {
        List<WalletInfoDTO> wallets = new LinkedList<>();
        List<Profile> profile = profileSvc
            .getUsersByEmail(Arrays.asList(emails.getEmails()));

        for (Profile p : profile) {
            WalletInfoDTO wallet = acctSvc.createWallet(
                    Util.fromRawByte(p.getFirstName()),
                    Constants.TudoAcct, "pasword", null, p.getUserUuid());
            wallets.add(wallet);
        }
        return new WalletResponse(wallets);
    }
}
