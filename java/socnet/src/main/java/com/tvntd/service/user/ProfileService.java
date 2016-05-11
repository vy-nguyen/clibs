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
import java.util.concurrent.ConcurrentMap;

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

import com.google.common.collect.MapMaker;
import com.tvntd.dao.ProfileRepository;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.service.api.IProfileService;

@Service
@Transactional
public class ProfileService implements IProfileService
{
    private static Logger s_log = LoggerFactory.getLogger(ProfileService.class);
    private static boolean s_noCache = false;
    private static ProfileCache s_cache = new ProfileCache();

    @Autowired
    protected ProfileRepository profileRepo;

    /* Temp. cache for now. */
    public static class ProfileCache
    {
        boolean m_fullCache;
        final ConcurrentMap<Long, ProfileDTO> m_idCache;
        final ConcurrentMap<UUID, ProfileDTO> m_uuidCache;

        public ProfileCache()
        {
            m_fullCache = false;
            m_idCache = new MapMaker().concurrencyLevel(32).makeMap();
            m_uuidCache = new MapMaker().concurrencyLevel(32).makeMap();
        }

        void cacheProfile(ProfileDTO profile)
        {
            if (profile != null) {
                m_idCache.put(profile.obtainUserId(), profile);
                m_uuidCache.put(profile.getUserUuid(), profile);
            }
        }

        ProfileDTO cacheLookup(Long userId)
        {
            if (s_noCache == false) {
                return m_idCache.get(userId);
            }
            return null;
        }

        ProfileDTO cacheLookup(UUID uuid)
        {
            if (s_noCache == false) {
                return m_uuidCache.get(uuid);
            }
            return null;
        }

        void invalFullCache() {
            m_fullCache = false;
        }

        List<ProfileDTO>
        getProfileList(ProfileDTO user, List<Profile> raw, ProfileRepository repo)
        {
            List<ProfileDTO> result = new LinkedList<>();

            if (m_fullCache == true) {
                for (Map.Entry<UUID, ProfileDTO> entry : m_uuidCache.entrySet()) {
                    result.add(entry.getValue());
                }
            } else {
                List<Profile> profiles = raw;
                if (raw == null) {
                    profiles = repo.findAll();
                }
                for (Profile prof : profiles) {
                    ProfileDTO dto = cacheLookup(prof.fetchUserUuid());
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
    }

    public static void disableCache() {
        s_noCache = true;
    }

    @Override
    public ProfileDTO getProfile(Long userId)
    {
        ProfileDTO result = s_cache.cacheLookup(userId);
        if (result != null) {
            return result;
        }
        Profile prof = profileRepo.findByUserId(userId);
        if (prof != null) {
            result = new ProfileDTO(prof);
            s_cache.cacheProfile(result);
            return result;
        }
        return null;
    }

    @Override
    public ProfileDTO getProfile(UUID uuid)
    {
        ProfileDTO result = s_cache.cacheLookup(uuid);
        if (result != null) {
            return result;
        }
        Profile prof = profileRepo.findByUserUuid(uuid.toString());
        if (prof != null) {
            result = new ProfileDTO(prof);
            s_cache.cacheProfile(result);
            return result;
        }
        return null;
    }

    @Override
    public List<ProfileDTO> getProfileList(List<UUID> userIds)
    {
        List<ProfileDTO> ret = new LinkedList<>();

        for (UUID uuid : userIds) {
            ProfileDTO result = s_cache.cacheLookup(uuid);
            if (result == null) {
                Profile prof = profileRepo.findByUserUuid(uuid.toString());
                if (prof == null) {
                    continue;
                }
                result = new ProfileDTO(prof);
                s_cache.cacheProfile(result);
            }
            ret.add(result);
        }
        return ret;
    }

    @Override
    public List<ProfileDTO> getProfileList(ProfileDTO user, List<Profile> raw) {
        return s_cache.getProfileList(user, raw, profileRepo);
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

    /**
     * Connect me to follow list of uuids.
     */
    @Override
    public void
    followProfiles(ProfileDTO me, String[] uuids, HashMap<UUID, ProfileDTO> changes)
    {
        for (String uuid : uuids) {
            try {
                UUID key = UUID.fromString(uuid);
                ProfileDTO peer = getProfile(key);
                if (peer != null) {
                    me.followProfile(peer);
                    if (changes.get(key) == null) {
                        changes.put(key, peer);
                    }
                }
            } catch(Exception e) {
                s_log.info("Exception: " + e.getMessage());
            }
        }
    }

    @Override
    public void
    connectProfiles(ProfileDTO me, String[] uuids, HashMap<UUID, ProfileDTO> changes)
    {
        for (String uuid : uuids) {
            try {
                UUID key = UUID.fromString(uuid);
                ProfileDTO peer = getProfile(key);

                if (peer != null) {
                    me.connectProfile(peer);
                    if (changes.get(key) == null) {
                        changes.put(key, peer);
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
    public void saveProfile(ProfileDTO profile)
    {
        try {
            s_log.info("Save profile " + profile);
            profileRepo.save(profile.toProfile());
            s_cache.cacheProfile(profile);

        } catch(Exception e) {
            s_log.info("Exception: " + e.getMessage() + ", detai " + e.toString());
            throw e;
        }
    }

    @Override
    public void saveUserImgUrl(ProfileDTO profile, ObjectId oid)
    {
        Profile prof = profile.toProfile();
        if (prof != null) {
            prof.setUserImgUrl(oid);
            profile.updateImgUrl(oid);
            saveProfile(profile);
        }
    }

    @Override
    public void createProfile(User user)
    {
        if (profileRepo.findByUserId(user.getId()) == null) {
            s_cache.invalFullCache();
            profileRepo.save(Profile.createProfile(user));
        }
    }

    @Override
    public void deleteProfile(Long userId)
    {
        s_cache.invalFullCache();
        profileRepo.deleteByUserId(userId);
    }
}
