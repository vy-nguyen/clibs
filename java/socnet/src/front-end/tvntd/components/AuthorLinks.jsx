/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';

import TreeView      from 'vntd-shared/layout/TreeView.jsx';
import AccordionView from 'vntd-shared/layout/AccordionView.jsx';
import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore  from 'vntd-root/stores/ArticleStore.jsx';

class AuthorLinks extends React.Component
{
    constructor(props) {
        super(props);
        this.evenRow        = true;
        this._updateState   = this._updateState.bind(this);
        this._renderTag     = this._renderTag.bind(this);
        this._renderLink    = this._renderLink.bind(this);
        this._renderElement = this._renderElement.bind(this);

        let tagMgr = AuthorStore.getAuthorTagMgr(props.authorUuid);
        this.state = {
            tagMgr  : tagMgr,
            tagItems: tagMgr != null ? tagMgr.getAuthorTagList().length : 0
        };
    }

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        let tagItems = 0;
        let tagMgr   = this.state.tagMgr;

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
        $('#tab-panel-all-' + item.authorUuid).trigger('click');
        $('#art-rank-full-' + item.articleUuid).trigger('click');
    }

    _renderLink(item) {
        let article = ArticleStore.getArticleByUuid(item.articleUuid);
        if (article == null) {
            return null;
        }
        let text = item.artTitle.substring(0, 40);
        this.evenRow = !this.evenRow;
        return (
            <p><a onClick={this._showItem.bind(this, item)}>{text}</a></p>
        );
    }

    _renderElement(parent, children, output) {
        if ((children != null) && !_.isEmpty(children)) {
            let sub = [];
            _.forOwn(children, function(item) {
                sub.push({
                    renderFn : this._renderLink,
                    renderArg: item
                });
            }.bind(this));

            let style = this.evenRow ? "label label-info" : "label label-primary";
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
    <ModalButton className="btn btn-sm btn-primary" buttonText={item.artTitle} closeCb={clickCb.bind(this, item.authorUuid)}>
        <PostPane data={article}/>
    </ModalButton>
*/
