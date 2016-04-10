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

let TabPanelStore = Reflux.createStore({
    data: {
        panel: {}
    },
    listenables: [Actions],

    getTabPanel: function(id) {
        if (this.data.panel[id] == undefined) {
            return null;
        }
        return this.data.panel[id];
    },

    setTabPanel: function(id, tab) {
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
