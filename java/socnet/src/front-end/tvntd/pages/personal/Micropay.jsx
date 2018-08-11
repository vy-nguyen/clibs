/**
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React            from 'react-mod';
import WalletStore      from 'vntd-root/stores/WalletStore.jsx';

import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class MicropayForm extends FormData
{
    constructor(props, suffix, owner) {
        super(props, suffix);
        this.initData();
    }

    initData() {
    }
}

class Micropay extends ComponentBase
{
    constructor(props) {
        super(props, null, WalletStore);
    }

    render() {
        return null;
    }
}

export default Micropay;
