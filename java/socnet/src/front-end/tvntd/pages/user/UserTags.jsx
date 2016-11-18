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

class UserTags extends React.Component
{
    constructor(props) {
        super(props);
        this._onSaveTags    = this._onSaveTags.bind(this);
        this._renderElement = this._renderElement.bind(this);
        this._updateState   = this._updateState.bind(this);
        this._updateArtTags = this._updateArtTags.bind(this);
        this._buildTagData  = this._buildTagData.bind(this);
        this._makeNestableTag  = this._makeNestableTag.bind(this);
        this._pubTags2Nestable = this._pubTags2Nestable.bind(this);

        this.state = this._buildTagData(AuthorStore.getAuthorTagMgr(props.userUuid));
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
        this.setState(this._buildTagData(this.state.tagMgr));
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

    _pubTags2Nestable(tagArray, tagTree, tagIndex) {
        _.forEach(tagArray, function(pub) {
            let tagItem = {
                itemId     : pub._id,
                itemFmt    : 'dd3-item',
                contentFmt : 'dd3-content',
                itemContent: <b>{pub.tagName}</b>,
                itemSave   : {
                    pubTag : true,
                    tagName: pub.tagName
                }
            };
            if (!_.isEmpty(pub.subTags)) {
                tagItem.children = [];
                this._pubTags2Nestable(pub.subTags, tagItem.children, tagIndex);
            } else {
                tagItem.children = null;
            }
            tagTree.push(tagItem);
            tagIndex[pub.tagName] = tagItem;
            tagIndex[tagItem.itemId] = tagItem;
        }.bind(this));
    }

    _makeNestableTag(tag, children, out) {
        if (_.isEmpty(tag.tagName)) {
            return;
        }
        let tagItem = {
            itemId     : tag._id,
            itemFmt    : 'dd3-item',
            contentFmt : 'dd3-content',
            itemContent: tag.tagName,
            itemSave   : {
                pubTag : false,
                tagName: tag.tagName
            }
        };
        let sortedRank = tag.getSortedArticleRank();
        if (!_.isEmpty(sortedRank)) {
            tagItem.children = [];
            _.forEach(sortedRank, function(art) {
                tagItem.children.push({
                    itemId     : art.articleUuid,
                    itemFmt    : 'dd3-item',
                    contentFmt : 'dd3-content',
                    itemContent: <i>{art.artTitle}</i>,
                    itemSave   : {
                        pubTag : false,
                        tagName: art.artTitle
                    }
                });
            });
        }
        let parent = out.tagIndex[tag.tagName];
        if (parent == null) {
            out.tagTree.push(tagItem);
            out.tagIndex[tag.tagName] = tagItem;
        } else {
            if (parent.children == null) {
                parent.children = [];
            }
            parent.children.push(tagItem);
        }
        out.tagIndex[tagItem.itemId] = tagItem;
    }

    _buildTagData(tagMgr) {
        let outTag = {
            tagMgr  : tagMgr,
            tagTree : [],
            tagIndex: {}
        };
        this._pubTags2Nestable(ArticleTagStore.getAllPublicTags(), outTag.tagTree, outTag.tagIndex);
        tagMgr.getTreeViewJson(this._makeNestableTag, outTag);

        return outTag;
    }

    _onSaveTags(arg) {
        console.log("on change tags");
        console.log(arg);
    }

    render() {
        console.log(this.state);
        return (
            <NestableSelect items={this.state.tagTree} id={this.props.userUuid} onSave={this._onSaveTags}/>
        );
    }
}

export default UserTags;
