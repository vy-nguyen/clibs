/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import Spinner           from 'react-spinjs';
import { QRCode }        from 'react-qr-svg';

import BaseMedia         from 'vntd-shared/layout/BaseMedia.jsx';
import Actions           from 'vntd-root/actions/Actions.jsx';
import TransactionTable  from 'vntd-root/pages/wall/TransactionTable.jsx';
import Payment           from 'vntd-root/pages/personal/Payment.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import WalletStore       from 'vntd-root/stores/WalletStore.jsx';
import { VntdGlob }      from 'vntd-root/config/constants.js';

class EtherAccount extends BaseMedia
{
    constructor(props) {
        super(props, null, WalletStore);
        this.style = {
            width: 64
        };
        this._payClick    = this._payClick.bind(this);
        this._showTrans   = this._showTrans.bind(this);
        this._refreshAcct = this._refreshAcct.bind(this);
        this.paymentDone  = this.paymentDone.bind(this);

        this.state = _.merge(this.state, {
            activePay: false,
            showTrans: !this.props.pay
        });
    }

    _updateState(store, data, code, item) {
        console.log("Done refresh, code " + code);
        if (code === "error") {
            console.log(data);
        }
        this.setState({
            refresh: false
        });
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
        } ];
    }

    _payClick() {
        this.setState({
            activePay: !this.state.activePay
        });
    }

    _showTrans() {
        this.setState({
            showTrans: !this.state.showTrans
        });
    }

    paymentDone() {
        this.setState({
            activePay: false
        });
    }

    _refreshAcct() {
        Actions.getAccountInfo(this.props.account.getAccountNo(), true);
        this.setState({
            refresh: true
        });
    }

    renderMediaBox(acct) {
        return <QRCode value={acct.Account} style={this.style}/>;
    }

    renderMediaBody(acct) {
        let pay = null, spin = null;

        if (this.props.pay === true && 
            WalletStore.isMyAccount(acct.getAccountNo()) !== false) {
            pay = (
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={this._payClick}>
                        <Mesg text="Pay"/>
                    </button>
                    <button className="btn btn-success" onClick={this._showTrans}>
                        <Mesg text="Show Trans"/>
                    </button>
                    <button className="btn btn-info" onClick={this._refreshAcct}>
                        <Mesg text="Refresh"/>
                    </button>
                </div>
            );
        }
        if (this.state.refresh === true) {
            spin = <Spinner config={VntdGlob.spinner}/>;
        }
        return (
            <div className="row">
                {spin}
                <div className="col-sx-4 col-sm-4 col-md-4 col-lg-4">
                    <h4>{acct.acctName}</h4>
                    {acct.getMoneyBalance()}
                </div>
                <div className="col-sx-8 col-sm-8 col-md-8 col-lg-8">
                    {pay}
                </div>
            </div>
        );
    }

    renderDetail(acct) {
        let pay = null, trans = null;

        if (this.state.activePay === true) {
            pay = <Payment ref="caller" account={this.props.account}/>;
        }
        if (this.state.showTrans === true) {
            trans = (
                <div>
                    <TransactionTable title="From Transactions"
                        nolink={true} trans={acct.getTxFromArr()}/>
                    <TransactionTable title="To Transactions"
                        nolink={true} trans={acct.getTxToArr()}/>
                </div>
            );
        }
        return (
            <div>
                {pay}
                {super.renderDetail(acct)}
                {trans}
            </div>
        );
    }
}

export default EtherAccount;
