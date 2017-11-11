/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import MapContainer       from 'vntd-shared/google-map/MapContainer.jsx';
import {GoogleApiLoad}    from 'vntd-shared/lib/AsyncLoader.jsx';
import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';

export class AdsRealtor extends React.Component
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
            <MapContainer center={this.props.center} google={this.props.google}/>
        );
    }
}

AdsRealtor.propTypes = {
};

export default GoogleApiLoad({
    version  : "3.28",
    apiKey   : "AIzaSyD2c0dE19Ubh3F5wgkuI-y_jnvKFAd2NDo",
    libraries: [ "places", "visualization" ]
})(AdsRealtor);
