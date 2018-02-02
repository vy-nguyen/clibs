/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import BoostCheckout      from 'vntd-shared/component/BoostCheckout.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';

class Catalog extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
    }

    render() {
        return <BoostCheckout id="shopping-cart"/>;
    }
}

export default Catalog;
