/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import { QRCode }        from 'react-qr-svg';

import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';
import { EtherBaseAcct } from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import EtherStore        from 'vntd-root/stores/EtherStore.jsx';
import ArticleTagBrief   from 'vntd-root/components/ArticleTagBrief.jsx';

class EtherAccount extends React.Component
{
    constructor(props) {
        super(props);
        this.style = {
            width: 64
        };
        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        if (this.props.onClick != null) {
            this.props.onClick(this.props.account);
        }
    }

    render() {
        let acct = this.props.account;
        return (
            <div className="media" onClick={this._onClick}>
                <div className="media-left">
                    <QRCode value={acct.Account} style={this.style}/>
                </div>
                <div className="media-body">
                    <h4>{acct.acctName}</h4>
                    {acct.getMoneyBalance()}
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
        this.setState({
            currAccount: account
        });
    }

    renderBrief(account) {
        return <EtherAccount account={account} onClick={this._acctClick}/>;
    }

    renderFull(account) {
        let curr = this.state.currAccount;

        if ((curr == null) || (curr.Account !== account.Account)) {
            return null;
        }
        console.log(this.state);
        console.log("compare true....");
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            </div>
        );
    }

    render() {
        let out, accounts = [];

        if (this.state.reserved == null) {
            return null;
        }
        EtherStore.iterEachIndex(function(acct) {
            accounts.push(acct);
        });
        out = ArticleTagBrief.renderArtBox(accounts,
                    this.renderBrief, this.renderFull, 4);

        return (<div>{out}</div>);
    }
}

export default EtherPane;
