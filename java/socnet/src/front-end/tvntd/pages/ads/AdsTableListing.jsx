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
import AdsBox          from './AdsBox.jsx';
import EStoreFeed      from './EStoreFeed.jsx';

class AdsTableListing extends React.Component
{
    constructor(props) {
        super(props);
        this._isActive       = this._isActive.bind(this);
        this._renderAdsBrief = this._renderAdsBrief.bind(this);
        this._renderAdsFull  = this._renderAdsFull.bind(this);

        this.state = {
            currAds: null
        };
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
        if (this.state.currAds != null && ads.artObj != null) {
            let curAds = this.state.currAds.artObj, adsObj = ads.artObj;
            return (curAds != null) && (curAds.articleUuid === adsObj.articleUuid);
        }
        return false;
    }

    _renderAdsBrief(ads) {
        let act = this._isActive(ads);
        return (
            <AdsBox adsRec={ads} active={act} onClick={this._readAds.bind(this, ads)}/>
        )
    }

    _renderAdsFull(ads) {
        if (this._isActive(ads) == false) {
            return null;
        }
        return (
            <EStoreFeed adsRec={ads} authorUuid={ads.artObj.authorUuid}
                onClick={this._readAds.bind(this, ads)}/>
        )
    }

    render() {
        let adsList = [], tagName = this.props.tagName;
        ArticleTagStore.getPublishedArticles(tagName, adsList, AdsStore.store);

        return (
            <section id='widget-grid'>
                {ArticleTagBrief.renderArtBox(adsList,
                    this._renderAdsBrief, this._renderAdsFull, true)}
            </section>
        );
    }
}

export default AdsTableListing;
