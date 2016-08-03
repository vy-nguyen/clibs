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
package com.tvntd.service.api;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.tvntd.models.TimeLine;

public interface ITimeLineService
{
    public TimeLineDTO createTimeLine(String userUuid, String articleUuid);
    public TimeLineDTO getTimeLine(String userUuid, String articleUuid);
    public List<TimeLineDTO> getTimeLine(String userUuid);

    public void saveTimeLine(TimeLineDTO tline);
    public void saveTimeLine(List<TimeLineDTO> list);
    public void saveTimeLine(String userUuid, String artUuid, String event, byte[] text);

    public void deleteTimeLine(String userUuid, String articleUuid);
    public void deleteTimeLineOlder(String userUuid, Date older);

    public List<TimeLineDTO> convert(List<TimeLine> src);

    public static class TimeLineDTO
    {
        private TimeLine timeLine;

        public TimeLineDTO(TimeLine tline) {
            this.timeLine = tline;
        }

        public TimeLineDTO(String userUuid, String articleUuid)
        {
            timeLine = new TimeLine(userUuid.toString(), articleUuid.toString());
            timeLine.setTimeStamp(new Date());
        }

        /**
         * @return the timeLine
         */
        public TimeLine getTimeLine() {
            return timeLine;
        }

        /**
         * Getters.
         */
        public String getUserUuid() {
            return timeLine.getUserUuid();
        }

        public String getTimeStamp()
        {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(timeLine.getTimeStamp());
        }

        public String getArticleUuid() {
            return timeLine.getArticleUuid();
        }

        /**
         * Getters and Setters.
         */
        public String getEventUuid() {
            return timeLine.getEventUuid();
        }

        public void setEventUuid(String uuid) {
            timeLine.setEventUuid(uuid);
        }

        public byte[] getSummarized() {
            return timeLine.getSummarized();
        }

        public void setSummarized(byte[] data) {
            timeLine.setSummarized(data);
        }
    }
}
