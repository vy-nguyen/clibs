/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import Reflux       from 'reflux';
import Actions      from 'vntd-root/actions/BusinessActions.jsx';

let BusinessStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    init: function() {
        this.data = {};
    },

    onStartupLayoutCompleted: function(json) {
        console.log("Startup layout completed");
        console.log(json);
    },

    mainStartup: function(json) {
    },

    dumpData: function(text) {
        console.log(text);
        console.log(this.data);
    }
});

export default BusinessStore;
