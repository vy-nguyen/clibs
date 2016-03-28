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

import java.util.ArrayList;
import java.util.List;

import com.tvntd.models.User;

public interface ISideNavMenuService
{
    public SideMenuView createPublicSideNavMenu();
    public SideMenuView getUserSideNavMenu(Long userId, User user);
    public void saveUserSideMenu(Long userId, SideMenuView view);

    public static class SideMenuView
    {
        protected String userImgUrl;
        protected String userName;
        protected String userUrl;
        protected String userStatusFmt;
        protected String userStatus;
        protected List<MenuTree> menuTree;

        public SideMenuView() {}

        public SideMenuView(String imgUrl, String name,
                String url, String statusFmt, String status)
        {
            userImgUrl = imgUrl;
            userName = name;
            userUrl = url;
            userStatusFmt = statusFmt;
            userStatus = status;
            menuTree = new ArrayList<>();
        }

        public SideMenuView addCategory(MenuTree category)
        {
            menuTree.add(category);
            return this;
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();

            sb.append("[").append(userName).append(", ").append(userStatus).append("]");
            for (MenuTree item : menuTree) {
                item.toString(sb, 0);
            }
            return sb.toString();
        }

        /**
         * @return the userImgUrl
         */
        public String getUserImgUrl() {
            return userImgUrl;
        }

        /**
         * @param userImgUrl the userImgUrl to set
         */
        public void setUserImgUrl(String userImgUrl) {
            this.userImgUrl = userImgUrl;
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
         * @return the userUrl
         */
        public String getUserUrl() {
            return userUrl;
        }

        /**
         * @param userUrl the userUrl to set
         */
        public void setUserUrl(String userUrl) {
            this.userUrl = userUrl;
        }

        /**
         * @return the userStatusFmt
         */
        public String getUserStatusFmt() {
            return userStatusFmt;
        }

        /**
         * @param userStatusFmt the userStatusFmt to set
         */
        public void setUserStatusFmt(String userStatusFmt) {
            this.userStatusFmt = userStatusFmt;
        }

        /**
         * @return the userStatus
         */
        public String getUserStatus() {
            return userStatus;
        }

        /**
         * @param userStatus the userStatus to set
         */
        public void setUserStatus(String userStatus) {
            this.userStatus = userStatus;
        }

        /**
         * @return the menuTree
         */
        public List<MenuTree> getMenuTree() {
            return menuTree;
        }

        public void setMenuTree(List<MenuTree> menuTree) {
            this.menuTree = menuTree;
        }
    }

    public static class MenuTree
    {
        protected static Long s_currId = 1L;
        protected Long itemId;
        protected Long parentId;

        protected String itemDomId;
        protected String itemHeader;
        protected String itemIconFmt;
        protected String itemText;
        protected String itemUrl;
        protected String itemNotify;
        protected MenuTree parent;
        protected List<MenuTree> menuTree;

        public MenuTree()
        {
            itemId = s_currId++;
            itemDomId = "id-side-nav-" + itemId;
        }
        public MenuTree(String header)
        {
            this();
            itemHeader = header;
        }

        public MenuTree(MenuTree parent,
                String iconFmt, String text, String url, String notify)
        {
            this();
            itemIconFmt = iconFmt;
            itemText = text;
            itemUrl = url;
            itemNotify = notify;
            this.parent = parent;
        }

        protected MenuTree(MenuTree parent, String header)
        {
            itemHeader = header;
            this.parent = parent;
        }

        public MenuTree addSubMenu(String iconFmt, String text, String url, String notif)
        {
            if (menuTree == null) {
                menuTree = new ArrayList<>();
            }
            menuTree.add(new MenuTree(this, iconFmt, text, url, notif));
            return this;
        }

        public MenuTree inSubMenuGroup(String header)
        {
            if (menuTree == null) {
                menuTree = new ArrayList<>();
            }
            MenuTree sub = new MenuTree(this, header);
            menuTree.add(sub);
            return sub;
        }

        public MenuTree inSubMenuGroup(String iconFmt,
                String text, String url, String notif)
        {
            if (menuTree == null) {
                menuTree = new ArrayList<>();
            }
            MenuTree sub = new MenuTree(this, iconFmt, text, url, notif);
            menuTree.add(sub);
            return sub;
        }

        public MenuTree outSubMenuGroup() {
            return parent;
        }

        public void toString(StringBuilder sb, int indent)
        {
            for (int i = 0; i < indent; i++) {
                sb.append(" ");
            }
            if (itemHeader != null) {
                sb.append("[").append(itemHeader).append(" (")
                    .append(itemId).append(")]\n");
            } else {
                sb.append("{").append(itemText).append(", ").append(itemUrl)
                    .append(" (").append(parent.getItemId()).append("/")
                    .append(itemId).append(")}\n");
            }
            if (menuTree != null) {
                for (MenuTree item : menuTree) {
                    item.toString(sb, indent + 2);
                }
            }
        }

        /**
         * @return the itemId
         */
        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long id) {
            this.itemId = id;
        }

        /**
         * @return the parentId
         */
        public Long getParentId() {
            return parentId;
        }

        /**
         * @param parentId the parentId to set
         */
        public void setParentId(Long parentId) {
            this.parentId = parentId;
        }

        /**
         * @return the itemDomId
         */
        public String getItemDomId() {
            return itemDomId;
        }

        /**
         * @param itemDomId the itemDomId to set
         */
        public void setItemDomId(String itemDomId) {
            this.itemDomId = itemDomId;
        }

        /**
         * @return the itemHeader
         */
        public String getItemHeader() {
            return itemHeader;
        }

        /**
         * @param itemHeader the itemHeader to set
         */
        public void setItemHeader(String itemHeader) {
            this.itemHeader = itemHeader;
        }

        /**
         * @return the itemIconFmt
         */
        public String getItemIconFmt() {
            return itemIconFmt;
        }

        /**
         * @param itemIconFmt the itemIconFmt to set
         */
        public void setItemIconFmt(String itemIconFmt) {
            this.itemIconFmt = itemIconFmt;
        }

        /**
         * @return the itemText
         */
        public String getItemText() {
            return itemText;
        }

        /**
         * @param itemText the itemText to set
         */
        public void setItemText(String itemText) {
            this.itemText = itemText;
        }

        /**
         * @return the itemUrl
         */
        public String getItemUrl() {
            return itemUrl;
        }

        /**
         * @param itemUrl the itemUrl to set
         */
        public void setItemUrl(String itemUrl) {
            this.itemUrl = itemUrl;
        }

        /**
         * @return the itemNotify
         */
        public String getItemNotify() {
            return itemNotify;
        }

        /**
         * @param itemNotify the itemNotify to set
         */
        public void setItemNotify(String itemNotify) {
            this.itemNotify = itemNotify;
        }

        /**
         * @return the parent
         */
        public MenuTree getParent() {
            return parent;
        }

        public void setParent(MenuTree parent) {
            this.parent = parent;
        }

        /**
         * @return the menuTree
         */
        public List<MenuTree> getMenuTree() {
            return menuTree;
        }

        /**
         * @param menuTree the menuTree to set
         */
        public void setMenuTree(List<MenuTree> menuTree) {
            this.menuTree = menuTree;
        }
    }
}
