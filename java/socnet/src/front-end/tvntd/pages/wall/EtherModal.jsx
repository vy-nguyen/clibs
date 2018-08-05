/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';
import Spinner   from 'react-spinjs';

import ModalBox                   from 'vntd-shared/layout/ModalBox.jsx';
import BaseMedia                  from 'vntd-shared/layout/BaseMedia.jsx';
import EtherBlock                 from 'vntd-root/pages/wall/EtherBlock.jsx';
import EtherAccount               from 'vntd-root/pages/wall/EtherAccount.jsx';
import { VntdGlob }               from 'vntd-root/config/constants.js';
import { EtherStore, EthAccount } from 'vntd-root/stores/EtherStore.jsx';

class EtherModal extends ModalBox
{
    constructor(props) {
        super(props, "etherModal", EtherStore);
        this.switchData = this.switchData.bind(this);

        if (props != null) {
            this.state = _.merge(props, this.state);
        }
    }

    _updateState(arg) {
        let state = this.state, where = arg.getCaller();

        switch(where) {
        case 'start':
        case 'fetch':
            this._newBlockFetched(state);
            this._newAccountFetched(state);
            break;

        case 'fetch-block':
            this._newBlockFetched(state);
            break;

        case 'fetch-acct':
            this._newAccountFetched(state);
            break;
        }
    }

    _newAccountFetched(state) {
        if (state.account == null || state.type != "acct") {
            return;
        }
        this.switchData(state.type, state.account);
    }

    _newBlockFetched(state) {
        let blk, hash, busy = state.busy;

        if (state.blkHash == null) {
            return;
        }
        hash = state.blkHash;
        blk = EtherStore.getBlockHash(hash);
        if (blk != null) {
            busy = false;
            hash = null;
        } else {
            blk  = state.data;
        }
        this.setState({
            busy   : busy,
            blkHash: hash,

            title: "Block Detail",
            type : 'block',
            data : blk
        });
    }

    openModal(arg) {
        this.switchData(arg.type, arg.data);
        super.openModal(arg);
    }

    switchData(type, data) {
        let title;

        if (type === 'trans') {
            title = "Transaction Detail";

        } else if (type === 'block') {
            let blk = EtherStore.getBlockHash(data);

            if (blk == null) {
                this.setState({
                    busy   : true,
                    blkHash: data,
                    title  : "Getting block " + data.substring(0, 6) + "..."
                });
                return;
            }
            data  = blk;
            title = "Block Detail";

        } else if (type === 'acct') {
            let acct = EtherStore.getAccount(data);

            if (acct == null) {
                this.setState({
                    busy   : true,
                    type   : type,
                    account: data,
                    title  : "Getting account " + data.substring(0, 6) + "..."
                });
                EtherStore.fetchMissingAccts();
                return;
            }
            data = acct;
            title = "Account detail";

        } else {
            return;
        }
        this.setState({
            busy : false,
            title: title,
            type : type,
            data : data
        });
    }

    _renderMain() {
        if (this.state == null) {
            return null;
        }
        let spin = null, out = null, arg = this.state;

        if (arg.type === 'trans') {
            out = (
                <TransactionDetail trans={arg.data}
                    switchData={this.switchData} detail={true}/>
            );
        } else if (arg.type === 'acct') {
            out = (
                <EtherAccount account={arg.data}
                    switchData={this.switchData} full={true}/>
            );

        } else if (arg.type === 'block') {
            out = (
                <EtherBlock block={arg.data}
                    switchData={this.switchData} detail={true}/>
            );
        }
        if (arg.busy === true) {
            spin = <Spinner config={VntdGlob.spinner}/>;
        }
        return (
            <div>
                {out}
                {spin}
            </div>
        );
    }
}

class TransactionDetail extends BaseMedia
{
    constructor(props) {
        super(props);
        this._blockClick  = this._blockClick.bind(this);
        this._toAccount   = this._toAccount.bind(this);
        this._fromAccount = this._fromAccount.bind(this);
    }

    _blockClick() {
        this.props.switchData('block', this.props.trans.getBlockHash());
    }

    _fromAccount() {
        this.props.switchData('acct', this.props.trans.getFromAcct());
    }

    _toAccount() {
        this.props.switchData('acct', this.props.trans.getToAcct());
    }

    getArg() {
        return this.props.trans;
    }

    getDetailKV(trans) {
        return [ {
            key: 'Block',
            val: <a onClick={this._blockClick}>{trans.getBlockHash()}</a>
        }, {
            key: 'From',
            val: <a onClick={this._fromAccount}>{trans.getFromAcct()}</a>
        }, {
            key: 'To',
            val: <a onClick={this._toAccount}>{trans.getToAcct()}</a>
        }, {
            key: 'Value',
            val: trans.getAmountFmt()
        }, {
            key: 'Time',
            val: trans.getTimeStamp()
        }, {
            key: 'Nonce',
            val: trans.nonce
        }, {
            key: 'Input',
            val: trans.input
        }, {
            key: 'R',
            val: trans.r
        }, {
            key: 'S',
            val: trans.s
        }, {
            key: 'V',
            val: trans.v
        } ];
    }

    renderDetail(trans) {
        return super.renderDetail(trans);
    }
}

export default EtherModal;
