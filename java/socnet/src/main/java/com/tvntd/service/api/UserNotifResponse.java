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

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.tvntd.models.UserNotify;
import com.tvntd.models.UserNotify.NotifyType;
import com.tvntd.models.UserNotifyItem;

public class UserNotifResponse
{
    private Message message;
    private Notify notify;
    private Task task;

    public static String milliToDate(Long milli)
    {
        if (milli != null) {
            Date date = new Date(milli);
            DateFormat df = new SimpleDateFormat("dd/MM/yy HH:mm");
            return df.format(date);
        }
        return null;
    }

    public static Long dateToMill(String dateStr)
    {
        if (dateStr != null) {
            DateFormat df = new SimpleDateFormat("dd/MM/yy HH:mm");
            try {
                Date date = df.parse(dateStr);
                return date.getTime();

            } catch(ParseException e) {
            }
        }
        return null;
    }

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
        private Integer length;
        List<MessageItem> items;

        public Message(UserNotify rec)
        {
            this.title = rec.getTitle();
            this.name = rec.getName();

            List<UserNotifyItem> list = rec.getItems();
            this.length = list.size();
            this.items = new ArrayList<>(this.length);
            for (UserNotifyItem it : list) {
                this.items.add(new MessageItem(it));
            }
        }

        public UserNotify toDbaseRecord()
        {
            UserNotify rec = new UserNotify();

            rec.setType(NotifyType.message);
            rec.setTitle(title);
            rec.setName(name);
            rec.setItems(new ArrayList<UserNotifyItem>(length));

            List<UserNotifyItem> list = rec.getItems();
            for (MessageItem m : items) {
                list.add(m.toDbaseRecord());
            }
            return rec;
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
         * @return the length
         */
        public Integer getLength() {
            return length;
        }

        /**
         * @param length the length to set
         */
        public void setLength(Integer length) {
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

        public MessageItem(UserNotifyItem it)
        {
            this.type = "Message";
            this.title = it.getTitle();
            this.image = it.getIcon();
            this.subject = it.getSubject();
            this.message = it.getMessage();
            this.status = it.getStatus();
            this.time = milliToDate(it.getMilliEpoc());
        }

        public UserNotifyItem toDbaseRecord()
        {
            UserNotifyItem item = new UserNotifyItem();
            item.setTitle(title);
            item.setImage(image);
            item.setSubject(subject);
            item.setMessage(message);
            item.setStatus(status);
            item.setMilliEpoc(dateToMill(time));
            return item;
        }

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
        private Integer length;
        private List<NotifyItem> items;

        public Notify(UserNotify rec)
        {
            this.title = rec.getTitle();
            this.name = rec.getName();

            List<UserNotifyItem> list = rec.getItems();
            this.length = list.size();
            this.items = new ArrayList<>(this.length);
            for (UserNotifyItem it : list) {
                this.items.add(new NotifyItem(it));
            }
        }

        public UserNotify toDbaseRecord()
        {
            UserNotify rec = new UserNotify();

            rec.setType(NotifyType.notify);
            rec.setTitle(title);
            rec.setName(name);

            List<UserNotifyItem> list = new ArrayList<>(length);
            rec.setItems(list);
            for (NotifyItem it : items) {
                list.add(it.toDbaseRecord());
            }
            return rec;
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
         * @return the length
         */
        public Integer getLength() {
            return length;
        }

        /**
         * @param length the length to set
         */
        public void setLength(Integer length) {
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

        public NotifyItem(UserNotifyItem it)
        {
            this.type = "Notification";
            this.icon = it.getIcon();
            this.message = it.getMessage();
            this.time = milliToDate(it.getMilliEpoc());
        }

        public UserNotifyItem toDbaseRecord()
        {
            UserNotifyItem rec = new UserNotifyItem();

            rec.setIcon(icon);
            rec.setMessage(message);
            rec.setMilliEpoc(dateToMill(time));
            return rec;
        }

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
        private Integer length;
        private List<TaskItem> items;

        public Task(UserNotify rec)
        {
            this.title = rec.getTitle();
            this.name = rec.getName();

            List<UserNotifyItem> list = rec.getItems();
            this.length = list.size();
            this.items = new ArrayList<>(this.length);

            for (UserNotifyItem it : list) {
                this.items.add(new TaskItem(it));
            }
        }

        public UserNotify toDbaseRecord()
        {
            UserNotify rec = new UserNotify();

            rec.setType(NotifyType.task);
            rec.setTitle(title);
            rec.setName(name);

            List<UserNotifyItem> list = new ArrayList<>(length);
            rec.setItems(list);
            for (TaskItem it : items) {
                list.add(it.toDbaseRecord());
            }
            return rec;
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
         * @return the length
         */
        public Integer getLength() {
            return length;
        }

        /**
         * @param length the length to set
         */
        public void setLength(Integer length) {
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

        public TaskItem(UserNotifyItem it)
        {
            this.type = "Task";
            this.status = it.getStatus();
            this.title = it.getTitle();
            this.width = it.getTaskComplete();
            this.progressClass = it.getIcon();
        }

        public UserNotifyItem toDbaseRecord()
        {
            UserNotifyItem rec = new UserNotifyItem();

            rec.setStatus(status);
            rec.setTitle(title);
            rec.setTaskComplete(width);
            rec.setIcon(progressClass);
            return rec;
        }

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
