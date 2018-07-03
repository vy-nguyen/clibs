/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';

import WebUtils        from 'vntd-shared/utils/WebUtils.jsx';
import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';
import ArticleBox      from 'vntd-root/components/ArticleBox.jsx';
import AuthorFeed      from 'vntd-root/components/AuthorFeed.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import EStore          from 'vntd-root/pages/e-store/EStore.jsx';

import {ArticleStore, EProductStore}  from 'vntd-root/stores/ArticleStore.jsx';

class ArticleTagBrief extends React.Component
{
    constructor(props) {
        super(props);
        this._readArticle    = this._readArticle.bind(this);
        this._renderArtBrief = this._renderArtBrief.bind(this);
        this._renderArtFull  = this._renderArtFull.bind(this);
        this._renderArtBriefUuid = this._renderArtBriefUuid.bind(this);
        this._renderArtListFull  = this._renderArtListFull.bind(this);
        this._renderArtListBrief = this._renderArtListBrief.bind(this);

        this.state = {
            articleUuid: null
        };
    }

    _readArticle(uuid, artRank) {
        if (uuid === this.state.articleUuid) {
            this.setState({
                articleUuid: null
            });
        } else {
            this.setState({
                articleUuid: uuid
            });
        }
    }

    _renderArtBriefUuid(artUuid, authorUuid) {
        return ArticleBox.artBlog(artUuid, authorUuid,
            ArticleBox.getClickCb(this.state, artUuid, this._readArticle, this));
    }

    _renderArtBrief(art) {
        return this._renderArtBriefUuid(art.getArticleUuid(), art.getAuthorUuid());
    }

    _renderArtFullUuid(article, artUuid, authorUuid, wideFmt) {
        let out;

        if (this.state.articleUuid == null || this.state.articleUuid !== artUuid) {
            return null;
        }
        if (article == null) {
            article = ArticleStore.getArticleByUuid(artUuid, authorUuid);
        }
        out = AuthorFeed.renderToggleView(authorUuid,
                article, this._readArticle, null, wideFmt);

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {out}
            </div>
        );
    }

    /**
     * Render full article from brief listing.
     */
    _renderArtFull(art) {
        return this._renderArtFullUuid(null, art.getArticleUuid(), art.getAuthorUuid());
    }

    /**
     * Render full article from listing by author.
     */
    _renderArtListFull(author) {
        let out, article, activeUuid = this.state.articleUuid;

        if (activeUuid == null) {
            return null;
        }
        article = author[activeUuid];
        if (article == null) {
            return null;
        }
        out = AuthorFeed.renderToggleView(
            article.getAuthorUuid(), article.getArticle(), this._readArticle, null, true
        );
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {out}
            </div>
        );
    }

    _renderArtListBrief(author) {
        return ArticleBox.artBlogList(author, this.state, this._readArticle, this);
    }

    render() {
        let out, tag = this.props.tag, articles = [], unique = {};

        if (tag.tagKind === "estore") {
            if (tag.sortedArts == null) {
                return null;
            }
            return EStore.renderProducts(tag.sortedArts, null);
        }
        ArticleTagStore.getPublishedArticles(tag.tagName, articles, unique);

        /*
        out = ArticleTagBrief.renderArtBox(
            articles, this._renderArtBrief, this._renderArtFull, true
        );
        */
        out = ArticleTagBrief.renderArtList(
            articles, this._renderArtListBrief, this._renderArtListFull
        );
        return (
            <section id='widget-grid'>
                {out}
            </section>
        );
    }

    static renderArtList(articles, renderBrief, renderFull) {
        let authorArr = [], authors = {};

        _.forEach(articles, function(art) {
            let uuid = art.getAuthorUuid(), anchor = authors[uuid];
            if (anchor == null) {
                anchor = {
                    artArray  : [],
                    authorUuid: uuid
                };
                authors[uuid] = anchor;
                authorArr.push(anchor);
            }
            anchor[art.getArticleUuid()] = art;
            anchor.artArray.push(art);
        });
        return ArticleTagBrief.renderArtBox(authorArr, renderBrief, renderFull, false);
    }

    static renderArtBox(adsList, renderBrief, renderFull, maxCol, briefColFmt) {
        let output = [], mode = NavigationStore.getViewMode(),
            length = adsList.length,
            oneBrief, oneFull, twoBrief, twoFull,
            threeBrief, threeFull, fourBrief, fourFull, briefFmt;

        if (briefColFmt == null) {
            briefFmt = "col-xs-12 col-sm-6 col-md-4 col-lg-3 padding-5";
        } else {
            briefFmt = briefColFmt;
        }
        for (let i = 0; i < length; i++) {
            oneFull  = renderFull(adsList[i]);
            oneBrief = (
                <div className={briefFmt}>
                    {renderBrief(adsList[i])}
                </div>
            );
            twoBrief   = null;
            twoFull    = null;
            threeBrief = null;
            threeFull  = null;
            fourBrief  = null;
            fourFull   = null;

            if (mode !== 'xs') {
                if ((i + 1) < length) {
                    i++;
                    twoFull  = renderFull(adsList[i]);
                    twoBrief = (
                        <div className={briefFmt}>
                            {renderBrief(adsList[i])}
                        </div>
                    );
                }
                if (mode === 'md' || mode === 'lg') {
                    if ((i + 1) < length) {
                        i++;
                        threeFull  = renderFull(adsList[i]);
                        threeBrief = (
                            <div className={briefFmt}>
                                {renderBrief(adsList[i])}
                            </div>
                        );
                    }
                    if ((maxCol === true) && (mode === 'lg') && ((i + 1) < length)) {
                        i++;
                        fourFull  = renderFull(adsList[i]);
                        fourBrief = (
                            <div className={briefFmt}>
                                {renderBrief(adsList[i])}
                            </div>
                        );
                    }
                }
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

    static renderPublicTags(pubMode) {
        let output = [],
            tags = ArticleTagStore.getAllPublicTags(true, pubMode);

        if (tags != null) {
            _.forOwn(tags, function(tag) {
                output.push(
                    <div className="row" key={_.uniqueId('art-tag-brief-')}>
                        <h1>{tag.tagName}</h1>
                        <ArticleTagBrief key={_.uniqueId('art-pub-tag-')} tag={tag}/>
                    </div>
                );
            });
        }
        return output;
    }
}

export default ArticleTagBrief;
