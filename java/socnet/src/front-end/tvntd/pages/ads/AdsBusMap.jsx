/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import {GoogleApiLoad}    from 'vntd-shared/lib/AsyncLoader.jsx';
import MapContainer       from 'vntd-shared/google-map/MapContainer.jsx';
import {AdsStore}         from 'vntd-root/stores/ArticleStore.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';

import {MapMarker, MarkerEntry} from 'vntd-shared/google-map/MapMarker.jsx';

class BusMapContainer extends MapContainer
{
    constructor(props) {
        super(props);
        this._getArtListing = this._getArtListing.bind(this);
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateListing); 
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _getArtListing(tagList) {
        let adsList = [], out = [], unique = {};

        _.forOwn(tagList, function(tagName) {
            ArticleTagStore.getPublishedArticles(tagName, adsList, unique);
        });
        _.forEach(adsList, function(adsRec) {
            out.push(adsRec.getArticle());
        });
        return out;
    }

    // @Override
    //
    _getMapData() {
        console.log("get tag...");
        return this._getArtListing(this.props.tagList);
    }

    renderEntry(data, label) {
        console.log("Data entry....");
        console.log(data);
        return (
            <MarkerEntry marker={data} label={label} onClick={this._onMarkerClick}/>
        );
    }

    renderMarker(data, label) {
        console.log("marker entry....");
        console.log(data);
        return (
            <MapMarker ref={label} key={_.uniqueId()} marker={data} label={label}/>
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
