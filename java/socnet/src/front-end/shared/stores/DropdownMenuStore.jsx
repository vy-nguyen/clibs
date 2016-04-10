/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux   from 'reflux';
import _        from 'lodash';
import Actions  from 'vntd-root/actions/Actions.jsx';

/*
 * Explicit define known fields in User object.
 */
class DropdownMenu {
    constructor(data) {
        this._id       = _.uniqueId('id-user-info-');
        this.menuId    = data.menuId;
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
    getDropdownMenu: function(menuId) {
        if (this.data.menu[menuId] == undefined) {
            return null;
        }
        return this.data.menu[menuId];
    },

    setDropdownMenu: function(menuId, menu) {
        this.data.menu[menuId] = menu;
        console.log(this.data.menu);
    },

    cloneDropdownMenu: function(orig, newId)
    {
        let origObj = this.data.menu[orig];
        if (origObj != undefined) {
            let copyObj = _.cloneDeep(origObj);

            copyObj.menuId = newId;
            this.data.menu[newId] = copyObj;
            return copyObj;
        }
        return null;
    },

    /* Startup actions. */

    exports: {
    }
});

export default DropdownMenuStore;
