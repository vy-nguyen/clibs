/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
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
package com.tvntd.security;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.
        web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;

@Component("authenticationFailureHandler")
public class AuthenticationFailureHandler
    extends SimpleUrlAuthenticationFailureHandler
{
    static private Logger s_log =
        LoggerFactory.getLogger(AuthenticationFailureHandler.class.getName());

    @Autowired
    private MessageSource messages;

    @Autowired
    private LocaleResolver localeResolver;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
            HttpServletResponse response, AuthenticationException exception)
        throws IOException, ServletException
    {
        setDefaultFailureUrl("/login?error=true");

        super.onAuthenticationFailure(request, response, exception);
        Locale locale = localeResolver.resolveLocale(request);

        String errorMessage =
            messages.getMessage("message.badCredentials", null, locale);

        s_log.info("Bad user " + request.getParameter("email") +
                " pass " + request.getParameter("password"));

        if (exception.getMessage().equalsIgnoreCase("User is disabled")) {
            errorMessage = messages.getMessage("auth.message.disabled", null, locale);
            s_log.info("Attempt login disabled user");

        } else if (exception.getMessage()
                .equalsIgnoreCase("User account has expired")) {
            errorMessage = messages.getMessage("auth.message.expired", null, locale);

        } else if (exception.getMessage().equalsIgnoreCase("blocked")) {
            errorMessage = messages.getMessage("auth.message.blocked", null, locale);
            s_log.info("Attempt login blocked user");
        }
        request.getSession()
            .setAttribute(WebAttributes.AUTHENTICATION_EXCEPTION, errorMessage);
    }
}
