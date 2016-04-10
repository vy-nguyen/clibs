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
let PanelStore = Reflux.createStore({
    data: {
        panel: {},
    },
    listenables: [Actions],

    getPanel: function(id) {
        return this.data.panel[id];
    },

    setPanel: function(panelId, panel) {
        if (this.data.panel[panelId] == undefined) {
            return null;
        }
        this.data.panel[panelId] = panel;
    },

    clonePanel: function(orig, newId)
    {
        let origObj = this.data.panel[orig];
        if (origObj != undefined) {
            let copyObj = _.cloneDeep(origObj);

            copyObj.panelId = newId;
            this.data.panel[newId] = copyObj;
            return copyObj;
        }
        return null;
    },

    /* Startup actions. */

    exports: {
    }
});

export default PanelStore;
