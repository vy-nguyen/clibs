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

import com.tvntd.error.EmailExistsException;
import com.tvntd.forms.RegisterForm;
import com.tvntd.models.User;
import com.tvntd.models.PasswordResetToken;
import com.tvntd.models.VerificationToken;

public interface IUserService
{
    User registerNewUserAccount(RegisterForm reg, String uuid)
        throws EmailExistsException;

    User getUser(String verificationToken);

    void saveRegisteredUser(User user);
    void deleteUser(User user);

    void createVerificationTokenForUser(User user, String token, boolean noexpir);
    VerificationToken getVerificationToken(User user, boolean creat);
    VerificationToken getVerificationToken(String verificationToken);
    VerificationToken generateNewVerificationToken(String token);

    boolean emailExist(String email);
    void sendLoginLink(String email, String link);
    void createPasswordResetTokenForUser(User user, String token);
    User findUserByEmail(String email);

    PasswordResetToken getPasswordResetToken(String token);
    User getUserByPasswordResetToken(String token);
    User getUserByID(long id);

    void changeUserPassword(User user, String password);
    boolean checkIfValidOldPassword(User user, String password);
    void changePassword(Long userId, String oldPass, String newPass);
}
