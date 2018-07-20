/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React              from 'react-mod';

import BaseMedia          from 'vntd-shared/layout/BaseMedia.jsx';

class EtherBlock extends BaseMedia
{
    constructor(props) {
        super(props);
    }

    getArg() {
        return this.props.block;
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
            val: block.parentHash
        }, {
            key: 'Sha3Uncles',
            val: block.sha3Uncles
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
