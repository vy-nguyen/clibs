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
package com.tvntd.models;

import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;

@Entity @IdClass(UserNotifyId.class)
public class UserNotify
{
    @Id private Long       userId;
    @Id private NotifyType type;

    private String title;
    private String name;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "UserNotifyItem",
        joinColumns = {
            @JoinColumn(name = "userId", referencedColumnName="userId"),
            @JoinColumn(name = "type", referencedColumnName="type")
        })
    private List<UserNotifyItem> items;

    public enum NotifyType
    {
        message(1),
        notify(2),
        task(3);

        private int typeVal;
        NotifyType(int val) {
            this.typeVal = val;
        }

        /**
         * @return the typeVal
         */
        public int getTypeVal() {
            return typeVal;
        }
    }

    private void setKey()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(userId);
        switch(type) {
        case message:
            sb.append("-mesg");
            break;

        case notify:
            sb.append("-notify");
            break;

        case task:
            sb.append("-task");
            break;
        }
    }

    /**
     * @return the userId
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(Long userId) {
        this.userId = userId;
        setKey();
    }

    /**
     * @return the type
     */
    public NotifyType getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(NotifyType type) {
        this.type = type;
    }

    /**
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * @param title the title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the items
     */
    public List<UserNotifyItem> getItems() {
        return items;
    }

    /**
     * @param items the items to set
     */
    public void setItems(List<UserNotifyItem> items) {
        this.items = items;
    }
}
