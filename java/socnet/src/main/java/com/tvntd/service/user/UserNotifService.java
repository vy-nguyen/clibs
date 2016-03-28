/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
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

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tvntd.dao.UserNotifyRepository;
import com.tvntd.models.UserNotify;
import com.tvntd.models.UserNotify.NotifyType;
import com.tvntd.service.api.IUserNotifService;
import com.tvntd.service.api.UserNotifResponse;
import com.tvntd.service.api.UserNotifResponse.Message;
import com.tvntd.service.api.UserNotifResponse.Notify;
import com.tvntd.service.api.UserNotifResponse.Task;

@Service
@Transactional
public class UserNotifService implements IUserNotifService
{
    static private Logger s_log = LoggerFactory.getLogger(UserNotifService.class);

    @Autowired
    protected UserNotifyRepository notifRepo;

    @Override
    public UserNotifResponse getUserNotif(Long userId)
    {
        List<UserNotify> raw = notifRepo.findAllByUserId(userId);

        if (raw == null) {
            return null;
        }
        UserNotifResponse result = new UserNotifResponse();
        for (UserNotify r : raw) {
            NotifyType type = r.getType();
            if (type == NotifyType.message) {
                result.setMessage(new Message(r));
                continue;
            }
            if (type == NotifyType.notify) {
                result.setNotify(new Notify(r));
                continue;
            }
            if (type == NotifyType.task) {
                result.setTask(new Task(r));
                continue;
            }
        }
        return result;
    }

    public void saveUserNotif(UserNotifResponse mem, Long userId)
    {
        UserNotify mesg  = mem.getMessage().toDbaseRecord();
        UserNotify notif = mem.getNotify().toDbaseRecord();
        UserNotify task  = mem.getTask().toDbaseRecord();

        mesg.setUserId(userId);
        notif.setUserId(userId);
        task.setUserId(userId);

        notifRepo.save(mesg);
        notifRepo.save(notif);
        notifRepo.save(task);
    }

    public void saveUserNotif(Long userId, String jsonFile)
    {
        Gson gson = new Gson();
        try {
            BufferedReader brd = new BufferedReader(new FileReader(jsonFile));
            UserNotifResponse json = gson.fromJson(brd, UserNotifResponse.class);
            brd.close();

            Gson out = new GsonBuilder().setPrettyPrinting().create();
            String debug = out.toJson(json);
            s_log.info("Parsed " + debug);

            saveUserNotif(json, userId);

        } catch(IOException e) {
            s_log.error(e.getMessage());
        }
    }
}
