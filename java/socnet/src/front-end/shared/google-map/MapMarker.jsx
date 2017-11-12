/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import Modal              from 'react-modal';
import React, {PropTypes} from 'react-mod';

import Marker             from 'vntd-shared/google-map/Marker.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';
import AdsBox             from 'vntd-root/pages/ads/AdsBox.jsx';
import ImageCarousel      from 'vntd-shared/layout/ImageCarousel.jsx';

export class MarkerEntry extends React.Component
{
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this.format = [ "container bg-info", "container bg-success" ];
    }

    _onClick() {
        if (this.props.onClick != null) {
            this.props.onClick(this.props.label, this.props.marker);
        }
    }

    render() {
        let { label, marker } = this.props, fmtIdx = parseInt(label) % 2;

        return (
            <div onClick={this._onClick} className={this.format[fmtIdx]}>
                <h5>{label}</h5>
                <p className="price-container">
                    {marker.busPhone}<br/>
                    {AdsBox.businessAddr(marker)}
                </p>
            </div>
        );
    }
}

export class MapMarker extends React.Component
{
    constructor(props) {
        super(props);

        this.openModal      = this.openModal.bind(this);
        this._closeModal    = this._closeModal.bind(this);
        this._onMarkerClick = this._onMarkerClick.bind(this);

        this.state = {
            modalIsOpen: false
        };
    }

    _onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker : marker,
            modalIsOpen  : true
        });
    }

    _closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        });
    }

    _modalHeader() {
        let marker = this.props.marker;

        return (
            <div className="modal-header">
                <button type="button" aria-label="close"
                    className="close" onClick={this._closeModal}>
                    <i className="fa fa-times"/>
                </button>
                <h3 className="modal-title">
                    {marker.busName} | {marker.createdDate}
                </h3>
            </div>
        );
    }

    _modalBody() {
        let marker = this.props.marker, pics = null;

        if (!_.isEmpty(marker.imageUrl)) {
            const style = {
                width  : "400px",
                height : "400px"
            };
            pics = (
                <ImageCarousel imageList={marker.imageUrl} select={0} imgStyle={style}/>
            );
        }
        return (
            <div className="row padding-10">
                <p>{AdsBox.businessAddr(marker)}</p>
                <h3>{marker.busEmail} | {marker.busPhone}</h3>
                <div dangerouslySetInnerHTML= {{__html: marker.busDesc}}/>
                {pics}
            </div>
        );
    }

    _renderModal() {
        return (
            <Modal style={VntdGlob.styleMarker} isOpen={this.state.modalIsOpen}
                onRequestClose={this._closeModal}>
                {this._modalHeader()}
                {this._modalBody()}
            </Modal>
        );
    }

    render() {
        let marker = this.props.marker,
        pos = {
            lat: marker.lat,
            lng: marker.lng
        };
        return (
            <Marker map={this.props.map} google={this.props.google}
                onClick={this._onMarkerClick}
                draggable={true} label={this.props.label} position={pos}>
                {this._renderModal()}
            </Marker>
        );
    }
}

export default MapMarker;
