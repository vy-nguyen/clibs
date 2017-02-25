/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import CommentStore from 'vntd-root/stores/CommentStore.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';

import {insertSorted, preend, removeArray} from 'vntd-shared/utils/Enum.jsx';

class Article {
    constructor(data) {
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this._id          = _.uniqueId('id-article-');
        this.author       = UserStore.getUserByUuid(data.authorUuid);
        this.createdDate  = Date.parse(data.createdDate);
        this.dateString   = moment(this.createdDate).format("DD/MM/YYYY - HH:mm");

        if (data.rank != null) {
            CommentStore.addArtAttr(data.rank);
        }
        return this;
    }
}

class AuthorShelf {
    constructor(article, authorUuid) {
        this.getData = 0;
        this.articles = {};
        this.sortedArticles = [];

        this.addSortedArticle = this.addSortedArticle.bind(this);
        if (article != null) {
            this.addSortedArticle(article);
        } else {
            Actions.refreshArticles(authorUuid);
        }
        return this;
    }

    addArticle(article) {
        if (article != null && this.articles[article.articleUuid] == null) {
            this.articles[article.articleUuid] = article;
            this.sortedArticles = preend(article, this.sortedArticles);
        }
    }

    _cmpArticle(anchor, elm) {
        if (anchor.createdDate == elm.createdDate) {
            return 0;
        }
        if (anchor.createdDate > elm.createdDate) {
            return -1;
        }
        return 1;
    }

    removeArticle(articleUuid) {
        let article = this.articles[articleUuid];
        if (article != null) {
            removeArray(this.sortedArticles, article, 0, this._cmpArticle);
            delete this.articles[articleUuid];
        }
    }

    addSortedArticle(article) {
        if (this.articles[article.articleUuid] === article) {
            return;
        }
        this.articles[article.articleUuid] = article;
        insertSorted(article, this.sortedArticles, this._cmpArticle);
    }

    hasData() {
        return true;
    }

    getSortedArticles() {
        return this.sortedArticles;
    }

    iterArticles(func, arg) {
        _.forOwn(this.sortedArticles, function(item, key) {
            func(item, arg);
        });
    }
}

class CommonStore {
    constructor(kind) {
        this.init(kind);
    }

    init(kind) {
        this.data = {
            getItemCount : 0,
            itemsByAuthor: {},
            itemsByUuid  : {},
            mySavedItems : {},

            requestUuids : null,
            missingUuids : null,
            myItems      : null,
            myItemPost   : null,
            errorText    : "",
            errorResp    : null,
            itemKinds    : {},
            storeKind    : kind
        }
    }

    getItemsByAuthor(uuid) {
        let items = [],
            uuids = UserStore.getFetchedUuidList(this.storeKind);

        if (!_.isEmpty(uuids)) {
           Actions.getPublishProds({
                authorUuid: UserStore.getSelfUuid(),
                uuidType  : "user",
                reqKind   : this.storeKind,
                uuids     : uuids
            });
        }
        let anchor = this.getItemOwner(uuid);
        if (anchor.hasData() === true) {
            anchor.iterArticles(function(it) {
                items.push(it);
            });
        }
        return items;
    }

    iterAuthorItemStores(uuid, func, arg) {
        let anchor = this.getItemOwner(uuid);
        anchor.iterArticles(func, arg);
        return anchor;
    }

    getItemOwner(uuid) {
        let anchor = this.data.itemsByAuthor[uuid];
        if (anchor == null) {
            anchor = this._createOwnerAnchor(uuid, null);
            this.data.itemsByAuthor[uuid] = anchor;
        }
        return anchor;
    }

    /*
     * Return author's items sorted to display.
     */
    getSortedItemsByAuthor(uuid) {
        let anchor = this.getItemOwner(uuid);
        return anchor.getSortedArticles();
    }

    getItemByUuid(uuid) {
        let uuids = this.data.itemsByUuid[uuid];
        return uuids;
    }

    onPublishItemCompleted(item, store) {
        let it = this._addItemStore(item, false),
            pubTag = it.publicTag;

        this.data.myItemPost = it;
        ArticleTagStore.addToPublicTag(pubTag, this.storeKind, it.articleUuid);
        store.trigger(this.data, [it], "postOk", true, it.authorUuid);
    }

    onPublishItemFailure(item, store) {
        store.trigger(this.data, null, "failure", false, item.authorUuid);
    }

    onGetPublishItemCompleted(data, key, store) {
        let items = [];

        CommentStore.onGetCommentsCompleted(data);
        _.forEach(data[key], function(item) {
            items.push(this._addItemStore(item, false));
        }.bind(this));

        this.data.requestUuids = null;
        this.requestItems();
        store.trigger(this.data, items, "getOk", !_.isEmpty(items), null);
    }

    onGetPublishItemFailure(data, store) {
        store.trigger(this.data, null, "failure", false, null);
    }

    onDeleteItemCompleted(data, store) {
        this._removeItemStore(data.uuids, data.authorUuid);
        store.trigger(this.data, [data], "delOk", true, data.authorUuid);
    }

    updateMissingUuid(uuids) {
        let store = this.data.itemsByUuid,
            missing = this.data.missingUuids;

        _.forEach(uuids, function(uid) {
            if (store[uid] == null) {
                if (this.data.missingUuids == null) {
                    this.data.missingUuids = [];
                    missing = this.data.missingUuids;
                }
                missing.push(uid);
            }
        }.bind(this));
    }

    requestItems() {
        if (this.data.requestdUuids != null || this.data.missingUuids == null) {
            return;
        }
        this.data.requestUuids = this.data.missingUuids;
        this.data.missingUuids = null;

        Actions.getPublishProds({
            authorUuid: null,
            uuidType  : this.data.storeKind,
            uuids     : this.data.requestUuids
        });
    }

    /**
     * Internal methods.
     */
    _errorHandler(error, store) {
        this.data.errorText = error.getErrorCodeText();
        this.data.errorResp = error.getUserText();
        store.trigger(this.data, null, "failure", false, null);
    }

    _createOwnerAnchor(authorUuid, article) {
        let anchor = new AuthorShelf(article, authorUuid);
        this.data.itemsByAuthor[authorUuid] = anchor;
        if (UserStore.isUserMe(authorUuid)) {
            this.data.myItems = anchor;
        }
        return anchor;
    }

    _addItemStore(item, saved) {
        let it = new Article(item);

        if (saved === true) {
            this.data.mySavedItems = preend(it, this.data.mySavedItems);
            return it;
        }
        let anchor = this.getItemOwner(it.authorUuid);
        if (this.data.itemsByUuid[it.articleUuid] == null) {
            this.data.itemsByUuid[it.articleUuid] = it;
            anchor.addArticle(it);
        }
        return it;
    }

    _removeItemStore(itemUuids, authorUuid) {
        _.forEach(itemUuids, function(articleUuid) {
            let anchor = this.getItemOwner(authorUuid);

            anchor.removeArticle(articleUuid);
            delete this.data.itemsByUuid[articleUuid];
        }.bind(this));
    }

    dumpData(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
}

export default CommonStore;
