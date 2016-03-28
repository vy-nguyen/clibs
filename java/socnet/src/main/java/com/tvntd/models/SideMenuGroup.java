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

import javax.persistence.Embeddable;

@Embeddable
public class SideMenuGroup
{
    private Long   itemId;
    private Long   itemParentId;
    private String itemUrl;
    private String itemIcon;
    private String itemText;
    private String itemNotif;

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
     * @return the itemParentId
     */
    public Long getItemParentId() {
        return itemParentId;
    }

    /**
     * @param itemParentId the itemParentId to set
     */
    public void setItemParentId(Long itemParentId) {
        this.itemParentId = itemParentId;
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
     * @return the itemIcon
     */
    public String getItemIcon() {
        return itemIcon;
    }

    /**
     * @param itemIcon the itemIcon to set
     */
    public void setItemIcon(String itemIcon) {
        this.itemIcon = itemIcon;
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
     * @return the itemNotif
     */
    public String getItemNotif() {
        return itemNotif;
    }

    /**
     * @param itemNotif the itemNotif to set
     */
    public void setItemNotif(String itemNotif) {
        this.itemNotif = itemNotif;
    }
}
