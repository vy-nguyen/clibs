/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';

class Product extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
    }

    render() {
        return (
            <div id="content">
                <h1>Product</h1>
                <h5>Param {this.props.params.name}</h5>
            </div>
        );
    }
}

export default Product;
