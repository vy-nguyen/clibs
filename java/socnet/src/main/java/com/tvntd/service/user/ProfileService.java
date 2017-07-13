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

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ProfileRepository;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Author;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IProfileService;

@Service
@Transactional
public class ProfileService implements IProfileService
{
    private static Logger s_log = LoggerFactory.getLogger(ProfileService.class);

    @Autowired
    protected ProfileRepository profileRepo;

    @Autowired
    protected IAuthorService authorSvc;

    @Override
    public ProfileDTO getProfile(User user)
    {
        Profile prof = profileRepo.findByUserId(user.getId());
        if (prof != null) {
            return new ProfileDTO(prof, user);
        }
        return null;
    }

    @Override
    public ProfileDTO getProfile(String uuid)
    {
        Profile prof = profileRepo.findByUserUuid(uuid);
        if (prof != null) {
            return new ProfileDTO(prof);
        }
        return null;
    }

    @Override
    public List<ProfileDTO> getProfileList(List<String> userIds)
    {
        List<ProfileDTO> ret = new LinkedList<>();

        for (String uuid : userIds) {
            Profile prof = profileRepo.findByUserUuid(uuid);
            if (prof == null) {
                continue;
            }
            ret.add(new ProfileDTO(prof));
        }
        return ret;
    }

    @Override
    public List<ProfileDTO> getProfileFromRaw(List<Profile> raw)
    {
        List<ProfileDTO> result = new LinkedList<>();
        List<Profile> profiles = raw;

        if (raw == null) {
            profiles = profileRepo.findAll();
        }
        for (Profile prof : profiles) {
            result.add(new ProfileDTO(prof));
        }
        return result;
    }

    @Override
    public Page<ProfileDTO> getProfileList()
    {
        Pageable req = new PageRequest(0, 10,
                new Sort(Sort.Direction.DESC, "userName"));
        Page<Profile> pages = profileRepo.findAll(req);
        List<Profile> profiles = pages.getContent();
        List<ProfileDTO> convert = getProfileFromRaw(profiles);

        return new PageImpl<ProfileDTO>(convert , req, pages.getTotalPages());
    }

    /**
     * Connect me to follow list of uuids.
     */
    @Override
    public void
    followProfiles(ProfileDTO me, String[] uuids, HashMap<String, ProfileDTO> changes)
    {
        for (String uuid : uuids) {
            try {
                ProfileDTO peer = getProfile(uuid);
                if (peer != null) {
                    me.followProfile(peer);
                    if (changes.get(uuid) == null) {
                        changes.put(uuid, peer);
                    }
                }
            } catch(Exception e) {
                s_log.info("Exception: " + e.getMessage());
            }
        }
    }

    @Override
    public void
    connectProfiles(ProfileDTO me, String[] uuids, HashMap<String, ProfileDTO> changes)
    {
        for (String uuid : uuids) {
            try {
                ProfileDTO peer = getProfile(uuid);

                if (peer != null) {
                    me.connectProfile(peer);
                    if (changes.get(uuid) == null) {
                        changes.put(uuid, peer);
                    }
                }
            } catch(Exception e) {
                s_log.info("Exception: " + e.getMessage());
            }
        }
    }

    @Override
    public void saveProfiles(List<ProfileDTO> profiles)
    {
        for (ProfileDTO prof : profiles) {
            saveProfile(prof);
        }
    }

    @Override
    public void saveUserImgUrl(ProfileDTO profile, ObjectId oid)
    {
        Profile prof = profile.toProfile();
        if (prof != null) {
            profile.updateImgUrl(oid);
            saveProfile(profile);
        }
    }

    @Override
    public void saveProfile(ProfileDTO profile)
    {
        try {
            s_log.info("Save profile " + profile);
            profileRepo.save(profile.toProfile());

        } catch(Exception e) {
            s_log.info("Exception: " + e.getMessage() + ", detai " + e.toString());
            s_log.info("Profile: " + profile);
            throw e;
        }
    }

    @Override
    public void createProfile(User user, String uuid)
    {
        if ((uuid != null) && (profileRepo.findByUserUuid(uuid) != null)) {
            s_log.info("Create new profile uuid, replace " + uuid);
            uuid = null;
        }
        if (profileRepo.findByUserId(user.getId()) == null) {
            Profile profile = Profile.createProfile(user, uuid);

            profileRepo.save(profile);
            authorSvc.saveAuthor(Author.fromUserUuid(profile.getUserUuid()));
        }
    }

    @Override
    public void deleteProfile(Long userId)
    {
        profileRepo.deleteByUserId(userId);
    }

    @Override
    public void deleteProfile(String uuid)
    {
        profileRepo.deleteByUserUuid(uuid.toString());
    }
}
