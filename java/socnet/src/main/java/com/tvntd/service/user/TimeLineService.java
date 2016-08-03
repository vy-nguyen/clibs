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

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.TimeLineRepo;
import com.tvntd.models.TimeLine;
import com.tvntd.service.api.ITimeLineService;

@Service
@Transactional
public class TimeLineService implements ITimeLineService
{
    private static Logger s_log = LoggerFactory.getLogger(TimeLineService.class);

    @Autowired
    TimeLineRepo timeLineRepo;

    @Override
    public TimeLineDTO createTimeLine(String user, String article)
    {
        return new TimeLineDTO(user, article);
    }

    @Override
    public TimeLineDTO getTimeLine(String user, String article)
    {
        return new TimeLineDTO(timeLineRepo
                .findByUserUuidAndArticleUuid(user.toString(), article.toString()));
    }

    @Override
    public List<TimeLineDTO> getTimeLine(String user)
    {
        return convert(timeLineRepo.findByUserUuid(user.toString()));
    }

    @Override
    public List<TimeLineDTO> convert(List<TimeLine> src)
    {
        List<TimeLineDTO> result = new LinkedList<>();

        for (TimeLine tl : src) {
            result.add(new TimeLineDTO(tl));
        }
        return result;
    }

    @Override
    public void saveTimeLine(TimeLineDTO tline)
    {
        timeLineRepo.save(tline.getTimeLine());
    }

    @Override
    public void saveTimeLine(List<TimeLineDTO> list)
    {
        try {
            for (TimeLineDTO tline : list) {
                timeLineRepo.save(tline.getTimeLine());
                s_log.info("Save timeline: " + tline);
            }
        } catch(Exception e) {
            s_log.info("Timeline exception: " + e.toString());
        }
    }

    @Override
    public void saveTimeLine(String user, String article, String event, byte[] text)
    {
        TimeLineDTO tline = new TimeLineDTO(user, article);

        if (event != null) {
            tline.setEventUuid(event.toString());
        }
        tline.setSummarized(text);
        saveTimeLine(tline);
    }

    @Override
    public void deleteTimeLine(String user, String article)
    {
        TimeLine tline = new TimeLine(user.toString(), article.toString());
        timeLineRepo.delete(tline);
    }

    @Override
    public void deleteTimeLineOlder(String user, Date older)
    {
    }
}
