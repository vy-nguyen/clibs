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
package com.tvntd.service.user;

import java.util.Arrays;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tvntd.error.EmailExistsException;
import com.tvntd.exports.LibModule;
import com.tvntd.forms.RegisterForm;
import com.tvntd.dao.PasswordResetTokenRepository;
import com.tvntd.dao.RoleRepository;
import com.tvntd.dao.UserRepository;
import com.tvntd.dao.VerificationTokenRepository;
import com.tvntd.models.PasswordResetToken;
import com.tvntd.models.Role;
import com.tvntd.models.User;
import com.tvntd.models.VerificationToken;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IUserService;

@Service
@Transactional
public class UserService implements IUserService
{
    private static final String s_loginMail = "Your Login Link";
    private static final String s_loginLink =
        "We created email login account for you, click on the link to login.\n" +
        "Note that you may have to click the link twice to get into your account.\n";

    @Autowired
    private UserRepository repository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    protected JavaMailSender mailSender;

    @Autowired
    protected Environment env;

    // API

    @Override
    public User registerNewUserAccount(RegisterForm account, String uuid)
        throws EmailExistsException
    {
        if (emailExist(account.getEmail())) {
            throw new EmailExistsException(account.getEmail() + " already exists");
        }
        User user = new User();

        user.setFirstName(account.getFirstName());
        user.setLastName(account.getLastName());
        user.setPassword(passwordEncoder.encode(account.getPassword0()));
        user.setEmail(account.getEmail());

        user.setRoles(Arrays.asList(roleRepository.findByName(Role.AuthUser)));
        user = repository.save(user);
        profileSvc.createProfile(user, uuid);
        return user;
    }

    @Override
    public void sendLoginLink(String email, String link)
    {
        SimpleMailMessage mesg = new SimpleMailMessage();

        mesg.setTo(email);
        mesg.setSubject(s_loginMail);
        mesg.setText(s_loginLink + "\n" + link);

        ExecutorService exec = LibModule.getExecutorService();
        exec.submit(new SendEmailTask(mesg));
        // mailSender.send(mesg);
    }

    @Override
    public User getUser(final String verificationToken)
    {
        final User user = tokenRepository.findByToken(verificationToken).getUser();
        return user;
    }

    @Override
    public VerificationToken getVerificationToken(String VerificationToken) {
        return tokenRepository.findByToken(VerificationToken);
    }

    @Override
    public void saveRegisteredUser(User user) {
        repository.save(user);
    }

    @Override
    public void deleteUser(User user) {
        repository.delete(user);
    }

    @Override
    public VerificationToken getVerificationToken(User user, boolean creat)
    {
        VerificationToken token = tokenRepository.findByUser(user);
        if (token == null && creat == true) {
            String code = UUID.randomUUID().toString();
            token = new VerificationToken(code, user, false);
            tokenRepository.save(token);
        }
        return token;
    }

    @Override
    public void
    createVerificationTokenForUser(User user, String token, boolean noexpiry)
    {
        final VerificationToken myToken = new VerificationToken(token, user, noexpiry);
        tokenRepository.save(myToken);
    }

    @Override
    public VerificationToken generateNewVerificationToken(
            String existingVerificationToken)
    {
        VerificationToken vToken =
            tokenRepository.findByToken(existingVerificationToken);
        vToken.updateToken(UUID.randomUUID().toString());
        vToken = tokenRepository.save(vToken);
        return vToken;
    }

    @Override
    public void createPasswordResetTokenForUser(User user, String token)
    {
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordTokenRepository.save(myToken);
    }

    @Override
    public User findUserByEmail(final String email) {
        return repository.findByEmail(email);
    }

    @Override
    public PasswordResetToken getPasswordResetToken(final String token) {
        return passwordTokenRepository.findByToken(token);
    }

    @Override
    public User getUserByPasswordResetToken(final String token) {
        return passwordTokenRepository.findByToken(token).getUser();
    }

    @Override
    public User getUserByID(final long id) {
        return repository.findOne(id);
    }

    @Override
    public void changeUserPassword(User user, String password)
    {
        user.setPassword(passwordEncoder.encode(password));
        repository.save(user);
    }

    @Override
    public String changePassword(Long userId, String oldPass, String newPass)
    {
        System.out.println("Change passwd " + userId + ", old " + oldPass +
                " new " + newPass);
        User user = repository.findById(userId);

        if (user == null) {
            return "User not found";
        }
        if (oldPass != null) {
            if (!passwordEncoder.matches(oldPass, user.getPassword())) {
                System.out.println("Missmatch " + oldPass + " on file " +
                        user.getPassword());
                return "Old password doesn't match";
            }
        } else {
            VerificationToken vtoken = getVerificationToken(user, false);
            if (vtoken == null) {
                return "Could not find the authentication token";
            }
            vtoken.setToken(UUID.randomUUID().toString());
            tokenRepository.save(vtoken);
            return null;
        }
        String encrypt = passwordEncoder.encode(newPass);
        System.out.println("New pass encrypt " + encrypt);
        user.setPassword(encrypt);
        repository.save(user);
        return null;
    }

    @Override
    public boolean checkIfValidOldPassword(User user, String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    @Override
    public boolean emailExist(String email)
    {
        User user = repository.findByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }

    class SendEmailTask implements Callable<Boolean>
    {
        protected SimpleMailMessage mesg;

        SendEmailTask(SimpleMailMessage email) {
            mesg = email;
        }

        public Boolean call()
        {
            mailSender.send(mesg);
            return true;
        }
    }
}
