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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.SideNavMenuRepository;
import com.tvntd.models.SideMenuGroup;
import com.tvntd.models.SideNavMenu;
import com.tvntd.models.User;
import com.tvntd.service.api.ISideNavMenuService;

@Service
@Transactional
public class SideNavMenuService implements ISideNavMenuService
{
    static private Logger s_log = LoggerFactory.getLogger(SideNavMenuService.class);

    @Autowired
    protected SideNavMenuRepository sideNavRepo;

    @Override
    public SideMenuView createPublicSideNavMenu()
    {
        SideMenuView dbase = getUserSideNavMenu(0L, null);
        s_log.debug("Get back dbase " + dbase);

        if (dbase != null) {
            return dbase;
        }
        SideMenuView menu = new SideMenuView(
                "/images/logo.png",
                "Welcome",
                "/",
                "fa fa-circle text-success",
                "100 Users Online");

        menu.addCategory(
                (new MenuTree("Explore Topics"))
                .inSubMenuGroup("fa fa-circle-o text-red",
                    "Politics",
                    "/pub/politics", "10")
                    .addSubMenu("fa fa-circle-o text-red",
                        "Politics article 1",
                        "/pub/politics/article-1", null)
                    .addSubMenu("fa fa-circle-o text-yellow",
                        "Politics article 2",
                        "/pub/politics/article-2", "new")
                    .addSubMenu("fa fa-circle-o text-yellow",
                        "Politics article 3",
                        "/pub/politics/article-3", null)
                    .addSubMenu("fa fa-circle-o text-yellow",
                        "Politics article 4",
                        "/pub/politics/article-4", null)
                    .addSubMenu("fa fa-circle-o text-yellow",
                        "Politics article 5",
                        "/pub/politics/article-5", null)
                    .addSubMenu("fa fa-circle-o text-yellow",
                        "Politics article 6",
                        "/pub/politics/article-6", null)
                    .addSubMenu("fa fa-circle-o text-yellow",
                        "Politics article 7",
                        "/pub/politics/article-7", null)
                .outSubMenuGroup()
                .inSubMenuGroup("fa fa-circle-o text-yellow",
                    "Economics",
                    "/pub/economics", "20")
                    .addSubMenu("fa fa-circle-o text-red",
                        "Economics article 1",
                        "/pub/economics/article-1", null)
                    .addSubMenu("fa fa-circle-o text-red",
                        "Economics article 2",
                        "/pub/economics/article-2", null)
                    .addSubMenu("fa fa-circle-o text-red",
                        "Economics article 3",
                        "/pub/economics/article-3", null)
                    .addSubMenu("fa fa-circle-o text-red",
                        "Economics article 4",
                        "/pub/economics/article-4", null)
                .outSubMenuGroup()
                .inSubMenuGroup("fa fa-circle-o text-aqua",
                    "History",
                    "/pub/history", "15")
                .outSubMenuGroup()
                .inSubMenuGroup("fa fa-circle-o text-blue",
                    "Education",
                    "/pub/education", "20")
                .outSubMenuGroup())
            .addCategory(
                (new MenuTree("Register or Sign in"))
                .addSubMenu("fa fa-circle-o text red",
                    "Register",
                    "/register", null)
                .addSubMenu("fa fa-circle-o text-yellow",
                    "Sign In",
                    "/login", null))
            .addCategory(
                (new MenuTree("About Us"))
                .addSubMenu("fa fa-envelope",
                    "Contact Us",
                    "/contact", null)
                .addSubMenu("fa fa-share",
                    "Support Us",
                    "/contribute", null)
                .addSubMenu("fa fa-circle-o text-read",
                    "How does it work",
                    "/help/intro", null));

        saveUserSideMenu(0L, menu);
        return menu;
    }

    @Override
    public SideMenuView getUserSideNavMenu(Long userId, User user)
    {
        SideNavMenu rec = sideNavRepo.findByUserId(userId);
        if (rec == null) {
            return null;
        }
        String name = user == null ? "Vietnam Tu Do" : 
                user.getFirstName() + " (5 friends)";
        Map<Long, MenuTree> index = new HashMap<>();
        SideMenuView menu = new SideMenuView(
                rec.getUserImgUrl(), name,
                rec.getUserUrl(), rec.getUserStatusFmt(), "online");

        for (SideMenuGroup entry : rec.getMenuGroup()) {
            String url = entry.getItemUrl();
            String text = entry.getItemText();

            MenuTree item = null;
            if ((text != null) && (url == null)) {
                item = new MenuTree(text);
            } else {
                item = new MenuTree(null,
                    entry.getItemIcon(), text, url, entry.getItemNotif());
            }
            item.setItemId(entry.getItemId());
            item.setParentId(entry.getItemParentId());
            index.put(item.getItemId(), item);
        }
        List<MenuTree> menuList = new ArrayList<>();
        for (Entry<Long, MenuTree> it : index.entrySet()) {
            MenuTree item = it.getValue();
            MenuTree parent = index.get(item.getParentId());
            item.setParent(parent);

            if (parent == null) {
                menuList.add(item);
            } else {
                List<MenuTree> sub = parent.getMenuTree();
                if (sub == null) {
                    sub = new ArrayList<>();
                    parent.setMenuTree(sub);
                }
                sub.add(item);
            }
        }
        index.clear();
        menu.setMenuTree(menuList);
        return menu;
    }

    @Override
    public void saveUserSideMenu(Long userId, SideMenuView view)
    {
        SideNavMenu rec = new SideNavMenu();

        rec.setUserId(userId);
        rec.setUserImgUrl(view.getUserImgUrl());
        rec.setUserUrl(view.getUserUrl());
        rec.setUserStatusFmt(view.getUserStatusFmt());
        rec.setMenuGroup(new ArrayList<SideMenuGroup>());

        for (MenuTree item : view.getMenuTree()) {
            sideViewToModel(rec.getMenuGroup(), item);
        }
        sideNavRepo.save(rec);
    }

    protected void sideViewToModel(List<SideMenuGroup> model, MenuTree tree)
    {
        SideMenuGroup entry = new SideMenuGroup();

        entry.setItemId(tree.getItemId());
        if (tree.getParent() != null) {
            entry.setItemParentId(tree.getParent().getItemId());
        } else {
            entry.setItemParentId(0L);
        }
        if (tree.getItemHeader() != null) {
            entry.setItemText(tree.getItemHeader());
            entry.setItemUrl(null);
        } else {
            entry.setItemUrl(tree.getItemUrl());
            entry.setItemIcon(tree.getItemIconFmt());
            entry.setItemText(tree.getItemText());
            entry.setItemNotif(tree.getItemNotify());
        }
        model.add(entry);

        List<MenuTree> sub = tree.getMenuTree();
        if (sub != null) {
            for (MenuTree subEntry : sub) {
                sideViewToModel(model, subEntry);
            }
        }
    }
}
