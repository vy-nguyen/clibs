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

import java.util.List;

import com.tvntd.models.MesgMenuItem;
import com.tvntd.models.NotifyItem;
import com.tvntd.models.TopNavMenu;

public interface ITopNavMenuService
{
    public TopNavMenu createPublicTopNav();
    public TopNavMenuView getUserTopNavMenu(Long userId);

    public static class TopNavMenuView
    {
        protected TopNavMesgMenu mesgMenu;
        protected TopNavNotifMenu notifMenu;
        protected TopNavUserMenu userMenu;

        /**
         * @return the mesgMenu
         */
        public TopNavMesgMenu getMesgMenu() {
            return mesgMenu;
        }

        /**
         * @param mesgMenu the mesgMenu to set
         */
        public void setMesgMenu(TopNavMesgMenu mesgMenu) {
            this.mesgMenu = mesgMenu;
        }

        /**
         * @return the notifMenu
         */
        public TopNavNotifMenu getNotifMenu() {
            return notifMenu;
        }

        /**
         * @param notifMenu the notifMenu to set
         */
        public void setNotifMenu(TopNavNotifMenu notifMenu) {
            this.notifMenu = notifMenu;
        }

        /**
         * @return the userMenu
         */
        public TopNavUserMenu getUserMenu() {
            return userMenu;
        }

        /**
         * @param userMenu the userMenu to set
         */
        public void setUserMenu(TopNavUserMenu userMenu) {
            this.userMenu = userMenu;
        }
    }

    public static class TopNavMenuBase
    {
        protected String notifyText;
        protected String fmtSection;
        protected String contentHeader;
        protected String fmtContent;
        protected String allUrl;
        protected String allMessage;

        /**
         * @return the notifyText
         */
        public String getNotifyText() {
            return notifyText;
        }

        /**
         * @param notifyText the notifyText to set
         */
        public void setNotifyText(String notifyText) {
            this.notifyText = notifyText;
        }

        /**
         * @return the fmtSection
         */
        public String getFmtSection() {
            return fmtSection;
        }

        /**
         * @param fmtSection the fmtSection to set
         */
        public void setFmtSection(String fmtSection) {
            this.fmtSection = fmtSection;
        }

        /**
         * @return the contentHeader
         */
        public String getContentHeader() {
            return contentHeader;
        }

        /**
         * @param contentHeader the contentHeader to set
         */
        public void setContentHeader(String contentHeader) {
            this.contentHeader = contentHeader;
        }

        /**
         * @return the fmtContent
         */
        public String getFmtContent() {
            return fmtContent;
        }

        /**
         * @param fmtContent the fmtContent to set
         */
        public void setFmtContent(String fmtContent) {
            this.fmtContent = fmtContent;
        }

        /**
         * @return the allUrl
         */
        public String getAllUrl() {
            return allUrl;
        }

        /**
         * @param allUrl the allUrl to set
         */
        public void setAllUrl(String allUrl) {
            this.allUrl = allUrl;
        }

        /**
         * @return the allMessage
         */
        public String getAllMessage() {
            return allMessage;
        }

        /**
         * @param allMessage the allMessage to set
         */
        public void setAllMessage(String allMessage) {
            this.allMessage = allMessage;
        }
    }

    /**
     * Fill in template message-fmt.jsp.
     */
    public static class TopNavMesgMenu extends TopNavMenuBase
    {
        protected List<MesgMenuItem> contentList;

        /**
         * @return the contentList
         */
        public List<MesgMenuItem> getContentList() {
            return contentList;
        }

        /**
         * @param contentList the contentList to set
         */
        public void setContentList(List<MesgMenuItem> contentList) {
            this.contentList = contentList;
        }
    }

    /**
     * Fill in template notification-fmt.jsp.
     */
    public static class TopNavNotifMenu extends TopNavMenuBase
    {
        protected List<NotifyItem> contentList;

        /**
         * @return the contentList
         */
        public List<NotifyItem> getContentList() {
            return contentList;
        }

        /**
         * @param contentList the contentList to set
         */
        public void setContentList(List<NotifyItem> contentList) {
            this.contentList = contentList;
        }
    }

    /**
     * Fill in template user-acct-menu.jsp.
     */
    public static class TopNavUserMenu
    {
        protected String mesgImgUrl;
        protected String userName;
        protected String userText;
        protected String userQuote;
        protected List<UserMenuItem> userMenuList;

        /**
         * @return the mesgImgUrl
         */
        public String getMesgImgUrl() {
            return mesgImgUrl;
        }

        /**
         * @param mesgImgUrl the mesgImgUrl to set
         */
        public void setMesgImgUrl(String mesgImgUrl) {
            this.mesgImgUrl = mesgImgUrl;
        }

        /**
         * @return the userName
         */
        public String getUserName() {
            return userName;
        }

        /**
         * @param userName the userName to set
         */
        public void setUserName(String userName) {
            this.userName = userName;
        }

        /**
         * @return the userText
         */
        public String getUserText() {
            return userText;
        }

        /**
         * @param userText the userText to set
         */
        public void setUserText(String userText) {
            this.userText = userText;
        }

        /**
         * @return the userQuote
         */
        public String getUserQuote() {
            return userQuote;
        }

        /**
         * @param userQuote the userQuote to set
         */
        public void setUserQuote(String userQuote) {
            this.userQuote = userQuote;
        }

        /**
         * @return the userMenuList
         */
        public List<UserMenuItem> getUserMenuList() {
            return userMenuList;
        }

        /**
         * @param userMenuList the userMenuList to set
         */
        public void setUserMenuList(List<UserMenuItem> userMenuList) {
            this.userMenuList = userMenuList;
        }
    }

    public static class UserMenuItem
    {
        protected String menuUrl;
        protected String menuItemText;

        public UserMenuItem(String url, String text)
        {
            menuUrl = url;
            menuItemText = text;
        }

        /**
         * @return the menuUrl
         */
        public String getMenuUrl() {
            return menuUrl;
        }

        /**
         * @param menuUrl the menuUrl to set
         */
        public void setMenuUrl(String menuUrl) {
            this.menuUrl = menuUrl;
        }

        /**
         * @return the menuItemText
         */
        public String getMenuItemText() {
            return menuItemText;
        }

        /**
         * @param menuItemText the menuItemText to set
         */
        public void setMenuItemText(String menuItemText) {
            this.menuItemText = menuItemText;
        }
    }
}
