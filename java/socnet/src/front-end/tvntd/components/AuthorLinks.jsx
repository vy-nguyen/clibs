/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import $         from 'jquery';
import React     from 'react-mod';

import BoostFilter   from 'vntd-shared/component/BoostFilter.jsx';
import InputStore    from 'vntd-shared/stores/NestableStore.jsx';
import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore  from 'vntd-root/stores/ArticleStore.jsx';

class AuthorLinks extends BoostFilter
{
    constructor(props) {
        super(props, AuthorStore);
        this.iconOpen  = 'fa fa-folder-open';
        this.iconClose = 'fa fa-folder';
        this.itemCount = true;

        if (props != null) {
            this.state = this._getState(AuthorStore, props);
        }
    }

    _getState(store, props) {
        let tagMgr = AuthorStore.getAuthorTagMgr(props.authorUuid);

        if (tagMgr == null) {
            return {
                tagMgr  : null,
                items   : null,
                tagItems: 0
            };
        }
        return {
            tagMgr  : tagMgr,
            items   : tagMgr.getUserTags(),
            tagItems: tagMgr.getAuthorTagList().length
        };
    }

    _getChildren(item) {
        return item.getSortedArticleRank();
    }

    _filterOut(item) {
        if (item.artTag !== this.props.selKey) {
            return true;
        }
        return false;
    }

    _renderItem(item) {
        return <span>{item.tagName}</span>;
    }

    _selectItem(item) {
        InputStore.storeItemTrigger(item.keyId, item, true);
        $('#tab-panel-all-' + item.authorUuid).trigger('click');
    }

    _renderLink(item) {
        let text, parent = item.parent,
            article = ArticleStore.getArticleByUuid(item.articleUuid, item.authorUuid);

        if (article == null) {
            return null;
        }
        text = item.getArtTitle().substring(0, 40);
        item.keyId   = parent.getId();
        item.viewId  = item.authorUuid;
        this.evenRow = !this.evenRow;
        return (
            <p onClick={this._selectItem.bind(this, item)}>{text}</p>
        );
    }
}

export default AuthorLinks;
