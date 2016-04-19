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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tvntd.models.MenuItem;

public interface IMenuItemService
{
    public MenuItem getMenuItem(Long itemId);
    public List<MenuItem> getMenuItemByUser(Long userId);

    public Long getPublicId();
    public Long getPrivateId();
    public Long getAdminId();

    public List<MenuItemResp>
    mergeMenuItemResp(List<MenuItemResp> a, List<MenuItemResp> b);

    public List<MenuItemResp> getMenuItemRespByUser(Long userId);
    public void saveMenuItem(Long userId, List<MenuItemResp> records);
    public void saveMenuItem(String jsonFile);

    public static class MenuItemResp
    {
        private Long   itemId;
        private Long   parentId;
        private String title;
        private String icon;
        private String route;
        private MenuItemBadge badge;
        private List<MenuItemResp> items;

        public MenuItemResp(Long userId) {
            this.itemId = userId;
        }

        public MenuItemResp(MenuItem item)
        {
            this.itemId = item.getItemId();
            this.parentId = item.getParentId();
            this.title = item.getTitle();
            this.icon = item.getIcon();
            this.route = item.getRoute();
            this.items = null;

            if (item.getBadgeClass() == null) {
                this.badge = null;
            } else {
                this.badge =
                    new MenuItemBadge(item.getBadgeLabel(), item.getBadgeClass());
            }
        }

        public MenuItemResp addSubMenu(MenuItemResp item)
        {
            if (items == null) {
                items = new ArrayList<>();
            }
            items.add(item);
            return this;
        }

        public String toString()
        {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            return gson.toJson(this);
        }

        /**
         * @return the itemId
         */
        public Long getItemId() {
            return itemId;
        }

        /**
         * @param itemId the itemId to set
         */
        public void setItemId(Long itemId) {
            this.itemId = itemId;
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
         * @return the route
         */
        public String getRoute() {
            return route;
        }

        /**
         * @param route the route to set
         */
        public void setRoute(String route) {
            this.route = route;
        }

        /**
         * @return the badge
         */
        public MenuItemBadge getBadge() {
            return badge;
        }

        /**
         * @param badge the badge to set
         */
        public void setBadge(MenuItemBadge badge) {
            this.badge = badge;
        }

        /**
         * @return the items
         */
        public List<MenuItemResp> getItems() {
            return items;
        }

        /**
         * @param items the items to set
         */
        public void setItems(List<MenuItemResp> items) {
            this.items = items;
        }
    }

    public static class MenuItemBadge
    {
        private String label;
        private String clazz;

        public MenuItemBadge(String label, String clazz)
        {
            this.label = label;
            this.clazz = clazz;
        }

        /**
         * @return the label
         */
        public String getLabel() {
            return label;
        }

        /**
         * @param label the label to set
         */
        public void setLabel(String label) {
            this.label = label;
        }

        /**
         * @return the clazz
         */
        public String getClazz() {
            return clazz;
        }

        /**
         * @param clazz the clazz to set
         */
        public void setClazz(String clazz) {
            this.clazz = clazz;
        }
    }
}
