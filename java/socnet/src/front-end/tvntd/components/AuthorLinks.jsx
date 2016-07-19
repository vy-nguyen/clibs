/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';
import Reflux    from 'reflux';

import TreeView      from 'vntd-shared/layout/TreeView.jsx';
import AccordionView from 'vntd-shared/layout/AccordionView.jsx';
import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore  from 'vntd-root/stores/ArticleStore.jsx';
import PostPane      from 'vntd-root/components/PostPane.jsx';

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

    showItem: function(item) {
        console.log("click showItem");
        $('#tab-panel-all-' + item.authorUuid).trigger('click');
        $('#art-rank-full-' + item.articleUuid).trigger('click');
        console.log($('#art-rank-full-' + item.articleUuid));
    },

    renderLink: function(item) {
        let article = ArticleStore.getArticleByUuid(item.articleUuid);
        if (article == null) {
            return null;
        }
        let text = item.artTitle.subString(0, 40);
        return (
            <p><a onClick={this.showItem.bind(this, item)}>{text}</a></p>
        );
    },

    renderElement: function(parent, children, output) {
        if ((children != null) && !_.isEmpty(children)) {
            let sub = [];
            _.forOwn(children, function(item) {
                sub.push({
                    renderFn : this.renderLink,
                    renderArg: item
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
        return <AccordionView items={json}/>;

            /*
        return (
            <div className="tree">
                <TreeView items={json} role="tree"/>
            </div>
        );
             */
    }
});

export default AuthorLinks;
        /*
            <ModalButton className="btn btn-sm btn-primary" buttonText={item.artTitle} closeCb={clickCb.bind(this, item.authorUuid)}>
                <PostPane data={article}/>
            </ModalButton>
        */
