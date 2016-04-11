/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux   from 'reflux';
import _        from 'lodash';
import Actions  from 'vntd-root/actions/Actions.jsx';

let PanelStore = Reflux.createStore({
    data: {
        panel: {},
    },
    listenables: [Actions],

    getPanel: function(id) {
        if (this.data.panel[id] == undefined) {
            return null;
        }
        return this.data.panel[id];
    },

    setPanel: function(panelId, panel) {
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
