/**
 * Code modified from https://github.com/fullstackreact/google-maps-react
 */
'use strict';

import React     from 'react-mod';
import PropTypes from 'prop-types';
import MapBase   from './MapBase.jsx';

const evtNames = ['click', 'mouseover', 'recenter'];

export class HeatMap extends MapBase
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // this.heatMapPromise = wrappedPromise();
        this.renderHeatMap();
    }

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.position !== prevProps.position)) {
            if (this.heatMap) {
                this.heatMap.setMap(null);
                this.renderHeatMap();
            }
        }
    }

    componentWillUnmount() {
        if (this.heatMap) {
            this.heatMap.setMap(null);
        }
    }

    renderHeatMap() {
        let {
            map, google, positions, mapCenter, icon, gradient, radius, opacity
        } = this.props;

        if (!google) {
            return null;
        }
        positions = positions.map((pos) => {
            return new google.maps.LatLng(pos.lat, pos.lng);
        });

        const pref = {
            map : map,
            data: positions,
        };

        this.heatMap = this.mapObj = new google.maps.visualization.HeatmapLayer(pref);

        this.heatMap.set('gradient', gradient);
        this.heatMap.set('radius', radius == null ? 20 : radius);
        this.heatMap.set('opacity', opacity == null ? 0.2 : opacity);
        this._listenEvents(evtNames);
        return null;
    }

    getHeatMap() {
        return null;
    }
}

HeatMap.propTypes = {
  position: PropTypes.object,
  map     : PropTypes.object,
  icon    : PropTypes.string
}

evtNames.forEach(function(e) {
    HeatMap.propTypes[e] = PropTypes.func;
});

HeatMap.defaultProps = {
  name: 'HeatMap'
}

export default HeatMap;
