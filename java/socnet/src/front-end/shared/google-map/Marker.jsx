/**
 * Code modified from https://github.com/fullstackreact/google-maps-react
 */
'use strict';

import React        from 'react-mod';
import PropTypes    from 'prop-types';
import MapBase      from './MapBase.jsx';

const evtNames = [
    'click',
    'dblclick',
    'dragend',
    'mousedown',
    'mouseout',
    'mouseover',
    'mouseup',
    'recenter',
];

export class Marker extends MapBase
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.renderMarker();
    }

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.position !== prevProps.position) ||
            (this.props.icon !== prevProps.icon)) {
            if (this.marker) {
                this.marker.setMap(null);
            }
            this.renderMarker();
        }
    }

    componentWillUnmount() {
        if (this.marker) {
            this.marker.setMap(null);
        }
    }

    renderMarker() {
        let {
            map, google, position, mapCenter, icon, label, draggable, title
        } = this.props;

        if (!google) {
            return null
        }
        let pos = position || mapCenter;
        if (!(pos instanceof google.maps.LatLng)) {
            position = new google.maps.LatLng(pos.lat, pos.lng);
        }

        const pref = {
            map      : map,
            position : position,
            icon     : icon,
            label    : label,
            title    : title,
            draggable: draggable
        };
        this.marker = this.mapObj = new google.maps.Marker(pref);
        this._listenEvents(evtNames);
        return null;
    }

    getMarker() {
        return null;
    }
}

Marker.propTypes = {
    position: PropTypes.object,
    map     : PropTypes.object
}

evtNames.forEach(function(e) {
    Marker.propTypes[e] = PropTypes.func;
})

Marker.defaultProps = {
    name: 'Marker'
}

export default Marker;
