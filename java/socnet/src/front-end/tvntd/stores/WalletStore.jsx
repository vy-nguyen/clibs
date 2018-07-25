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
        this.usdFund  = new BaseStore(this);
        this.tudoFund = new BaseStore(this);
    }

    addAccount(account) {
        this.microPay = account;
        this.tudoFund.storeItem(account.getAccountNo(), account, false);
    }

    getName() {
        return this.name;
    }

    isMyAccount(acctNo) {
        if (this.equity != null && this.equity.getAccountNo() === acctNo) {
            return 'equity';
        }
        if (this.usdFund.getItem(acctNo) != null) {
            return 'usd';
        }
        if (this.tudoFund.getItem(acctNo) != null) {
            return 'tudo';
        }
        return false;
    }

    getEquityAcct() {
        return this.equity;
    }

    getMicroPay() {
        return this.microPay;
    }

    getUsdFund() {
        return this.usdFund.getAllData();
    }

    getUsdFundByName(name) {
        return this.usdFund.getIndex(name);
    }

    getTudoFund() {
        return this.tudoFund.getAllData();
    }

    getTudoFundByName(name) {
        return this.tudoFund.getIndex(name);
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
        this._updateWallet(data.wallets);
        this.trigger(this, this.state, "fetch");
    }

    onGetEtherWalletFailed(error) {
        console.log("get wallet failed...");
        this.trigger(this, error, "error");
    }

    onGetAccountInfoCompleted(data) {
    }

    onGetAccountInfoFailed(error) {
        console.log("get account info failed...");
        this.trigger(this, error, "error");
    }

    getMyWallets() {
        return this.state.getAllData();
    }

    isMyAccount(acctNo) {
        let result = false, wallets = this.state.getAllData();

        _.forOwn(wallets, function(w) {
            if (result === false) {
                let out = w.isMyAccount(acctNo);
                if (out !== false) {
                    result = out;
                    return false; // bailout early.
                }
            }
        });
        return result;
    }

    getAddressBook() {
        return [ {
            value: "abc", label: "Vy Nguyen"
        }, {
            value: "def", label: "Manh Nguyen"
        }, {
            value: "def", label: "Dung Nguyen"
        }, {
            value: "def", label: "Hai Hoang"
        }, {
            value: "def", label: "Minh Hieu"
        } ];
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
