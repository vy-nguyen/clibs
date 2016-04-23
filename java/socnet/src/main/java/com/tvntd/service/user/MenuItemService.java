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

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.tvntd.dao.MenuItemRepository;
import com.tvntd.models.MenuItem;
import com.tvntd.service.api.IMenuItemService;

@Service
@Transactional
public class MenuItemService implements IMenuItemService
{
    static private Logger s_log = LoggerFactory.getLogger(MenuItemService.class);
    static private final int publicId  = 0;
    static private final int privateId = 1;
    static private final int adminId   = 2;
    static private final int customizedId = 3;
    static private final int itemIdMul = 1000;

    @Autowired
    protected MenuItemRepository menuItemRepo;

    @Override
    public Long getPublicId() {
        return Long.valueOf(publicId);
    }

    @Override
    public Long getPrivateId() {
        return Long.valueOf(privateId);
    }

    @Override
    public Long getAdminId() {
        return Long.valueOf(adminId);
    }

    @Override
    public MenuItem getMenuItem(Long itemId) {
        return menuItemRepo.findByItemId(itemId);
    }

    @Override
    public List<MenuItem> getMenuItemByUser(Long userId) {
        return menuItemRepo.findAllByUserId(userId);
    }

    @Override
    public List<MenuItemResp> getMenuItemRespByUser(Long userId)
    {
        List<MenuItem> rawList = menuItemRepo.findAllByUserId(userId);
        if (rawList == null) {
            return null;
        }
        Long base = userId * itemIdMul;
        Map<Long, MenuItemResp> map = new HashMap<>();
        List<MenuItemResp> result = new LinkedList<>();
        LinkedList<MenuItemResp> sub = new LinkedList<>();

        for (MenuItem raw : rawList) {
            MenuItemResp item = new MenuItemResp(raw);

            map.put(item.getItemId(), item);
            if (item.getParentId().equals(base)) {
                result.add(item);
            } else {
                sub.add(item);
            }
        }
        while (!sub.isEmpty()) {
            MenuItemResp item = sub.removeFirst();
            MenuItemResp parent = map.get(item.getParentId()); 

            if (parent != null) {
                parent.addSubMenu(item);
            } else {
                s_log.debug("No menu parent " +
                        item.getParentId() + ", item " + item.getTitle());
            }
        }
        map.clear();
        return result;
    }

    /**
     * Merge two lists sorted by itemId.
     * @return the merged list.
     */
    @Override
    public List<MenuItemResp>
    mergeMenuItemResp(List<MenuItemResp> a, List<MenuItemResp> b)
    {
        return null;
    }

    /**
     * Recursive walk to save customized menu to database.
     */
    @Override
    public void saveMenuItem(Long userId, List<MenuItemResp> items)
    {
        Long itemId = userId * itemIdMul;

        for (MenuItemResp it : items) {
            if ((userId >= customizedId) && (it.getItemId() >= customizedId)) {
                it.setItemId(itemId++);
            }
            MenuItem save = new MenuItem(it);
            menuItemRepo.save(save);

            List<MenuItemResp> subList = it.getItems();
            if (subList != null) {
                for (MenuItemResp sub : subList) {
                    sub.setParentId(save.getItemId());
                }
                saveMenuItem(userId, subList);
            }
        }
    }

    @Override
    public void saveMenuItem(String jsonFile)
    {
        Gson gson = new Gson();
        try {
            BufferedReader brd = new BufferedReader(new FileReader(jsonFile));
            MenuItemJsonFile items = gson.fromJson(brd, MenuItemJsonFile.class);
            brd.close();

            items.saveMenuItems(menuItemRepo, publicId);
            items.saveMenuItems(menuItemRepo, privateId);
            items.saveMenuItems(menuItemRepo, adminId);

        } catch(IOException | JsonSyntaxException e) {
            s_log.info("Fail to parse json file " + e.toString());
            s_log.error(e.toString());
        }
    }

    class MenuItemJsonFile
    {
        private List<MenuItem> home;
        private List<MenuItem> login;
        private List<MenuItem> publicMenu;
        private List<MenuItem> adminMenu;
        private List<MenuItem> aboutUs;
        private List<MenuItem> userMenu;
        private List<MenuItem> funding;

        public void saveMenuItems(MenuItemRepository repo, long uid)
        {
            Long userId = Long.valueOf(uid);

            saveMenuItems(home, repo, userId);
            saveMenuItems(aboutUs, repo, userId);
            saveMenuItems(funding, repo, userId);

            if (uid == publicId) {
                saveMenuItems(login, repo, userId);
                saveMenuItems(publicMenu, repo, userId);
            } else if (uid == adminId) {
                saveMenuItems(adminMenu, repo, userId);
            } else {
                saveMenuItems(userMenu, repo, userId);
            }
        }

        private void
        saveMenuItems(List<MenuItem> items, MenuItemRepository repo, Long userId)
        {
            if (items == null) {
                s_log.info("Error in parsing json, items has nothing to save ");
                return;
            }
            for (MenuItem it : items) {
                Long base = userId * itemIdMul;
                it.setUserId(userId);
                it.setItemId(it.getItemId() + base);
                it.setParentId(it.getParentId() + base);

                repo.save(it);
            }
        }

        /**
         * @return the home
         */
        public List<MenuItem> getHome() {
            return home;
        }

        /**
         * @param home the home to set
         */
        public void setHome(List<MenuItem> home) {
            this.home = home;
        }

        /**
         * @return the login
         */
        public List<MenuItem> getLogin() {
            return login;
        }

        /**
         * @param login the login to set
         */
        public void setLogin(List<MenuItem> login) {
            this.login = login;
        }

        /**
         * @return the publicMenu
         */
        public List<MenuItem> getPublicMenu() {
            return publicMenu;
        }

        /**
         * @param publicMenu the publicMenu to set
         */
        public void setPublicMenu(List<MenuItem> publicMenu) {
            this.publicMenu = publicMenu;
        }

        /**
         * @return the adminMenu
         */
        public List<MenuItem> getAdminMenu() {
            return adminMenu;
        }

        /**
         * @param adminMenu the adminMenu to set
         */
        public void setAdminMenu(List<MenuItem> adminMenu) {
            this.adminMenu = adminMenu;
        }

        /**
         * @return the aboutUs
         */
        public List<MenuItem> getAboutUs() {
            return aboutUs;
        }

        /**
         * @param aboutUs the aboutUs to set
         */
        public void setAboutUs(List<MenuItem> aboutUs) {
            this.aboutUs = aboutUs;
        }

        /**
         * @return the userMenu
         */
        public List<MenuItem> getUserMenu() {
            return userMenu;
        }

        /**
         * @param userMenu the userMenu to set
         */
        public void setUserMenu(List<MenuItem> userMenu) {
            this.userMenu = userMenu;
        }

        /**
         * @return the funding
         */
        public List<MenuItem> getFunding() {
            return funding;
        }

        /**
         * @param funding the funding to set
         */
        public void setFunding(List<MenuItem> funding) {
            this.funding = funding;
        }
    }

    class MenuItemJson
    {
        private List<MenuItem> items;

        void saveMenuItems(MenuItemRepository repo, Long userId)
        {
            if (items == null) {
                s_log.info("Error in parsing json, items has nothing to save ");
                return;
            }
            for (MenuItem it : items) {
                Long base = userId * itemIdMul;
                it.setUserId(userId);
                it.setItemId(it.getItemId() + base);
                it.setParentId(it.getParentId() + base);

                repo.save(it);
            }
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();
            for (MenuItem it : items) {
                sb.append(it.toString());
            }
            return sb.toString();
        }

        /**
         * @return the items
         */
        public List<MenuItem> getItems() {
            return items;
        }

        /**
         * @param items the items to set
         */
        public void setItems(List<MenuItem> items) {
            this.items = items;
        }
    }
}
