/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux            from 'reflux';
import Actions           from 'vntd-root/actions/Actions.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';

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

        NavigationStore.replaceMenuItems(json.menuItems);
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
