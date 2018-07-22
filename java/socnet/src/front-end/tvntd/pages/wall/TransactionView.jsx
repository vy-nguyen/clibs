/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import { EtherBaseAcct }  from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import TransactionTable   from 'vntd-root/pages/wall/TransactionTable.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';

class TransactionView extends EtherBaseAcct
{
    constructor(props) {
        super(props);
        this.state = _.merge(this.state, {
            currTx  : props.currTx,
            txDetail: false
        });
    }

    render() {
        let currTx = EtherStore.getTransaction(this.state.currTx);

        return (
            <div>
                <TransactionTable trans={currTx}/>
            </div>
        );
    }
}

export default TransactionView;
