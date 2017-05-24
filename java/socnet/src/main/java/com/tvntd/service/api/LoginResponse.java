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
package com.tvntd.service.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.web.csrf.CsrfToken;

import com.tvntd.service.api.IAnnonService.AnnonUserDTO;
import com.tvntd.service.api.IProfileService.ProfileDTO;

public class LoginResponse extends GenericResponse
{
    private String authVerifToken;
    private String authToken;
    private String csrfToken;
    private String csrfHeader;
    private ProfileDTO userSelf;
    private AnnonUserDTO annonUser;

    public LoginResponse(String type, String message, String error, String token)
    {
        super(type, message, error);

        this.authVerifToken = token;
        this.authToken = null;
        this.csrfToken = null;
        this.csrfHeader = null;
    }

    public LoginResponse(ProfileDTO profile,
            HttpServletRequest reqt, HttpSession session, boolean annon)
    {
        super(GenericResponse.USER_HOME, null, null);

        this.userSelf = profile;
        this.authToken = profile.toProfile().getAuthToken();
        CsrfToken token = (CsrfToken) reqt.getAttribute("_csrf");
        profile.setStartPage((String) session.getAttribute("startPage"));

        if (token != null) {
            csrfToken = token.getToken();
            csrfHeader = token.getHeaderName();
        }
        if (annon == true) {
            annonUser = (AnnonUserDTO) session.getAttribute("annon-user");
        }
    }

    /**
     * @return the authVerifToken
     */
    public String getAuthVerifToken() {
        return authVerifToken;
    }

    /**
     * @return the authToken
     */
    public String getAuthToken() {
        return authToken;
    }

    /**
     * @return the csrfToken
     */
    public String getCsrfToken() {
        return csrfToken;
    }

    /**
     * @param csrfToken the csrfToken to set
     */
    public void setCsrfToken(String csrfToken) {
        this.csrfToken = csrfToken;
    }

    /**
     * @return the csrfHeader
     */
    public String getCsrfHeader() {
        return csrfHeader;
    }

    /**
     * @param csrfHeader the csrfHeader to set
     */
    public void setCsrfHeader(String csrfHeader) {
        this.csrfHeader = csrfHeader;
    }

    /**
     * @return the userSelf
     */
    public ProfileDTO getUserSelf() {
        return userSelf;
    }

    /**
     * @return the annonUser
     */
    public AnnonUserDTO getAnnonUser() {
        return annonUser;
    }

    /**
     * @param annonUser the annonUser to set
     */
    public void setAnnonUser(AnnonUserDTO annonUser) {
        this.annonUser = annonUser;
    }
}
