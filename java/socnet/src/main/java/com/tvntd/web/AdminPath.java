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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArtTagService.ArtTagDTO;
import com.tvntd.service.api.IArtTagService.ArtTagList;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.LoginResponse;
import com.tvntd.service.user.ArtTagService;
import com.tvntd.util.Constants;

@Controller
public class AdminPath
{
    static private Logger s_log = LoggerFactory.getLogger(AdminPath.class);

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected IProfileService profileSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @Secured({"ROLE_Admin"})
    @RequestMapping(value = "/admin", params = {"user"}, method = RequestMethod.GET)
    @ResponseBody
    public LoginResponse admin(Locale locale, HttpSession session,
            HttpServletRequest reqt, @RequestParam(value = "user") String user)
    {
        s_log.info("Request admin");
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            s_log.info("No profile " + user);
            return null;
        }
        LoginResponse resp = new LoginResponse(profile, reqt);
        ApiPath.fillLoginResponse(resp, profile);
        return resp;
    }

    /**
     * Get list of users.
     */
    @Secured({"ROLE_Admin"})
    @RequestMapping(value = "/admin/list-users", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse getUserList(HttpSession session)
    {
        s_log.info("Request from admin");
        return UserPath.s_genOkResp;
    }

    /**
     * Make public tag and sub tags.
     */
    @Secured({"ROLE_Admin"})
    @RequestMapping(value = "/admin/set-tags",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    setPulicTags(@RequestBody ArtTagList tagList, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return UserPath.s_noProfile;
        }
        s_log.debug("Got set tags requests");
        List<ArtTagDTO> fixup =
            ArtTagService.makeSubTags(tagList.getPublicTags(), Constants.PublicUuid);

        for (ArtTagDTO tag : fixup) {
            artTagSvc.saveTag(tag);       
        }
        for (ArtTagDTO tag : tagList.getDeletedTags()) {
            artTagSvc.deleteTag(tag.getTagName(), Constants.PublicUuid);
        }
        return UserPath.s_genOkResp;
    }
}
