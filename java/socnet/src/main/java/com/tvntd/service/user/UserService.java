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

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tvntd.error.EmailExistsException;
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

    // API

    @Override
    public User registerNewUserAccount(RegisterForm account)
        throws EmailExistsException
    {
        if (emailExist(account.getEmail())) {
            throw new EmailExistsException(
                    "There is an account with that email adress: "
                    + account.getEmail());
        }
        User user = new User();

        user.setFirstName(account.getFirstName());
        user.setLastName(account.getLastName());
        user.setPassword(passwordEncoder.encode(account.getPassword0()));
        user.setEmail(account.getEmail());

        user.setRoles(Arrays.asList(roleRepository.findByName(Role.AuthUser)));
        user = repository.save(user);
        profileSvc.createProfile(user);        
        return user;
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
    public VerificationToken getVerificationToken(User user)
    {
        VerificationToken token = tokenRepository.findByUser(user);
        if (token == null) {
            String code = UUID.randomUUID().toString();
            token = new VerificationToken(code, user);
            tokenRepository.save(token);
        }
        return token;
    }

    @Override
    public void createVerificationTokenForUser(User user, String token)
    {
        final VerificationToken myToken = new VerificationToken(token, user);
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
    public boolean checkIfValidOldPassword(User user, String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    private boolean emailExist(String email)
    {
        User user = repository.findByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }
}
