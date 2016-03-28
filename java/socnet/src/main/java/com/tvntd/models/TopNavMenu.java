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

import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;

@Entity
public class TopNavMenu
{
    @Id
    private Long userId;

    /**
     * topnavMesgMenu fields.
     */
    @Column(length = 8)
    private String mesgNotifyText;

    private String mesgContentHeader;
    private String mesgAllUrl;
    private String mesgAllMessage;
    private String mesgFmtContent;
    private String mesgFmtSection;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "MesgMenuItem", joinColumns = @JoinColumn(name="userId"))
    private List<MesgMenuItem> mesgItems;

    /**
     * topnavNotifyMenu fields.
     */
    @Column(length = 8)
    private String notifNotifyText;

    private String notifContentHeader;
    private String notifAllUrl;
    private String notifAllMessage;
    private String notifFmtContent;
    private String notifFmtSection;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="NotifyItem", joinColumns=@JoinColumn(name="userId"))
    private List<NotifyItem> notifItem;

    /**
     * topnavUserMenu fields.
     */
    private String userImgUrl;
    private String userText;
    private String userQuote;
    private String userMenuSetting;
    private String userMenuSettingUrl;
    private String userMenuManage;
    private String userMenuManageUrl;
    private String userMenuExplore;
    private String userMenuExploreUrl;

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
     * @return the mesgNotifyText
     */
    public String getMesgNotifyText() {
        return mesgNotifyText;
    }

    /**
     * @param mesgNotifyText the mesgNotifyText to set
     */
    public void setMesgNotifyText(String mesgNotifyText) {
        this.mesgNotifyText = mesgNotifyText;
    }

    /**
     * @return the mesgContentHeader
     */
    public String getMesgContentHeader() {
        return mesgContentHeader;
    }

    /**
     * @param mesgContentHeader the mesgContentHeader to set
     */
    public void setMesgContentHeader(String mesgContentHeader) {
        this.mesgContentHeader = mesgContentHeader;
    }

    /**
     * @return the mesgAllUrl
     */
    public String getMesgAllUrl() {
        return mesgAllUrl;
    }

    /**
     * @param mesgAllUrl the mesgAllUrl to set
     */
    public void setMesgAllUrl(String mesgAllUrl) {
        this.mesgAllUrl = mesgAllUrl;
    }

    /**
     * @return the mesgAllMessage
     */
    public String getMesgAllMessage() {
        return mesgAllMessage;
    }

    /**
     * @param mesgAllMessage the mesgAllMessage to set
     */
    public void setMesgAllMessage(String mesgAllMessage) {
        this.mesgAllMessage = mesgAllMessage;
    }

    /**
     * @return the mesgFmtContent
     */
    public String getMesgFmtContent() {
        return mesgFmtContent;
    }

    /**
     * @param mesgFmtContent the mesgFmtContent to set
     */
    public void setMesgFmtContent(String mesgFmtContent) {
        this.mesgFmtContent = mesgFmtContent;
    }

    /**
     * @return the mesgFmtSection
     */
    public String getMesgFmtSection() {
        return mesgFmtSection;
    }

    /**
     * @param mesgFmtSection the mesgFmtSection to set
     */
    public void setMesgFmtSection(String mesgFmtSection) {
        this.mesgFmtSection = mesgFmtSection;
    }

    /**
     * @return the mesgItems
     */
    public List<MesgMenuItem> getMesgItems() {
        return mesgItems;
    }

    /**
     * @param mesgItems the mesgItems to set
     */
    public void setMesgItems(List<MesgMenuItem> mesgItems) {
        this.mesgItems = mesgItems;
    }

    /**
     * @return the notifNotifyText
     */
    public String getNotifNotifyText() {
        return notifNotifyText;
    }

    /**
     * @param notifNotifyText the notifNotifyText to set
     */
    public void setNotifNotifyText(String notifNotifyText) {
        this.notifNotifyText = notifNotifyText;
    }

    /**
     * @return the notifContentHeader
     */
    public String getNotifContentHeader() {
        return notifContentHeader;
    }

    /**
     * @param notifContentHeader the notifContentHeader to set
     */
    public void setNotifContentHeader(String notifContentHeader) {
        this.notifContentHeader = notifContentHeader;
    }

    /**
     * @return the notifAllUrl
     */
    public String getNotifAllUrl() {
        return notifAllUrl;
    }

    /**
     * @param notifAllUrl the notifAllUrl to set
     */
    public void setNotifAllUrl(String notifAllUrl) {
        this.notifAllUrl = notifAllUrl;
    }

    /**
     * @return the notifAllMessage
     */
    public String getNotifAllMessage() {
        return notifAllMessage;
    }

    /**
     * @param notifAllMessage the notifAllMessage to set
     */
    public void setNotifAllMessage(String notifAllMessage) {
        this.notifAllMessage = notifAllMessage;
    }

    /**
     * @return the notifFmtContent
     */
    public String getNotifFmtContent() {
        return notifFmtContent;
    }

    /**
     * @param notifFmtContent the notifFmtContent to set
     */
    public void setNotifFmtContent(String notifFmtContent) {
        this.notifFmtContent = notifFmtContent;
    }

    /**
     * @return the notifFmtSection
     */
    public String getNotifFmtSection() {
        return notifFmtSection;
    }

    /**
     * @param notifFmtSection the notifFmtSection to set
     */
    public void setNotifFmtSection(String notifFmtSection) {
        this.notifFmtSection = notifFmtSection;
    }

    /**
     * @return the notifItem
     */
    public List<NotifyItem> getNotifItem() {
        return notifItem;
    }

    /**
     * @param notifItem the notifItem to set
     */
    public void setNotifItem(List<NotifyItem> notifItem) {
        this.notifItem = notifItem;
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
     * @return the userMenuSetting
     */
    public String getUserMenuSetting() {
        return userMenuSetting;
    }

    /**
     * @param userMenuSetting the userMenuSetting to set
     */
    public void setUserMenuSetting(String userMenuSetting) {
        this.userMenuSetting = userMenuSetting;
    }

    /**
     * @return the userMenuSettingUrl
     */
    public String getUserMenuSettingUrl() {
        return userMenuSettingUrl;
    }

    /**
     * @param userMenuSettingUrl the userMenuSettingUrl to set
     */
    public void setUserMenuSettingUrl(String userMenuSettingUrl) {
        this.userMenuSettingUrl = userMenuSettingUrl;
    }

    /**
     * @return the userMenuManage
     */
    public String getUserMenuManage() {
        return userMenuManage;
    }

    /**
     * @param userMenuManage the userMenuManage to set
     */
    public void setUserMenuManage(String userMenuManage) {
        this.userMenuManage = userMenuManage;
    }

    /**
     * @return the userMenuManageUrl
     */
    public String getUserMenuManageUrl() {
        return userMenuManageUrl;
    }

    /**
     * @param userMenuManageUrl the userMenuManageUrl to set
     */
    public void setUserMenuManageUrl(String userMenuManageUrl) {
        this.userMenuManageUrl = userMenuManageUrl;
    }

    /**
     * @return the userMenuExplore
     */
    public String getUserMenuExplore() {
        return userMenuExplore;
    }

    /**
     * @param userMenuExplore the userMenuExplore to set
     */
    public void setUserMenuExplore(String userMenuExplore) {
        this.userMenuExplore = userMenuExplore;
    }

    /**
     * @return the userMenuExploreUrl
     */
    public String getUserMenuExploreUrl() {
        return userMenuExploreUrl;
    }

    /**
     * @param userMenuExploreUrl the userMenuExploreUrl to set
     */
    public void setUserMenuExploreUrl(String userMenuExploreUrl) {
        this.userMenuExploreUrl = userMenuExploreUrl;
    }
}
