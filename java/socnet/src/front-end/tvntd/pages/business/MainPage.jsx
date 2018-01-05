/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';
import Spinner            from 'react-spinjs';

import ImageCarousel      from 'vntd-shared/layout/ImageCarousel.jsx';
import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import asyncLoader        from 'vntd-shared/lib/AsyncLoader.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';

class BusinessMain extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
        this.state = BusinessStore.getMainPage();
    }

    _updateState(store, data, item, code) {
        this.setState(store.getMainPage());
    }

    render() {
        let { carosel } = this.state;

        if (carosel == null) {
            return null;
        }
        return (
            <div id="content">
                <ImageCarousel imageList={carosel}/>
                <h1>Business Page</h1>
            </div>
        );
    }
}

export default BusinessMain;

// export default asyncLoader("business-page", "/rs/client/business.js")(BusinessMain);
