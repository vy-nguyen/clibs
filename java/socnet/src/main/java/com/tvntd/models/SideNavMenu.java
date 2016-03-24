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
import javax.persistence.JoinColumn;

@Entity
public class SideNavMenu
{
    @Id
    private Long userId;

    private String userImgUrl;
    private String userUrl;
    private String userStatusFmt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "SideMenuGroup", joinColumns = @JoinColumn(name="userId"))
    private List<SideMenuGroup> menuGroup;

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
     * @return the menuGroup
     */
    public List<SideMenuGroup> getMenuGroup() {
        return menuGroup;
    }

    /**
     * @param menuGroup the menuGroup to set
     */
    public void setMenuGroup(List<SideMenuGroup> menuGroup) {
        this.menuGroup = menuGroup;
    }
}
