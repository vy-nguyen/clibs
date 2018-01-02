/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import React       from 'react-mod';

import BaseComponent from 'vntd-shared/layout/BaseComponent.jsx';
import BusinessStore from 'vntd-root/stores/BusinessStore.jsx';

class BoostTopBanner extends BaseComponent
{
    constructor(props) {
        super(props, null, [BusinessStore]);
    }

    render() {
        return null;
    }
}

export default BoostTopBanner;
