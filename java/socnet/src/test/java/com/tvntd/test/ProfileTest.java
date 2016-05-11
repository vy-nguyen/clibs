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
package com.tvntd.test;

import static org.junit.Assert.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.tvntd.config.TestPersistenceJPAConfig;
import com.tvntd.config.TestSecurityConfig;
import com.tvntd.config.TestTvntdRootConfig;
import com.tvntd.config.TestTvntdWebConfig;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.user.ProfileService;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(
    classes = {
        TestSecurityConfig.class,
        TestTvntdWebConfig.class,
        TestPersistenceJPAConfig.class,
        TestTvntdRootConfig.class
    }
)
public class ProfileTest
{
    private static Logger s_log = LoggerFactory.getLogger(ProfileTest.class);
    private static final ByteArrayOutputStream outContent;
    private static final ByteArrayOutputStream errContent;
    static {
        outContent = new ByteArrayOutputStream();
        errContent = new ByteArrayOutputStream();
    }

    static protected Long testId = 10L;

    @Autowired
    IProfileService profileRepo;

    static public Long getTestId() 
    {
        Long rt = testId++;
        return rt;
    }

    @Before
    public void setupStreams()
    {
        System.setOut(new PrintStream(outContent));
        System.setOut(new PrintStream(errContent));
    }

    @After
    public void cleanupStream()
    {
        System.setOut(null);
        System.setErr(null);
    }

    @Test
    public void testProfile()
    {
        MockUser a = new MockUser("AA", "AaAaAa", "aa@abc.com");
        MockUser b = new MockUser("BB", "BbBbBb", "bbm@abc.com");
        MockUser c = new MockUser("CC", "CcCcCc", "ccp@abc.com");
        ProfileDTO ap = new ProfileDTO(MockUser.createProfile(a));
        ProfileDTO bp = new ProfileDTO(MockUser.createProfile(b));
        ProfileDTO cp = new ProfileDTO(MockUser.createProfile(c));

        bp.connectProfile(ap);
        verifyFollow(bp, ap);

        ProfileService.disableCache();
        profileRepo.saveProfile(ap);
        profileRepo.saveProfile(bp);

        ProfileDTO av = profileRepo.getProfile(ap.getUserUuid());
        ProfileDTO bv = profileRepo.getProfile(bp.getUserUuid());

        verifyProfile(ap, av);
        verifyProfile(bp, bv);

        ap.followProfile(bp);
        verifyConnected(ap, bp);

        profileRepo.saveProfile(ap);
        profileRepo.saveProfile(bp);

        av = profileRepo.getProfile(ap.getUserUuid());
        bv = profileRepo.getProfile(bp.getUserUuid());
        verifyProfile(ap, av);
        verifyProfile(bp, bv);

        profileRepo.saveProfile(ap);
        av = profileRepo.getProfile(ap.getUserUuid());
        verifyProfile(ap, av);

        bp.followProfile(ap);
        verifyConnected(ap, bp);

        ap.connectProfile(cp);
        verifyFollow(ap, cp);

        profileRepo.saveProfile(cp);
        ProfileDTO cv = profileRepo.getProfile(cp.getUserUuid());
        verifyProfile(cp, cv);

        bp.followProfile(cp);
        verifyFollow(bp, cp);

        profileRepo.saveProfile(bp);
        bv = profileRepo.getProfile(bp.getUserUuid());
        verifyProfile(bp, bv);

        cp.followProfile(ap);
        verifyConnected(ap, cp);

        cp.connectProfile(ap);
        verifyConnected(ap, cp);

        profileRepo.saveProfile(cp);
        cv = profileRepo.getProfile(cp.getUserUuid());
        verifyProfile(cp, cv);

        profileRepo.saveProfile(ap);
        av = profileRepo.getProfile(ap.getUserUuid());
        verifyProfile(ap, av);
    }

    /**
     * Verify that two profiles are equals.
     */
    void verifyProfile(ProfileDTO a, ProfileDTO b)
    {
        assertEquals(a.getUserUuid(), b.getUserUuid());
        assertEquals(a.obtainUserId(), b.obtainUserId());
        assertEquals(a.getEmail(), b.getEmail());
        assertEquals(a.getFirstName(), b.getFirstName());
        assertEquals(a.getLastName(), b.getLastName());

        verifyList(a, a.getConnectList(), b, b.getConnectList());
        verifyList(a, a.getFollowList(), b, b.getFollowList());
        verifyList(a, a.getFollowerList(), b, b.getFollowerList());
    }

    /**
     * Verify that two lists are equals.
     */
    void verifyList(ProfileDTO ap, List<UUID> a, ProfileDTO bp, List<UUID> b)
    {
        Map<UUID, Long> map = new HashMap<>();

        for (UUID uuid : a) {
            map.put(uuid, 1L);
        }
        for (UUID uuid : b) {
            if (map.get(uuid) == null) {
                s_log.info("Orig: " + ap);
                s_log.info("Verf: " + bp);
            }
            assertNotNull(map.get(uuid));
            map.remove(uuid);
        }
        if (!map.isEmpty()) {
            s_log.info("Orig: " + ap);
            s_log.info("Verf: " + bp);
        }
        assertTrue(map.isEmpty());
    }

    /**
     * Verify that both a and b are connected.
     */
    void verifyConnected(ProfileDTO ap, ProfileDTO bp)
    {
        UUID auid = ap.getUserUuid();
        UUID buid = bp.getUserUuid();

        assertNotNull(ap.findUuid(ap.getConnectList(), buid));
        assertNull(ap.findUuid(ap.getFollowList(), buid));
        assertNull(bp.findUuid(ap.getFollowList(), auid));

        assertNotNull(bp.findUuid(bp.getConnectList(), auid));
        assertNull(ap.findUuid(ap.getFollowerList(), buid));
        assertNull(bp.findUuid(ap.getFollowerList(), auid));
    }

    /**
     * Verify that a follows b.
     */
    void verifyFollow(ProfileDTO ap, ProfileDTO bp)
    {
        UUID auid = ap.getUserUuid();
        UUID buid = bp.getUserUuid();

        assertNotNull(ap.findUuid(ap.getFollowList(), buid));
        assertNotNull(bp.findUuid(bp.getFollowerList(), auid));
        assertNull(ap.findUuid(ap.getConnectList(), buid));
        assertNull(bp.findUuid(bp.getFollowList(), auid));
    }

    public static class MockUser extends User
    {
        public MockUser(String lastName, String firstName, String email)
        {
            super();
            setId(ProfileTest.getTestId());
            setLastName(lastName);
            setFirstName(firstName);
            setEmail(email);
        }

        public static Profile createProfile(User user)
        {
            Profile profile = Profile.createProfile(user);

            profile.setConnectList(new LinkedList<UUID>());
            profile.setFollowList(new LinkedList<UUID>());
            profile.setFollowerList(new LinkedList<UUID>());
            profile.setChainLinks(new LinkedList<Long>());
            return profile;
        }
    }
}
