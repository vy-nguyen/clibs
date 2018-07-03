/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _                 from 'lodash';
import Reflux            from 'reflux';
import moment            from 'moment';

import Actions           from 'vntd-root/actions/Actions.jsx';
import BaseStore         from 'vntd-root/stores/BaseStore.jsx';

class EthAccount
{
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

class EtherBlock
{
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.blkNum = parseInt(this.number, 16);
        this.timestamp = new Date(this.timestamp * 1000);
        this.moment = moment(this.timestamp).fromNow();
    }

    getBlkNum() {
        return this.blkNum;
    }

    getTransCount() {
        if (this.transactions != null) {
            return this.transactions.length;
        }
        return 0;
    }

    getMiner() {
        return this.miner.substring(0, 16) + "...";
    }

    getMoment() {
        return this.moment;
    }

    getTimestamp() {
        return this.moment + '-' + this.timestamp;
    }
}

class EtherTrans
{
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
    }
}

class EtherStoreClz extends Reflux.Store
{
    constructor() {
        super();
        this.state = new BaseStore(this);
        this.blocks = new BaseStore(this);
        this.listenToMany(Actions);
    }

    onStartupCompleted(data) {
        console.log("Ether startup is called");
        console.log(data);
        let pubAcct = data.publicAcct;

        this._updateStore(pubAcct.publicAcct);
        this._updateBlock([pubAcct.latestBlock]);
        this.trigger(this, this.state);
    }

    onEtherStartupCompleted(data) {
        onStartupCompleted(data);
    }

    _updateBlock(blocks) {
        if (blocks == null) {
            return;
        }
        _.forEach(blocks, function(block) {
            let blk = new EtherBlock(block);
            this.blocks.storeItem(blk.getBlkNum(), blk, true);
            if (this.latestBlock == null) {
                this.latestBlock = blk.getBlkNum();
            }
        }.bind(this));
    }

    _updateStore(accounts) {
        _.forOwn(accounts, function(item) {
            this.state.storeItem(item.Account, new EthAccount(item), true);
        }.bind(this));
    }

    getBlock(number) {
        if (number == null || number > this.latestBlock) {
            number = this.latestBlock;
        }
        let block = this.blocks.getItem(number);
        if (block != null) {
            return block;
        }
        return this.blocks.getItem(this.latestBlock);
    }

    getNextBlock(block) {
        if (block != null) {
            return block.getNextBlock(this.latestBlock);
        }
        return null;
    }

    getPrevBlock(block) {
        if (block != null) {
            return block.getPrevBlock(this.latestBlock);
        }
        return null;
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
