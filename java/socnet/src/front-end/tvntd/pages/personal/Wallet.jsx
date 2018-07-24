/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import Panel              from 'vntd-shared/widgets/Panel.jsx';
import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import WalletStore        from 'vntd-root/stores/WalletStore.jsx';
import EtherAccount       from 'vntd-root/pages/wall/EtherAccount.jsx';

class Wallet extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
        this._newWallet  = this._newWallet.bind(this);
        this._editWallet = this._editWallet.bind(this);
        this._moreMicroCredit = this._moreMicroCredit.bind(this);

        this.state = {
            wallets: WalletStore.getMyWallets()
        };
        this.menu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: Lang.translate('Menu'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: Lang.translate('Edit Wallets'),
                itemHandler: this._editWallet
            }, {
                itemFmt : 'fa fa-circle txt-color-yellow',
                itemText: Lang.translate('New Wallet'),
                itemHandler: this._newWallet
            }, {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: Lang.translate('Request Micropay Credits'),
                itemHandler: this._moreMicroCredit
            } ]
        };
        this.panelDef = {
            init  : false,
            icon  : 'fa fa-money',
            header: Lang.translate('My Wallets'),
            headerMenus: [this.menu]
        };
    }

    _newWallet() {
    }

    _editWallet() {
        console.log("Edit wallet...");
        console.log(this);
    }

    _moreMicroCredit() {
        console.log("Request micro credits...");
    }

    _updateState(store, data, where, code) {
        this.setState({
            wallets: WalletStore.getMyWallets()
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
                <EtherAccount key={_.uniqueId()} account={micro} full={true}/>
            );
        }
        td = wallet.getTudoFund();
        _.forOwn(td, function(acct) {
            if (acct != micro) {
                acctOut.push(
                    <EtherAccount key={_.uniqueId()} account={acct} full={true}/>
                );
            }
        });
        usd = wallet.getUsdFund();
        _.forOwn(usd, function(acct) {
            if (acct != equity) {
                acctOut.push(
                    <EtherAccount key={_.uniqueId()} account={acct} full={true}/>
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

    _renderWallets() {
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

    render() {
        return (
            <Panel context={this.panelDef}>
                {this._renderWallets()}
                {this.props.children}
            </Panel>
        );
    }
}

export default Wallet;
