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
package com.tvntd.service.user;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.TopNavRepository;
import com.tvntd.models.MesgMenuItem;
import com.tvntd.models.NotifyItem;
import com.tvntd.models.TopNavMenu;
import com.tvntd.service.api.ITopNavMenuService;

@Service
@Transactional
public class TopNavMenuService implements ITopNavMenuService
{
    @Autowired
    private TopNavRepository topNavRepo;

    @Override
    public TopNavMenuView getUserTopNavMenu(Long userId)
    {
        TopNavMenuView menu = new TopNavMenuView();
        TopNavMenu info = topNavRepo.findByUserId(userId);

        if (info == null) {
            System.out.println("DB read fail!");
            info = createPublicTopNav();
        }
        menu.setMesgMenu(getTopNavMesgMenu(info));
        menu.setNotifMenu(getTopNavNotifMenu(info));
        menu.setUserMenu(getTopNavUserMenu(info));
        return menu;
    }

    protected TopNavMesgMenu getTopNavMesgMenu(TopNavMenu data)
    {
        TopNavMesgMenu menu = new TopNavMesgMenu();
        menu.setNotifyText(data.getMesgNotifyText());
        menu.setContentHeader(data.getMesgContentHeader());
        menu.setAllUrl(data.getMesgAllUrl());
        menu.setAllMessage(data.getMesgAllMessage());
        menu.setContentList(data.getMesgItems());
        menu.setFmtContent(data.getMesgFmtContent());
        menu.setFmtSection(data.getMesgFmtSection());
        return menu;
    }

    protected TopNavNotifMenu getTopNavNotifMenu(TopNavMenu data)
    {
        TopNavNotifMenu menu = new TopNavNotifMenu();
        menu.setNotifyText(data.getNotifNotifyText());
        menu.setContentHeader(data.getNotifContentHeader());
        menu.setFmtContent(data.getNotifFmtContent());
        menu.setAllUrl(data.getNotifAllUrl());
        menu.setAllMessage(data.getNotifAllMessage());
        menu.setContentList(data.getNotifItem());
        menu.setFmtSection(data.getNotifFmtSection());
        return menu;
    }

    protected TopNavUserMenu getTopNavUserMenu(TopNavMenu data)
    {
        List<UserMenuItem> item = new ArrayList<>();
        TopNavUserMenu menu = new TopNavUserMenu();

        menu.setMesgImgUrl(data.getUserImgUrl());
        menu.setUserName("Vy Nguyen");
        menu.setUserText(data.getUserText());
        menu.setUserQuote(data.getUserQuote());
        menu.setUserMenuList(item);

        item.add(new UserMenuItem(
                    data.getUserMenuSettingUrl(),
                    data.getUserMenuSetting()));
        item.add(new UserMenuItem(
                    data.getUserMenuManageUrl(),
                    data.getUserMenuManage()));
        item.add(new UserMenuItem(
                    data.getUserMenuExploreUrl(),
                    data.getUserMenuExplore()));
        return menu;
    }

    @Transactional
    public final TopNavMenu createPublicTopNav()
    {
        TopNavMenu menu = topNavRepo.findByUserId(0L);
        if (menu != null) {
            return menu;
        }
        menu = new TopNavMenu();
        menu.setUserId(0L);

        List<MesgMenuItem> msgItems = new ArrayList<>();
        msgItems.add(new MesgMenuItem(
                    "#1",
                    "/images/avatar3.png",
                    "Nam Vo",
                    "5 mins",
                    "You need to go to work"));
        msgItems.add(new MesgMenuItem(
                    "#2",
                    "/images/avatar2.png",
                    "Thuc Bui",
                    "2 hours",
                    "You forgot to lock the door"));
        msgItems.add(new MesgMenuItem(
                    "#3",
                    "/images/avatar2.png",
                    "Tom Nguyen",
                    "1 day",
                    "You need to take us to lunch"));
        msgItems.add(new MesgMenuItem(
                    "#4",
                    "/images/avatar1.png",
                    "Steven To",
                    "1 week",
                    "You didn't go to the meeting"));
        msgItems.add(new MesgMenuItem(
                    "#5",
                    "/images/avatar1.png",
                    "Steven To",
                    "1 week",
                    "You forgot to schedue the meeting"));

        menu.setMesgItems(msgItems);
        menu.setMesgNotifyText(String.format("%d", msgItems.size()));
        menu.setMesgContentHeader(
                String.format("You have %d messages", msgItems.size()));

        menu.setMesgAllUrl("#all-mesg");
        menu.setMesgAllMessage("See all messages");
        menu.setMesgFmtContent("menu");
        menu.setMesgFmtSection("dropdown-menu");

        List<NotifyItem> notifItems = new ArrayList<>();
        notifItems.add(new NotifyItem(
                    "ion ion-ios7-people info",
                    "#notf1",
                    "5 new members joined today"));
        notifItems.add(new NotifyItem(
                    "fa fa-users warning",
                    "#notif2",
                    "Very long notification message, who would read it?"));
        notifItems.add(new NotifyItem(
                    "ion ion-ios7-cart success",
                    "#notif3",
                    "10 sales made but they haven't paid yet"));
        notifItems.add(new NotifyItem(
                    "ion ion-ios7-person danger",
                    "#notif4",
                    "You changed your user name"));

        menu.setNotifNotifyText(String.format("%d", notifItems.size()));
        menu.setNotifContentHeader(
                String.format("You have %d notifications", notifItems.size()));
        menu.setNotifAllUrl("#notif");
        menu.setNotifAllMessage("See all notifications");
        menu.setNotifFmtContent("menu");
        menu.setNotifFmtSection("dropdown-menu");
        menu.setNotifItem(notifItems);

        menu.setUserImgUrl("/images/avatar3.png");
        menu.setUserText("Software Engineer");
        menu.setUserQuote("Joined since '05");
        menu.setUserMenuSetting("Settings");
        menu.setUserMenuSettingUrl("#settings");
        menu.setUserMenuManage("Interests");
        menu.setUserMenuManageUrl("#manage");
        menu.setUserMenuExplore("Explore");
        menu.setUserMenuExploreUrl("#explore");

        topNavRepo.save(menu);
        return menu;
    }
}
