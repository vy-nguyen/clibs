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
package com.tvntd.events;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.tvntd.models.User;
import com.tvntd.models.VerificationToken;
import com.tvntd.service.api.IUserService;

@Component
public class RegistrationListener implements ApplicationListener<RegistrationEvent>
{
    static private final String s_mailSubject = "Registration Confirmation";
    static private final String s_mailMessage =
        "We have created an account for you.  Please click on the link to activate your account";

    @Autowired
    private IUserService service;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Environment env;

    // API

    @Override
    public void onApplicationEvent(RegistrationEvent event) {
        System.out.println("Register mail " + event.toString());
        System.out.println("Reg obj " + this.toString() + ": " + System.identityHashCode(this));
        this.confirmRegistration(event);
    }

    private void confirmRegistration(RegistrationEvent event)
    {
        User user = event.getUser();
        if (user == null || event.hasToken() == true) {
            System.out.println("Skip confirm, already has token " + event.toString());
            return;
        }
        VerificationToken token = service.getVerificationToken(user);
        event.addToken(token.getToken()).makeCallbackUrl();

        SimpleMailMessage email = constructEmailMessage(event, user);
        mailSender.send(email);
    }

    //
    private final SimpleMailMessage constructEmailMessage(RegistrationEvent event, User user)
    {
        String recipientAddress = user.getEmail();
        SimpleMailMessage email = new SimpleMailMessage();

        email.setTo(recipientAddress);
        email.setSubject(s_mailSubject);
        email.setText(s_mailMessage + " \r\n" + event.getCallbackUrl());
        email.setFrom(env.getProperty("support.email"));
        return email;
    }
}
