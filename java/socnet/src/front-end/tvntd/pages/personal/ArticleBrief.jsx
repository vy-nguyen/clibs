/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';
import ArticleBox      from 'vntd-root/components/ArticleBox.jsx';
import {
    ArticleStore, EProductStore, AdsStore
} from 'vntd-root/stores/ArticleStore.jsx';

class ArticleBrief extends ArticleTagBrief
{
    constructor(props) {
        super(props);
    }

    _renderArtBrief(art) {
        return this._renderArtBriefUuid(art.getArticleUuid(), art.getAuthorUuid());
    }

    _renderArtFull(art) {
        return this._renderArtFullUuid(null,
            art.getArticleUuid(), art.getAuthorUuid(), true);
    }

    render() {
        let tag = this.props.tag, ranks = tag.sortedArts,
            articles = [], missingArts = null;

        if (ranks == null) {
            return null;
        }
        _.forEach(ranks, function(artRank) {
            let articleUuid = artRank.getArticleUuid(),
                authorUuid = artRank.getAuthorUuid();

            if (artRank.artTag === "estore") {
                EProductStore.getProductByUuid(articleUuid, authorUuid);
                return;
            }
            if (artRank.artTag === "ads") {
                AdsStore.getAdsByUuid(articleUuid, authorUuid);
                return;
            }
            articles.push(artRank);
            ArticleStore.getArticleByUuid(articleUuid, authorUuid);
        });
        if (_.isEmpty(articles)) {
            return null;
        }
        return (
            <section id='widget-grid'>
                {ArticleTagBrief.renderArtBox(articles,
                    this._renderArtBrief, this._renderArtFull, true)}
            </section>
        );
    }
}

export default ArticleBrief;
