/**
 * Code modified from 'https://maps.googleapis.com/maps/api/js'
 */
'use strict';

import React, { PropTypes as T } from 'react-mod';

import {Util}           from 'vntd-shared/utils/Enum.jsx';
import {wrappedPromise} from './HeatMap.jsx';

const evtNames = ['click', 'mouseout', 'mouseover'];

export class Polygon extends React.Component {
    componentDidMount() {
        this.polygonPromise = wrappedPromise();
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
        const {
            map,
            google,
            paths,
            strokeColor,
            strokeOpacity,
            strokeWeight,
            fillColor,
            fillOpacity
        } = this.props;

        if (!google) {
            return null;
        }

        const params = {
            map,
            paths,
            strokeColor,
            strokeOpacity,
            strokeWeight,
            fillColor,
            fillOpacity
        };

        this.polygon = new google.maps.Polygon(params);

        evtNames.forEach(e => {
            this.polygon.addListener(e, this.handleEvent(e));
        });
        this.polygonPromise.resolve(this.polygon);
        return null;
    }

    getPolygon() {
        return this.polygonPromise;
    }

    handleEvent(evt) {
        return (e) => {
            const evtName = `on${Util.camelize(evt)}`
            if (this.props[evtName]) {
                this.props[evtName](this.props, this.polygon, e);
            }
        }
    }

    render() {
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
