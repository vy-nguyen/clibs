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
class TabPannelItem {
    constructor(data) {
        this._id       = _.uniqueId('id-user-info-');
        return this;
    }
}

let TabPanelStore = Reflux.createStore({
    data: {
        panel: {}
    },
    listenables: [Actions],

    getTabPanel: function(id) {
        return this.data.panel[id];
    },

    setTabPanel: function(id, tab) {
        if (this.data.panel[id] == undefined) {
            return null;
        }
        this.data.panel[id] = tab;
    },

    cloneTabPanel: function(orig, newId)
    {
        let origObj = this.data.panel[orig];
        if (origObj != undefined) {
            let copyObj = _.cloneDeep(origObj);

            copyObj.paneId = newId;
            this.data.panel[newId] = copyObj;
            return copyObj;
        }
        return null;
    },

    /* Startup actions. */

    exports: {
    }
});

export default TabPanelStore;
