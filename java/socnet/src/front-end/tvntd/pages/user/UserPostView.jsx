/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react';
import _            from 'lodash';
import Reflux       from 'reflux';

import UserStore    from  'vntd-shared/stores/UserStore.jsx';
import TreeView     from  'vntd-shared/layout/TreeView.jsx';
import AccordionView from 'vntd-shared/layout/AccordionView.jsx';
import AuthorStore  from  'vntd-root/stores/AuthorStore.jsx';
import ArticleRank  from  'vntd-root/components/ArticleRank.jsx';

let UserPostView = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    data: {},

    moveUp: function(tag, e) {
        e.stopPropagation();
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.reRankTag(tag, true);
    },

    moveDown: function(tag, e) {
        e.stopPropagation();
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.reRankTag(tag, false);
    },

    renderTag: function(tag) {
        let upRank = null;
        let downRank = null;

        if (UserStore.isUserMe(this.props.userUuid) === true) {
            upRank = (
                <span className="label label-info" onClick={this.moveUp.bind(this, tag)}>
                    <i className="fa fa-sort-desc"/>Up
                </span>
            );
            downRank = (
                <span className="label label-info" onClick={this.moveDown.bind(this, tag)}>
                    <i className="fa fa-sort-asc"/>Down
                </span>
            );
        }
        return (
            <span>{tag.tagName} {upRank} {downRank}</span>
        );
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
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        let json = [];
        tagMgr.getTreeViewJson(this.renderElement, json);
        return <AccordionView className="no-padding" items={json}/>;

        /*
        return (
            <div className="tree">
                <TreeView items={json} role="group"/>
            </div>
        )
        */
    }
});

export default UserPostView;
