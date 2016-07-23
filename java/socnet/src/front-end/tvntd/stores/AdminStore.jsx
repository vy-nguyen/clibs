/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import _         from 'lodash';
import Actions   from 'vntd-root/actions/Actions.jsx';

let AdminStore = Reflux.createStore({
    listenables: [Actions],

    init: function() {
        console.log("Admin Store init");
    },

    /* Admin actions to list users. */
    onListUsersCompleted: function(data) {
        console.log(data);
    },

    onListUsersFailed: function(data) {
        console.log("List user failed");
        console.log(data);
    }
});

export default AdminStore;
