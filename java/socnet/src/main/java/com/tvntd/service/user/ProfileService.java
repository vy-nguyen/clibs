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

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ProfileRepository;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.service.api.IProfileService;

@Service
@Transactional
public class ProfileService implements IProfileService
{
    @Autowired
    protected ProfileRepository profileRepo;

    @Override
    public ProfileDTO getProfile(Long userId)
    {
        Profile prof = profileRepo.findByUserId(userId);
        if (prof != null) {
            return new ProfileDTO(prof);
        }
        return null;
    }

    @Override
    public ProfileDTO getProfile(UUID uuid)
    {
        Profile prof = profileRepo.findByUserUuid(uuid);
        if (prof != null) {
            return new ProfileDTO(prof);
        }
        return null;
    }

    @Override
    public List<ProfileDTO> getProfileList(List<UUID> userIds)
    {
        List<ProfileDTO> ret = new LinkedList<>();

        for (UUID uuid : userIds) {
            Profile prof = profileRepo.findByUserUuid(uuid);
            if (prof != null) {
                ret.add(new ProfileDTO(prof));
            }
        }
        return ret;
    }

    @Override
    public List<ProfileDTO> getProfileList(ProfileDTO user)
    {
        return null;
    }

    @Override
    public void saveUserImgUrl(ProfileDTO profile, ObjectId oid)
    {
        Profile prof = profileRepo.findByUserId(profile.obtainUserId());
        if (prof != null) {
            prof.setUserImgUrl(oid);
            profileRepo.save(prof);
        }
    }

    @Override
    public void createProfile(User user)
    {
        if (profileRepo.findByUserId(user.getId()) == null) {
            profileRepo.save(Profile.createProfile(user));
        }
    }

    @Override
    public void deleteProfile(Long userId) {
        profileRepo.deleteByUserId(userId);
    }
}
