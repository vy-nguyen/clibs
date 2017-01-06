/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux            from 'reflux';
import Actions           from 'vntd-root/actions/Actions.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';

const _userMenuEntries = [ {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-home',
    items: null,
    route: '/',
    title: 'Home'
}, {
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
}, {
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
}, {
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
}, {
    badge: null,
    icon : 'fa fa-lg fa-fw fa-globe',
    tiems: null,
    route: '/public/aboutus',
    title: 'About Us'
} ];

let RenderStore = Reflux.createStore({
    data: {},
    listenables: [Actions, NavigationActions],

    init: function() {
        this.data = {
            menuItems: [],
            notifyItems: [],
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

    onStartupCompleted: function(json) {
        this.data.menuItems = json.menuItems;

        NavigationStore.replaceMenuItems(_userMenuEntries);
        //NavigationStore.replaceMenuItems(json.menuItems);
        this.trigger(this.data);
    },

    onRefreshNotifyCompleted: function(json) {
        this.data.notifyItems = [json.message, json.notify, json.task];
        this.data.activeNotify = json.message;
        this.data.lastUpdated = new Date();
        this.trigger(this.data);
    },

    onRefreshNotifyFailed: function(error) {
        console.log(error);
        error.dispatch();
    },

    onStartupFailed: function(xhdr, text, status) {
        console.log("on startup failed");
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default RenderStore;
