/**
 * Code modified from https://github.com/fullstackreact/google-maps-react
 */
'use strict';

import React        from 'react-mod';
import PropTypes    from 'prop-types';
import MapBase      from './MapBase.jsx';

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
    paths        : PropTypes.array,
    strokeColor  : PropTypes.string,
    strokeOpacity: PropTypes.number,
    strokeWeight : PropTypes.number,
    fillColor    : PropTypes.string,
    fillOpacity  : PropTypes.number
}

evtNames.forEach(function(e) {
    Polygon.propTypes[e] = PropTypes.func;
});

Polygon.defaultProps = {
    name: 'Polygon'
}

export default Polygon;
