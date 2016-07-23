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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tvntd.service.api.IMenuItemService.MenuItemBadge;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;

@Entity
public class MenuItem
{
    @Id
    @Column(name = "itemId")
    private Long   itemId;

    private Long   userId;
    private Long   parentId;
    private String title;
    private String icon;
    private String route;
    private String badgeLabel;
    private String badgeClass;

    public MenuItem() {
        super();
    }

    public MenuItem(MenuItem copy)
    {
        itemId = new Long(copy.itemId);
        userId = new Long(copy.userId);
        parentId = new Long(copy.parentId);
        title = copy.title;
        icon = copy.icon;
        route = copy.route;
        badgeLabel = copy.badgeLabel;
        badgeClass = copy.badgeClass;
    }

    public MenuItem(MenuItemResp mem)
    {
        this.itemId = mem.getItemId();
        this.parentId = mem.getParentId();
        this.title = mem.getTitle();
        this.icon = mem.getIcon();
        this.route = mem.getRoute();

        MenuItemBadge badge = mem.getBadge();
        if (badge != null) {
            this.badgeLabel = badge.getLabel();
            this.badgeClass = badge.getClazz();
        } else {
            this.badgeLabel = null;
            this.badgeLabel = null;
        }
    }

    public MenuItem(Long parentId, Long userId, MenuItemResp mem)
    {
        this(mem);
        this.userId = userId;
        this.parentId = parentId;
     }

    public String toString()
    {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(this);
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
     * @return the badgeLabel
     */
    public String getBadgeLabel() {
        return badgeLabel;
    }

    /**
     * @param badgeLabel the badgeLabel to set
     */
    public void setBadgeLabel(String badgeLabel) {
        this.badgeLabel = badgeLabel;
    }

    /**
     * @return the badgeClass
     */
    public String getBadgeClass() {
        return badgeClass;
    }

    /**
     * @param badgeClass the badgeClass to set
     */
    public void setBadgeClass(String badgeClass) {
        this.badgeClass = badgeClass;
    }
}
