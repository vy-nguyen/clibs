/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react';
import _            from 'lodash';
import Reflux       from 'reflux';

import TreeView     from 'vntd-shared/layout/TreeView.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import ArticleRank  from 'vntd-root/components/ArticleRank.jsx';

let UserPostView = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    data: {},

    moveUp: function(tag, e) {
        e.stopPropagation();
        this.data.tagMgr.reRankTag(tag, true);
    },

    moveDown: function(tag, e) {
        e.stopPropagation();
        this.data.tagMgr.reRankTag(tag, false);
    },

    renderTag: function(tag) {
        return (
            <span>
                {tag.tagName}
                <span className="label label-info" onClick={this.moveUp.bind(this, tag)}><i className="fa fa-sort-desc"/>Up</span>
                <span className="label label-info" onClick={this.moveDown.bind(this, tag)}><i className="fa fa-sort-asc"/>Down</span>
            </span>
        )
    },

    renderElement: function(parent, children, output) {
        if (children == null) {
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                defLabel : true,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        } else {
            let sub = [];
            _.forOwn(children, function(rank) {
                sub.push({
                    renderFn : ArticleRank.render,
                    renderArg: rank
                })
            });
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                defLabel : true,
                children : sub,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        }
    },

    render: function() {
        let tagMgr = this.data.tagMgr;
        if (tagMgr == null) {
            tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
            this.data.tagMgr = tagMgr;
        }
        let json = [];
        tagMgr.getTreeViewJson(this.renderElement, json);

        return (
            <div className="tree">
                <TreeView items={json} role="tree"/>
            </div>
        )
    }
});

export default UserPostView;
