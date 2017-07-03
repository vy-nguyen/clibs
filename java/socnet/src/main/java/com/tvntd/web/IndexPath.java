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
import java.util.Collection;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web
    .authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvntd.dao.PrivilegeRepository;
import com.tvntd.error.EmailExistsException;
import com.tvntd.forms.ProfileForm;
import com.tvntd.forms.RegisterForm;
import com.tvntd.models.User;
import com.tvntd.models.VerificationToken;
import com.tvntd.security.AuthenticationHandler;
import com.tvntd.security.AuthenticationHandler.CustomAuthentication;
import com.tvntd.security.ServiceUser;
import com.tvntd.security.UrlAuthenticationSuccessHandler;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IAnnonService;
import com.tvntd.service.api.IAnnonService.AnnonUserDTO;
import com.tvntd.service.api.IUserService;

@Controller
public class IndexPath
{
    static private Logger s_log = LoggerFactory.getLogger(IndexPath.class);

    protected static GenericResponse s_sentEmail =
        new GenericResponse(GenericResponse.REG_WAIT_EMAIL, "Sent email", null);
    protected RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Autowired
    protected AuthenticationHandler authProvider;

    @Autowired
    protected IUserService userService;

    @Autowired
    protected IAnnonService annonSvc;

    @Autowired
    protected PrivilegeRepository privilegeRepo;

    @Autowired
    UrlAuthenticationSuccessHandler urlAuthenticationSuccessHandler;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String tvntd(Map<String, Object> model, HttpSession session) {
        return "tvntd";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse login(
            @RequestParam(value = "error", required = false) String error,
            HttpSession session, HttpServletRequest request,
            HttpServletResponse response)
    {
        if (error != null) {
            s_log.info("Auth error " + request.getRemoteUser());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return new GenericResponse(
                    GenericResponse.REG_FAILED,
                    session.getAttribute(
                        WebAttributes.AUTHENTICATION_EXCEPTION).toString(), "failure");
        }
        try {
            s_log.info("Redirect to root url");
            response.sendRedirect("/#/login");

        } catch(IOException e) {
            s_log.info(e.getMessage());
        }
        return null;
    }

    @RequestMapping(value = "/login/link/{email}/{token}", method = RequestMethod.GET)
    public String 
    loginLink(@PathVariable(value = "email") String email,
            @PathVariable(value = "token") String token,
            HttpSession session, HttpServletRequest request, HttpServletResponse resp)
    {
        try {
            User user = userService.findUserByEmail(email);
            if (user != null) {
                if (user.isEnabled() == false) {
                    user.setEnabled(true);
                    userService.saveRegisteredUser(user);
                }
                VerificationToken vtoken = userService.getVerificationToken(token);
                if (vtoken != null) {
                    Collection<GrantedAuthority> authorities =
                        ServiceUser.getAuthorities(user.getRoles());

                    Authentication auth =
                        emailAuthentication(user, vtoken.getToken(), authorities);

                    urlAuthenticationSuccessHandler.setupLoginSession(user,
                            "profile", session, request, resp, auth);

                    resp.sendRedirect("/");
                } else {
                    session.setAttribute("startPage", "badEmailToken");
                }
            }
        } catch(Exception e) {
            System.out.println("Email login failed ");
            System.out.println(e.getMessage());
        }
        return "tvntd";
    }

    private Authentication emailAuthentication(User user, String passwd,
            Collection<GrantedAuthority> authorities)
    {
        Authentication auth;
        CustomAuthentication cust = new CustomAuthentication(
                user.getEmail(), passwd, authorities, passwd);

        auth = authProvider.authenticate(cust);
        SecurityContext ctx = SecurityContextHolder.getContext();
        ctx.setAuthentication(auth);
        return auth;
    }

    @RequestMapping(value = "/login/email",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse login(Locale locale,
            @RequestBody ProfileForm login, HttpSession session,
            HttpServletRequest request, HttpServletResponse response)
    {
        String email = login.getEmail();
        RegisterForm register = new RegisterForm(email);
        String token = register.getPassword0();
        try {
            AnnonUserDTO anon = annonSvc.getAnnonUser(request, response, session);
            User user = userService.registerNewUserAccount(register, anon.getUserUuid());

            if (user == null) {
                s_log.info("Failed to create user " + email);
                return null;
            }
            userService.createVerificationTokenForUser(user, token, true);

        } catch(EmailExistsException e) {
            User user = userService.findUserByEmail(email);
            if (user == null) {
                s_log.info("User was deleted " + email);
                return null;
            }
            VerificationToken vtoken = userService.getVerificationToken(user, false);
            if (vtoken != null) {
                token = vtoken.getToken();
            }
        }
        if (token == null) {
            s_log.info("Failed to locate login token " + email);
            return null;
        }
        String link = String
            .format("https://www.tvntd.com/login/link/%s/%s\n", email, token);

        s_log.info("Send email login " + email + " link " + link);
        userService.sendLoginLink(email, link);
        return s_sentEmail;
    }

    @RequestMapping(value="/login/logout", method = RequestMethod.GET)
    public String logoutPage(HttpServletRequest request, HttpServletResponse response)
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       
        s_log.info("Logout for " + request.getRemoteUser());
        if (auth != null){
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/";
    }
}
