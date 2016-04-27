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
import java.util.Map;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    /* Temp. cache for now. */
    boolean m_fullCache;
    protected HashMap<Long, ProfileDTO> m_idCache;
    protected HashMap<UUID, ProfileDTO> m_uuidCache;

    public ProfileService()
    {
        m_fullCache = false;
        m_idCache = new HashMap<>();
        m_uuidCache = new HashMap<>();
    }

    private void cacheProfile(ProfileDTO profile)
    {
        if (profile != null) {
            synchronized(this) {
                m_idCache.put(profile.obtainUserId(), profile);
                m_uuidCache.put(profile.getUserUuid(), profile);
            }
        }
    }

    private ProfileDTO cacheLookup(Long userId)
    {
        synchronized(this) {
            return m_idCache.get(userId);
        }
    }

    private ProfileDTO cacheLookup(UUID uuid)
    {
        synchronized(this) {
            return m_uuidCache.get(uuid);
        }
    }

    @Override
    public ProfileDTO getProfile(Long userId)
    {
        ProfileDTO result = cacheLookup(userId);
        if (result != null) {
            return result;
        }
        Profile prof = profileRepo.findByUserId(userId);
        if (prof != null) {
            result = new ProfileDTO(prof);
            cacheProfile(result);
            return result;
        }
        return null;
    }

    @Override
    public ProfileDTO getProfile(UUID uuid)
    {
        ProfileDTO result = cacheLookup(uuid);
        if (result != null) {
            return result;
        }
        Profile prof = profileRepo.findByUserUuid(uuid);
        if (prof != null) {
            result = new ProfileDTO(prof);
            cacheProfile(result);
            return result;
        }
        return null;
    }

    @Override
    public List<ProfileDTO> getProfileList(List<UUID> userIds)
    {
        List<ProfileDTO> ret = new LinkedList<>();

        for (UUID uuid : userIds) {
            ProfileDTO result = cacheLookup(uuid);
            if (result == null) {
                Profile prof = profileRepo.findByUserUuid(uuid);
                if (prof == null) {
                    continue;
                }
                result = new ProfileDTO(prof);
                cacheProfile(result);
            }
            ret.add(result);
        }
        return ret;
    }

    @Override
    public List<ProfileDTO> getProfileList(ProfileDTO user, List<Profile> raw)
    {
        List<ProfileDTO> result = new LinkedList<>();

        if (m_fullCache == true) {
            synchronized(this) {
                for (Map.Entry<UUID, ProfileDTO> entry : m_uuidCache.entrySet()) {
                    result.add(entry.getValue());
                }
            }
        } else {
            List<Profile> profiles = raw;
            if (raw == null) {
                profiles = profileRepo.findAll();
            }
            for (Profile prof : profiles) {
                ProfileDTO dto = cacheLookup(prof.getUserUuid());
                if (dto == null) {
                    dto = new ProfileDTO(prof);
                    cacheProfile(dto);
                }
                result.add(dto);
            }
            m_fullCache = true;
        }
        return result;
    }

    @Override
    public Page<ProfileDTO> getProfileList()
    {
        Pageable req = new PageRequest(0, 10, new Sort(Sort.Direction.DESC, "userName"));
        Page<Profile> pages = profileRepo.findAll(req);
        List<Profile> profiles = pages.getContent();
        List<ProfileDTO> convert = getProfileList(null, profiles);

        return new PageImpl<ProfileDTO>(convert , req, pages.getTotalPages());
    }

    @Override
    public List<ProfileDTO> followProfiles(ProfileDTO me, String[] uuids)
    {
        return null;
    }

    @Override
    public List<ProfileDTO> connectProfiles(ProfileDTO me, String[] uuids)
    {
        return null;
    }

    @Override
    public void updateProfiles(List<ProfileDTO> profiles)
    {
    }

    @Override
    public void updateWholeProfile(ProfileDTO profile)
    {
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
