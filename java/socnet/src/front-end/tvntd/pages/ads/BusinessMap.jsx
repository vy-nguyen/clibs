/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import Spinner         from 'react-spinjs';

import Map             from 'vntd-shared/google-map/Map.jsx';
import InfoWindow      from 'vntd-shared/google-map/InfoWindow.jsx';
import {GoogleApiLoad} from 'vntd-shared/lib/AsyncLoader.jsx';
import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import Mesg            from 'vntd-root/components/Mesg.jsx';
import {VntdGlob}      from 'vntd-root/config/constants.js';
import AdsBox          from 'vntd-root/pages/ads/AdsBox.jsx';

class BusinessMap extends React.Component
{
    constructor(props) {
        super(props);
        let ads = props.adsRec.getArticle();

        this.state = {
            ads: ads,
            lat: ads.lat == 0 ? null : ads.lat,
            lng: ads.lng == 0 ? null : ads.lng
        };
    }

    _renderInfo() {
        let ads = this.state.ads;
        return (
            <div className="padding-10">
                <h3>{ads.busName}</h3>
                <h4>{ads.busWeb} | {ads.busPhone}</h4>
                <h5>{AdsBox.businessAddr(ads)}</h5>
            </div>
        );
    }

    _renderMap(pos) {
        let style = {
            width   : '100vw',
            height  : '50vh',
            overflow: 'auto'
        };
        return (
            <div className="row" style={style}>
                <Map google={this.props.google} zoom={16} draggable={false}
                    clickableIcons={false} style={style}
                    ref="map" initialCenter={pos}>
                    <InfoWindow {...this.props} position={pos} visible={true}>
                        {this._renderInfo()}
                    </InfoWindow>
                </Map>
            </div>
        );
    }

    render() {
        let pos, ads = this.state.ads, google = this.props.google;

        pos = {
            lat: this.state.lat,
            lng: this.state.lng
        };
        if (pos.lat == null || pos.lng == null) {
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: 'San Francisco, CA'
            }, function(results, status) {
                let loc = results[0].geometry.location;
                this.setState({
                    lat: loc.lat(),
                    lng: loc.lng()
                });
            }.bind(this));
            return <Spinner config={VntdGlob.spinner}/>;
        }
        return this._renderMap(pos);
    }
}

export default GoogleApiLoad({
    version  : "3.28",
    apiKey   : "AIzaSyD2c0dE19Ubh3F5wgkuI-y_jnvKFAd2NDo",
    libraries: [ "places", "visualization" ]
})(BusinessMap);
