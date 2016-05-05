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

import javax.servlet.http.HttpServletRequest;
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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.forms.PostForm;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArtSavedService;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.LoginResponse;

@Controller
public class UserPath
{
    static private Logger s_log = LoggerFactory.getLogger(UserPath.class);
    static private GenericResponse s_genOkResp = new GenericResponse("ok");
    static public  GenericResponse s_noProfile =
        new GenericResponse("Invalid session", "User Error");

    @Autowired
    private IArticleService articleRepo;

    @Autowired
    private IArtSavedService artSavedRepo;

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    public LoginResponse user(HttpSession session, HttpServletRequest reqt)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        s_log.debug("Login to user profile: " + profile);
        return new LoginResponse(profile, reqt);
    }

    /**
     * User post articles.
     */
    @RequestMapping(value = "/user/save-post",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    saveUserPost(@RequestBody PostForm form,
            HttpServletRequest request, HttpSession session)
    {
        s_log.info("Content " + form.getContent());
        return s_genOkResp;
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/user/upload-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImage(@RequestParam("name") String name,
            @RequestParam("articleUuid") String artUuid,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        s_log.info("Name: " + name + "\nArtUuid: " + artUuid);
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return s_noProfile;
        }
        return s_genOkResp;
    }
}
