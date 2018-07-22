/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import { QRCode }        from 'react-qr-svg';

import BaseMedia         from 'vntd-shared/layout/BaseMedia.jsx';

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

export default EtherAccount;
