/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _                 from 'lodash';
import Reflux            from 'reflux';

import Actions           from 'vntd-root/actions/Actions.jsx';
import BaseStore         from 'vntd-root/stores/BaseStore.jsx';

class EthAccount {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    getEther() {
        let hao = this.haoBalance % 1000;
        return {
            ether: this.haoBalance / 1000,
            xu   : hao / 10,
            hao  : hao % 10
        }
    }

    getMoneyBalance() {
        let ether = this.haoBalance / 1000;
        return 'T$ '  + ether.formatMoney(3, '.', ',');
    }

    indexFn() {
        return this.acctName;
    }
}

class EtherStoreClz extends Reflux.Store
{
    constructor() {
        super();
        this.state = new BaseStore(this);
        this.listenToMany(Actions);
    }

    onStartupCompleted(data) {
        this._updateStore(data.publicAcct.publicAcct);
    }

    onEtherStartupCompleted(data) {
        console.log("Ether startup is called");
        this._updateStore(data.publicAcct.publicAcct);
    }

    _updateStore(accounts) {
        _.forOwn(accounts, function(item) {
            this.state.storeItem(item.Account, new EthAccount(item), true);
        }.bind(this));

        this.trigger(this, this.state);
    }

    iterEachAccount(fn) {
        _.forOwn(this.state.getAllData(), fn);
    }

    iterEachIndex(fn) {
        _.forOwn(this.state.getAllIndex(), fn);
    }

    getCommunity() {
        if (this.state != null) {
            return this.state.getIndex("Micropay");
        }
        return null;
    }

    getReserved() {
        if (this.state != null) {
            return this.state.getIndex("Reserved");
        }
        return null;
    }

    onEtherStartupFailed(error) {
        console.log("Ether startup failed...");
        console.log(error);
    }

    dumpData(hdr) {
        console.log(hdr);
        console.log(this);
    }
}

var EtherStore = Reflux.initStore(EtherStoreClz);

export default EtherStore;
