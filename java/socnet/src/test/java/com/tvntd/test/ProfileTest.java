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

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.tvntd.config.TestCacheConfig;
import com.tvntd.config.TestPersistenceJPAConfig;
import com.tvntd.config.TestSecurityConfig;
import com.tvntd.config.TestTvntdRootConfig;
import com.tvntd.config.TestTvntdWebConfig;
import com.tvntd.dao.RoleRepository;
import com.tvntd.dao.UserRepository;
import com.tvntd.lib.RandUtil;
import com.tvntd.models.Profile;
import com.tvntd.models.Role;
import com.tvntd.models.User;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.test.TestData.UserRoleItem;
import com.tvntd.test.TestData.UserRoles;
import com.tvntd.util.Constants;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(
    classes = {
        TestSecurityConfig.class,
        TestTvntdWebConfig.class,
        TestPersistenceJPAConfig.class,
        TestTvntdRootConfig.class,
        TestCacheConfig.class
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

    static protected Long testId = 10000L;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private IProfileService profileSvc;

    @Autowired
    private UserRepository userRepo;

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
    public void testProfileBasic()
    {
        MockUser a = new MockUser("AA", "AaAaAa", "aa@abc.com");
        MockUser b = new MockUser("BB", "BbBbBb", "bbm@abc.com");
        MockUser c = new MockUser("CC", "CcCcCc", "ccp@abc.com");
        ProfileDTO ap = new ProfileDTO(MockUser.createProfile(a));
        ProfileDTO bp = new ProfileDTO(MockUser.createProfile(b));
        ProfileDTO cp = new ProfileDTO(MockUser.createProfile(c));

        bp.connectProfile(ap);
        verifyFollow(bp, ap);

        profileSvc.saveProfile(ap);
        profileSvc.saveProfile(bp);

        ProfileDTO av = profileSvc.getProfile(ap.getUserUuid());
        ProfileDTO bv = profileSvc.getProfile(bp.getUserUuid());

        verifyProfile(ap, av);
        verifyProfile(bp, bv);

        ap.followProfile(bp);
        verifyConnected(ap, bp);

        profileSvc.saveProfile(ap);
        profileSvc.saveProfile(bp);

        av = profileSvc.getProfile(ap.getUserUuid());
        bv = profileSvc.getProfile(bp.getUserUuid());
        verifyProfile(ap, av);
        verifyProfile(bp, bv);

        profileSvc.saveProfile(ap);
        av = profileSvc.getProfile(ap.getUserUuid());
        verifyProfile(ap, av);

        bp.followProfile(ap);
        verifyConnected(ap, bp);

        ap.connectProfile(cp);
        verifyFollow(ap, cp);

        profileSvc.saveProfile(cp);
        ProfileDTO cv = profileSvc.getProfile(cp.getUserUuid());
        verifyProfile(cp, cv);

        bp.followProfile(cp);
        verifyFollow(bp, cp);

        profileSvc.saveProfile(bp);
        bv = profileSvc.getProfile(bp.getUserUuid());
        verifyProfile(bp, bv);

        cp.followProfile(ap);
        verifyConnected(ap, cp);

        cp.connectProfile(ap);
        verifyConnected(ap, cp);

        profileSvc.saveProfile(cp);
        cv = profileSvc.getProfile(cp.getUserUuid());
        verifyProfile(cp, cv);

        profileSvc.saveProfile(ap);
        av = profileSvc.getProfile(ap.getUserUuid());
        verifyProfile(ap, av);
    }

    @Test
    public void testProfiles()
    {
        List<String> uuids = genProfiles(10);
        testConnectAll(uuids, 10);
        deleteProfiles(uuids);
    }

    void testConnectAll(List<String> uuids, int max)
    {
        for (int i = 0; i < max; i++) {
            int index = RandUtil.genRandInt(0, uuids.size() - 1);
            ProfileDTO me = profileSvc.getProfile(uuids.get(index));

            assertNotNull(me);
            for (String uid : uuids) {
                ProfileDTO peer = profileSvc.getProfile(uid);
                assertNotNull(peer);

                me.connectProfile(peer);
                if (!me.fetchUserId().equals(peer.fetchUserId())) {
                    verifyFollow(me, peer);
                    verifyFollower(peer, me);
                }
                profileSvc.saveProfile(peer);
            }
            profileSvc.saveProfile(me);
        }
    }

    /**
     * Generate number of profiles and save it to the database.
     */
    List<String> genProfiles(int max)
    {
        List<String> uuids = new ArrayList<>(max);

        for (int i = 0; i < max; i++) {
            String first = RandUtil.genRandString(3, 5);
            String last = RandUtil.genRandString(3, 5);
            MockUser u = new MockUser(first, last, first + "." + last + "@abc.com");
            ProfileDTO p = new ProfileDTO(MockUser.createProfile(u));

            uuids.add(p.getUserUuid());
            profileSvc.saveProfile(p);
         }
        return uuids;
    }

    void deleteProfiles(List<String> uuids)
    {
        for (String uid : uuids) {
            profileSvc.deleteProfile(uid);
        }
    }

    /**
     * Verify that two profiles are equals.
     */
    void verifyProfile(ProfileDTO a, ProfileDTO b)
    {
        assertEquals(a.getUserUuid(), b.getUserUuid());
        assertEquals(a.fetchUserId(), b.fetchUserId());
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
    void verifyList(ProfileDTO ap, List<String> a, ProfileDTO bp, List<String> b)
    {
        Map<String, Long> map = new HashMap<>();

        for (String uuid : a) {
            map.put(uuid, 1L);
        }
        for (String uuid : b) {
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
        String auid = ap.getUserUuid();
        String buid = bp.getUserUuid();

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
        String auid = ap.getUserUuid();
        String buid = bp.getUserUuid();

        if (ap.findUuid(ap.getFollowList(), buid) == null) {
            verifyConnected(ap, bp);
            return;
        }
        assertNotNull(ap.findUuid(ap.getFollowList(), buid));
        assertNotNull(bp.findUuid(bp.getFollowerList(), auid));
        assertNull(ap.findUuid(ap.getConnectList(), buid));
        assertNull(bp.findUuid(bp.getFollowList(), auid));
    }

    void verifyFollower(ProfileDTO me, ProfileDTO follower)
    {
        String peer = follower.getUserUuid();

        if (me.findUuid(me.getFollowerList(), peer) == null) {
            verifyConnected(me, follower);
        }
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
            Profile profile = Profile.createProfile(user, null);

            profile.setConnectList(new LinkedList<String>());
            profile.setFollowList(new LinkedList<String>());
            profile.setFollowerList(new LinkedList<String>());
            profile.setChainLinks(new LinkedList<Long>());
            return profile;
        }
    }

    /**
     * Set user roles.
     */
    @Test
    public void setUserRoles()
    {
        String rsDir = System.getProperty("TestResource");
        String jsonFile = rsDir + "/user-role.json";
        Gson gson  = new Gson();
        try {
            BufferedReader brd = new BufferedReader(new FileReader(jsonFile));
            UserRoles roles = gson.fromJson(brd, UserRoles.class);
            UserRoleItem[] input = roles.getUserRoles();

            for (UserRoleItem item : input) {
                User user = userRepo.findByEmail(item.getEmail());
                if (user == null) {
                    continue;
                }
                Long mask = Constants.Role_User;
                for (String r : item.getRoles()) {
                    if (r.equals("admin")) {
                        mask |= Constants.Role_Admin;
                        continue;
                    }
                    if (r.equals("dba")) {
                        mask |= Constants.Role_Dba;
                    }
                }
                grantUserRole(user, mask);
            }
            brd.close();

        } catch(IOException | JsonSyntaxException e) {
            s_log.info("Failed to parse json file " + e.toString());
        }
    }

    /**
     * Grant user roles according to the mask.
     */
    public void grantUserRole(User user, Long mask)
    {
        addRoles(user.getRoles(), mask);
        userRepo.save(user);
    }

    public void addRoles(Collection<Role> roles, Long mask)
    {
        for (Role r : roles) {
            String name = r.getName();
            s_log.info(">> Role name " + name);
            if (name.equals(Role.AuthUser)) {
                mask &= ~Constants.Role_User;
                continue;
            }
            if (name.equals(Role.AuthAdmin)) {
                mask &= ~Constants.Role_Admin;
                continue;
            }
            if (name.equals(Role.AuthDba)) {
                mask &= ~Constants.Role_Dba;
                continue;
            }
            if (name.equals(Role.AuthBanker)) {
                mask &= ~Constants.Role_Banker;
                continue;
            }
        }
        Role role = null;
        if ((mask & Constants.Role_User) != 0) {
            role = roleRepo.findByName(Role.AuthUser);
            if (role != null) {
                roles.add(role);
            }
        }
        if ((mask & Constants.Role_Admin) != 0) {
            role = roleRepo.findByName(Role.AuthAdmin);
            if (role != null) {
                roles.add(role);
            }
        }
        if ((mask & Constants.Role_Dba) != 0) {
            role = roleRepo.findByName(Role.AuthDba);
            if (role != null) {
                roles.add(role);
            }
        }
        if ((mask & Constants.Role_Banker) != 0) {
            role = roleRepo.findByName(Role.AuthBanker);
            if (role != null) {
                roles.add(role);
            }
        }
    }
}
