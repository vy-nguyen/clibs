/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _                 from 'lodash';
import Reflux            from 'reflux';
import moment            from 'moment';

import Actions           from 'vntd-root/actions/Actions.jsx';
import BaseStore         from 'vntd-root/stores/BaseStore.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';

const TDRates = {
    HAO2TD: 100,
    XU2HAO: 100,
    XU2TD : 10000
};

class EthAccount
{
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    getEther() {
        let xu = this.xuBalance % TDRates.XU2TD;
        return {
            ether: this.haoBalance / TDRates.XU2TD,
            hao  : xu / TDRates.XU2HAO,
            xu   : xu % TDRates.XU2TD
        }
    }

    getMoneyBalance() {
        let ether = this.xuBalance / TDRates.XU2TD;
        return 'T$ '  + ether.formatMoney(3, '.', ',');
    }

    indexFn() {
        return this.acctName;
    }

    getName() {
        return this.acctName;
    }

    static getExchangeRate() {
        return TDRates;
    }
}

class EtherBlock
{
    constructor(data, store) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.store = store;
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

    getMiner(name) {
        let acct = this.miner.substring(0, 16) + "...";

        if (name === true) {
            let name, account = this.store.getAccount(this.miner);
            name = (account != null) ? account.getName() : "Annon";
            acct = acct + " (" + name + ")";
        }
        return acct;
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
        this.pendingGet  = {};
        this.latestBlock = 0;
        this.listenToMany(Actions);
    }

    onStartupCompleted(data) {
        let pubAcct = data.publicAcct;

        console.log("-------" + UserStore.isLogin());
        console.log(data);

        this._updateStore(pubAcct.publicAcct);
        this._updateBlock([pubAcct.latestBlock]);
        this.trigger(this, this.state);

        if (UserStore.isLogin()) {
            Actions.getEtherWallet();
        }
    }

    onEtherStartupCompleted(data) {
        onStartupCompleted(data);
    }

    onGetEtherBlocksCompleted(data) {
        delete this.pendingGet[data.cbContext];
        this._updateBlock(data.blocks);
        this.trigger(this, this.state, "fetch");
    }

    _updateBlock(blocks) {
        if (blocks == null) {
            return;
        }
        _.forEach(blocks, function(block) {
            let blkNo, blk = new EtherBlock(block, this);

            blkNo = blk.getBlkNum();
            this.blocks.storeItem(blkNo, blk, true);
            if (blkNo > this.latestBlock) {
                this.latestBlock = blkNo;
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

    fetchBlock(blkNo) {
        if (blkNo >= this.latestBlock) {
            return this.blocks.getItem(this.latestBlock);
        }
        let blk = this.blocks.getItem(blkNo);
        if (blk == null) {
            if (this.pendingGet[blkNo] == null) {
                this.pendingGet[blkNo] = blkNo;
                Actions.getEtherBlocks(blkNo, blkNo);
            }
        }
        return blk;
    }

    getAccount(acct) {
        return this.state.getItem(acct);
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
export { EthAccount, EtherStore };
