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
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.dao.NewsFeedRepo;
import com.tvntd.exports.LibModule;
import com.tvntd.models.NewsFeed;
import com.tvntd.service.api.INewsFeedService;
import com.tvntd.service.api.IProfileService.ProfileDTO;

@Service
@Transactional
public class NewsFeedService implements INewsFeedService
{
    private static Logger s_log = LoggerFactory.getLogger(NewsFeedService.class);
    public static String publicNewsFeed = "ffff-000-ffff-000-ffff";
    protected static List<String> publicAuthors;

    @Autowired
    NewsFeedRepo newsFeedRepo;

    @Override
    public void generateNewsFeed(ProfileDTO profile, String user)
    {
        NewsFeedTask task = new NewsFeedTask(user, profile, newsFeedRepo);
        ExecutorService exec = LibModule.getExecutorService();
        profile.assignPendTask(exec.submit(task));
    }

    @Override
    public List<String> getPrivateFeed(ProfileDTO profile, String user)
    {
        List<String> result = profile.fetchNewsFeed();
        if (result != null) {
            return result;
        }
        NewsFeed feed = newsFeedRepo.findByUserUuid(user.toString());
        if (feed != null) {
            result = feed.getAuthorUuid();
            profile.assignNewsFeed(result);
        }
        return result;
    }

    @Override
    public List<String> getPublicFeed(ProfileDTO profile, String user)
    {
        if (publicAuthors == null) {
            NewsFeed feed = newsFeedRepo.findByUserUuid(publicNewsFeed);
            if (feed != null) {
                publicAuthors = feed.getAuthorUuid();
            }
        }
        return publicAuthors;
    }

    class NewsFeedTask implements Callable<List<String>>
    {
        protected String userUuid;
        protected ProfileDTO profile;
        protected NewsFeedRepo newsRepo;

        public NewsFeedTask(String uuid, ProfileDTO prof, NewsFeedRepo repo)
        {
            userUuid = uuid;
            profile = prof;
            newsRepo = repo;
        }

        public List<String> call()
        {
            List<String> authors = new LinkedList<>();
            List<String> connect = profile.getConnectList();
            List<String> follow = profile.getFollowList();
            List<String> follower = profile.getFollowerList();

            for (String uuid : connect) {
                authors.add(uuid);
            }
            for (String uuid : follow) {
                authors.add(uuid);
            }
            for (String uuid : follower) {
                authors.add(uuid);
            }
            profile.assignNewsFeed(authors);

            try {
                NewsFeed feed = newsRepo.findByUserUuid(userUuid.toString());
                if (feed == null) {
                    feed = NewsFeed.fromProfile(profile);
                }
                feed.setAuthorUuid(authors);
                newsRepo.save(feed);

            } catch(Exception e) {
                s_log.info("Exception: " + e.toString());
            }
            return authors;
        }
    }
}
