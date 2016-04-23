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

import com.tvntd.models.User;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;
import com.tvntd.service.api.IProfileService.ProfileDTO;

public class StartupResponse
{
    private String csrfToken;
    private String csrfHeader;
    private LoginResponse      userDTO;
    private List<ProfileDTO>   linkedUsers;
    private List<MenuItemResp> menuItems;

    public StartupResponse(User user, ProfileDTO profile)
    {
        if (user != null) {
            userDTO = new LoginResponse(profile);
        }
    }

    /**
     * @return the csrfToken
     */
    public String getCsrfToken() {
        return csrfToken;
    }

    /**
     * @param csrfToken the csrfToken to set
     */
    public void setCsrfToken(String csrfToken) {
        this.csrfToken = csrfToken;
    }

    /**
     * @return the csrfHeader
     */
    public String getCsrfHeader() {
        return csrfHeader;
    }

    /**
     * @param csrfHeader the csrfHeader to set
     */
    public void setCsrfHeader(String csrfHeader) {
        this.csrfHeader = csrfHeader;
    }

    /**
     * @return the userDTO
     */
    public LoginResponse getUserDTO() {
        return userDTO;
    }

    /**
     * @param userDTO the userDTO to set
     */
    public void setUserDTO(LoginResponse userDTO) {
        this.userDTO = userDTO;
    }

    /**
     * @return the linkedUsers
     */
    public List<ProfileDTO> getLinkedUsers() {
        return linkedUsers;
    }

    /**
     * @param linkedUsers the linkedUsers to set
     */
    public void setLinkedUsers(List<ProfileDTO> linkedUsers) {
        this.linkedUsers = linkedUsers;
    }

    /**
     * @return the menuItems
     */
    public List<MenuItemResp> getMenuItems() {
        return menuItems;
    }

    /**
     * @param menuItems the menuItems to set
     */
    public void setMenuItems(List<MenuItemResp> menuItems) {
        this.menuItems = menuItems;
    }
}
