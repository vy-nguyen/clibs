/**
 * Code modified from https://github.com/fullstackreact/google-maps-react
 */
'use strict';

import React          from 'react-mod';
import PropTypes      from 'prop-types';
import ReactDOM       from 'react-dom';
import ReactDOMServer from 'react-dom-server';

export class InfoWindow extends React.Component
{
    constructor(props) {
        super(props);
        this.onOpen  = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        this.renderInfoWindow();
    }

    componentDidUpdate(prevProps) {
        const {google, map} = this.props;

        if (!google || !map) {
            return;
        }
        if (map !== prevProps.map) {
            this.renderInfoWindow();
        }
        if (this.props.position !== prevProps.position) {
            this.updatePosition();
        }
        if (this.props.children !== prevProps.children) {
            this.updateContent();
        }
        if (this.props.visible !== prevProps.visible ||
            this.props.marker !== prevProps.marker ||
            this.props.position !== prevProps.position) {
            if (this.props.visible) {
                this.openWindow();
            } else {
                this.closeWindow();
            }
        }
    }

    renderInfoWindow() {
        let {map, google, mapCenter} = this.props;

        if (!google || !google.maps) {
            return;
        }
        let content = this.renderChildren();
        const iw = this.infowindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(iw, 'closeclick', this.onClose)
        google.maps.event.addListener(iw, 'domready', this.onOpen);
    }

    onOpen() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }

    onClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    openWindow() {
        this.infowindow.open(this.props.map, this.props.marker);
    }

    updatePosition() {
        let pos = this.props.position;
        if (!(pos instanceof this.props.google.maps.LatLng)) {
            pos = pos && new this.props.google.maps.LatLng(pos.lat, pos.lng);
        }
        this.infowindow.setPosition(pos);
    }

    updateContent() {
        const content = this.renderChildren();
        console.log(content);
        this.infowindow.setContent(content);
    }

    closeWindow() {
        this.infowindow.close();
    }

    renderChildren() {
        const {children} = this.props;
        return ReactDOMServer.renderToString(this.props.children);
    }

    render() {
        return null;
    }
}

InfoWindow.propTypes = {
    children: PropTypes.element.isRequired,
    map     : PropTypes.object,
    marker  : PropTypes.object,
    position: PropTypes.object,
    visible : PropTypes.bool,

    // callbacks
    onClose: PropTypes.func,
    onOpen : PropTypes.func
}

InfoWindow.defaultProps = {
    visible: false
}

export default InfoWindow;
