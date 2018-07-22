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

        this.txTo      = {};
        this.txToArr   = [];
        this.txFrom    = {};
        this.txFromArr = [];
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
        return EthAccount.formatMoney(this.xuBalance);
    }

    // @Override
    //
    indexFn() {
        return this.acctName;
    }

    getName() {
        return this.acctName;
    }

    indexTransaction(trans) {
        if (trans.getFromAcct() === this.Account) {
            this.txFromArr.push(trans);
            this.txFrom[trans.getTxHash()] = trans;
        }
        if (trans.getToAcct() === this.Account) {
            this.txToArr.push(trans);
            this.txTo[trans.getTxHash()] = trans;
        }
    }

    getTxFromArr() {
        return this.txFromArr;
    }

    getTxToArr() {
        return this.txToArr;
    }

    static getExchangeRate() {
        return TDRates;
    }

    static formatMoney(xuBalance) {
        let ether = xuBalance / TDRates.XU2TD;
        return 'T$ '  + ether.formatMoney(3, '.', ',');
    }
}

class Transaction
{
    constructor(data, store) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        let acct = store.getAccount(this.fromAcct);
        if (acct != null) {
            acct.indexTransaction(this);
        }
        acct = store.getAccount(this.toAcct);
        if (acct != null) {
            acct.indexTransaction(this);
        }
    }

    getBlockHash() {
        return this.blockHash;
    }

    getTxHash() {
        return this.txHash;
    }

    getTxHashBrief() {
        return this.txHash.substring(0, 16) + "...";
    }

    getFromAcct() {
        return this.fromAcct;
    }

    getToAcct() {
        return this.toAcct;
    }

    getXuAmount() {
        return this.xuAmount;
    }

    getAmountFmt() {
        return EthAccount.formatMoney(this.xuAmount);
    }

    getNonce() {
        return this.nonce;
    }

    getTimeStamp() {
        if (this.block == null) {
            return "...";
        }
        if (this.txTime == null) {
            this.txTime = moment(this.block.timestamp);
        }
        return this.txTime.format("DD-MM-YYYY HH:mm");
    }

    linkBlock(ethStore) {
        if (this.block == null) {
            this.block = ethStore.getBlockHash(this.blockHash);
            if (this.block == null) {
                return false;
            }
        }
        return true;
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

    getTransactions() {
        return this.transactions;
    }

    getMiner(name) {
        return this.store.getAccountName(this.miner);
    }

    getMoment() {
        return this.moment;
    }

    getTimestamp() {
        return this.moment + '-' + this.timestamp;
    }

    // @Override
    //
    indexFn() {
        return this.hash;
    }
}

class EtherStoreClz extends Reflux.Store
{
    constructor() {
        super();
        this.state  = new BaseStore(this);
        this.blocks = new BaseStore(this);
        this.transactions = new BaseStore(this);

        this.transOrder   = [];
        this.pendingBlock = {};
        this.pendingTrans = {};
        this.pendingAccts = {};
        this.pendingGet   = {};
        this.latestBlock  = 0;
        this.cacheTrans   = 100;
        this.listenToMany(Actions);
    }

    onEtherStartupCompleted(data) {
        onStartupCompleted(data);
    }

    onStartupCompleted(data) {
        let pubAcct = data.publicAcct;

        this._updateStore(pubAcct.publicAcct);
        this._updateBlock([pubAcct.latestBlock]);
        this._updateTransaction(pubAcct.recentTrans);
        this.trigger(this, this.state, "start");

        if (UserStore.isLogin()) {
            Actions.getEtherWallet();
        }
    }

    /**
     * When getting a collection of blocks.
     */
    onGetEtherBlockSetCompleted(data) {
        this.pendingBlock = {};
        this._updateBlock(data.blocks);
        this.trigger(this, this.state, "fetch");
    }

    /**
     * When getting a block range.
     */
    onGetEtherBlocksCompleted(data) {
        delete this.pendingGet[data.cbContext];
        this._updateBlock(data.blocks);
        this.trigger(this, this.blocks, "fetch");
    }

    /**
     * When getting a collection of transactions.
     */
    onGetEtherTransCompleted(data) {
        this.pendingTrans = {};
        this._updateTransaction(data.trans);
        this.trigger(this, this.transactions, "fetch-trans");
    }

    /**
     * When getting a collection of accounts.
     */
    onGetAccountCompleted(data) {
        this.pendingAccts = {};
        this._updateStore(data.accounts);
        this.trigger(this, this.state, "fetch-acct");
    }

    /**
     * Update with the list of blocks received.
     */
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
            if (blk.transactions != null) {
                let trans = this._updateTransaction(blk.transactions);

                if (trans != null && trans.length === blk.transactions.length) {
                    // Switch to transaction objects.
                    //
                    blk.transactions = trans;
                }
            }
        }.bind(this));
    }

    /**
     * Update with the list of transactions received.
     */
    _updateTransaction(trans) {
        if (trans == null) {
            return null;
        }
        let txObjs = [];
        _.forEach(trans, function(t) {
            let h, tobj = this.transactions.getItem(t.hash);

            if (tobj == null) {
                tobj = new Transaction(t, this);

                this.transOrder.push(tobj);
                this.transactions.storeItem(tobj.getTxHash(), tobj);
            }
            if (tobj.linkBlock(this) == false) {
                h = tobj.getBlockHash();
                this.pendingBlock[h] = h;
            }
            txObjs.push(tobj);
        }.bind(this));
        this.fetchMissingBlock();

        return txObjs;
    }

    /**
     * Update with the list of accounts.
     */
    _updateStore(accounts) {
        _.forOwn(accounts, function(item) {
            this.state.storeItem(item.Account, new EthAccount(item), true);
        }.bind(this));
    }

    /**
     * Block methods.
     */
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

    getBlockHash(hash) {
        let blk = this.blocks.getIndex(hash);

        if (blk == null) {
            this.pendingBlock[hash] = hash;
            this.fetchMissingBlock();
        }
        return blk;
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

    fetchMissingBlock() {
        if (!_.isEmpty(this.pendingBlock)) {
            Actions.getEtherBlockSet(_.toArray(this.pendingBlock));
        }
    }

    /**
     * Transaction methods.
     */
    getTransaction(from, count) {
        if (from >= this.cacheTrans) {
            // Fetch more trans
        }
        if (from < 0 || from >= this.transOrder.length) {
            from = 0;
        }
        return this.transOrder.slice(from, count);
    }

    getTransObj(t) {
        if (t instanceof Transaction) {
            return t;
        }
        let tobj, hash = (typeof t !== "string") ? t.hash : t;

        tobj = this.transactions.getItem(hash);
        if (tobj != null) {
            return tobj;
        }
        this.pendingTrans[hash] = hash;
        return null;
    }

    getTransObject(txs) {
        let tobj, out = [];

        if (!Array.isArray(txs)) {
            return [this.getTransObj(txs)];
        }
        _.forOwn(txs, function(t) {
            tobj = this.getTransObj(t);
            if (tobj != null) {
                out.push(tobj);
            }
        }.bind(this));

        this.fetchMissingTrans();
        return out;
    }

    fetchMissingTrans() {
        if (!_.isEmpty(this.pendingTrans)) {
            console.log("fetch missing trans");
        }
    }

    /**
     * Account methods.
     */
    getAccount(acct) {
        let aObj = this.state.getItem(acct);

        if (aObj != null) {
            return aObj;
        }
        this.pendingAccts[acct] = acct;
        this.fetchMissingAccts();
        return null;
    }
  
    fetchMissingAccts() {
        if (!_.isEmpty(this.pendingAccts)) {
            console.log("Fetch missing accounts..");
            console.log(this.pendingAccts);
        }
    }

    getAccountName(acct) {
        let account = this.state.getItem(acct),
            name = (account != null) ? account.getName() : "Annon";
        return acct.substring(0, 16) + "... (" + name + ")";
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
