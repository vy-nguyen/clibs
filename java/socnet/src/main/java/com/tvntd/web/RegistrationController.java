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

import java.util.Calendar;
import java.util.Locale;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.
        UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tvntd.error.InvalidOldPasswordException;
import com.tvntd.error.UserNotFoundException;
import com.tvntd.models.PasswordResetToken;
import com.tvntd.models.User;
import com.tvntd.models.VerificationToken;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IUserService;

@Controller
public class RegistrationController
{
    private static Logger s_log =
        LoggerFactory.getLogger(RegistrationController.class.getName());

    @Autowired
    private IUserService userService;

    @Autowired
    private MessageSource messages;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private Environment env;

    public RegistrationController() {
        super();
    }

    @RequestMapping(value = "/regitrationConfirm", method = RequestMethod.GET)
    public String confirmRegistration(Locale locale, Model model,
            @RequestParam("token") String token)
    {
        VerificationToken verificationToken = userService.getVerificationToken(token);
        if (verificationToken == null) {
            String message =
                messages.getMessage("auth.message.invalidToken", null, locale);
            model.addAttribute("message", message);
            return "redirect:/badUser.html?lang=" + locale.getLanguage();
        }

        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() -
                    cal.getTime().getTime()) <= 0) {
            model.addAttribute("message",
                    messages.getMessage("auth.message.expired", null, locale));
            model.addAttribute("expired", true);
            model.addAttribute("token", token);
            return "redirect:/badUser.html?lang=" + locale.getLanguage();
        }

        user.setEnabled(true);
        userService.saveRegisteredUser(user);
        model.addAttribute("message",
                messages.getMessage("message.accountVerified", null, locale));
        return "redirect:/login.html?lang=" + locale.getLanguage();
    }

    // user activation - verification

    @RequestMapping(value = "/user/resendRegistrationToken", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse resendRegistrationToken(HttpServletRequest request,
            @RequestParam("token") String existingToken)
    {
        VerificationToken newToken =
            userService.generateNewVerificationToken(existingToken);
        User user = userService.getUser(newToken.getToken());
        String appUrl = "http://" + request.getServerName() +
            ":" + request.getServerPort() + request.getContextPath();

        SimpleMailMessage email =
            constructResendVerificationTokenEmail(appUrl,
                    request.getLocale(), newToken, user);
        mailSender.send(email);

        return new GenericResponse(messages.
                getMessage("message.resendToken", null, request.getLocale()));
    }

    // Reset password
    @RequestMapping(value = "/user/resetPassword", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse resetPassword(HttpServletRequest request,
            @RequestParam("email") String userEmail)
    {
        User user = userService.findUserByEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException();
        }
        s_log.info("Reset password " + user.getEmail());

        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);
        String appUrl = "http://" + request.getServerName() +
            ":" + request.getServerPort() + request.getContextPath();

        SimpleMailMessage email = constructResetTokenEmail(appUrl,
                request.getLocale(), token, user);

        mailSender.send(email);
        return new GenericResponse(messages
                .getMessage("message.resetPasswordEmail", null, request.getLocale()));
    }

    @RequestMapping(value = "/user/changePassword", method = RequestMethod.GET)
    public String showChangePasswordPage(Locale locale, Model model,
            @RequestParam("id") long id,
            @RequestParam("token") String token)
    {
        PasswordResetToken passToken = userService.getPasswordResetToken(token);
        User user = passToken.getUser();
        if (passToken == null || user.getId() != id)
        {
            String message = messages
                .getMessage("auth.message.invalidToken", null, locale);
            model.addAttribute("message", message);
            return "redirect:/login.html?lang=" + locale.getLanguage();
        }

        Calendar cal = Calendar.getInstance();
        if ((passToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            model.addAttribute("message",
                    messages.getMessage("auth.message.expired", null, locale));
            return "redirect:/login.html?lang=" + locale.getLanguage();
        }

        Authentication auth =
            new UsernamePasswordAuthenticationToken(user,
                    null, userDetailsService
                    .loadUserByUsername(user.getEmail()).getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        return "redirect:/updatePassword.html?lang=" + locale.getLanguage();
    }

    @RequestMapping(value = "/user/savePassword", method = RequestMethod.POST)
    @PreAuthorize("hasRole('READ_PRIVILEGE')")
    @ResponseBody
    public GenericResponse savePassword(Locale locale,
            @RequestParam("password") final String password)
    {
        User user = (User) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        userService.changeUserPassword(user, password);
        return new GenericResponse(messages
                .getMessage("message.resetPasswordSuc", null, locale));
    }

    // change user password

    @RequestMapping(value = "/user/updatePassword", method = RequestMethod.POST)
    @PreAuthorize("hasRole('READ_PRIVILEGE')")
    @ResponseBody
    public GenericResponse changeUserPassword(Locale locale,
            @RequestParam("password") String password,
            @RequestParam("oldpassword") String oldPassword)
    {
        User user = userService
            .findUserByEmail(SecurityContextHolder
                    .getContext().getAuthentication().getName());

        if (!userService.checkIfValidOldPassword(user, oldPassword)) {
            throw new InvalidOldPasswordException();
        }
        userService.changeUserPassword(user, password);
        return new GenericResponse(messages
                .getMessage("message.updatePasswordSuc", null, locale));
    }

    // NON-API

    private final SimpleMailMessage constructResendVerificationTokenEmail(
            String contextPath, Locale locale,
            VerificationToken newToken, User user)
    {
        String confirmationUrl = contextPath +
            "/regitrationConfirm.html?token=" + newToken.getToken();
        String message = messages.getMessage("message.resendToken", null, locale);
        SimpleMailMessage email = new SimpleMailMessage();

        email.setSubject("Resend Registration Token");
        email.setText(message + " \r\n" + confirmationUrl);
        email.setTo(user.getEmail());
        email.setFrom(env.getProperty("support.email"));
        return email;
    }

    private final SimpleMailMessage constructResetTokenEmail(String contextPath,
            Locale locale, String token, User user)
    {
        String url = contextPath + "/user/changePassword?id=" +
            user.getId() + "&token=" + token;
        String message = messages.getMessage("message.resetPassword", null, locale);
        SimpleMailMessage email = new SimpleMailMessage();

        email.setTo(user.getEmail());
        email.setSubject("Reset Password");
        email.setText(message + " \r\n" + url);
        email.setFrom(env.getProperty("support.email"));

        System.out.println("Send email to " + user.getEmail());
        System.out.println(email.toString());
        return email;
    }

/*
    private User createUserAccount(UserDto accountDto)
    {
        return null;
        User registered = null;
        try {
            registered = userService.registerNewUserAccount(accountDto);
        } catch (final EmailExistsException e) {
            return null;
        }
        return registered;
    }
        */
}
