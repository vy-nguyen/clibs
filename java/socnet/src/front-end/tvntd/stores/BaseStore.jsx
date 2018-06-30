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
        this.index = {};
        this.store = store;
    }

    storeItem(id, item, force) {
        let ret = this.data[id];

        if (ret == null || force === true) {
            this.data[id] = item;
            ret = item;
            if (item.indexFn != null) {
                this.index[item.indexFn()] = item;
            }
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
        if (item.indexFn != null) {
            delete this.data[item.indexFn()];
        }
        return item;
    }

    getAllData() {
        return this.data;
    }

    getAllIndex() {
        return this.index;
    }

    getItem(id) {
        return this.data[id];
    }

    getIndex(id) {
        return this.index[id];
    }

    deleteItem(id) {
        let item = this.data[id];

        delete this.data[id];
        if (item.itemFn != null) {
            delete this.data[item.indexFn()];
        }
        return item;
    }

    storeObject(id, key, value) {
        let ret = this.data[id];

        if (ret == null) {
            ret = this.data[id] = {};
        } else {
            if (ret.indexFn != null) {
                this.index[ret.indexFn()] = value;
            }
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
