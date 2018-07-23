/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import WalletStore        from 'vntd-root/stores/WalletStore.jsx';

class Wallet extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
    }

    _updateState(store, data, where, code) {
        super._updateState(store, data, where, code);
    }

    render() {
        return (
            <h1>Personal wallet</h1>
        );
    }
}

export default Wallet;
