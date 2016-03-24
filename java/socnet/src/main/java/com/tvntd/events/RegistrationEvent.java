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
package com.tvntd.events;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.MessageSource;

import com.tvntd.models.User;

@SuppressWarnings("serial")
public class RegistrationEvent extends ApplicationEvent
{
    private User user;
    private final StringBuilder callbackUrl;
    private final HttpServletRequest request;

    public RegistrationEvent(User user, HttpServletRequest request) {
        super(user);
        this.user = user;
        this.request = request;
        this.callbackUrl = new StringBuilder();
    }

    public String getCallbackUrl() {
        return callbackUrl.toString();
    }

    public Locale getLocale() {
        return request.getLocale();
    }

    /**
     * @return the user
     */
    public User getUser() {
        return user;
    }

    public RegistrationEvent makeCallbackUrl()
    {
        callbackUrl
            .append("http://")
            .append(request.getServerName())
            .append(":")
            .append(request.getServerPort())
            .append(request.getContextPath());

        return this;
    }

    public RegistrationEvent addToken(String token)
    {
        callbackUrl
            .append("/register/confirm?token=")
            .append(token);

        return this;
    }

    public RegistrationEvent makeEmailShortCut(MessageSource mesg, String token)
    {
        callbackUrl
            .append(mesg.getMessage("message.email.error", null, request.getLocale()))
            .append(" <a href=");
        makeCallbackUrl();
        callbackUrl
            .append("/register/shortcut?token=")
            .append(token)
            .append(">this link</a>");

        return this;
    }
}
