/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import React        from 'react';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import TreeView         from 'vntd-shared/layout/TreeView.jsx';
import {NestableSelect} from 'vntd-shared/widgets/Nestable.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleRank      from 'vntd-root/components/ArticleRank.jsx';

let TestData =  {
    itemId     : "item-0",
    itemFmt    : "dd3-item",
    itemContent: "Content item 0",
    contentFmt : "dd3-content",
    children   : [ {
        itemId     : "item-1",
        itemFmt    : "dd3-item",
        itemContent: "Content item 1",
        contentFmt : "dd3-content",
        children   : [ {
            itemId     : "item-1.1",
            itemFmt    : "dd3-item",
            itemContent: "Content item 1.1",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-1.2",
            itemFmt    : "dd3-item",
            itemContent: "Content item 1.2",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-1.3",
            itemFmt    : "dd3-item",
            itemContent: "Content item 1.3",
            contentFmt : "dd3-content"
        } ]
    }, {
        itemId     : "item-2",
        itemFmt    : "dd3-item",
        itemContent: "Content item 2",
        contentFmt : "dd3-content",
        children   : [ {
            itemId     : "item-2.1",
            itemFmt    : "dd3-item",
            itemContent: "Content item 2.1",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-2.2",
            itemFmt    : "dd3-item",
            itemContent: "Content item 2.2",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-2.3",
            itemFmt    : "dd3-item",
            itemContent: "Content item 2.3",
            contentFmt : "dd3-content"
        } ]
    }, {
        itemId     : "item-3",
        itemFmt    : "dd3-item",
        itemContent: "Content item 3",
        contentFmt : "dd3-content",
        children   : [ {
            itemId     : "item-3.1",
            itemFmt    : "dd3-item",
            itemContent: "Content item 3.1",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-3.2",
            itemFmt    : "dd3-item",
            itemContent: "Content item 3.2",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-3.3",
            itemFmt    : "dd3-item",
            itemContent: "Content item 3.3",
            contentFmt : "dd3-content"
        } ]
    }, {
        itemId     : "item-4",
        itemFmt    : "dd3-item",
        itemContent: "Content item 4",
        contentFmt : "dd3-content",
        children   : [ {
            itemId     : "item-4.1",
            itemFmt    : "dd3-item",
            itemContent: "Content item 4.1",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-4.2",
            itemFmt    : "dd3-item",
            itemContent: "Content item 4.2",
            contentFmt : "dd3-content"
        }, {
            itemId     : "item-4.3",
            itemFmt    : "dd3-item",
            itemContent: "Content item 4.3",
            contentFmt : "dd3-content"
        } ]
    } ]
};

class UserTags extends React.Component
{
    constructor(props) {
        super(props);
        this._renderElement = this._renderElement.bind(this);
        this._updateState   = this._updateState.bind(this);
        this._updateArtTags = this._updateArtTags.bind(this);
        this._onChangeTags  = this._onChangeTags.bind(this);

        this.state = {
            tagMgr : AuthorStore.getAuthorTagMgr(props.userUuid),
            pubTags: ArticleTagStore.getAllPublicTags()
        };
    }

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
        this.unsubArtTag = ArticleTagStore.listen(this._updateArtTags);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsubArtTag();
            this.unsub = null;
            this.unsubArtTag = null;
        }
    }

    _updateState(data) {
        this.setState({
            tagMgr: AuthorStore.getAuthorTagMgr(this.props.userUuid)
        });
    }

    _updateArtTags() {
        this.setState({
            pubTags: ArticleTagStore.getAllPublicTags()
        });
    }

    _renderTag(tag) {
        return <span>{tag.tagName}</span>
    }

    _renderElement(parent, children, output) {
        if (children == null) {
            output.push({
                keyId    : parent._id,
                renderFn : this._renderTag,
                renderArg: parent,
                defLabel : true,
                iconOpen : "fa fa-lg fa-folder-open",
                iconClose: "fa fa-lg fa-folder"
            }.bind(this));
        } else {
        }
    }

    _onChangeTags(arg) {
        console.log("on change tags");
        console.log(this);
        console.log(arg);
    }

    render() {
        let tagMgr = this.state.tagMgr;
        let json = tagMgr.getUserTags();

        // tagMgr.getTreeViewJson(this.renderElement, json);
        console.log("User Tags " + this.props.userUuid);
        console.log(this.state.pubTags);
        return (
            <NestableSelect items={[TestData]} id={this.props.userUuid} onChange={this._onChangeTags}/>
        );
    }
}

export default UserTags;
