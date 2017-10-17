/**
 * Code modified from 'https://maps.googleapis.com/maps/api/js'
 */
'use strict';

import React     from 'react-mod';
import PropTypes from 'prop-types';

import {Util}    from 'vntd-shared/utils/Enum.jsx';

const evtNames = ['click', 'mouseover', 'recenter'];

export const wrappedPromise = function() {
    let wPromise = {},
        promise = new Promise(function (resolve, reject) {
            wPromise.resolve = resolve;
            wPromise.reject = reject;
        });

    wPromise.then    = promise.then.bind(promise);
    wPromise.catch   = promise.catch.bind(promise);
    wPromise.promise = promise;
    return wPromise;
}

export class HeatMap extends React.Component {

    componentDidMount() {
        this.heatMapPromise = wrappedPromise();
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

        this.heatMap = new google.maps.visualization.HeatmapLayer(pref);

        this.heatMap.set('gradient', gradient);
        this.heatMap.set('radius', radius == null ? 20 : radius);
        this.heatMap.set('opacity', opacity == null ? 0.2 : opacity);

        evtNames.forEach(e => {
            this.heatMap.addListener(e, this.handleEvent(e));
        });
        this.heatMapPromise.resolve(this.heatMap);
        return null;
    }

    getHeatMap() {
        return this.heatMapPromise;
    }

    handleEvent(evt) {
        return (e) => {
            const evtName = `on${Util.camelize(evt)}`
            if (this.props[evtName]) {
                this.props[evtName](this.props, this.heatMap, e);
            }
        }
    }

    render() {
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
