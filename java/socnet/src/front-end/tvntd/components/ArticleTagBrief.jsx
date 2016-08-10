/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';
import Reflux   from 'reflux';

import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';
import ArticleBox      from 'vntd-root/components/ArticleBox.jsx';

let ArticleTagBrief = React.createClass({

    _btnActive: {
        btnClass: "btn btn-success",
        btnText : "Read More..."
    },

    _btnDisabled: {
        btnClass: "btn btn-success disabled",
        btnText : "Read More..."
    },

    _readArticle: function(uuid, artRank) {
    },

    _getSubTag: function(subTags, tag) {
        if (tag.subTags == null) {
            return;
        }
        _.forEach(tag.subTags, function(sub) {
            subTags.push(sub.tagName);
            if (sub.subTags != null && !_.isEmpty(sub.subTags)) {
                this._getSubTag(subTags, sub);
            }
        }.bind(this));
    },

    _getSubTagObjs: function(out, tag) {
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
    },

    _renderArtBrief: function(art) {
        let artUuid = art.artUuid;
        let artTag = art.artTag;
        return (
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4" id={"art-tag-" + artUuid}>
                {ArticleBox.article(artUuid, this._readArticle, this._btnActive, this._btnDisabled, this)}
            </div>
        )
    },

    _renderArtFull: function(art) {
        let artUuid = art.artUuid;
        let artTag = art.artTag;
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" id={"art-tag-full-" + artUuid}>
                <h1>{artUuid}</h1>
            </div>
        )
    },

    _renderArtBox: function(output, allTags) {
        let articles = [];
        _.forEach(allTags, function(tag) {
            if (tag.articleRank != null) {
                _.forEach(tag.articleRank, function(uuid) {
                    articles.push({
                        artUuid: uuid,
                        artTag : tag
                    });
                });
            }
        });
        let mode = NavigationStore.getViewMode();
        let length = articles.length;

        console.log("length " + length);
        for (let i = 0; i < length; i++) {
            let oneBrief = this._renderArtBrief(articles[i]);
            let oneFull  = this._renderArtFull(articles[i]);

            let twoBrief = null;
            let twoFull  = null;
            if ((i + 1) < length) {
                i++;
                twoBrief = this._renderArtBrief(articles[i]);
                twoFull  = this._renderArtFull(articles[i]);
            }
            let threeBrief = null;
            let threeFull  = null;
            if ((mode === "lg") && ((i + 1) < length)) {
                i++;
                threeBrief = this._renderArtBrief(articles[i]);
                threeFull  = this._renderArtFull(articles[i]);
            }
            console.log(oneBrief);
            console.log(twoBrief);
            console.log(threeBrief);

            output.push(
                <div className="row" key={_.uniqueId("art-brief-")}>
                    {oneBrief}
                    {twoBrief}
                    {threeBrief}
                </div>
            );
            output.push(
                <div className="row" key={_.uniqueId("art-full-")}>
                    {oneFull}
                    {twoFull}
                    {threeFull}
                </div>
            );
        }
    },

    render: function() {
        let allTags = [];
        this._getSubTagObjs(allTags, this.props.tag);

        let output = [];
        this._renderArtBox(output, allTags);

        return (
            <div>
                {output}
            </div>
        );
    }
});

export default ArticleTagBrief;
