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
import Actions          from 'vntd-root/actions/Actions.jsx';

class UserTags extends React.Component
{
    constructor(props) {
        super(props);
        this._onSaveTags    = this._onSaveTags.bind(this);
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

    _updateArtTags(data, tagMgr) {
        if (tagMgr != null && tagMgr === this.state.tagMgr) {
            let state = this._buildTagData(this.state.tagMgr);
            this.setState(state);
            NestableSelect.buildIndex(this.props.userUuid, true, state.tagTree);
        }
    }

    _pubTags2Nestable(tagArray, tagTree, tagIndex) {
        let admin = UserStore.amIAdmin();
        _.forEach(tagArray, function(pub) {
            let tagItem = {
                itemId     : pub._id,
                itemSub    : admin,
                canRemove  : false,
                itemFmt    : 'dd3-item',
                contentFmt : 'dd3-content',
                itemContent: <b>{pub.tagName}</b>,
                itemSave   : {
                    pubTag : true,
                    tagName: pub.tagName,
                    article: false
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
            itemSub    : true,
            canRemove  : true,
            itemFmt    : 'dd3-item',
            contentFmt : 'dd3-content',
            itemContent: tag.tagName,
            itemSave   : {
                pubTag : false,
                tagName: tag.tagName,
                article: false
            }
        };
        let sortedRank = tag.getSortedArticleRank();
        if (!_.isEmpty(sortedRank)) {
            tagItem.children = [];
            _.forEach(sortedRank, function(art) {
                tagItem.children.push({
                    itemId     : art.articleUuid,
                    itemSub    : false,
                    canRemove  : true,
                    itemFmt    : 'dd3-item',
                    contentFmt : 'dd3-content',
                    itemContent: <i>{art.artTitle}</i>,
                    itemSave   : {
                        pubTag : false,
                        tagName: art.artTitle,
                        article: true
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

    _onSaveTags(tags, btnId) {
        let index = {};
        let tagRank = {
            userUuid: UserStore.getSelfUuid(),
            tagRanks: [],
            artList : []
        };
        _.forEach(tags, function(t) {
            index[t.itemId] = t;
        });
        let artTag  = {};
        let artList = tagRank.artList;
        let ranks   = tagRank.tagRanks;

        _.forEach(tags, function(t) {
            let parent = index[t.parentId];
            ranks.push({
                tagName: t.tagName,
                parent : parent != null ? parent.tagName : null,
                pubTag : t.pubTag,
                rank   : t.order,
                article: t.article
            });
            if (t.article === true && parent != null) {
                if (artTag[parent.tagName] == null) {
                    artTag[parent.tagName] = {};
                }
                artTag[parent.tagName][t.itemId] = t.tagName;
            }
        });
        _.forOwn(artTag, function(val, key) {
            let artUuid = [];
            _.forOwn(val, function(v, k) {
                artUuid.push(k);
            });
            artList.push({
                tagName: key,
                artUuid: artUuid
            });
        });
        let tagMgr = this.state.tagMgr;
        if (tagMgr != null) {
            tagMgr.btnId = btnId;
            Actions.commitTagRanks(tagMgr, tagRank);
        }
    }

    render() {
        return (
            <NestableSelect items={this.state.tagTree}
                id={this.props.userUuid} onSave={this._onSaveTags}/>
        );
    }
}

export default UserTags;
