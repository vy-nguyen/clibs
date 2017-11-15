/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';

import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';
import EStoreFeed      from './EStoreFeed.jsx';

import {AdsBox, AdsBigBox} from './AdsBox.jsx';

class AdsTableListing extends React.Component
{
    constructor(props) {
        super(props);
        this._isActive          = this._isActive.bind(this);
        this._renderAdsBrief    = this._renderAdsBrief.bind(this);
        this._renderAdsFull     = this._renderAdsFull.bind(this);
        this._updateListing     = this._updateListing.bind(this);
        this._renderAdsBriefBig = this._renderAdsBriefBig.bind(this);

        this.state = {
            currAds: null,
            adsList: []
        };
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateListing);
    }

    componentWillMount() {
        this.setState({
            adsList: this._getArtListing(this.props.tagList)
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            adsList: this._getArtListing(nextProps.tagList)
        });
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    /**
     * We can optimize this code by passing correct value from the store.
     */
    _updateListing() {
        let adsList = this._getArtListing(this.props.tagList);

        if (adsList.length != this.state.adsList) {
            this.setState({
                adsList: adsList
            });
        }
    }

    _getArtListing(tagList) {
        let adsList = [], unique = {};

        _.forOwn(tagList, function(tagName) {
            ArticleTagStore.getPublishedArticles(tagName, adsList, unique);
        });
        return adsList;
    }

    _readAds(ads) {
        if (this._isActive(ads)) {
            this.setState({
                currAds: null
            });
        } else {
            this.setState({
                currAds: ads
            });
        }
    }

    _isActive(ads) {
        let curRank, adsRank;

        if (this.state.currAds != null && ads.artObj != null) {
            curRank = this.state.currAds.getArticleRank();
            adsRank = ads.getArticleRank();
            return (
                (curRank != null) &&
                (curRank.getArticleUuid() === adsRank.getArticleUuid())
            );
        }
        return false;
    }

    _renderAdsBrief(ads) {
        let act = this._isActive(ads);
        return (
            <AdsBox adsRec={ads} active={act} onClick={this._readAds.bind(this, ads)}/>
        )
    }

    _renderAdsBriefBig(ads) {
        let act = this._isActive(ads);
        return (
            <AdsBigBox adsRec={ads} active={act}
                onClick={this._readAds.bind(this, ads)}/>
        );
    }

    _renderAdsFull(ads) {
        if (this._isActive(ads) == false) {
            return null;
        }
        return (
            <EStoreFeed adsRec={ads} authorUuid={ads.artObj.authorUuid}/>
        )
    }

    render() {
        let adsList = this.state.adsList,
            fullFn  = this._renderAdsFull,
            briefFn = this.props.detail === true ?
                this._renderAdsBriefBig : this._renderAdsBrief;

        return (
            <section id='widget-grid'>
                {ArticleTagBrief.renderArtBox(adsList, briefFn, fullFn, true)}
            </section>
        );
    }
}

export default AdsTableListing;
