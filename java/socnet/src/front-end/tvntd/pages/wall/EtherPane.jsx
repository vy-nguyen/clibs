/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import { QRCode }        from 'react-qr-svg';
import { EtherBaseAcct } from 'vntd-root/pages/wall/EtherCrumbs.jsx';

class EtherAccount extends React.Component
{
    constructor(props) {
        super(props);
        this.style = {
            width: 64
        };
    }

    render() {
        let acct = this.props.account;
        console.log(acct);
        return (
            <li>
            <span>
                <QRCode value={acct.Account} style={this.style}/>
                {acct.acctName}
                {acct.getMoneyBalance()}
            </span>
            </li>
        );
    }
}

class EtherPane extends EtherBaseAcct
{
    constructor(props) {
        super(props);
    }

    render() {
        let reserved = this.state.reserved, community = this.state.community;

        if (reserved == null) {
            return null;
        }
        return (
            <ul className="list-inline">
                <EtherAccount account={reserved}/>
                <EtherAccount account={community}/>
            </ul>
        );
    }
}

export default EtherPane;
