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
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tvntd.config.TestPersistenceJPAConfig;
import com.tvntd.config.TestSecurityConfig;
import com.tvntd.config.TestTvntdRootConfig;
import com.tvntd.config.TestTvntdWebConfig;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IMenuItemService;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;
import com.tvntd.service.api.IUserNotifService;
import com.tvntd.service.api.UserNotifResponse;

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
public class MenuItemTest
{
    private static Logger s_log = LoggerFactory.getLogger(MenuItemTest.class);
    private static final ByteArrayOutputStream outContent;
    private static final ByteArrayOutputStream errContent;
    static {
        outContent = new ByteArrayOutputStream();
        errContent = new ByteArrayOutputStream();
    }
    @Autowired
    IMenuItemService menuItemService;

    @Autowired
    IUserNotifService userNotifService;

    @Autowired
    IArticleService articleService;

    @Before
    public void setUpStreams()
    {
        System.setOut(new PrintStream(outContent));
        System.setErr(new PrintStream(errContent));
    }

    @After
    public void cleanUpStreams()
    {
        System.setOut(null);
        System.setErr(null);
    }

    @Test
    public void testMenuItemService()
    {
        String rsDir = System.getProperty("TestResource");
        String jsonFile = rsDir + "/menu-item.json";
        menuItemService.saveMenuItem(jsonFile);

        Long userId = menuItemService.getPublicId();
        List<MenuItemResp> menu = menuItemService.getMenuItemRespByUser(userId);
        assertNotNull(menu);

        userId = menuItemService.getPrivateId();
        menu = menuItemService.getMenuItemRespByUser(userId);
        assertNotNull(menu);

        userId = menuItemService.getAdminId();
        menu = menuItemService.getMenuItemRespByUser(userId);
        assertNotNull(menu);
    }

    @Test
    public void testUserNotifyService()
    {
        String rsDir = System.getProperty("TestResource");
        String jsonFile = rsDir + "/user-notify.json";
        userNotifService.saveUserNotif(0L, jsonFile);

        UserNotifResponse resp = userNotifService.getUserNotif(0L);
        assertNotNull(resp);

        Gson out = new GsonBuilder().setPrettyPrinting().create();
        s_log.info(out.toJson(resp));
    }

    @Test
    public void testArticleService()
    {
        String rsDir = System.getProperty("TestResource");
        String jsonFile = rsDir + "/article-sample.json";

        articleService.saveArticles(jsonFile, rsDir);
        Page<ArticleDTO> articles =
            articleService.getUserArticles("vynguyen77@yahoo.com");

        assertNotNull(articles);
    }
}
