/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import Spinner            from 'react-spinjs';

import BaseLinks          from 'vntd-shared/component/BaseLinks.jsx';
import BaseMedia          from 'vntd-shared/layout/BaseMedia.jsx';

import { VntdGlob }       from 'vntd-root/config/constants.js';
import { EtherBaseAcct }  from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import EtherBlock         from 'vntd-root/pages/wall/EtherBlock.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';

class BlockView extends EtherBaseAcct
{
    constructor(props) {
        super(props);
        this.state = _.merge(this.state, {
            currBlk  : props.currBlk,
            latestNo : props.latestNo,
            fetchBlk : null,
            blkDetail: false
        });
        this.fetchTry     = 0;
        this.renderFull   = this.renderFull.bind(this);
        this.renderBrief  = this.renderBrief.bind(this);
        this._clickButton = this._clickButton.bind(this);
        this._clickBlock  = this._clickBlock.bind(this);
    }
  
    _updateEthAcct(store, data, where) {
        super._updateEthAcct(store, data);

        let block, state = this.state;
        if (where == 'fetch' && state.fetchBlk != null) {
            block = EtherStore.fetchBlock(state.fetchBlk);
            if (block == null) {
                this.fetchTry++;
                console.log("Retry ?");
                return;
            }
            this.setState({
                currBlk : block,
                fetchBlk: null
            });
        }
    }

    _clickButton(where) {
        if (where === "c") {
            this.setState({
                blkDetail: !this.state.blkDetail
            });
            return;
        }
        let blkNo, block, currBlk = this.state.currBlk;

        if (currBlk == null || this.state.fetchBlk != null) {
            return;
        }
        blkNo = currBlk.getBlkNum();
        if (where == 'l') {
            if (blkNo === 0) {
                return;
            }
            blkNo--;
        } else {
            if (blkNo === this.state.latestNo) {
                return;
            }
            blkNo++;
        }
        block = EtherStore.fetchBlock(blkNo);
        if (block != null) {
            this.setState({
                currBlk : block,
                fetchBlk: null
            });
        } else {
            this.setState({
                fetchBlk: blkNo
            });
        }
    }

    _clickBlock() {
        this._clickButton('c');
    }

    renderBrief(block) {
        return <EtherBlock block={block} onClick={this._clickBlock}/>;
    }

    renderFull(block) {
        if (this.state.blkDetail !== true) {
            return null;
        }
        return <EtherBlock block={block} detail={true} onClick={this._clickBlock}/>;
    }

    render() {
        let out, blkNo,
            left = "Prev", right = "Next", curr = this.state.currBlk, busy = null;

        if (curr == null || this.state.fetchBlk != null) {
            busy = <Spinner config={VntdGlob.spinner}/>;
            if (curr == null) {
                return busy;
            }
        }
        blkNo = curr.getBlkNum();
        if (blkNo === this.state.latestNo) {
            right = null;
        }
        if (blkNo === 0) {
            left = null;
        }
        out = ArticleTagBrief.renderArtBox([curr], this.renderBrief, this.renderFull,
                    false, "col-xs-12 col-sm-12 col-md-12 col-sm-12 padding-5");

        return (
            <div>
                <BaseLinks leftTitle={left} centerTitle="Block Detail"
                    rightTitle={right} onClick={this._clickButton}/>
                {busy}
                {out}
            </div>
        );
    }
}

export default BlockView;
