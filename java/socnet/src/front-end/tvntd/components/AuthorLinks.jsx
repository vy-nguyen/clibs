/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';
import Reflux    from 'reflux';

import TreeView     from 'vntd-shared/layout/TreeView.jsx';
import ModalButton  from 'vntd-shared/layout/ModalButton.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';

let AuthorLinks = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    data: {
        evenRow: true
    },

    renderTag: function(tag) {
        return (
            <span>{tag.tagName}</span>
        );
    },

    renderLink: function(item) {
        let article = ArticleStore.getArticleByUuid(item.articleUuid);
        if (article == null) {
            return null;
        }
        let pane = $('.nav-tabs a[href="#all-' + item.authorUuid + '"]');
        let clickCb = function() {
            console.log("click cb");
            pane.tab('show');
        }
        return (
            <ModalButton className="btn btn-sm btn-primary" buttonText={item.artTitle} closeCb={clickCb.bind(pane)}>
                <PostPane data={article}/>
            </ModalButton>
        );
    },

    renderElement: function(parent, children, output) {
        if ((children != null) && !_.isEmpty(children)) {
            let sub = [];
            _.forOwn(children, function(item) {
                sub.push({
                    renderFn : this.renderLink,
                    renderArg: item
                    //content: item.artTitle
                });
            }.bind(this));

            let style = this.data.evenRow ? "label label-info" : "label label-primary";
            this.data.evenRow = !this.data.evenRow;
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                textStyle: style,
                fontSize : '12',
                defLabel : true,
                children : sub,
                iconOpen : 'fa fa-folder-open',
                iconClose: 'fa fa-folder'
            });
        }
    },

    render: function() {
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.authorUuid);

        let json = [];
        tagMgr.getTreeViewJson(this.renderElement, json);

        return (
            <div className="tree">
                <TreeView items={json} role="tree"/>
            </div>
        );
    }
});

export default AuthorLinks;
