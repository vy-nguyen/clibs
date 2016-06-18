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

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tvntd.lib.Constants;
import com.tvntd.lib.FileResources;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IMenuItemService;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.StartupResponse;

@Controller
public class PublicPath
{
    static private Logger s_log = LoggerFactory.getLogger(PublicPath.class);

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    private IAuthorService authorSvc;

    @Autowired
    IMenuItemService menuItemSvc;

    @Autowired
    IArticleService articleSvc;

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
        StartupResponse result = new StartupResponse(profile, reqt);

        if (profile != null) {
            ApiPath.fillStartupResponse(result,
                    profile, profileSvc, authorSvc, menuItemSvc, articleSvc);
            return result;
        }
        Long userId = menuItemSvc.getPublicId();
        List<MenuItemResp> items = menuItemSvc.getMenuItemRespByUser(userId);
        if (items != null) {
            result.setMenuItems(items);
        }
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

    @RequestMapping(value = "/public/get-html/{html}",
            method = RequestMethod.GET, produces = "text/html; charset=utf-8")
    public String getHtml(Map<String, Object> model,
            @PathVariable(value = "html") String html, HttpSession session) {
        return html;
    }
}
