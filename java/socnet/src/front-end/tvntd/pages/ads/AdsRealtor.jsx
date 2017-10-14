/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import Spinner            from 'react-spinjs';
import React, {PropTypes} from 'react-mod';

import {
    Map, Marker, InfoWindow, GoogleApiWrapper
} from 'google-maps-react';
import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';

export class MapContainer extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: true,
            activeMarker     : {},
            selectedPlace    : {}
        };

        this._onMarkerClick  = this._onMarkerClick.bind(this);
        this._onInfoWinClose = this._onInfoWinClose.bind(this);
    }

    _onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace : props,
            activeMarker  : marker
        });
    }

    _onInfoWinClose() {
    }

    render() {
        console.log(this.props);
        return (
            <Map google={this.props.google} zoom={14}
                initialCenter={{
                    lat: 40.854885,
                    lng: -88.081807
                }}
            >
                <Marker onClick={this._onMarkerClick} name="My Location"/>
                <InfoWindow onClose={this._onInfoWinClose}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

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
            <MapContainer google={this.props.google}/>
        );
    }
}

AdsRealtor.propTypes = {
};

export default GoogleApiWrapper({
    version  : "3.28",
    apiKey   : "AIzaSyD2c0dE19Ubh3F5wgkuI-y_jnvKFAd2NDo",
    libraries: [ "places", "visualization" ]
})(AdsRealtor);
