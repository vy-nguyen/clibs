/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import WalletStore        from 'vntd-root/stores/WalletStore.jsx';

class Payment extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
    }

    render() {
        console.log(this.props);
        return (
            <div className="row">
                <h2>Payment box</h2>
            </div>
        );
    }
}

export default Payment;
