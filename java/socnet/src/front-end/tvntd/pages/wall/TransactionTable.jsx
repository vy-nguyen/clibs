/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import DynamicTable       from 'vntd-root/components/DynamicTable.jsx';
import EtherModal         from 'vntd-root/pages/wall/EtherModal.jsx';

class TransactionTable extends React.Component
{
    constructor(props) {
        super(props);
        this._cellClick = this._cellClick.bind(this);

        this.tabHeader = [ {
            key   : "txHash",
            header: Lang.translate("Transaction Id")
        }, {
            key   : "fromAcct",
            header: Lang.translate("From")
        }, {
            key   : "toAcct",
            header: Lang.translate("To")
        }, {
            key   : "tstamp",
            header: Lang.translate("Date")
        }, {
            key   : "amount",
            header: Lang.translate("Amount")
        } ];
    }

    _cellClick(cellArg) {
        this.refs.modal.openModal(cellArg);
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

    _renderWithLink() {
        let title = this.props.title || "Recent Transactions";
        return (
            <DynamicTable tableFormat={this.tabHeader} sortCol={4}
                tableData={this._getTableData()}
                tableTitle={Lang.translate(title)}
                tableId={_.uniqueId("trans-")}
                cellClick={this._cellClick}>
                <EtherModal ref="modal" modal={true}/>
            </DynamicTable>
        );
    }

    _getTableNoLink() {
        let data = [], trans = this.props.trans;

        _.forOwn(trans, function(t) {
            data.push({
                txHash  : t.getTxHashBrief(),
                fromAcct: EtherStore.getAccountName(t.getFromAcct()),
                toAcct  : EtherStore.getAccountName(t.getToAcct()),
                rowId   : t.getTxHash(),
                amount  : t.getAmountFmt(),
                tstamp  : t.getTimeStamp()
            });
        });
        return data;
    }

    _renderNoLink() {
        return (
            <DynamicTable tableFormat={this.tabHeader} sortCol={4} sortMode="dsc"
                tableData={this._getTableNoLink()}
                tableTitle={Lang.translate(this.props.title)}
                tableId={_.uniqueId("trans-")}>
            </DynamicTable>
        );
    }

    render() {
        if (this.props.nolink === true) {
            return this._renderNoLink();
        }
        return this._renderWithLink();
    }
}

export default TransactionTable;
