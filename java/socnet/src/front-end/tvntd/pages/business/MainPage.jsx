/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';
import Spinner            from 'react-spinjs';

import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import asyncLoader        from 'vntd-shared/lib/AsyncLoader.jsx';
import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';

class BusinessMain extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [AuthorStore]);
    }

    render() {
        console.log("Render business main");
        console.log(this.props);
        return (
            <div id="content">
                <h1>Business Page</h1>
            </div>
        )
    }
}

export default asyncLoader("business-page", "/rs/client/business.js")(BusinessMain);
