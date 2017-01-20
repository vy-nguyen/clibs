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
    },

    clearItemIndex: function(id) {
        this.data[id] = null;
    },

    getItemIndex: function(id) {
        return this.data[id];
    },

    getIndexString: function(id) {
        let str = this.data[id] || "";
        return str.replace(/<div>(.*?)<\/div>/gi, "<p>$1</p>");
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
