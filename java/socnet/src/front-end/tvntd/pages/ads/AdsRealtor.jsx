/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import MapContainer       from 'vntd-shared/google-map/MapContainer.jsx';
import {GoogleApiLoad}    from 'vntd-shared/lib/AsyncLoader.jsx';

export class AdsRealtor extends React.Component
{
    render() {
        return (
            <MapContainer {...this.props}/>
            // <MapContainer center={this.props.center} google={this.props.google}/>
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
