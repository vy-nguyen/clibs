/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import Spinner            from 'react-spinjs';
import React, {PropTypes} from 'react-mod';

import Map                from 'vntd-shared/google-map/Map.jsx';
import Marker             from 'vntd-shared/google-map/Marker.jsx';
import InfoWindow         from 'vntd-shared/google-map/InfoWindow.jsx';
import {GoogleApiLoad}    from 'vntd-shared/lib/AsyncLoader.jsx';
import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';

export class MapContainer extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: true,
            activeMarker     : {},
            selectedPlace    : {},
            initialCenter    : {
                lat: 37.774929,
                lng: -122.419416
            }
        };
        console.log("constructor, reset ...");
        this._onMarkerClick  = this._onMarkerClick.bind(this);
        this._onInfoWinClose = this._onInfoWinClose.bind(this);
    }

    _onMarkerClick(props, marker, e) {
        console.log("on marker click");
        console.log(props);

        this.setState({
            selectedPlace : props,
            activeMarker  : marker
        });
    }

    _onInfoWinClose() {
    }

    componentWillMount() {
        let geocoder = this.geocoder, google = this.props.google;

        if (google == null) {
            return;
        }
        if (geocoder == null) {
            this.geocoder = geocoder = new google.maps.Geocoder();
        }
        geocoder.geocode({
            address: "Pleasanton, CA"
        }, function(results, status) {
            console.log("Lookup pleasanton address");
            let loc = results[0].geometry.location,
                cord = {
                    lat: loc.lat(),
                    lng: loc.lng()
                };
            console.log(cord);
            console.log("$$$$$");
            this.setState({
                initialCenter: cord
            });
        }.bind(this));
    }

    render() {
        let style = {
            width: '100vw',
            height: '600px'
        };
        console.log("---------------");
        console.log(this.state);
        return (
            <Map google={this.props.google} zoom={14}
                draggable={true} clickableIcons={true}
                style={style} initialCenter={this.state.initialCenter}>
                <Marker onClick={this._onMarkerClick}
                    draggable={true} title="I'm here"
                    label="My Location"/>
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
        console.log("ads realtor render");
        return (
            <MapContainer google={this.props.google}/>
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
