/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import { QRCode }        from 'react-qr-svg';

import BaseMedia         from 'vntd-shared/layout/BaseMedia.jsx';

import ArticleTagBrief   from 'vntd-root/components/ArticleTagBrief.jsx';
import BlockView         from 'vntd-root/pages/wall/BlockView.jsx';
import TransactionView   from 'vntd-root/pages/wall/TransactionView.jsx';

import { EtherBaseAcct }          from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import { EtherStore, EthAccount } from 'vntd-root/stores/EtherStore.jsx';

class EtherAccount extends BaseMedia
{
    constructor(props) {
        super(props);
        this.style = {
            width: 64
        };
    }

    getArg() {
        return this.props.account;
    }

    getDetailKV(acct) {
        return [ {
            key: 'Public Key',
            val: acct.Account
        }, {
            key: 'Public Name',
            val: acct.getName()
        }, {
            key: 'Balance',
            val: acct.getMoneyBalance()
        }, {
            key: 'Transactions',
            val: 'Work in progress...'
        } ];
    }

    renderMediaBox(acct) {
        return <QRCode value={acct.Account} style={this.style}/>;
    }

    renderMediaBody(acct) {
        return (
            <div>
                <h4>{acct.acctName}</h4>
                {acct.getMoneyBalance()}
            </div>
        );
    }
}

class EtherExchange extends BaseMedia
{
    constructor(props) {
        super(props);
    }

    getArg() {
        return EthAccount.getExchangeRate();
    }

    getDetailKV(rate) {
        return [ {
            key: '1 T$',
            val: rate.HAO2TD + " hao"
        }, {
            key: '1 hao',
            val: rate.XU2HAO + " xu"
        } ];
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-6 col-xs-6 col-md-4 col-lg-4">
                    {this.renderDetail(this.getArg())}
                </div>
                <div className="col-sm-6 col-xs-6 col-md-4 col-lg-4">
                </div>
                <div className="col-sm-6 col-xs-6 col-md-4 col-lg-4">
                </div>
            </div>
        );
    }
}

class EtherPane extends EtherBaseAcct
{
    constructor(props) {
        super(props);
        this._acctClick  = this._acctClick.bind(this);
        this.renderFull  = this.renderFull.bind(this);
        this.renderBrief = this.renderBrief.bind(this);
        this.state = _.merge(this.state, {
            currAccount: null
        });
    }

    _acctClick(account) {
        if (this.state.currAccount != null) {
            // Toggle detail display.
            //
            account = null;
        }
        this.setState({
            currAccount: account
        });
        console.log("Ether pane detail " + this.state.currAccount);
    }

    renderBrief(account) {
        return <EtherAccount account={account} onClick={this._acctClick}/>;
    }

    renderFull(account) {
        let curr = this.state.currAccount;

        if ((curr == null) || (curr.Account !== account.Account)) {
            return null;
        }
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <EtherAccount account={account} detail={true} onClick={this._acctClick}/>
            </div>
        );
    }

    render() {
        let out, latestBlk, accounts = [];

        if (this.state.reserved == null) {
            return null;
        }
        EtherStore.iterEachIndex(function(acct) {
            accounts.push(acct);
        });
        latestBlk = EtherStore.getBlock(null);
        out = ArticleTagBrief.renderArtBox(accounts,
                    this.renderBrief, this.renderFull, true);

        return (
            <div className="row">
                <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                    <EtherExchange/>
                </div>
                <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                    {out}
                </div>
                <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                    <BlockView currBlk={latestBlk} latestNo={latestBlk.getBlkNum()}/>
                </div>
                <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                    <TransactionView currTx={0}/>
                </div>
            </div>
        )
    }
}

export default EtherPane;
