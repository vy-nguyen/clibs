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
    static private final String menuItemJsonBeg = "{ \"items\": [";
    static private final String menuItemJsonEnd = "] }";
    static private final String menuItemHome =
    "{" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 1," +
        "\"parentId\": 0," +
        "\"title\"   : \"Home\"," +
        "\"icon\"    : \"fa fa-lg fa-fw fa-home\"," +
        "\"route\"   : \"/\"" +
    "}";
    static private final String menuItemLogin =
    "{" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 20," +
        "\"parentId\": 0," +
        "\"title\"   : \"Login/Register\"," +
        "\"icon\"    : \"fa fa-lg fa-fw fa-user\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 21," +
        "\"parentId\": 20," +
        "\"title\"   : \"Login\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/login\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 22," +
        "\"parentId\": 20," +
        "\"title\"   : \"Register\"," +
        "\"icon\"    : \"fa fa-group\"," +
        "\"route\"   : \"/register/form\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 23," +
        "\"parentId\": 20," +
        "\"title\"   : \"Login Help\"," +
        "\"icon\"    : \"fa fa-money\"," +
        "\"route\"   : \"/register/recover\"" +
    "}";
    static private final String menuItemPublic =
    "{" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 300," +
        "\"parentId\": 0," +
        "\"title\"   : \"Trending News\"," +
        "\"icon\"    : \"fa fa-lg fa-fw fa-book\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 310," +
        "\"parentId\": 300," +
        "\"title\"   : \"Viet Nam\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/public/vietnam\"," +
        "\"badgeClass\": \"badge pull-right\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 320," +
        "\"parentId\": 300," +
        "\"title\"   : \"Kinh Te\"," +
        "\"icon\"    : \"fa fa-money\"," +
        "\"route\"   : \"/public/economic\"," +
        "\"badgeClass\": \"badge pull-right\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 330," +
        "\"parentId\": 300," +
        "\"title\"   : \"Giao Duc\"," +
        "\"icon\"    : \"fa fa-book\"," +
        "\"route\"   : \"/public/education\"," +
        "\"badgeClass\": \"badge pull-right\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 340," +
        "\"parentId\": 300," +
        "\"title\"   : \"Ky Thuat\"," +
        "\"icon\"    : \"fa fa-gear\"," +
        "\"route\"   : \"/public/tech\"," +
        "\"badgeClass\": \"badge pull-right\"" +
    "}";
    static private final String menuItemAboutUs =
    "{" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 900," +
        "\"parentId\": 0," +
        "\"title\"   : \"About Us\"," +
        "\"icon\"    : \"fa fa-lg fa-fw fa-home\"," +
        "\"route\"   : \"/public/aboutus\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 901," +
        "\"parentId\": 900," +
        "\"title\"   : \"Prototypes\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/public/proto\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 902," +
        "\"parentId\": 901," +
        "\"title\"   : \"Blog\"," +
        "\"icon\"    : \"fa fa-book\"," +
        "\"route\"   : \"/public/proto/blog\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 903," +
        "\"parentId\": 901," +
        "\"title\"   : \"E Store\"," +
        "\"icon\"    : \"fa fa-money\"," +
        "\"route\"   : \"/public/proto/estore\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 930," +
        "\"parentId\": 903," +
        "\"title\"   : \"Product View\"," +
        "\"icon\"    : \"fa fa-tag\"," +
        "\"route\"   : \"/public/proto/estore/product-view\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 931," +
        "\"parentId\": 903," +
        "\"title\"   : \"Product Detail\"," +
        "\"icon\"    : \"fa fa-shopping\"," +
        "\"route\"   : \"/public/proto/estore/product-detail\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 904," +
        "\"parentId\": 901," +
        "\"title\"   : \"Timeline\"," +
        "\"icon\"    : \"fa fa-sort\"," +
        "\"route\"   : \"/public/proto/timeline\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 905," +
        "\"parentId\": 901," +
        "\"title\"   : \"News Feed\"," +
        "\"icon\"    : \"fa fa-gear\"," +
        "\"route\"   : \"/public/proto/news\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 906," +
        "\"parentId\": 901," +
        "\"title\"   : \"Forum\"," +
        "\"icon\"    : \"fa fa-sort\"," +
        "\"route\"   : \"/public/proto/forum\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 907," +
        "\"parentId\": 901," +
        "\"title\"   : \"Social Wall\"," +
        "\"icon\"    : \"fa fa-thumbs-o-up\"," +
        "\"route\"   : \"/public/proto/wall\"" +
    "}";
    static private final String menuItemUser =
    "{" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 50," +
        "\"parentId\": 0," +
        "\"title\"   : \"Profile\"," +
        "\"icon\"    : \"fa fa-home\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 51," +
        "\"parentId\": 50," +
        "\"title\"   : \"Edit Profile\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/user/profile\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 52," +
        "\"parentId\": 50," +
        "\"title\"   : \"Your Account\"," +
        "\"icon\"    : \"fa fa-money\"," +
        "\"route\"   : \"/user/account\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 53," +
        "\"parentId\": 50," +
        "\"title\"   : \"Activity Logs\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/user/logs\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 54," +
        "\"parentId\": 50," +
        "\"title\"   : \"Logout\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/login/logout\"" +
    "}";
    static private final String menuItemFunding =
    "{" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 400," +
        "\"parentId\": 0," +
        "\"title\"   : \"Public Funding\"," +
        "\"icon\"    : \"fa fa-lg fa-fw fa-home\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 461," +
        "\"parentId\": 400," +
        "\"title\"   : \"Public Projects\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/public/project\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 462," +
        "\"parentId\": 400," +
        "\"title\"   : \"Private Projects\"," +
        "\"icon\"    : \"fa fa-money\"," +
        "\"route\"   : \"/public/project\"" +
    "}, {" +
        "\"userId\"  : 0," +
        "\"itemId\"  : 463," +
        "\"parentId\": 400," +
        "\"title\"   : \"Viet Nam\"," +
        "\"icon\"    : \"fa fa-home\"," +
        "\"route\"   : \"/user/project\"" +
    "}";

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
    public List<MenuItemResp> createPublicMenu()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(menuItemJsonBeg)
            .append(menuItemHome)
            .append(',').append(menuItemLogin)
            .append(',').append(menuItemPublic)
            .append(',').append(menuItemFunding)
            .append(',').append(menuItemAboutUs)
            .append(menuItemJsonEnd);

        return createMenuItem(sb, Long.valueOf(publicId));
    }

    @Override
    public List<MenuItemResp> createPrivateMenu()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(menuItemJsonBeg)
            .append(menuItemHome)
            .append(',').append(menuItemUser)
            .append(',').append(menuItemPublic)
            .append(',').append(menuItemFunding)
            .append(',').append(menuItemAboutUs)
            .append(menuItemJsonEnd);

        return createMenuItem(sb, Long.valueOf(privateId));
    }

    @Override
    public List<MenuItemResp> createAdminMenu()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(menuItemJsonBeg)
            .append(menuItemHome)
            .append(',').append(menuItemUser)
            .append(',').append(menuItemPublic)
            .append(',').append(menuItemFunding)
            .append(',').append(menuItemAboutUs)
            .append(menuItemJsonEnd);

        return createMenuItem(sb, Long.valueOf(adminId));
    }

    private List<MenuItemResp> createMenuItem(StringBuilder sb, Long userId)
    {
        Gson gson = new Gson();
        try {
            MenuItemJson item = gson.fromJson(sb.toString(), MenuItemJson.class);
            item.saveMenuItems(menuItemRepo, userId);

        } catch(JsonSyntaxException e) {
            s_log.error("Json error " + e.getMessage());
        }
        return getMenuItemRespByUser(userId);
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
        s_log.info(">> Memory tree user: " + userId + "\n" + result);
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
