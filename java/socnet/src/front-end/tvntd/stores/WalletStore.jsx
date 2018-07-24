/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _              from 'lodash';
import Reflux         from 'reflux';
import moment         from 'moment';

import Actions        from 'vntd-root/actions/Actions.jsx';
import BaseStore      from 'vntd-root/stores/BaseStore.jsx';
import EtherStore     from 'vntd-root/stores/EtherStore.jsx';

class Wallet
{
    constructor(data, store) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.equity   = null;
        this.microPay = null;
        this.usdFund  = {};
        this.tudoFund = {};
    }

    addAccount(account) {
        this.microPay = account;
        this.tudoFund[account.getName()] = account;
    }

    getName() {
        return this.name;
    }

    getEquityAcct() {
        return this.equity;
    }

    getMicroPay() {
        return this.microPay;
    }

    getUsdFund() {
        return this.usdFund;
    }

    getUsdFundByName(name) {
        return this.usdFund[name];
    }

    getTudoFund() {
        return this.tudoFund;
    }

    getTudoFundByName(name) {
        return this.tudoFund[name];
    }

    // @Override
    //
    indexFn() {
        return this.name;
    }
}

class WalletStoreClz extends Reflux.Store
{
    constructor() {
        super();
        this.state = new BaseStore(this);
        this.listenToMany(Actions);
    }

    onGetEtherWalletCompleted(data) {
        console.log("----------");
        console.log(data);
        this._updateWallet(data.wallets);
        this.trigger(this, this.state, "fetch");
    }

    onGetEtherWalletFailed(error) {
        console.log("get wallet failed...");
        console.log(error);
    }

    getMyWallets() {
        return this.state.getAllData();
    }

    _updateWallet(wallets) {
        let wstore = this.state;
        _.forOwn(wallets, function(w) {
            let wobj = wstore.getItem(w.walletUuid);

            if (wobj == null) {
                wobj = new Wallet(w, this);
                wstore.storeItem(w.walletUuid, wobj, true);
            }
            this._updateAccount(wobj, w.accountInfo);

        }.bind(this));
    }

    _updateAccount(wobj, accountInfo) {
        let aobj, accounts = [], trans = [], wstore = this.state;

        _.forEach(accountInfo, function(a) {
            accounts.push(a.account);
            if (a.recentTrans != null) {
                trans = _.merge(trans, a.recentTrans);
            }
        });
        EtherStore.updateAccounts(accounts);
        EtherStore.updateTransactions(trans);

        _.forEach(accounts, function(a) {
            aobj = EtherStore.getAccount(a.Account);
            if (aobj != null) {
                wobj.addAccount(aobj);
            }
        }.bind(this));
    }

    dumpData(hdr) {
        console.log(hdr);
        console.log(this);
    }
}

var WalletStore = Reflux.initStore(WalletStoreClz);

export default WalletStore;
