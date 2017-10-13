/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import Spinner            from 'react-spinjs';
import React, {PropTypes} from 'react-mod';

import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';

class AdsRealtor extends React.Component
{
    constructor(props) {
        super(props);
        this._updateAds = this._updateAds.bind(this);
    }

    componentDidMount() {
        this.unsub = AdPropertyStore.listen(this._updateAds);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateAds(store, data, elm, status) {
    }

    render() {
        return (
            <Spinner config={VntdGlob.spinner}/>
        );
    }
}

AdsRealtor.propTypes = {
};

export default AdsRealtor;
