/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import {renderToString}   from 'react-dom-server';

import BaseMedia          from 'vntd-shared/layout/BaseMedia.jsx';
import BaseLinks          from 'vntd-shared/component/BaseLinks.jsx';

import { EtherBaseAcct }  from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import DynamicTable       from 'vntd-root/components/DynamicTable.jsx';

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

class TransactionTable extends React.Component
{
    constructor(props) {
        super(props);
        this._cellClick = this._cellClick.bind(this);

        this.tabHeader = [ {
            key   : "txHash",
            format: "",
            header: Lang.translate("Transaction Id")
        }, {
            key   : "fromAcct",
            format: "",
            header: Lang.translate("From")
        }, {
            key   : "toAcct",
            format: "",
            header: Lang.translate("To")
        }, {
            key   : "tstamp",
            format: "",
            header: Lang.translate("Date")
        }, {
            key   : "amount",
            format: "",
            header: Lang.translate("Amount")
        } ];
    }

    _cellClick(cellArg) {
        console.log("click on tx ");
        console.log(cellArg);
    }

    _getTableData() {
        let tx, txLink, data = [], trans = this.props.trans;

        _.forOwn(trans, function(t) {
            let fr = t.getFromAcct(), to = t.getToAcct();

            data.push({
                txHash  : {
                    cellArg : { type: 'trans', data: t },
                    cellData: t.getTxHashBrief()
                },
                fromAcct: {
                    cellArg : { type: 'acct', data: fr },
                    cellData: EtherStore.getAccountName(fr)
                },
                toAcct  : {
                    cellArg : { type: 'acct', data: to },
                    cellData: EtherStore.getAccountName(to)
                },
                rowId : t.getTxHash(),
                amount: t.getAmountFmt(),
                tstamp: t.getTimeStamp()
            });
        }.bind(this));
        return data;
    }

    render() {
        return (
            <DynamicTable tableFormat={this.tabHeader}
                tableData={this._getTableData()}
                tableTitle={Lang.translate("Recent Transactions")}
                tableId={_.uniqueId("trans-")}
                cellClick={this._cellClick}
            >
            </DynamicTable>
        );
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

    _updateEthAcct(store, data, where) {
        super._updateEthAcct(store, data);
    }

    _clickTrans(where) {
        if (where === "c") {
            this.setState({
                txDetail: true
            });
            return;
        }
    }

    renderBrief(tx) {
        console.log("render tx");
        console.log(tx);
        return null;
    }

    renderFull(tx) {
        return null;
    }

    render() {
        let out, currTx = EtherStore.getTransaction(this.state.currTx);

        /*
        out = ArticleTagBrief.renderArtBox(currTx, this.renderBrief, this.renderFull,
                false, "col-xs-12 col-sm-12 col-md-12 col-sm-12 padding-5");
                <BaseLinks leftTitle="Prev" centerTitle="Recent Transactions"
                    rightTitle="Next" onClick={this._clickTrans}/>
*/
        return (
            <div>
                <TransactionTable trans={currTx}/>
            </div>
        );
    }
}

export default TransactionView;
