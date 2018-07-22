/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React              from 'react-mod';

import BaseMedia          from 'vntd-shared/layout/BaseMedia.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import TransactionTable   from 'vntd-root/pages/wall/TransactionTable.jsx';

class EtherBlock extends BaseMedia
{
    constructor(props) {
        super(props);
        this._blockClick = this._blockClick.bind(this);
    }

    getArg() {
        return this.props.block;
    }

    _blockClick() {
        if (this.props.switchData != null) {
            this.props.switchData('block', this.props.block.parentHash);
        }
    }

    getDetailKV(block) {
        return [ {
            key: 'Block',
            val: block.getBlkNum()
        }, {
            key: 'Timestamp',
            val: block.getTimestamp()
        }, {
            key: 'Hash',
            val: block.hash
        }, {
            key: 'Parent Hash',
            val: <a onClick={this._blockClick}>{block.parentHash}</a>
        }, {
            key: 'Sha3Uncles',
            val: <a onClick={this._blockClick}>{block.sha3Uncles}</a>
        }, {
            key: 'Miner',
            val: block.getMiner(true)
        }, {
            key: 'Nonce',
            val: block.nonce
        }, {
            key: 'Size',
            val: block.size
        }, {
            key: 'Transactions',
            val: block.getTransCount()
        } ];
    }

    renderDetail(block) {
        let tab = null;

        if (block.getTransCount() > 0) {
            let trans = EtherStore.getTransObject(block.getTransactions());
            tab = <TransactionTable title="Transactions" trans={trans}/>;
        }
        return (
            <div>
                {super.renderDetail(block)}
                {tab}
            </div>
        );
    }

    renderMediaBox(block) {
        return (
            <h3>{block.getBlkNum()}</h3>
        );
    }

    renderMediaBody(block) {
        return (
            <div>
                <span>Mined by {block.getMiner(true)}</span>
                <div>Sealed {block.getMoment()}</div>
                <div>Transactions {block.getTransCount()}</div>
            </div>
        );
    }
}

export default EtherBlock;
