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
import BaseFetch         from 'vntd-shared/stores/BaseFetch.jsx';
import BaseElement       from 'vntd-shared/stores/BaseElement.jsx';
import { Util }          from 'vntd-shared/utils/Enum.jsx';

const TDRates = {
    HAO2TD: 100,
    XU2HAO: 100,
    XU2TD : 10000
};

class EthAccount extends BaseElement
{
    constructor(data) {
        super(data);

        this.txTo      = {};
        this.txToArr   = [];
        this.txFrom    = {};
        this.txFromArr = [];

        if (this.acctName == null) {
            this.acctName = "Micropay";
        }
    }

    baseUpdate(data) {
        if (data.Balance == null || data.Balance === "NA") {
            data.Balance = this.Balance;
            data.xuBalance = this.xuBalance;
        }
        super.baseUpdate(data);
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

    getAccountNo() {
        return this.Account;
    }

    indexTransaction(trans) {
        if (trans.getFromAcct() === this.Account) {
            this.txFromArr = null;
            this.txFrom[trans.getTxHash()] = trans;
        }
        if (trans.getToAcct() === this.Account) {
            this.txToArr = null;
            this.txTo[trans.getTxHash()] = trans;
        }
    }

    getTxFromArr() {
        if (this.txFromArr == null) {
            this.txFromArr = EtherStore.sortTransactions(this.txFrom);
        }
        return this.txFromArr;
    }

    getTxToArr() {
        if (this.txToArr == null) {
            this.txToArr = EtherStore.sortTransactions(this.txTo);
        }
        return this.txToArr;
    }

    static toXu(dong, hao, xu) {
        return (dong * TDRates.XU2TD) + (hao * TDRates.XU2HAO) + xu;
    }

    static getExchangeRate() {
        return TDRates;
    }

    static formatMoney(xuBalance) {
        let ether = xuBalance / TDRates.XU2TD;
        return 'T$ '  + ether.formatMoney(3, '.', ',');
    }

    static isNullBlkHash(h) {
        if (h === "0x0000000000000000000000000000000000000000000000000000000000000000") {
            return true;
        }
        return false;
    }
}

class Transaction extends BaseElement
{
    constructor(data, store) {
        super(data, store);

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
        return this.txTime.format("YYYY-MM-DD HH:mm");
    }

    getUnixTimeStamp() {
        if (this.block == null) {
            return 0;
        }
        return this.block.timestamp;
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

    linkAccount(ethStore) {
        let acct = ethStore.getAccount(this.fromAcct);
        if (acct != null) {
            acct.indexTransaction(this);
        }
        acct = ethStore.getAccount(this.toAcct);
        if (acct != null) {
            acct.indexTransaction(this);
        }
    }
}

class EtherBlock extends BaseElement
{
    constructor(data, store) {
        super(data, store);
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

        this.transOrder   = null;
        this.pendingBlock = new BaseFetch(this.blocks);
        this.pendingTrans = new BaseFetch(this.transactions);
        this.pendingAccts = new BaseFetch(this.state);
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

        this.updateAccounts(pubAcct.publicAcct);
        this.updateBlocks([pubAcct.latestBlock]);
        this.updateTransactions(pubAcct.recentTrans, true);
        this.trigger(new BaseElement({
            store: this,
            data : this.state,
            where: 'start'
        }), this.state, "start");

        if (UserStore.isLogin()) {
            Actions.getEtherWallet();
        } else {
            Actions.getEtherAddrBook();
        }
    }

    /**
     * When getting a collection of blocks.
     */
    onGetEtherBlockSetCompleted(data) {
        this.pendingBlock.requestDoneOk();
        this.updateBlocks(data.blocks);
        this.trigger(new BaseElement({
            store: this,
            data : this.state,
            where: 'fetch'
        }), this.state, "fetch");
    }

    onGetEtherBlockSetFailed(data) {
        this.pendingBlock.requestDoneFail();
    }

    /**
     * When getting a block range.
     */
    onGetEtherBlocksCompleted(data) {
        delete this.pendingGet[data.cbContext];
        this.updateBlocks(data.blocks);
        this.trigger(new BaseElement({
            store: this,
            data : this.blocks,
            where: "fetch"
        }), this.blocks, "fetch");
    }

    /**
     * When getting a collection of transactions.
     */
    onGetEtherTransCompleted(data) {
        this.pendingTrans.requestDoneOk();
        this.updateTransactions(data.trans, true);
        this.trigger(new BaseElement({
            store: this,
            data : this.transactions,
            where: "fetch-trans"
        }), this.transactions, "fetch-trans");
    }

    /**
     * When getting a collection of accounts.
     */
    onGetAccountCompleted(data) {
        this.pendingAccts.requestDoneOk();
        this.updateAccounts(data.accounts);
        this.trigger(new BaseElement({
            store: this,
            data : this.state,
            where: "fetch-acct"
        }), this.state, "fetch-acct");
    }

    onGetAccountFailed(error) {
        this.pendingAccts.requestDoneFail();
    }

    onGetAccountInfoCompleted(data) {
        this.pendingAccts.requestDoneOk();
        this.updateBlocks(data.transBlock);
        this.updateAccounts(data.accounts);
        this.updateTransactions(data.recentTrans, true);
        this.trigger(new BaseElement({
            store: this,
            data : this.state,
            where: "fetch-acct"
        }));
    }

    /**
     * Update with the list of blocks received.
     */
    updateBlocks(blocks) {
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
                let trans = this.updateTransactions(blk.transactions, false);

                if (trans != null && trans.length === blk.transactions.length) {
                    // Switch to transaction objects.
                    //
                    blk.transactions = trans;
                }
            }
        }.bind(this));
        this.transOrder = this.sortTransactions();
    }

    /**
     * Update with the list of transactions received.
     */
    updateTransactions(trans, sort) {
        if (trans == null) {
            return null;
        }
        let txObjs = [];
        _.forEach(trans, function(t) {
            if (t == null) {
                return;
            }
            let h, tobj = this.transactions.getItem(t.hash);

            if (tobj == null) {
                tobj = new Transaction(t, this);
                this.transactions.storeItem(tobj.getTxHash(), tobj);
            } else {
                tobj.baseUpdate(t);
            }
            tobj.linkAccount(this);
            if (tobj.linkBlock(this) == false) {
                h = tobj.getBlockHash();
                this.pendingBlock.addPending(h, h);
            }
            txObjs.push(tobj);
        }.bind(this));

        this.fetchMissingBlock();
        if (sort === true) {
            this.transOrder = this.sortTransactions();
        }
        return txObjs;
    }

    /**
     * Update with the list of accounts.
     */
    updateAccounts(accounts) {
        let acct, aStore = this.state;

        if (accounts == null) {
            return;
        }
        _.forOwn(accounts, function(item) {
            acct = aStore.getItem(item.Account);
            if (acct == null) {
                let trans = this.transactions.getAllData(), aobj = new EthAccount(item);
                 
                aStore.storeItem(item.Account, aobj, true);
                _.forOwn(trans, function(t) {
                    aobj.indexTransaction(t);
                });
            } else {
                acct.baseUpdate(item);
            }
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
            this.pendingBlock.addPending(hash, hash);
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
        this.pendingBlock.submitPending(function(blocks) {
            Actions.getEtherBlockSet(_.toArray(blocks));
        });
    }

    /**
     * Transaction methods.
     */
    getTransaction(from, count) {
        if (from >= this.cacheTrans) {
            // Fetch more trans
        }
        if (this.transOrder == null) {
            this.transOrder = this.sortTransaction();
        }
        if (from < 0 || from >= this.transOrder.length) {
            from = 0;
        }
        if (count == null) {
            count = 100;
        }
        return this.transOrder.slice(from, count);
    }

    /**
     * Table will do the sorting, don't have to do it here.
     */
    sortTransactions(txs) {
        let trans = txs || this.transactions.getAllData(), order = [];

        _.forOwn(trans, function(t) {
            order.push(t);
            /*
            Util.insertSorted(t, order, function(t1, t2) {
                return t1.getUnixTimeStamp() - t2.getUnixTimeStamp();
            });
            */
        });
        return order;
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
        this.pendingTrans.addPending(hash, hash);
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
        this.pendingTrans.submitPending(function(trans) {
            Actions.getEtherTransSet(_.toArray(trans));
        });
    }

    /**
     * Account methods.
     */
    getAccount(acct) {
        let aObj = this.state.getItem(acct);

        if (aObj != null) {
            return aObj;
        }
        this.pendingAccts.addPending(acct, acct);
        return null;
    }
  
    fetchMissingAccts() {
        this.pendingAccts.submitPending(function(accts) {
            Actions.getAccountInfo(_.toArray(accts));
        });
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
