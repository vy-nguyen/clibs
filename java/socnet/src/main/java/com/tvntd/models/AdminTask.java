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
package com.tvntd.models;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(indexes = {
    @Index(columnList = "taskCode", unique = false),
    @Index(columnList = "userUuid", unique = false)
})
public class AdminTask
{
    static public Long FUND_MICROPAY = 0x0000000000000001L;
    static public Long SEND_EMAIL    = 0x0000000000000002L;

    @Id
    @Column(length = 64)
    protected String taskUuid;

    @Column(length = 64)
    protected String userUuid;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    protected Date timeStamp;

    @Column
    protected Long taskCode;

    @Column(length = 1024)
    protected String taskValue;

    public AdminTask()
    {
        timeStamp = new Date();
        taskUuid = UUID.randomUUID().toString();
    }

    public AdminTask(String userUuid, Long code, String value)
    {
        this();
        this.userUuid = userUuid;
        this.taskCode = code;
        this.taskValue = value;
    }

    /**
     * @return the taskUuid
     */
    public String getTaskUuid() {
        return taskUuid;
    }

    /**
     * @return the userUuid
     */
    public String getUserUuid() {
        return userUuid;
    }

    /**
     * @return the timeStamp
     */
    public Date getTimeStamp() {
        return timeStamp;
    }

    /**
     * @return the taskCode
     */
    public Long getTaskCode() {
        return taskCode;
    }

    /**
     * @return the taskValue
     */
    public String getTaskValue() {
        return taskValue;
    }
}
