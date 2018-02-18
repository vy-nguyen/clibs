/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import BoostProduct       from 'vntd-shared/component/BoostProduct.jsx';
import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';

class Blog extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
    }

    render() {
        return (<BoostProduct/>);
    }
}

export default Blog;
