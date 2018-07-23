/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import WalletStore        from 'vntd-root/stores/WalletStore.jsx';

class AddressBook extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
    }

    render() {
        return null;
    }
}

export default AddressBook;
