/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';

let NestableStore = Reflux.createStore({
    data: {},
    init: function() {
        this.data = {}
    },

    storeItemIndex: function(id, indexTab, force) {
        if (this.data[id] == null || force == true) {
            this.data[id] = indexTab;
        }
        return indexTab;
    },

    clearItemIndex: function(id) {
        let ret = this.data[id];
        this.data[id] = null;
        return ret;
    },

    getItemIndex: function(id) {
        return this.data[id];
    },

    getIndexString: function(id) {
        return this.data[id] || "";
    },

    allocIndexString: function(id, initVal) {
        if (this.data[id] == null) {
            this.data[id] = initVal;
        }
        return this.data[id];
    },

    allocItemIndex: function(id) {
        if (this.data[id] == null) {
            this.data[id] = {};
        }
        return this.data[id];
    },

    allocArrayIndex: function(id) {
        if (this.data[id] == null) {
            this.data[id] = [];
        }
        return this.data[id];
    },

    dumpData: function(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
});

export default NestableStore; 
