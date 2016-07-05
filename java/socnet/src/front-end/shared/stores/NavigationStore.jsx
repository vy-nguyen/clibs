/**
 * Vy Nguyen (2016)
 */
'use strict';

import Reflux from 'reflux';
import _      from 'lodash';

import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import History           from 'vntd-shared/utils/History.jsx';
import MenuItem          from './MenuItem.jsx';

let NavigationStore = Reflux.createStore({

    data: {},
    listenables: NavigationActions,

    init: function() {
        this.data = {
            item: undefined,
            items: []
        }
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
    }

});

export default NavigationStore
