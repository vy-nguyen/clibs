/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import BaseLinks          from 'vntd-shared/component/BaseLinks.jsx';
import KeyValueTable      from 'vntd-shared/layout/KeyValueTable.jsx';

import { EtherBaseAcct }  from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';

class RenderBlock extends React.Component
{
    constructor(props) {
        super(props);
    }

    renderFull() {
        let block = this.props.block,
            blockKV = [ {
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

        return (
            <KeyValueTable keyValueList={blockKV} oddRowKeyFmt=" " evenRowKeyFmt=" "/>
        );
    }

    render() {
        let block = this.props.block;

        if (block == null) {
            return null;
        }
        if (this.props.detail == true) {
            return this.renderFull();
        }
        return (
            <div className="media">
                <div className="media-left">
                    <h3>{block.getBlkNum()}</h3>
                </div>
                <div className="media-body">
                    <span>Mined by {block.getMiner()}</span>
                    <div>Sealed {block.getMoment()}</div>
                    <div>Transactions {block.getTransCount()}</div>
                </div>
            </div>
        );
    }
}

class BlockView extends EtherBaseAcct
{
    constructor(props) {
        super(props);
        this.state = _.merge(this.state, {
            currBlk  : props.currBlk,
            latestNo : props.latestNo,
            blkDetail: false
        });
        this.renderFull  = this.renderFull.bind(this);
        this.renderBrief = this.renderBrief.bind(this);
        this._clickBlock = this._clickBlock.bind(this);
    }
   
    _clickBlock(where) {
        if (where === "c") {
            this.setState({
                    blkDetail: !this.state.blkDetail
            });
        } else if (where == 'l') {
        } else {
        }
    }

    renderBrief(block) {
        return <RenderBlock block={block}/>;
    }

    renderFull(block) {
        if (this.state.blkDetail === true) {
            return <RenderBlock block={block} detail={true}/>;
        }
        return null;
    }

    render() {
        let curr = this.state.currBlk, out;

        if (curr == null) {
            return null;
        }
        out = ArticleTagBrief.renderArtBox([curr], this.renderBrief, this.renderFull,
                    false, "col-xs-12 col-sm-12 col-md-12 col-sm-12 padding-5");

        return (
            <div>
                <BaseLinks leftTitle="Prev" centerTitle="Block Detail"
                    rightTitle="Next" onClick={this._clickBlock}/>
                {out}
            </div>
        );
    }
}

export default BlockView;
