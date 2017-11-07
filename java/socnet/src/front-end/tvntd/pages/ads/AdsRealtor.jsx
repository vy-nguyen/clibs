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

class MapMarker extends React.Component
{
    constructor(props) {
        super(props);

        this._onMarkerClick  = this._onMarkerClick.bind(this);
    }

    _onMarkerClick(props, marker, e) {
        console.log("on marker click");
        console.log(props);
        console.log(marker);

        this.setState({
            selectedPlace: props,
            activeMarker : marker
        });
    }

    render() {
        let marker = this.props.marker,
        pos = {
            lat: marker.lat,
            lng: marker.lng
        };
        console.log(marker);
        return (
            <Marker map={this.props.map} google={this.props.google}
                onClick={this._onMarkerClick}
                draggable={true} title="abc" position={pos} />
        );
    }
}

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
        this._onInfoWinClose = this._onInfoWinClose.bind(this);
        this._onBoundChange  = this._onBoundChange.bind(this);
    }

    _onInfoWinClose() {
    }

    _onBoundChange(props, mapObj, e) {
        console.log("On bound change...");
        console.log(props);
        console.log(mapObj);
        console.log(e);
    }

    componentWillMount() {
        let geocoder = this.geocoder, google = this.props.google;

        if (google == null) {
            return;
        }
        if (geocoder == null) {
            this.geocoder = geocoder = new google.maps.Geocoder();
        }
            /*
        geocoder.geocode({
            address: "Pleasanton, CA"
        }, function(results, status) {
            console.log("Lookup pleasanton address");
            let loc = results[0].geometry.location,
                cord = {
                    lat: loc.lat(),
                    lng: loc.lng()
                };
            this.setState({
                initialCenter: cord
            });
        }.bind(this));
             */
    }

    render() {
        let style = {
            width: '100vw',
            height: '600px'
        };
        let ads = AdPropertyStore.getAllAds(), markers = [], ex = null, center;

        _.forOwn(ads, function(a) {
            if (ex == null) {
                ex = a;
            }
            markers.push(<MapMarker marker={a}/>);
        });
        center = {
            lat: ex.lat,
            lng: ex.lng
        };

        return (
            <Map google={this.props.google} zoom={14}
                draggable={true} clickableIcons={true}
                onBoundsChanged={this._onBoundChange}
                onHeadingChange={this._onBoundChange}
                onDragend={this._onBoundChange}
                style={style} initialCenter={ex}>
                {markers}
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
