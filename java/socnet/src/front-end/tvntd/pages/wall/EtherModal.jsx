/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';

import ModalBox                   from 'vntd-shared/layout/ModalBox.jsx';
import BaseMedia                  from 'vntd-shared/layout/BaseMedia.jsx';
import { EtherStore, EthAccount } from 'vntd-root/stores/EtherStore.jsx';

class EtherModal extends ModalBox
{
    constructor(props) {
        super(props);
        this._switchData = this._switchData.bind(this);
    }

    openModal(arg) {
        if (arg.type === 'trans') {
            this.setState({
                title: "Transaction Detail"
            });
            super.openModal(arg);
        }
    }

    _switchData(type, data) {
        let title;

        if (type === 'trans') {
            title = "Transaction Detail";
        } else if (type === 'block') {
            title = "Block Detail";
        }
        this.setState({
            title: title
        });
        console.log("switch data " + type + " data " + data);
    }

    _renderMain() {
        if (this.state == null) {
            return null;
        }
        let arg = this.state;

        if (arg.type === 'trans') {
            return (
                <TransactionDetail trans={arg.data}
                    switchData={this._switchData} detail={true}/>
            );
        }
        return <h1>Main</h1>;
    }
}

class TransactionDetail extends BaseMedia
{
    constructor(props) {
        super(props);
        this._blockClick = this._blockClick.bind(this);
    }

    _blockClick() {
        this.props.switchData('block', this.props.trans.getBlockHash());
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
            val: trans.getFromAcct()
        }, {
            key: 'To',
            val: trans.getToAcct()
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
