/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';

import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';
import AuthorFeed      from 'vntd-root/components/AuthorFeed.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import EStore          from 'vntd-root/pages/e-store/EStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';
import AdsBox          from './AdsBox.jsx';

class AdsTableListing extends React.Component
{
    constructor(props) {
        super(props);
        this._renderAdsBrief = this._renderAdsBrief.bind(this);
        this._renderAdsFull  = this._renderAdsFull.bind(this);

        this.state = {
            currAds: null
        };
    }

    _readArticle(ads) {
        if (ads == this.state.currAds) {
            this.setState({
                currAds: null
            });
        } else {
            this.setState({
                currAds: ads
            });
        }
    }

    _renderAdsBrief(ads) {
        let clickCb = {
            getBtnFormat: function() {
                if (this.state.currAds == null ||
                    this.state.currAds !== ads) {
                    return {
                        btnClass: "btn btn-success",
                        btnText : Lang.translate("Detail...")
                    }
                }
                return {
                    btnClass: "btn btn-success",
                    btnText : Lang.translate("Hide Detail")
                }
            }.bind(this),
            onClick: this._readArticle.bind(this, ads)
        };
        return (
            <AdsBox adsRec={ads} clickCb={clickCb}/>
        )
    }

    _renderAdsFull(art) {
        if (this.state.articleUuid == null || this.state.articleUuid !== art.artUuid) {
            return null;
        }
        let artUuid = art.artUuid;
        let artTag = art.artTag;
        let article = ArticleStore.getArticleByUuid(artUuid);

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {AuthorFeed.renderToggleView(article.authorUuid,
                    article, this._readArticle, artTag)}
            </div>
        )
    }

    render() {
        let adsList = [], tagName = this.props.tagName;
        ArticleTagStore.getPublishedArticles(tagName, adsList, AdsStore.store);

        console.log(adsList);
        return (
            <section id='widget-grid'>
                {AdsTableListing.renderAdsBox(adsList,
                    this._renderAdsBrief, this._renderAdsFull, true)}
            </section>
        );
    }

    static renderAdsBox(adsList, renderBrief, renderFull, maxCol) {
        let output = [], mode = NavigationStore.getViewMode(), length = adsList.length,
            oneBrief, oneFull, twoBrief, twoFull,
            threeBrief, threeFull, fourBrief, fourFull,
            briefFmt = "col-xs-4 col-sm-4 col-md-3 col-lg-3";

        for (let i = 0; i < length; i++) {
            oneFull  = renderFull(adsList[i]);
            oneBrief = (
                <div className={briefFmt}>
                    {renderBrief(adsList[i])}
                </div>
            );
            twoBrief = null;
            twoFull  = null;
            if ((i + 1) < length) {
                i++;
                twoFull  = renderFull(adsList[i]);
                twoBrief = (
                    <div className={briefFmt}>
                        {renderBrief(adsList[i])}
                    </div>
                );
            }
            threeBrief = null;
            threeFull  = null;
            if ((i + 1) < length) {
                i++;
                threeFull  = renderFull(adsList[i]);
                threeBrief = (
                    <div className={briefFmt}>
                        {renderBrief(adsList[i])}
                    </div>
                );
            }
            fourBrief = null;
            fourFull  = null;
            if ((i + 1) < length) {
                i++;
                fourFull  = renderFull(adsList[i]);
                fourBrief = (
                    <div className={briefFmt}>
                        {renderBrief(adsList[i])}
                    </div>
                );
            }
            output.push(
                <div className="row" key={_.uniqueId("ads-brief-")}>
                    {oneBrief}
                    {twoBrief}
                    {threeBrief}
                    {fourBrief}
                </div>
            );
            output.push(
                <div className="row" key={_.uniqueId("ads-full-")}>
                    {oneFull}
                    {twoFull}
                    {threeFull}
                    {fourFull}
                </div>
            );
        }
        return output;
    }
}

export default AdsTableListing;
