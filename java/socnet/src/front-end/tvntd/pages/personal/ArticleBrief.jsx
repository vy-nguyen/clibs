/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import {ArticleStore}  from 'vntd-root/stores/ArticleStore.jsx';
import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';
import ArticleBox      from 'vntd-root/components/ArticleBox.jsx';

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
        let art, tag = this.props.tag, ranks = tag.sortedArts,
            articles = [], missingArts = null;

        if (ranks == null) {
            return null;
        }
        _.forEach(ranks, function(artRank) {
            articles.push(artRank);
            art = ArticleStore
                .getArticleByUuid(artRank.getArticleUuid(), artRank.getAuthorUuid());
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
