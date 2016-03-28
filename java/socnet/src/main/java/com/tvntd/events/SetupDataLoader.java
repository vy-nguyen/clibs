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
package com.tvntd.events;

/*
 * Adopt work from:
 * https://github.com/eugenp/tutorials.git
 */
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.dao.PrivilegeRepository;
import com.tvntd.dao.RoleRepository;
import com.tvntd.dao.UserRepository;
import com.tvntd.models.Privilege;
import com.tvntd.models.Role;
import com.tvntd.models.User;
import com.tvntd.service.api.ISideNavMenuService;
import com.tvntd.service.api.ITopNavMenuService;

@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent>
{
    private static final Logger s_log = LoggerFactory.getLogger(SetupDataLoader.class);
    private boolean alreadySetup = false;
    
    @Autowired
    private ITopNavMenuService topNavSvc;

    @Autowired
    private ISideNavMenuService sideNavSvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PrivilegeRepository privilegeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // API
    @Override
    @Transactional
    public void onApplicationEvent(final ContextRefreshedEvent event)
    {
        if (alreadySetup) {
            return;
        }
        s_log.info("Initialize the database");

        // Create initial privileges
        Privilege op_read  = createPrivilegeIfNotFound(Privilege.Read);
        Privilege op_write = createPrivilegeIfNotFound(Privilege.Write);
        Privilege op_user  = createPrivilegeIfNotFound(Role.AuthUser);
        Privilege op_dba   = createPrivilegeIfNotFound(Role.Dba);
        Privilege op_admin = createPrivilegeIfNotFound(Role.AuthAdmin);

        // Create initial roles
        List<Privilege> dbaPriv   = Arrays.asList(op_dba, op_read, op_write);
        List<Privilege> userPriv  = Arrays.asList(op_user, op_read);
        List<Privilege> adminPriv = Arrays.asList(op_admin, op_read, op_write);

        createRoleIfNotFound(Role.AuthDba, dbaPriv);
        createRoleIfNotFound(Role.AuthAdmin, adminPriv);
        createRoleIfNotFound(Role.AuthUser, userPriv);

        Role testRole = roleRepository.findByName(Role.AuthUser);
        if (userRepository.findByEmail("test@test.com") == null) {
            User user = new User();
            user.setFirstName("Test");
            user.setLastName("Test");
            user.setPassword(passwordEncoder.encode("test"));
            user.setEmail("test@test.com");
            user.setRoles(Arrays.asList(testRole));
            user.setEnabled(true);
            userRepository.save(user);
        }
        topNavSvc.createPublicTopNav();
        sideNavSvc.createPublicSideNavMenu();

        alreadySetup = true;
    }

    @Transactional
    private final Privilege createPrivilegeIfNotFound(String name)
    {
        Privilege privilege = privilegeRepository.findByName(name);
        if (privilege == null) {
            privilege = new Privilege(name);
            privilegeRepository.save(privilege);
        }
        return privilege;
    }

    @Transactional
    private final Role createRoleIfNotFound(String name, Collection<Privilege> priv)
    {
        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role(name);
            role.setPrivileges(priv);
            roleRepository.save(role);
        }
        return role;
    }
}
