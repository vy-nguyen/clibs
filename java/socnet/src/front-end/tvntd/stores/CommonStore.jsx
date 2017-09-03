/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import CommentStore from 'vntd-root/stores/CommentStore.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import WebUtils     from 'vntd-shared/utils/WebUtils.jsx';

import {Util}       from 'vntd-shared/utils/Enum.jsx';
import {VConst}     from 'vntd-root/config/constants.js';

class Article {
    constructor(data) {
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.author       = UserStore.getUserByUuid(data.authorUuid);
        this.createdDate  = Date.parse(data.createdDate);
        this.dateString   = moment(this.createdDate).format("DD/MM/YYYY - HH:mm");

        if (data.rank != null) {
            CommentStore.addArtAttr(data.rank);
            this.rank = AuthorStore.addArticleRankFromJson(data.rank);
        }
        return this;
    }

    getArticleUuid() {
        return this.articleUuid;
    }

    getAuthorUuid() {
        return this.authorUuid;
    }

    getTagName() {
        return this.rank.tagName;
    }

    getTitle() {
        return this.topic;        
    }

    isPublished() {
        return this.published;
    }

    getArtTag() {
        return VConst.blog;
    }

    getSortedAnchor() {
        return VConst.blogs;
    }

    requestData() {
        if (this.noData === true && this.ownerStore != null) {
            this.ownerStore.requestItems(Actions.getArticles);
        } else {
            console.log("skip Request data...");
        }
        return WebUtils.spinner();
    }

    getArticleRank() {
        if (this.rank != null) {
            return this.rank;
        }
        if (this.noData === true) {
            return AuthorStore.lookupArticleRankByUuid(this.articleUui);
        }
        return null;
    }

    updateFromJson(jsonArt) {
        _.forEach(jsonArt, function(v, k) {
            this[k] = v;
        }.bind(this));

        if (jsonArt.noData == null) {
            delete this.noData;
        }
    }

    /*
     * TODO: rework product and ads to do dynamic loading like article.
     */
    getArticle() {
        return this;
    }

    static newInstance(kind, data) {
        if (kind === VConst.blog) {
            return new Article(data);
        }
        if (kind === VConst.estore) {
            return new Product(data);
        }
        return new AdsItem(data);
    }

    static newDefInstance(kind, store, articleUuid, authorUuid) {
        let json = {
            authorUuid : authorUuid,
            articleUuid: articleUuid,
        };
        return Article.newDefInstanceFrmRank(
            store, kind, AuthorStore.lookupArticleRankByUuid(articleUuid), json
        );
    }

    static newDefInstanceFrmRank(store, kind, artRank, json) {
        if (json == null) {
            json = {};
        }
        json.noData     = true;
        json.ownerStore = store;

        if (artRank != null) {
            kind             = artRank.artTag;
            json.authorUuid  = artRank.authorUuid;
            json.articleUuid = artRank.articleUuid;
            json.createdDate = artRank.timeStamp;
            json.topic       = artRank.getArtTitle();
            json.content     = artRank.contentBrief;
            json.published   = true;
        }
        store.recordMissingUuid(json.articleUuid);
        return Article.newInstance(kind, json);
    }
}

class Product extends Article {
    constructor(data) {
        super(data);
    }

    getTagName() {
        return this.publicTag;
    }

    getTitle() {
        return this.prodTitle;
    }

    isPublished() {
        return true;
    }

    getArtTag() {
        return VConst.estore;
    }

    getSortedAnchor() {
        return VConst.prods;
    }
}

class AdsItem extends Article {
    constructor(data) {
        super(data);
    }

    getTagName() {
        return this.adsRank.tagName;
    }

    getTitle() {
        return this.busName;
    }

    isPublished() {
        return true;
    }

    getArtTag() {
        return VConst.ad;
    }

    getSortedAnchor() {
        return VConst.ads;
    }
}

class AuthorShelf {
    constructor(article, authorUuid) {
        this.getData   = 0;
        this.articles  = {};
        this.savedArts = {};

        this[VConst.ads]     = [];
        this[VConst.blogs]   = [];
        this[VConst.prods]   = [];
        this.sortedSavedArts = [];

        if (article != null) {
            this.addSortedArticle(article);
        }
        return this;
    }

    addArticle(article) {
        if (article == null) {
            return;
        }
        if (this.articles[article.articleUuid] != null) {
            this.removeArticle(article.articleUuid);
        }
        this.addSortedArticle(article, true);
    }

    _cmpArticle(anchor, elm) {
        if (anchor.createdDate === elm.createdDate) {
            return 0;
        }
        if (anchor.createdDate > elm.createdDate) {
            return -1;
        }
        return 1;
    }

    removeArticle(articleUuid) {
        let root, article = this.articles[articleUuid];

        if (article != null) {
            root = article.getSortedAnchor();
            Util.removeArray(this[root], article, 0, this._cmpArticle);
            delete this.articles[articleUuid];
        }
        article = this.savedArts[articleUuid];
        if (article != null) {
            Util.removeArray(this.sortedSavedArts, article, 0, this._cmpArticle);
            delete this.savedArts[articleUuid];
        }
    }

    addSortedArticle(article, pre) {
        let root = article.getSortedAnchor();

        if (article.isPublished()) {
            if (this.articles[article.articleUuid] !== article) {
                this.articles[article.articleUuid] = article;
                if (pre === true) {
                    this[root] = Util.preend(article, this[root]);
                } else {
                    Util.insertSorted(article, this[root], this._cmpArticle);
                }
            }
            return;
        }
        this.addSortedSavedArts(article);
    }

    addSortedSavedArts(article) {
        if (this.savedArts[article.articleUuid] !== article) {
            this.savedArts[article.articleUuid] = article;
            Util.insertSorted(article, this.sortedSavedArts, this._cmpArticle);
        }
    }

    hasData() {
        return true;
    }

    getSortedArticles() {
        return this[VConst.blogs];
    }

    getSortedSavedArts() {
        return this.sortedSavedArts;
    }

    getArticle(artUuid) {
        if (this.articles[artUuid] != null) {
            return this.articles[artUuid];
        }
        return this.savedArts[artUuid];
    }

    iterArticles(func, arg) {
        _.forOwn(this[VConst.blogs], function(item, key) {
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

            requestUuids : null,
            missingUuids : null,
            myItems      : null,
            errorText    : "",
            errorResp    : null,
            itemKinds    : {},
            storeKind    : kind,
            listenChanges: {}
        }
        return this.data;
    }

    listenChanges(listener, key) {
        this.data.listenChanges[key] = listener;
    }

    _notifyListeners(code, changeList) {
        let storeKind = this.data.storeKind;

        _.forOwn(this.data.listenChanges, function(callback, key) {
            callback[key](storeKind, code, changeList);
        });
    }

    getItemsByAuthor(uuid, fetch) {
        let anchor, items = [], owners;

        if (fetch === true) {
            owners = UserStore.getFetchedUuidList(this.storeKind);
            if (owners != null && !_.isEmpty(owners)) {
                Actions.getPublishProds({
                    authorUuid: UserStore.getSelfUuid(),
                    uuidType  : "user",
                    reqKind   : this.storeKind,
                    uuids     : owners
                });
            }
        }
        anchor = this.getItemOwner(uuid);
        if (anchor.hasData() === true) {
            anchor.iterArticles(function(it) {
                items.push(it);
            });
        }
        return items;
    }

    iterAuthorItemStores(uuid, func, arg) {
        let anchor = this.getItemOwner(uuid);
        if (anchor != null) {
            anchor.iterArticles(func, arg);
        }
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

    getMyItems() {
        if (this.data.myItems != null) {
            return this.data.myItems.sortedArticles;
        }
        return null;
    }

    getMySavedItems() {
        let myShelf = this.data.myItems;
        return (myShelf != null) ? myShelf.getSortedSavedArts() : null;
    }

    getItemByUuid(uuid, authorUuid) {
        let item = this.data.itemsByUuid[uuid];

        if (item == null) {
            if (authorUuid == null) {
                return null;
            }
            item = this._addDefaultItem(this.data.storeKind, this, uuid, authorUuid);
        }
        return item;
    }

    getAuthorUuid(articleUuid) {
        let item = this.data.itemsByUuid[articleUuid];
        if (item != null) {
            return item.authorUuid;
        }
        return null;
    }

    onPublishItemCompleted(item, store) {
        let it = this._addItemStore(item), pubTag = it.publicTag;

        this._notifyListeners("add", [it]);
        store.trigger(this.data, [it], "postOk", true, it.authorUuid);
    }

    onPublishItemFailure(item, store) {
        store.trigger(this.data, null, "failure", false, item.authorUuid);
    }

    onGetPublishItemCompleted(data, key, store) {
        let items = [];

        CommentStore.onGetCommentsCompleted(data);
        _.forEach(data[key], function(item) {
            items.push(this._addItemStore(item));
        }.bind(this));

        this.data.requestUuids = null;
        if (!_.isEmpty(items)) {
            this._notifyListeners("add", items);
        }
        store.trigger(this.data, items, "getOk", !_.isEmpty(items), null);
    }

    onGetPublishItemFailure(data, store) {
        store.trigger(this.data, null, "failure", false, null);
    }

    requestItems(actionFn) {
        let uuids;

        if (this.data.requestUuids != null ||
            this.data.missingUuids == null || _.isEmpty(this.data.missingUuids)) {
            return;
        }
        uuids = [];
        this.data.requestUuids = this.data.missingUuids;
        this.data.missingUuids = null;

        _.forOwn(this.data.requestUuids, function(v, k) {
            uuids.push(k);
        });
        actionFn({
            authorUuid: null,
            uuidType  : this.data.storeKind,
            reqKind   : this.data.storeKind,
            uuids     : uuids
        });
    }

    onDeleteItemCompleted(data, store) {
        let out = this._removeItemStore(data.uuids, data.authorUuid);

        this._notifyListeners("remove", out);
        store.trigger(this.data, [data], "delOk", true, data.authorUuid);
    }

    recordMissingUuid(uuid) {
        let missing = this.data.missingUuids;

        if (missing == null) {
            this.data.missingUuids = {};
            missing = this.data.missingUuids;
        }
        missing[uuid] = true;
        return missing;
    }

    updateMissingUuid(uuids) {
        let store = this.data.itemsByUuid,
            missing = this.data.missingUuids;

        _.forEach(uuids, function(uid, key) {
            if (store[key] == null) {
                if (this.data.missingUuids == null) {
                    this.data.missingUuids = {};
                    missing = this.data.missingUuids;
                }
                missing[key] = true;
            }
        }.bind(this));
    }

    updatePublicTags(tags, actionFn) {
        _.forEach(tags, function(t) {
            if (t.articleRank != null) {
                this.updateMissingUuid(t.articleRank);
            }
        }.bind(this));
        this.requestItems(actionFn);
    }

    /**
     * Internal methods, used by derrived stores.
     */
    errorHandler(error, store) {
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

    /**
     * Add default article when we only have article uuid and author uuid.
     */
    _addDefaultItem(kind, store, articleUuid, authorUuid) {
        return this._addItemStore(
            Article.newDefInstance(kind, store, articleUuid, authorUuid)
        );
    }

    /**
     * Add default article generated from article rank.
     */
    addDefaultFromRank(artRank) {
        return this._addItemStore(
            Article.newDefInstanceFrmRank(this, this.data.storeKind, artRank, null)
        );
    }

    /**
     * Add article item to the store where item is in json format or Article type.
     */
    _addItemStore(item) {
        let articleUuid, authorUuid, anchor, authorTagMgr, article;

        articleUuid = item.articleUuid;
        authorUuid  = item.authorUuid;
        anchor      = this.getItemOwner(authorUuid);
        article     = this.data.itemsByUuid[articleUuid];

        if (article == null) {
            if (item instanceof Article) {
                article = item;
            } else {
                article = Article.newInstance(this.data.storeKind, item);
            }
            this.data.itemsByUuid[articleUuid] = article;
            anchor.addArticle(article);
        } else {
            article.updateFromJson(item);
        }
        if (item.rank != null) {
            authorTagMgr = AuthorStore.getAuthorTagMgr(authorUuid);
            article.rank = authorTagMgr.addArticleRank(item.rank);
        } else {
            article.rank = AuthorStore.lookupArticleRankByUuid(articleUuid);
        }
        return article;
    }

    _removeItemStore(itemUuids, authorUuid, silent) {
        let item, result = [], anchor = this.getItemOwner(authorUuid);

        _.forEach(itemUuids, function(articleUuid) {
            anchor.removeArticle(articleUuid);
            item = this.data.itemsByUuid[articleUuid];
            result.push(item);

            if (silent == true) {
                AuthorStore.removeArticleRank(item, silent);
            }
            delete this.data.itemsByUuid[articleUuid];
        }.bind(this));
        return result;
    }

    _triggerStore(store, item, code) {
        store.trigger(this.data, item, code, true, item.authorUuid);
    }

    addFromJson(items, key, index) {
        let oldArt, kind = this.data.storeKind, itemsByKey = this.data[key];

        _.forOwn(items, function(it, k) {
            oldArt = itemsByKey[it.articleUuid];

            if (oldArt == null) {
                itemsByKey[it.articleUuid] = Article.newInstance(kind, it);

            } else if (oldArt.noData == true) {
                oldArt.updateFromJson(it);
            }
        }.bind(this));

        if (index == true) {
            this.indexAuthors(items);
        }
        return this.data;
    }

    indexAuthors(items) {
        let itemsByUuid = this.data.itemsByUuid,
            itemsByAuthor = this.data.itemsByAuthor;

        _.forOwn(items, function(jsonItem, key) {
            let anchor, item = itemsByUuid[jsonItem.articleUuid];
            if (item == null) {
                return;
            }
            if (item.author == null) {
                item.author = UserStore.getUserByUuid(item.authorUuid);
            }
            anchor = this.getItemOwner(item.authorUuid);
            anchor.addSortedArticle(item);

            if (UserStore.isUserMe(item.authorUuid)) {
                this.data.myItems = anchor;
            }
        }.bind(this));
    }
    
    dumpData(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
}

export {CommonStore, Article}
export default CommonStore;
