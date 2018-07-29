/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import Reflux            from 'reflux';
import moment            from 'moment';

import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import Actions           from 'vntd-root/actions/Actions.jsx';
import BaseStore         from 'vntd-root/stores/BaseStore.jsx';
import EtherStore        from 'vntd-root/stores/EtherStore.jsx';

class Wallet
{
    constructor(data, store) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.equity   = null;
        this.microPay = null;
        this.usdFund  = new BaseStore(store);
        this.tudoFund = new BaseStore(store);
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

    iterAccount(func) {
        if (this.equity != null) {
            func(this.equity);
        }
        _.forOwn(this.getTudoFund(), func);
        _.forOwn(this.getUsdFund(), func);
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

class AddrBookEntry
{
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.user = UserStore.getUserByUuid(data.ownerUuid);
    }

    getUser(siz) {
        let user;

        if (this.user != null) {
            let name = this.user.getUserName() + " (" + this.account + ")";

            if (siz == null) {
                siz = 20;
            }
            user = (
                <span>
                    <img width={siz} height={siz} src={this.user.userImgUrl}/> {name}
                </span>
            );
        } else {
            user = <span>{this.account}</span>;
        }
        return user;
    }

    getSelectEntry() {
        return {
            value: this.account,
            label: this.getUser()
        };
    }
}

class WalletStoreClz extends Reflux.Store
{
    constructor() {
        super();
        this.state = new BaseStore(this);
        this.defWallet = null;
        this.addrBook = new BaseStore(this);
        this.globBook = new BaseStore(this);
        this.addrBookSelect = [];

        this.listenToMany(Actions);
    }

    onGetEtherWalletCompleted(data) {
        this._updateWallet(data.wallets);
        this.trigger(this, this.state, "fetch");
        Actions.getEtherAddrBook();
    }

    onGetEtherWalletFailed(error) {
        this.trigger(this, error, "error");
    }

    onGetAccountInfoCompleted(data) {
    }

    onGetAccountInfoFailed(error) {
        this.trigger(this, error, "error");
    }

    onGetEtherAddrBookCompleted(data) {
        this._updateAddressBook(data);
    }

    getDefWallet() {
        if (this.defWallet == null) {
            _.forOwn(this.state.getAllData(), function(w) {
                this.defWallet = w;
                return false;
            }.bind(this));
        }
        return this.defWallet;
    }

    getSelOptions() {
        let opts = [];

        _.forOwn(this.state.getAllData(), function(w) {
            opts.push({
                value: w.walletUuid,
                label: w.getName()
            });
        });
        return opts;
    }

    getTAOptions() {
        let opts = [];

        _.forOwn(this.state.getAllData(), function(w) {
            opts.push(w.getName());
        });
        return opts;
    }

    getMyWallets() {
        return this.state.getAllData();
    }

    getWalletByName(name) {
        return this.state.getIndex(name);
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
        return this.addrBookSelect;
    }

    getAddressBookEntry(acctNo) {
        let account = this.addrBook.getItem(acctNo);

        if (account != null) {
            return account;
        }
        account = this.globBook.getItem(acctNo);
        if (account != null) {
            return account;
        }
        return new AddrBookEntry({
            account: acctNo
        });
    }

    _updateAddressBook(data) {
        if (data.personal != null) {
            this._addAddressBook(this.addrBook, this.addrBookSelect, data.personal);
        }
        if (data.publicBook != null) {
            this._addAddressBook(this.globBook, this.addrBookSelect, data.publicBook);
        }
    }

    _addAddressBook(store, select, list) {
        _.forEach(list, function(e) {
            let entry = store.getItem(e.account);
            if (entry == null) {
                entry = new AddrBookEntry(e);
                store.storeItem(e.account, entry, true);
                select.push(entry.getSelectEntry());
            }
        }.bind(this));
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
