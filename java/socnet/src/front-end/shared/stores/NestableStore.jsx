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

    storeItemTrigger: function(id, item, force) {
        this.storeItemIndex(id, item, force);
        this.trigger(item);
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

    freeItemIndex: function(id) {
        let val = this.data[id];
        if (val != null) {
            delete this.data[id];
        }
        return val;
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
