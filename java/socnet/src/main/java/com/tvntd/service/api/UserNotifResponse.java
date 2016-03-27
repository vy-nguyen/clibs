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
package com.tvntd.service.api;

import java.util.List;

public class UserNotifResponse
{
    private Message message;
    private Notify notify;
    private Task task;

    /**
     * @return the message
     */
    public Message getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(Message message) {
        this.message = message;
    }

    /**
     * @return the notify
     */
    public Notify getNotify() {
        return notify;
    }

    /**
     * @param notify the notify to set
     */
    public void setNotify(Notify notify) {
        this.notify = notify;
    }

    /**
     * @return the task
     */
    public Task getTask() {
        return task;
    }

    /**
     * @param task the task to set
     */
    public void setTask(Task task) {
        this.task = task;
    }

    public static class Message
    {
        private String title;
        private String name;
        private Long length;
        List<MessageItem> items;

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
         * @return the length
         */
        public Long getLength() {
            return length;
        }

        /**
         * @param length the length to set
         */
        public void setLength(Long length) {
            this.length = length;
        }

        /**
         * @return the items
         */
        public List<MessageItem> getItems() {
            return items;
        }

        /**
         * @param items the items to set
         */
        public void setItems(List<MessageItem> items) {
            this.items = items;
        }
    }

    public static class MessageItem
    {
        private String type;
        private String title;
        private String image;
        private String time;
        private String subject;
        private String message;
        private String status;

        /**
         * @return the type
         */
        public String getType() {
            return type;
        }

        /**
         * @param type the type to set
         */
        public void setType(String type) {
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
         * @return the image
         */
        public String getImage() {
            return image;
        }

        /**
         * @param image the image to set
         */
        public void setImage(String image) {
            this.image = image;
        }

        /**
         * @return the time
         */
        public String getTime() {
            return time;
        }

        /**
         * @param time the time to set
         */
        public void setTime(String time) {
            this.time = time;
        }

        /**
         * @return the subject
         */
        public String getSubject() {
            return subject;
        }

        /**
         * @param subject the subject to set
         */
        public void setSubject(String subject) {
            this.subject = subject;
        }

        /**
         * @return the message
         */
        public String getMessage() {
            return message;
        }

        /**
         * @param message the message to set
         */
        public void setMessage(String message) {
            this.message = message;
        }

        /**
         * @return the status
         */
        public String getStatus() {
            return status;
        }

        /**
         * @param status the status to set
         */
        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class Notify
    {
        private String title;
        private String name;
        private Long length;
        private List<NotifyItem> items;

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
         * @return the length
         */
        public Long getLength() {
            return length;
        }

        /**
         * @param length the length to set
         */
        public void setLength(Long length) {
            this.length = length;
        }

        /**
         * @return the items
         */
        public List<NotifyItem> getItems() {
            return items;
        }

        /**
         * @param items the items to set
         */
        public void setItems(List<NotifyItem> items) {
            this.items = items;
        }
    }

    public static class NotifyItem
    {
        private String type;
        private String icon;
        private String message;
        private String time;

        /**
         * @return the type
         */
        public String getType() {
            return type;
        }

        /**
         * @param type the type to set
         */
        public void setType(String type) {
            this.type = type;
        }

        /**
         * @return the icon
         */
        public String getIcon() {
            return icon;
        }

        /**
         * @param icon the icon to set
         */
        public void setIcon(String icon) {
            this.icon = icon;
        }

        /**
         * @return the message
         */
        public String getMessage() {
            return message;
        }

        /**
         * @param message the message to set
         */
        public void setMessage(String message) {
            this.message = message;
        }

        /**
         * @return the time
         */
        public String getTime() {
            return time;
        }

        /**
         * @param time the time to set
         */
        public void setTime(String time) {
            this.time = time;
        }
    }

    public static class Task
    {
        private String title;
        private String name;
        private Long length;
        private List<TaskItem> items;

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
         * @return the length
         */
        public Long getLength() {
            return length;
        }

        /**
         * @param length the length to set
         */
        public void setLength(Long length) {
            this.length = length;
        }

        /**
         * @return the items
         */
        public List<TaskItem> getItems() {
            return items;
        }

        /**
         * @param items the items to set
         */
        public void setItems(List<TaskItem> items) {
            this.items = items;
        }
    }

    public static class TaskItem
    {
        private String type;
        private String status;
        private String progressClass;
        private String title;
        private String width;

        /**
         * @return the type
         */
        public String getType() {
            return type;
        }

        /**
         * @param type the type to set
         */
        public void setType(String type) {
            this.type = type;
        }

        /**
         * @return the status
         */
        public String getStatus() {
            return status;
        }

        /**
         * @param status the status to set
         */
        public void setStatus(String status) {
            this.status = status;
        }

        /**
         * @return the progressClass
         */
        public String getProgressClass() {
            return progressClass;
        }

        /**
         * @param progressClass the progressClass to set
         */
        public void setProgressClass(String progressClass) {
            this.progressClass = progressClass;
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
         * @return the width
         */
        public String getWidth() {
            return width;
        }

        /**
         * @param width the width to set
         */
        public void setWidth(String width) {
            this.width = width;
        }
    }
}
