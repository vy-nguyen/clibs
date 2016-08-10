/**
 * Vy Nguyen (2016)
 */
'use strict';

import _      from 'lodash';
import $      from 'jquery';
import Reflux from 'reflux';

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
            item: undefined,
            items: [],
            currMqIdx : undefined,
            currMqMode: 'xs'
        }
        this._checkForResize();
        $(window).on('resize', this._checkForResize);
    },

    _checkForResize: function() {
        let data = this.data;
        data.currMqIdx = $('#mq-detector span').index($('#mq-detector span:visible'));
        switch(data.currMqIdx) {
            case 0: data.currMqMode = 'xs'; break;
            case 1: data.currMqMode = 'sm'; break;
            case 2: data.currMqMode = 'md'; break;
            case 3: data.currMqMode = 'lg'; break;
            default: data.currMqMode = 'xs';
        }
    },

    getViewMode: function() {
        return this.data.currMqMode;
    },

    replaceMenuItems: function(json) {
        this.data.items = null;
        this.data.item  = undefined;
        this.addRawItems(json);
        this.trigger(this.data);
    },

    onGetItemsCompleted: function(rawItems) {
        this.addRawItems(rawItems.items);
        this.trigger(this.data)
    },

    onTranslateCompleted: function() {
        this._translate(this.data.items);
    },

    onActivate: function(item) {
        this.data.item = item;
        if (item.route) {
            History.pushState(null, item.route)
        }
        this.trigger({
            item: item
        });
    },

    addRawItems: function(rawItems) {
        this.data.items = _.map(rawItems, function(item) {
            return new MenuItem(item)
        });
        this._setInitialItem(this.data.items);
    },

    _translate: function(items) {
        items.forEach(function(item) {
            item.title = LanguageStore.translate(item.title);
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
