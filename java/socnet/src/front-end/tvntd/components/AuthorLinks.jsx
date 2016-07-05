/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';
import Reflux    from 'reflux';

import TreeView     from 'vntd-shared/layout/TreeView.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';

let AuthorLinks = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    data: {},

    renderTag: function(tag) {
        return (
            <span>{tag.tagName}</span>
        );
    },

    renderElement: function(parent, children, output) {
        if (children == null) {
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                textStyle: 'label label-info',
                fontSize : '12',
                defLabel : true,
                iconOpen : 'fa fa-folder-open',
                iconClose: 'fa fa-folder'
            });
        } else {
            let sub = [];
            _.forOwn(children, function(item) {
                sub.push({
                    content: item.artTitle
                });
            });
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                textStyle: 'label label-info',
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
        console.log("Get tag mgr author " + this.props.authorUuid);
        console.log(tagMgr);

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
