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

import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.mongodb.Mongo;
import com.tvntd.models.User;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleDTOResponse;
import com.tvntd.service.api.IMenuItemService;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;
import com.tvntd.service.api.IUserNotifService;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.service.api.UserNotifResponse;

@Controller
public class ApiPath
{
    static private Logger s_log = LoggerFactory.getLogger(PublicPath.class);
    static private GenericResponse s_genOkResp = new GenericResponse("ok");

    @Autowired
    private IMenuItemService menuItemService;

    @Autowired
    private IUserNotifService userNotifService;

    @Autowired
    private IArticleService articleService;

    @Autowired
    protected Mongo mongo;

    @Autowired
    protected CommonsMultipartResolver multipartResolver;

    /**
     * Handle Api REST calls.
     */
    @RequestMapping(value = "/api/user-notification", method = RequestMethod.GET)
    @ResponseBody
    public UserNotifResponse
    getUserNotification(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        Long userId = menuItemService.getPublicId();
        User user = (User) session.getAttribute("user");

        if (user != null) {
            userId = 0L;
        }
        UserNotifResponse result = userNotifService.getUserNotif(userId);
        CsrfToken token = (CsrfToken) reqt.getAttribute("_csrf");

        if (token != null) {
            result.setCsrfHeader(token.getHeaderName());
            result.setCsrfToken(token.getToken());
            s_log.info("Request user notification token " + 
                    result.getCsrfHeader() + ": " + result.getCsrfToken());
        }
        return result;
    }

    @RequestMapping(value = "/api/user-articles", method = RequestMethod.GET)
    @ResponseBody
    public ArticleDTOResponse
    getUserArticles(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            List<ArticleDTO> articles = articleService.getArticlesByUser(user.getId());
            s_log.info("Got articles " + articles.size());
            return new ArticleDTOResponse(articles);
        }
        s_log.info("User is not login");
        return null;
    }

    @RequestMapping(value = "/api/user", method = RequestMethod.GET)
    @ResponseBody
    public StartupResponse
    getStartupMenu(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return null;
        }
        Long userId = menuItemService.getPrivateId();
        List<MenuItemResp> items = menuItemService.getMenuItemRespByUser(userId);
        StartupResponse result = new StartupResponse(user);

        fillStartupResponse(result, user, reqt);
        if (items != null) {
            result.setMenuItems(items);
        }
        return result;
    }

    public static void
    fillStartupResponse(StartupResponse resp, User user, HttpServletRequest reqt)
    {
        CsrfToken token = (CsrfToken) reqt.getAttribute("_csrf");

        if (token != null) {
            resp.setCsrfHeader(token.getHeaderName());
            resp.setCsrfToken(token.getToken());
        }
    }

    @RequestMapping(value = "/api/upload-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImage(@RequestParam("name") String name,
            @RequestParam("file") MultipartFile file)
    {
        s_log.info("Upload image " + name + " part " + file.toString());
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
}
