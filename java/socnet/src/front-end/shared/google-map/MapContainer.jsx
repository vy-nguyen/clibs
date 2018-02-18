/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import Modal              from 'react-modal';
import Spinner            from 'react-spinjs';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import Map                from 'vntd-shared/google-map/Map.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';
import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';

import {MapMarker, MarkerEntry} from 'vntd-shared/google-map/MapMarker.jsx';

export class MapContainer extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            markers: null
        };
        this._onBoundChange = this._onBoundChange.bind(this);
        this._onMarkerClick = this._onMarkerClick.bind(this);
        this._updateMarkers = this._updateMarkers.bind(this);
    }

    _onBoundChange(props, mapObj) {
        this.setState({
            markers: this._updateMarkers(mapObj.getBounds())
        });
    }

    _onMarkerClick(label, data) {
        this.refs[label].openModal();
    }

    componentDidMount() {
        let google = this.props.google;

        if (google == null) {
            return;
        }
        this.setState({
            markers: this._updateMarkers(null)
        });
    }

    _updateMarkers(bound) {
        if (bound == null) {
            let mapRefs = this.refs.map;

            if (mapRefs == null || mapRefs.map == null) {
                console.log(this);
                return null;
            }
            bound = mapRefs.map.getBounds();
        }
        if (bound == null) {
            return null;
        }
        let pos, data = this._getMapData(), markers = [];

        _.forOwn(data, function(item) {
            pos = {
                lat: item.lat,
                lng: item.lng
            };
            if (bound.contains(pos)) {
                markers.push(item);
            }
        });
        return markers;
    }

    // Override this to get different data.
    //
    _getMapData() {
        return AdPropertyStore.getAllAds();
    }

    // Override this method to render marker entry.
    //
    renderEntry(data, label) {
        return (
            <MarkerEntry marker={data} label={label} onClick={this._onMarkerClick}/>
        );
    }

    // Override this method to render the marker.
    //
    renderMarker(data, label) {
        return (
            <MapMarker ref={label} key={_.uniqueId()} marker={data} label={label}/>
        );
    }

    render() {
        let data = this.state.markers, markers = [], entries = [],
            label = 1, labelStr, center = this.props.center;

        if (data != null) {
            _.forOwn(data, function(a) {
                labelStr = label.toString();
                entries.push(
                    <li key={_.uniqueId()} className="padding-5">
                        {this.renderEntry(a, labelStr)}
                    </li>
                );
                markers.push(this.renderMarker(a, labelStr));
                label++;
            }.bind(this));
        }
        return (
            <div className="row" style={VntdGlob.styleMap}>
                <div className="col-md-2 col-lg-2 hidden-xs hidden-sm">
                    <ul className="list-inline" style={{fontSize: '12px'}}>
                        {entries}
                    </ul>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
                    <Map google={this.props.google} zoom={center.zoom}
                        draggable={true} clickableIcons={true}
                        onBoundsChanged={this._onBoundChange}
                        onHeadingChange={this._onBoundChange}
                        onDragend={this._onBoundChange}
                        onRecenter={this._onBoundChange}
                        style={VntdGlob.styleMap}
                        initialCenter={center} ref="map">
                        {markers}
                    </Map>
                </div>
            </div>
        );
    }
}

export default MapContainer;
