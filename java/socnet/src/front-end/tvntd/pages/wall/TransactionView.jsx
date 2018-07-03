/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import BaseMedia          from 'vntd-shared/layout/BaseMedia.jsx';
import BaseLinks          from 'vntd-shared/component/BaseLinks.jsx';

import { EtherBaseAcct }  from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';

class RenderTrans extends BaseMedia
{
    constructor(props) {
        super(props);
    }

    getDetailKV() {
        return null;
    }

    render() {
        <div className="media">
            <div className="media-left">
                <h3>Tx...</h3>
            </div>
        </div>
    }
}

class TransactionView extends EtherBaseAcct
{
    constructor(props) {
        super(props);
        this.state = _.merge(this.state, {
            currTx  : props.currTx,
            txDetail: false
        });
        this.renderFull  = this.renderFull.bind(this);
        this.renderBreif = this.renderBrief.bind(this);
        this._clickTrans = this._clickTrans.bind(this);
    }

    _clickTrans(where) {
    }

    renderBrief(tx) {
        return null;
    }

    renderFull(tx) {
        return null;
    }

    render() {
        let out, currTx = this.state.currTx;

        out = ArticleTagBrief.renderArtBox([out], this.renderBrief, this.renderFull,
                false, "col-xs-12 col-sm-12 col-md-12 col-sm-12 padding-5");

        return (
            <div>
                <BaseLinks leftTitle="Prev" centerTitle="Transaction Detail"
                    rightTitle="Next" onClick={this._clickTrans}/>
                <h2>Work in progress...</h2>
                {out}
            </div>
        );
    }
}

export default TransactionView;
