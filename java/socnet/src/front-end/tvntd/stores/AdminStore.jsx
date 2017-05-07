/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import _         from 'lodash';
import Actions   from 'vntd-root/actions/Actions.jsx';

let AdminStore = Reflux.createStore({
    data: {},
    listenables: [Actions],

    init: function() {
        this.data = {
            publicArticle: {}
        }
    },

    /* Admin actions to list users. */
    onListUsersCompleted: function(data) {
    },

    onListUsersFailed: function(data) {
    },

    onSetTagsCompleted: function(data) {
    },

    onSetTagsFailed: function(data) {
    },

    addPublicArticle: function(artUuid, artRank) {
        this.data.publicArticle[artUuid] = artUuid;
    },

    getPublicArticle: function() {
        return this.data.publicArticle;
    },

    clearPublicArticle: function() {
        this.data.publicArticle = {};
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default AdminStore;
