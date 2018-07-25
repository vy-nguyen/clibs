/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import WalletStore        from 'vntd-root/stores/WalletStore.jsx';
import EtherAccount       from 'vntd-root/pages/wall/EtherAccount.jsx';

class Wallet extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
        this.state = _.merge(this.state, {
            wallets: props.wallets
        });
    }

    _updateState(store, data, where, code) {
        this.setState({
            wallets: store.getMyWallets()
        });
    }

    _renderOneWallet(wallet, out) {
        let td, usd, equity, micro, acctOut = [];

        equity = wallet.getEquityAcct();
        if (equity != null) {
            acctOut.push(
                <EtherAccount key={_.uniqueId()} account={equity} detail={false}/>
            );
        }
        micro = wallet.getMicroPay();
        if (micro != null) {
            acctOut.push(
                <EtherAccount key={_.uniqueId()}
                    account={micro} full={true} pay={true}/>
            );
        }
        td = wallet.getTudoFund();
        _.forOwn(td, function(acct) {
            if (acct != micro) {
                acctOut.push(
                    <EtherAccount key={_.uniqueId()}
                        account={acct} full={true} pay={true}/>
                );
            }
        });
        usd = wallet.getUsdFund();
        _.forOwn(usd, function(acct) {
            if (acct != equity) {
                acctOut.push(
                    <EtherAccount key={_.uniqueId()}
                        account={acct} full={true} pay={true}/>
                );
            }
        });

        out.push(
            <div key={_.uniqueId()} className="panel panel-default">
                <div className="panel-heading">
                    {wallet.getName()}
                </div>
                <div className="panel-body">
                    {acctOut}
                </div>
            </div>
        );
    }

    render() {
        let out = [], wallets = this.state.wallets;

        _.forOwn(wallets, function(w) {
            this._renderOneWallet(w, out);
        }.bind(this));

        return (
            <div className="row">
                {out}
            </div>
        );
    }
}

export default Wallet;
