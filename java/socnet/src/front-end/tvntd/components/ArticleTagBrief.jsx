/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';

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
        this._getSubTag      = this._getSubTag.bind(this);
        this._getSubTagObjs  = this._getSubTagObjs.bind(this);
        this._renderArtBrief = this._renderArtBrief.bind(this);
        this._renderArtFull  = this._renderArtFull.bind(this);

        this.state = {
            articleUuid: null,
            articleRank: null 
        };
    }

    _readArticle(uuid, artRank) {
        if (uuid === this.state.articleUuid) {
            this.setState({
                articleUuid: null,
                articleRank: null 
            });
        } else {
            this.setState({
                articleUuid: uuid,
                articleRank: artRank
            });
        }
    }

    _getSubTag(subTags, tag) {
        if (tag.subTags == null) {
            return;
        }
        _.forEach(tag.subTags, function(sub) {
            subTags.push(sub.tagName);
            if (sub.subTags != null && !_.isEmpty(sub.subTags)) {
                this._getSubTag(subTags, sub);
            }
        }.bind(this));
    }

    _getSubTagObjs(out, tag) {
        out.push(tag);
        if (tag.subTags == null) {
            return;
        }
        _.forEach(tag.subTags, function(sub) {
            out.push(sub);
        });
        _.forEach(tag.subTags, function(sub) {
            if (sub.subTags != null && !_.isEmpty(sub.subTags)) {
                this._getSubTagObjs(out, sub);
            }
        }.bind(this));
    }

    _renderArtBrief(art) {
        let artUuid = art.artUuid;
        let artTag = art.artTag;
        let clickCb = {
            getBtnFormat: function() {
                if (this.state.articleUuid == null ||
                    this.state.articleUuid !== artUuid) {
                    return {
                        btnClass: "btn btn-success",
                        btnText : Lang.translate("Read more...")
                    }
                }
                return {
                    btnClass: "btn btn-success",
                    btnText : Lang.translate("Hide Post")
                }
            }.bind(this),

            callbackArg : this,
            clickHandler: this._readArticle
        };
        return ArticleBox.article(artUuid, clickCb);
    }

    _renderArtFull(art) {
        if (this.state.articleUuid == null ||
            this.state.articleUuid !== art.artUuid) {
            return null;
        }
        let artUuid = art.artUuid, artTag = art.artTag,
            article = ArticleStore.getArticleByUuid(artUuid);

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {AuthorFeed.renderToggleView(article.authorUuid,
                    article, this._readArticle, artTag)}
            </div>
        )
    }

    render() {
        let tag = this.props.tag;

        if (tag.tagKind === "estore") {
            let products = [];
            _.forEach(tag.articleRank, function(uuid) {
                let prod = EProductStore.getProductByUuid(uuid);
                if (prod != null) {
                    products.push(prod);
                }
            });
            return EStore.renderProducts(products, null);
        }
        let articles = [], unique = {};
        ArticleTagStore.getPublishedArticles(this.props.tag.tagName, articles, unique);

        return (
            <section id='widget-grid'>
                {ArticleTagBrief.renderArtBox(articles,
                    this._renderArtBrief, this._renderArtFull, false)}
            </section>
        );
    }

    static renderArtBox(adsList, renderBrief, renderFull, maxCol) {
        let output = [], mode = NavigationStore.getViewMode(),
            length = adsList.length,
            oneBrief, oneFull, twoBrief, twoFull,
            threeBrief, threeFull, fourBrief, fourFull,
            briefFmt = "col-xs-12 col-sm-6 col-md-4 col-lg-3";

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
