/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux   from 'reflux';
import _        from 'lodash';
import Actions  from 'vntd-root/actions/Actions.jsx';

class DropdownMenu {
    constructor(data) {
        this._id       = _.uniqueId('id-user-info-');
        this.reactId   = data.reactId;
        this.menuItems = data.menuItems;
        return this;
    }
}

let DropdownMenuStore = Reflux.createStore({
    data: {
        menu: {},
    },
    listenables: [Actions],

    /* Public Api to get dropdown menu data. */
    getDropdownMenu: function(reactId) {
        if (this.data.menu[reactId] == undefined) {
            return null;
        }
        return this.data.menu[reactId];
    },

    setDropdownMenu: function(reactId, menu) {
        this.data.menu[reactId] = menu;
    },

    cloneDropdownMenu: function(orig, newId)
    {
        let origObj = this.data.menu[orig];
        if (origObj != undefined) {
            let copyObj = _.cloneDeep(origObj);

            copyObj.reactId = newId;
            this.data.menu[newId] = copyObj;
            return copyObj;
        }
        return null;
    },

    exports: {
    }
});

export default DropdownMenuStore;
