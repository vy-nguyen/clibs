/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _ from 'lodash';

class BaseElement
{
    constructor(data, store) {
        this.baseUpdate(data);
        if (store != null) {
            this.store = store;
        }
    }

    baseUpdate(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    getData() {
        return this.data;
    }

    getStatus() {
        let data = this.data;

        if (data != null && data.error != null) {
            return data.error;
        }
        return this.status || "ok";
    }

    getCaller() {
        return this.where;
    }

    getError() {
        if (this.data != null && this.data.error != null) {
            return this.data.error;
        }
        return this.error;
    }
}

export default BaseElement;
