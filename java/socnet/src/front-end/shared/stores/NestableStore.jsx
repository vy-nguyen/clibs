/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';

class NestableStoreClass extends Reflux.Store
{
    constructor() {
        super();
        this.data = {};
    }

    storeItemIndex(id, indexTab, force) {
        if (this.data[id] == null || force == true) {
            this.data[id] = indexTab;
        }
        return indexTab;
    }

    storeItemTrigger(id, item, force) {
        this.storeItemIndex(id, item, force);
        this.trigger(item, id, "store");
    }

    triggerStore(id, item) {
        if (item == null) {
            item = this.data[id];
        }
        if (item != null) {
            this.trigger(item, id, "store");
        }
    }

    clearItemIndex(id) {
        let ret = this.data[id];
        this.data[id] = null;
        return ret;
    }

    getItemIndex(id) {
        let ret = this.data[id];
        if (ret != null) {
            return ret;
        }
        return null;
    }

    getIndexString(id) {
        return this.data[id] || "";
    }

    allocIndexString(id, initVal) {
        if (this.data[id] == null) {
            this.data[id] = initVal;
        }
        return this.data[id];
    }

    allocItemIndex(id) {
        if (this.data[id] == null) {
            this.data[id] = {};
        }
        return this.data[id];
    }

    freeItemIndex(id) {
        let val = this.data[id];
        if (val != null) {
            delete this.data[id];
        }
        return val;
    }

    allocArrayIndex(id) {
        if (this.data[id] == null) {
            this.data[id] = [];
        }
        return this.data[id];
    }

    dumpData(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
}

let NestableStore = Reflux.initStore(NestableStoreClass);

export default NestableStore; 
