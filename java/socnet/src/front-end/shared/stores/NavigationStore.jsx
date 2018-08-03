/**
 * Vy Nguyen (2016)
 */
'use strict';

import _      from 'lodash';
import $      from 'jquery';
import Reflux from 'reflux';

import BaseElement       from 'vntd-shared/stores/BaseElement.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import History           from 'vntd-shared/utils/History.jsx';
import Actions           from 'vntd-root/actions/Actions.jsx';
import LanguageStore     from 'vntd-root/stores/LanguageStore.jsx';
import MenuItem          from './MenuItem.jsx';

let NavigationStore = Reflux.createStore({

    data: {},
    listenables: [NavigationActions, Actions],

    init: function() {
        this.data = {
            sideBar   : true,
            item      : null,
            items     : [],
            currMqIdx : null,
            currMqMode: 'xs',
            maxHeight : '500px'
        }
        this._checkForResize();
        $(window).on('resize', this._checkForResize);
    },

    _checkForResize: function() {
        let data = this.data;
        data.currMqIdx = $('#mq-detector span').index($('#mq-detector span:visible'));
        switch(data.currMqIdx) {
            case 0:
                data.sideBar    = false;
                data.currMqMode = 'xs';
                break;
            case 1:
                data.sideBar    = false;
                data.currMqMode = 'sm';
                data.maxHeight = '750px';
                break;
            case 2:
                data.sideBar    = true;
                data.currMqMode = 'md';
                data.maxHeight = '1000px';
                break;
            case 3:
                data.sideBar    = true;
                data.currMqMode = 'lg';
                data.maxHeight = '1000px';
                break;
            default:
                data.currMqMode = 'xs';
        }
    },

    getViewMode: function() {
        return this.data.currMqMode;
    },

    getMaxHeight: function() {
        return this.data.maxHeight;
    },

    isSideBarOn: function() {
        return this.data.sideBar;
    },

    getSideBarItems: function() {
        return this.data.items;
    },

    triggerPoint(where, code) {
        this.trigger(new BaseElement({
            store: this,
            item : this.data.item,
            items: this.data.item,
            data : this.data,
            where: where
        }), code);
    },

    replaceMenuItems: function(json) {
        this.data.items = null;
        this.data.item  = null;
        this.addRawItems(json);
        this.triggerPoint('replace-menu', 'update');
    },

    onGetItemsCompleted: function(rawItems) {
        this.addRawItems(rawItems.items);
        this.triggerPoint('get-item', 'update');
    },

    onTranslateCompleted: function() {
        this._translate(this.data.items);
    },

    onToggleSideBarCompleted: function() {
        this.data.sideBar = !this.data.sideBar;
        this.triggerPoint('get-sidebar', 'sidebar');
    },

    onActivate: function(item) {
        this.data.item = item;
        if (item.route) {
            History.pushState(null, item.route)
        }
        this.triggerPoint('on-active', 'active');
    },

    addRawItems: function(rawItems) {
        this.data.items = _.map(rawItems, function(item) {
            return new MenuItem(item)
        });
        this._setInitialItem(this.data.items);
    },

    _translate: function(items) {
        items.forEach(function(item) {
            item.title = LanguageStore.translate(item.titleKey);
            if (item.items != null) {
                this._translate(item.items);
            }
        }.bind(this));
    },

    _setInitialItem: function(items) {
        let home = null;
        items.forEach(function(item) {
            if (item.isActive) {
                this.data.item = item;
            }
            if (item.isHome) {
                home = item;
            }
            if (item.items) {
                this._setInitialItem(item.items);
            }
        }.bind(this));

        if (this.data.item == null) {
            if (home == null) {
                home = items[0];
            }
            this.data.item = home;
        }
    },

    getData: function() {
        return this.data;
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default NavigationStore
