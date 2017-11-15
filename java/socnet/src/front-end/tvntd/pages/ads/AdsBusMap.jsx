/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import {GoogleApiLoad}    from 'vntd-shared/lib/AsyncLoader.jsx';
import MapContainer       from 'vntd-shared/google-map/MapContainer.jsx';
import {AdsStore}         from 'vntd-root/stores/ArticleStore.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import EStoreFeed         from './EStoreFeed.jsx';

import {MapMarker, MarkerEntry} from 'vntd-shared/google-map/MapMarker.jsx';

class BusMapMarker extends MapMarker
{
    constructor(props) {
        super(props);
        this.modalStyle = VntdGlob.styleBusMarker;
    }

    _modalTitle() {
        let marker = this.props.marker;
        return <h1 className="modal-title">{marker.busName}</h1>;
    }

    _modalBody() {
        let adsRec = this.props.adsRec,
            authorUuid = adsRec.artObj != null ? adsRec.artObj.authorUuid : null;

        return <EStoreFeed adsRec={adsRec} authorUuid={authorUuid}/>;
    }
}

class BusMapContainer extends MapContainer
{
    constructor(props) {
        super(props);

        this._getArtListing = this._getArtListing.bind(this);
        this._updateListing = this._updateListing.bind(this);
        this.state = this._getArtListing(props.tagList);
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateListing); 
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateListing() {
        this.setState(this._getArtListing(this.props.tagList));
    }

    _getArtListing(tagList) {
        let adsList = [], out = [], unique = {};

        _.forOwn(tagList, function(tagName) {
            ArticleTagStore.getPublishedArticles(tagName, adsList, unique);
        });
        _.forEach(adsList, function(adsRec) {
            unique[adsRec.articleUuid] = adsRec;
            out.push(adsRec.getArticle());
        });
        return {
            busAds: out,
            adsRec: unique
        };
    }

    // @Override
    //
    _getMapData() {
        return this.state.busAds;
    }

    // @Override
    //
    renderMarker(data, label) {
        return (
            <BusMapMarker ref={label} key={_.uniqueId()} marker={data}
                adsRec={this.state.adsRec[data.articleUuid]} label={label}/>
        );
    }
}

class AdsBusMap extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BusMapContainer center={this.props.center} google={this.props.google}
                tagList={this.props.tagList}/>
        );
    }
}

export default GoogleApiLoad({
    version  : "3.28",
    apiKey   : "AIzaSyD2c0dE19Ubh3F5wgkuI-y_jnvKFAd2NDo",
    libraries: [ "places", "visualization" ]
})(AdsBusMap);
