/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux            from 'reflux';
import Actions           from 'vntd-root/actions/Actions.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';
import ErrorDispatch     from 'vntd-shared/actions/ErrorDispatch.jsx';

let RenderStore = Reflux.createStore({
    data: {
        menuItems: [],
        notifyItems: [],
        activeNotify: {
            items: []
        },
        lastUpdated: new Date()
    },
    listenables: [Actions, NavigationActions],

    init: function() {
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

        NavigationStore.replaceMenuItems(this.data.menuItems);
        this.trigger(this.data);
    },

    onRefreshNotifyCompleted: function(json) {
        this.data.notifyItems = [json.message, json.notify, json.task];
        this.data.activeNotify = json.message;
        this.data.lastUpdated = new Date();
        this.trigger(this.data);
    },

    onRefreshNotifyFailed: function(error) {
        error.dispatch();
    },

    onStartupFailed: function(xhdr, text, status) {
        let error = new ErrorDispatch(xhdr, text, status);
        error.handle();
        error = null;
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default RenderStore;
