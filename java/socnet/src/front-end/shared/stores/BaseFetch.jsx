/**
 * Writtey by Vy Nguyen (2018)
 */
'use strict';

import _     from 'lodash';

class BaseFetch
{
    constructor(store) {
        this.store        = store;
        this.requesting   = null;
        this.pendingReqts = {};
    }

    addPending(key, val) {
        this.pendingReqts[key] = val;
    }

    requestDoneOk() {
        this.requesting = null;
    }

    requestDoneFail() {
        this.pendingReqts = _.mege(this.pendingReqts, this.requesting);
        this.requesting   = null;
    }

    submitPending(actionFn) {
        if (this.requesting != null) {
            return;
        }
        if (!_.isEmpty(this.pendingReqts)) {
            this.requesting   = this.pendingReqts;
            this.pendingReqts = {};
            actionFn(this.requesting);
        }
    }
}

export default BaseFetch;
