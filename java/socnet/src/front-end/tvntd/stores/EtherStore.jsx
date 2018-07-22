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
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
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
        this.pendingBlock = [];
        this.pendingTrans = [];
        this.pendingGet   = {};
        this.latestBlock  = 0;
        this.cacheTrans   = 100;
        this.listenToMany(Actions);
    }

    onStartupCompleted(data) {
        let pubAcct = data.publicAcct;

        this._updateStore(pubAcct.publicAcct);
        this._updateBlock([pubAcct.latestBlock]);
        this._updateTransaction(pubAcct.recentTrans);
        this.trigger(this, this.state);

        if (UserStore.isLogin()) {
            Actions.getEtherWallet();
        }
    }

    onGetEtherBlockSetCompleted(data) {
        this.pendingBlock = [];
        this._updateBlock(data.blocks);
        this.trigger(this, this.state, "fetch");
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
            if (blk.transactions != null) {
                this._updateTransaction(blk.transactions);
            }
        }.bind(this));
    }

    _updateTransaction(trans) {
        if (trans == null) {
            return;
        }
        _.forEach(trans, function(t) {
            let tobj = this.transactions.getItem(t.hash);

            if (tobj == null) {
                tobj = new Transaction(t, this);

                this.transOrder.push(tobj);
                this.transactions.storeItem(tobj.getTxHash(), tobj);
            }
            if (tobj.linkBlock(this) == false) {
                this.pendingBlock.push(tobj.getBlockHash());
            }
        }.bind(this));
        this.fetchMissingBlock();
    }

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
            this.pendingBlock.push(hash);
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
        if (this.pendingBlock.length > 0) {
            Actions.getEtherBlockSet(this.pendingBlock);
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
        return out;
    }

    /**
     * Account methods.
     */
    getAccount(acct) {
        return this.state.getItem(acct);
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
