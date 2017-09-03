/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import $         from 'jquery';
import React     from 'react-mod';

import TreeView      from 'vntd-shared/layout/TreeView.jsx';
import AuthorBase    from 'vntd-shared/layout/AuthorBase.jsx';
import AccordionView from 'vntd-shared/layout/AccordionView.jsx';
import InputStore    from 'vntd-shared/stores/NestableStore.jsx';
import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore  from 'vntd-root/stores/ArticleStore.jsx';

class AuthorLinks extends AuthorBase
{
    constructor(props) {
        super(props);
        this.evenRow        = true;
        this._renderTag     = this._renderTag.bind(this);
        this._renderLink    = this._renderLink.bind(this);
        this._renderElement = this._renderElement.bind(this);

        let tagMgr = AuthorStore.getAuthorTagMgr(props.authorUuid);
        this.state = {
            tagMgr  : tagMgr,
            tagItems: tagMgr != null ? tagMgr.getAuthorTagList().length : 0
        };
    }

    _updateAuthor(data, mgr) {
        let tagItems = 0,
            tagMgr   = this.state.tagMgr;

        if (tagMgr == null) {
            tagMgr   = AuthorStore.getAuthorTagMgr(this.props.authorUuid);
            tagItems = tagMgr != null ? tagMgr.getAuthorTagList().length : 0;
        }
        if (tagItems !== this.state.tagItems) {
            this.setState({
                tagMgr  : tagMgr,
                tagItems: tagItems
            });
        }
    }

    _renderTag(tag) {
        return (
            <span>{tag.tagName}</span>
        );
    }

    _showItem(item) {
        InputStore.storeItemTrigger(item.keyId, item, true);
        $('#tab-panel-all-' + item.authorUuid).trigger('click');
    }

    _renderLink(item) {
        let text, parent = item.parent,
            article = ArticleStore.getArticleByUuid(item.articleUuid, item.authorUuid);

        if (article == null) {
            return null;
        }
        text = item.artTitle.substring(0, 40);
        item.keyId   = parent._id;
        item.viewId  = item.authorUuid;
        this.evenRow = !this.evenRow;
        return (
            <p><a onClick={this._showItem.bind(this, item)}>{text}</a></p>
        );
    }

    _renderElement(parent, children, output) {
        if ((children != null) && !_.isEmpty(children)) {
            let style, sub = [];
            _.forOwn(children, function(item) {
                if (item.artTag !== "blog") {
                    return;
                }
                item.parent = parent;
                sub.push({
                    renderFn : this._renderLink,
                    renderArg: item
                });
            }.bind(this));

            style = this.evenRow ? "label label-info" : "label label-primary";
            this.evenRow = !this.evenRow;
            output.push({
                renderFn : this._renderTag,
                renderArg: parent,
                textStyle: style,
                fontSize : '12',
                defLabel : true,
                children : sub,
                iconOpen : 'fa fa-folder-open',
                iconClose: 'fa fa-folder'
            });
        }
    }

    render() {
        let tagMgr = this.state.tagMgr;
        if (tagMgr == null) {
            return null;
        }
        let json = [];
        tagMgr.getTreeViewJson(this._renderElement, json);
        return <AccordionView items={json}/>;
    }
}

export default AuthorLinks;
/*
    <ModalButton className="btn btn-sm btn-primary"
        buttonText={item.artTitle} closeCb={clickCb.bind(this, item.authorUuid)}>
        <PostPane data={article}/>
    </ModalButton>
*/
