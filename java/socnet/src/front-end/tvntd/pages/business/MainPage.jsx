/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import ImageCarousel      from 'vntd-shared/layout/ImageCarousel.jsx';
import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import ShowCase           from 'vntd-shared/widgets/ShowCase.jsx';
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

    _renderShowCase() {
        return (
            <div id="show-case">
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                        <ShowCase/>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let { carosel } = this.state;

        if (carosel == null) {
            return null;
        }
        return (
            <div id="content">
                <ImageCarousel imageList={carosel}/>
                {this._renderShowCase()}
                <h1>Business Page</h1>
            </div>
        );
    }
}

export default BusinessMain;

// export default asyncLoader("business-page", "/rs/client/business.js")(BusinessMain);
