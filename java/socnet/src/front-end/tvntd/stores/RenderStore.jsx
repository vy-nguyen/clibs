/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux            from 'reflux';
import Actions           from 'vntd-root/actions/Actions.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';

const _menuHome = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-home',
    items: null,
    route: '/',
    title: 'Home'
};

const _menuDomainHome = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-user-plus',
    items: null,
    route: '/newsfeed',
    title: 'News Feed'
};

const _myDomainHome = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-user-plus',
    items: null,
    route: '/user/domain',
    title: 'My Domain Page',
};

const _menuProfile = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-user',
    items: [ {
        badge: null,
        icon : 'fa fa-user',
        items: null,
        route: '/user/profile',
        title: 'Edit Profile'
    }, {
        badge: null,
        icon : 'fa fa-tag',
        items: null,
        route: 'user/tag-posts',
        title: 'Manage Posts'
    }, {
        badge: null,
        icon : 'fa fa-money',
        items: null,
        route: '/user/account',
        title: 'My Account'
    }, {
        badge: null,
        icon : 'fa fa-flag',
        items: null,
        route: '/user/logs',
        title: 'Activity Logs'
    }, {
        badge: null,
        icon : 'fa fa-users',
        items: null,
        route: '/user/all',
        title: 'All Users'
    }, {
        badge: null,
        icon : 'fa fa-sign-out',
        items: null,
        route: '/login/logout',
        title: 'Logout'
    } ],
    route: '/user',
    title: 'Profile'
};

const _menuBlogs = [ {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-book',
    items: null,
    route: '/public/blog',
    title: 'News/Blogs'
}, {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-money',
    items: null,
    route: '/public/ads',
    title: 'Commercial Ads'
}, {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-shopping-cart',
    items: null,
    route: '/public/estore',
    title: 'E Stores'
}, {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-book',
    items: null,
    route: '/public/edu',
    title: 'Education'
}, {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-gear',
    items: null,
    route: '/public/tech',
    title: 'Technology'
} ];

const _menuProjects = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-briefcase',
    items: [ {
        badge: null,
        icon : 'fa fa-money',
        items: null,
        route: '/public/projects',
        title: 'Public Projects'
    }, {
        badge: null,
        icon : 'fa fa-money',
        items: null,
        route: '/user/projects',
        title: 'Private Projects'
    } ],
    route: '/public/projects',
    title: 'Public Projects'
};

const _menuAboutUs = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-globe',
    items: null,
    route: '/public/aboutus',
    title: 'About Us'
};

const _menuLogin = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-user',
    items: [ {
        badge: null,
        icon : 'fa fa-user',
        items: null,
        route: '/register/form',
        title: 'Register New Account'
    }, {
        badge: null,
        icon : 'fa fa-flag',
        items: null,
        route: '/register/recover',
        title: 'Recover Your Password?'
    }, {
        badge: null,
        icon : 'fa fa-flag',
        items: null,
        route: '/register/reset',
        title: 'Reset Your Password'
    } ],
    route: '/login',
    title: 'Login/Register'
};

const _menuAdmin = {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-user',
    items: [ {
        badge: null,
        icon : 'fa fa-money',
        items: null,
        route: '/admin/manage-users',
        title: 'Manage Users'
    }, {
        badge: null,
        icon : 'fa fa-flag',
        items: null,
        route: '/admin/set-tags',
        title: 'Manage Public Tags'
    }, {
        badge: null,
        icon : 'fa fa-flag',
        items: null,
        route: '/admin/logs',
        title: 'Review Logs'
    } ],
    route: '/admin',
    title: 'Admin'
};

let RenderStore = Reflux.createStore({
    data: {},
    listenables: [Actions, NavigationActions],

    init: function() {
        this.data = {
            menuItems   : [],
            notifyItems : [],
            activeNotify: {
                items: []
            },
            lastUpdated: new Date()
        }
    },

    getMenuItems: function() {
        return this.data.items;
    },

    getNotifyItems: function() {
        return this.data.notifyItems;
    },

    getActiveNotify: function() {
        return this.data.activeNotify;
    },

    setActiveNotify: function(item) {
        this.data.activeNotify = item;
    },

    onActivateCompleted: function(item) {
        Actions.clickMenuItem(item);
    },

    mainStartup: function(json) {
        let menuItems = [_menuHome];

        if (UserStore.isLogin() == true) {
            if (UserStore.getDomainUuid() != null) {
                if (window.VNDomain === "tudoviet") {
                    menuItems.push(_myDomainHome);
                } else {
                    menuItems.push(_menuDomainHome);
                }
            }
            menuItems.push(_menuProfile);
            menuItems.push(_menuProjects);
            Array.prototype.push.apply(menuItems, _menuBlogs);

            if (UserStore.amIAdmin() == true) {
                menuItems.push(_menuAdmin);
            }
        } else {
            Array.prototype.push.apply(menuItems, _menuBlogs);
            menuItems.push(_menuLogin);
        }
        menuItems.push(_menuAboutUs);

        this.data.menuItems = menuItems;
        NavigationStore.replaceMenuItems(menuItems);
        this.trigger(this.data);
    },

    onRefreshNotifyCompleted: function(json) {
        this.data.notifyItems  = [json.message, json.notify, json.task];
        this.data.activeNotify = json.message;
        this.data.lastUpdated  = new Date();
        this.trigger(this.data);
    },

    onRefreshNotifyFailed: function(error) {
        error.dispatch();
    },

    onStartupFailed: function(xhdr, text, status) {
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default RenderStore;
