/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react';
import _            from 'lodash';
import Reflux       from 'reflux';
import {renderToString} from 'react-dom-server';

import TreeView     from 'vntd-shared/layout/TreeView.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import ArticleRank  from 'vntd-root/components/ArticleRank.jsx';

// let demo = require('json!/data/prod/DEVELOPER/ReactJS_Full_Version (beta)/web/api/ui/treeview.json');

let UserPostView = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    renderTag: function(tag, t) {
        console.log(this);
        console.log(tag);
        console.log(t);
        return (
            <div>
                <h1>test</h1>
                {tag.tagName}
            </div>
        )
    },

    renderElement: function(parent, children, output) {
        if (children == null) {
            output.push({
                content: parent.tagName,
                noHtml : true,
                //renderFn : this.renderTag.bind(this, parent),
                //renderArg: parent,
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
                content : parent.tagName,
                noHtml  : true,
                children: sub,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            });
        }
    },

    render: function() {
        let json = [];
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.userUuid);
        tagMgr.getTreeViewJson(this.renderElement, json);

        return (
            <div className="tree">
                <TreeView items={json} role="tree"/>
            </div>
        )
    }
});

export default UserPostView;
