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
import java.util.LinkedList;
import java.util.List;

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

import com.tvntd.config.TestAccountJPAConfig;
import com.tvntd.config.TestCacheConfig;
import com.tvntd.config.TestPersistenceJPAConfig;
import com.tvntd.config.TestSecurityConfig;
import com.tvntd.config.TestTvntdRootConfig;
import com.tvntd.config.TestTvntdWebConfig;
import com.tvntd.ether.config.EtherJPAConfig;
import com.tvntd.ether.config.RootConfig;
import com.tvntd.forms.PostForm;
import com.tvntd.lib.RandUtil;
import com.tvntd.models.ArticlePost;
import com.tvntd.models.Author;
import com.tvntd.models.Profile;
import com.tvntd.models.User;
import com.tvntd.service.api.IArticleSvc;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.ITimeLineService;
import com.tvntd.service.api.ITimeLineService.TimeLineDTO;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(
    classes = {
        TestSecurityConfig.class,
        TestTvntdWebConfig.class,
        TestPersistenceJPAConfig.class,
        TestAccountJPAConfig.class,
        TestTvntdRootConfig.class,
        TestCacheConfig.class,
        EtherJPAConfig.class,
        RootConfig.class
    }
)
public class ArticleTest
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
    IProfileService profileSvc;

    @Autowired
    IArticleSvc     articleSvc;

    @Autowired
    ITimeLineService timeLineSvc;

    @Autowired
    IAuthorService authorSvc;

    static public Long getTestId() 
    {
        long rt = testId++;
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
    public void testArticles()
    {
        MockUser a = new MockUser("AA", "AaAaAa", "aa@abc.com");
        ProfileDTO ap = new ProfileDTO(MockUser.createProfile(a));
        List<TimeLineDTO> tlist = new LinkedList<>();
        List<ArticlePost> arts = genArticles(ap, 100, 20, 1024);

        for (ArticlePost at : arts) {
            // articleSvc.saveArticlePost(at);
            TimeLineDTO tline = timeLineSvc.createTimeLine(
                    at.getAuthorUuid(), at.getArticleUuid());

            tline.setSummarized(RandUtil.genRandString(10, 20).getBytes());
            tlist.add(tline);
        }
        timeLineSvc.saveTimeLine(tlist);

        List<TimeLineDTO> check = timeLineSvc.getTimeLine(ap.getUserUuid());
        s_log.info("Article size : " + arts.size());
        s_log.info("Timeline size: " + check.size());

        assertEquals(check.size(), arts.size());

        doAuthorTest(ap, arts);

        /*
        for (ArticlePost at : arts) {
            articleSvc.deleteArticle(at, ap);
        }
        */
        for (TimeLineDTO tl : check) {
            timeLineSvc.deleteTimeLine(tl.getUserUuid(), tl.getArticleUuid());
        }
    }

    void doAuthorTest(ProfileDTO profile, List<ArticlePost> articles)
    {
        /*
        ArticlePost art = articles.get(0);
        Author author = Author.fromProfile(profile, art.getArticleUuid());

        s_log.info("Do author test " +
                profile.getUserUuid() + " art size " + articles.size());

        int limit = articles.size() / 2;
        for (int i = 0; i < limit; i++) {
            art = articles.get(i);
            author.addFavoriteArticle(art.getArticleUuid());
        }
        authorSvc.saveAuthor(author);
        authorSvc.deleteAuthor(profile.getUserUuid());

        // Save and retrieve again may not work!  Need to understand the model more.
        //
        Author ref = authorSvc.getAuthor(profile.getUserUuid());
        s_log.info("Author uuid " + author.getAuthorUuid() +
                ", profile " + profile.getUserUuid() + " ref " + ref);
        assertNotNull(ref);

        List<UUID> mod = new LinkedList<>();
        List<UUID> fav = ref.getFavArticles();
        s_log.info("Fav size: " + fav.size() + ", limit " + limit);
        s_log.info("List: " + fav);

        assertEquals(fav.size(), limit);

        limit = limit / 2;
        for (int i = 0; i < limit; i++) {
            art = articles.get(i);
            UUID aid = UUID.fromString(art.getArticleUuid());
            UUID uid = ProfileDTO.removeFrom(fav, aid);

            assertEquals(aid, uid);
            mod.add(uid);
        }
        ref.setFavArticles(mod);
        authorSvc.saveAuthor(ref, true);

        author = authorSvc.getAuthor(profile.getUserUuid());
        assertNotNull(author);

        fav = author.getFavArticles();
        assertEquals(fav.size(), limit);
        */
    }

    public List<ArticlePost> genArticles(ProfileDTO profile,
            int count, int topicLen, int contentLen)
    {
        List<ArticlePost> result = new LinkedList<>();

        for (int i = 0; i < count; i++) {
            PostForm post = new PostForm();
            post.setTopic(RandUtil.genRandString(topicLen, topicLen));
            post.setContent(RandUtil.genRandString(contentLen, contentLen));

            // result.add(articleSvc.toArticle(post, profile, true));
        }
        return result;
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
}
