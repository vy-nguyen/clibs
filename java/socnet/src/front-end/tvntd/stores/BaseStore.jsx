/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import {Util}         from 'vntd-shared/utils/Enum.jsx';

class BaseStore
{
    constructor(store) {
        this.data  = {};
        this.store = store;
    }

    storeItem(id, item, force) {
        let ret = this.data[id];

        if (ret == null || force === true) {
            this.data[id] = item;
            ret = item;
        }
        return ret;
    }

    storeItemTrigger(id, item, force, code) {
        let ret = this.storeItem(id, item, force);
        this.triggerStore(id, item, code);
        return ret;
    }

    removeItem(id) {
        let item = this.data[id];
        this.data[id] = null;
        return item;
    }

    getItem(id) {
        return this.data[id];
    }

    deleteItem(id) {
        let item = this.data[id];
        delete this.data[id];
        return item;
    }

    storeObject(id, key, value) {
        let ret = this.data[id];

        if (ret == null) {
            ret = this.data[id] = {};
        }
        ret[key] = value;
        return ret;
    }

    pushArray(id, elm) {
        let ret = this.data[id];

        if (ret == null) {
            ret = this.data[id] = [];
        }
        ret.push(elm);
        return ret;
    }

    triggerStore(id, item, code) {
        if (item == null) {
            item = this.data[id];
        }
        if (item != null) {
            this.store.trigger(this.data, item, code);
        }
    }

    dumpData(hdr) {
        console.log(hdr);
        console.log(this.data);
    }

    static compareByArt(t1, t2) {
        let l1 = t1.sortedArts != null ? t1.sortedArts.length : 0,
            l2 = t2.sortedArts != null ? t2.sortedArts.length : 0;
        return l2 - l1;
    }

    static sortTagByArticles(tagList) {
        let out = [];
        _.forEach(tagList, (tag) => {
            Util.insertSorted(tag, out, BaseStore.compareByArt);
        });
        return out;
    }
}

export default BaseStore
