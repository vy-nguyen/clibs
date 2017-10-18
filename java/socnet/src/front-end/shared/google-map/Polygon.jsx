/**
 * Code modified from https://github.com/fullstackreact/google-maps-react
 */
'use strict';

import React, { PropTypes as T } from 'react-mod';
import MapBase from './MapBase.jsx';

const evtNames = ['click', 'mouseout', 'mouseover'];

export class Polygon extends MapBase
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.renderPolygon();
    }

    componentDidUpdate(prevProps) {
        if (this.props.map !== prevProps.map) {
            if (this.polygon) {
                this.polygon.setMap(null);
                this.renderPolygon();
            }
        }
    }

    componentWillUnmount() {
        if (this.polygon) {
            this.polygon.setMap(null);
        }
    }

    renderPolygon() {
        const { map, google, paths, strokeColor, strokeOpacity,
            strokeWeight, fillColor, fillOpacity
        } = this.props;

        if (!google) {
            return null;
        }
        const params = {
            map, paths, strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity
        };

        this.polygon = this.mapObj = new google.maps.Polygon(params);
        this._listenEvents(evtNames);
        return null;
    }

    getPolygon() {
        return null;
    }
}

Polygon.propTypes = {
    paths        : T.array,
    strokeColor  : T.string,
    strokeOpacity: T.number,
    strokeWeight : T.number,
    fillColor    : T.string,
    fillOpacity  : T.number
}

evtNames.forEach(function(e) {
    Polygon.propTypes[e] = T.func;
});

Polygon.defaultProps = {
    name: 'Polygon'
}

export default Polygon;
