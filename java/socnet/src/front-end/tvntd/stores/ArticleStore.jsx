/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import CommentStore from 'vntd-root/stores/CommentStore.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
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

let EProductStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    _resetStore: function() {
        this.data = {
            getStoreCount  : 0,
            estoresByAuthor: {},
            productByUuid  : {},
            mySavedProducts: {},

            requestUuids : null,
            missingUuids : null,
            myProducts   : null,
            myProductPost: null,
            errorText : "",
            errorResp : null
        }
    },

    getProductsByAuthor: function(uuid) {
        let products = [];
        let uuids = UserStore.getFetchedUuidList('es');

        if (!_.isEmpty(uuids)) {
           Actions.getPublishProds({
                authorUuid: UserStore.getSelfUuid(),
                uuidType  : "user",
                uuids     : uuids
            });
        }
        let anchor = this.getProductOwner(uuid);
        if (anchor.hasData() === true) {
            anchor.iterArticles(function(item) {
                products.push(item);
            });
        }
        return products;
    },

    iterAuthorEStores: function(uuid, func, arg) {
        let anchor = this.getProductOwner(uuid);
        anchor.iterArticles(func, arg);
        return anchor;
    },

    getProductOwner: function(uuid) {
        let anchor = this.data.estoresByAuthor[uuid];
        if (anchor == null) {
            anchor = this._createOwnerAnchor(uuid, null);
            this.data.estoresByAuthor[uuid] = anchor;
        }
        return anchor;
    },

    /*
     * Return author's articles sorted to display.
     */
    getSortedProductsByAuthor: function(uuid) {
        let anchor = this.getProductOwner(uuid);
        return anchor.getSortedArticles();
    },

    getProductByUuid: function(uuid) {
        let uuids = this.data.productByUuid[uuid];
        return uuids;
    },

    init: function() {
        this._resetStore();
    },

    onPublishProductCompleted: function(product) {
        let prod = this._addEStore(product, false);
        let pubTag = prod.publicTag;

        this.data.myProductPost = prod;
        ArticleTagStore.addToPublicTag(pubTag, "estore", prod.articleUuid);
        this.trigger(this.data, [prod], "postOk", true, prod.authorUuid);
    },

    onPublishProductFailure: function(product) {
        this.trigger(this.data, null, "failure", false, product.authorUuid);
    },

    onGetPublishProdsCompleted: function(data) {
        let products = [];

        _.forEach(data.products, function(product) {
            products.push(this._addEStore(product, false));
        }.bind(this));

        this.data.requestUuids = null;
        this.requestProducts();
        this.trigger(this.data, products, "getOk", !_.isEmpty(products), null);
    },

    onGetPublishProdsFailure: function(data) {
        this.trigger(this.data, null, "failure", false, null);
    },

    onDeleteProductCompleted: function(data) {
        this._removeEStore(data.uuids, data.authorUuid);
        this.trigger(this.data, [data], "delOk", true, data.authorUuid);
    },

    updateMissingUuid(uuids) {
        let store = this.data.productByUuid;
        let missing = this.data.missingUuids;
        _.forEach(uuids, function(uid) {
            if (store[uid] == null) {
                if (this.data.missingUuids == null) {
                    this.data.missingUuids = [];
                    missing = this.data.missingUuids;
                }
                missing.push(uid);
            }
        }.bind(this));
    },

    requestProducts() {
        if (this.data.requestdUuids != null || this.data.missingUuids == null) {
            return;
        }
        this.data.requestUuids = this.data.missingUuids;
        this.data.missingUuids = null;

        Actions.getPublishProds({
            authorUuid: null,
            uuidType  : "product",
            uuids     : this.data.requestUuids
        });
    },

    /**
     * Internal methods.
     */
    _errorHandler: function(error) {
        this.data.errorText = error.getErrorCodeText();
        this.data.errorResp = error.getUserText();
        this.trigger(this.data, null, "failure", false, null);
    },

    _createOwnerAnchor: function(authorUuid, article) {
        let anchor = new AuthorShelf(article, authorUuid);
        this.data.estoresByAuthor[authorUuid] = anchor;
        if (UserStore.isUserMe(authorUuid)) {
            this.data.myProducts = anchor;
        }
        return anchor;
    },

    _addEStore: function(product, saved) {
        let prod = new Article(product);

        if (saved === true) {
            this.data.mySavedProducts = preend(prod, this.data.mySavedProducts);
            return prod;
        }
        let anchor = this.getProductOwner(prod.authorUuid);
        if (this.data.productByUuid[prod.articleUuid] == null) {
            this.data.productByUuid[prod.articleUuid] = prod;
            anchor.addArticle(prod);
        }
        return prod;
    },

    _removeEStore: function(prodUuids, authorUuid) {
        _.forEach(prodUuids, function(articleUuid) {
            let anchor = this.getProductOwner(authorUuid);

            anchor.removeArticle(articleUuid);
            delete this.data.productByUuid[articleUuid];
        }.bind(this));
    },

    dumpData(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
});

let ArticleStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    _resetStore: function() {
        this.data = {
            articlesByUuid  : {},
            articlesByAuthor: {},
            mySavedArticles : {},

            myArticles    : null,
            myPostResult  : null,
            artUuidByDate : [],
            artUuidByScore: [],

            requestArtUuids: [],
            missingArtUuids: [],

            errorText : "",
            errorResp : null
        }
    },

    /**
     * Public API for the store.
     */
    getArticleStore: function() {
        return this.data;
    },

    getArticlesByAuthor: function(uuid) {
        let articles = [];
        this.iterAuthorArticles(uuid, function(item) {
            articles.push(item);
        });
        return articles;
    },

    getArtOwner: function(uuid) {
        let anchor = this.data.articlesByAuthor[uuid];
        if (anchor == null) {
            anchor = this._createArtOwner(uuid, null);
            this.data.articlesByAuthor[uuid] = anchor;
        }
        return anchor;
    },

    /*
     * Return author's articles sorted to display.
     */
    getSortedArticlesByAuthor: function(uuid) {
        let anchor = this.getArtOwner(uuid);
        return anchor.getSortedArticles();
    },

    getAuthorUuid: function(articleUuid) {
        let article = this.data.articlesByUuid[articleUuid];
        if (article != null) {
            return article.authorUuid;
        }
        return null;
    },

    iterAuthorArticles: function(uuid, func, arg) {
        let shelf = this.data.articlesByAuthor[uuid];
        if (shelf != null) {
            shelf.iterArticles(func, arg);
        }
        return shelf;
    },

    getMyArticles: function() {
        if (this.data.myArticles !== null) {
            return this.data.myArticles.sortedArticles;
        }
        return null;
    },

    getMySavedArticles: function() {
        return this.data.mySavedArticles;
    },

    getArticleByUuid: function(artUuid) {
        return this.data.articlesByUuid[artUuid];
    },

    sortArticlesByDate: function(articles) {
    },

    sortArticlesByScore: function(articles) {
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    },

    /**
     * Event handlers.
     */
    init: function() {
        this._resetStore();
    },

    onPreloadCompleted: function(json) {
        this._addFromJson(json.articles);
        this.trigger(this.data, null, "preload", true, null);
    },

    onLogoutCompleted: function() {
        this._resetStore();
        this.trigger(this.data, null, "logout", true, null);
    },

    onRefreshArticlesCompleted: function(data) {
        this._addFromJson(data.articles);
        this._addSavedJson(data.pendPosts);
        this.trigger(this.data, null, "startup", true, null);
    },

    onStartupCompleted: function(data) {
        if (data.articles) {
            this._addFromJson(data.articles);
            this.trigger(this.data, null, "startup", true, null);
        }
    },

    /**
     * Save/publish user post.
     */
    onPendingPostCompleted: function(post) {
        this.data.myPostResult = post;
    },

    onSaveUserPostFailed: function(err) {
        this._errorHandler(err);
    },

    onSaveUserPostCompleted: function(post) {
        this._addArticle(post, true);
        this.trigger(this.data, post, "save", true, post.authorUuid);
    },

    onPublishUserPostFailed: function(err) {
        this._errorHandler(err);
    },

    onPublishUserPostCompleted: function(post) {
        this._addArticle(post, false);
        this.data.myPostResult = post;
        this.trigger(this.data, post, "publish", true, post.authorUuid);
    },

    onUpdateUserPostCompleted: function(post) {
        this._removeArticle([post.articleUuid], post.authorUuid, true);
        this._addArticle(post, false);
        this.trigger(this.data, post, "publish", true, post.authorUuid);
    },

    onDeleteUserPostCompleted: function(data) {
        this._removeArticle(data.uuids, data.authorUuid); 
        this.trigger(this.data, data, "delOk", true, data.authorUuid);
    },

    /**
     * Internal methods.
     */
    _errorHandler: function(error) {
        this.data.errorText = error.getErrorCodeText();
        this.data.errorResp = error.getUserText();
        this.trigger(this.data, null, "error", false, null);
    },

    _createArtOwner: function(authorUuid, article) {
        let anchor = new AuthorShelf(article, authorUuid);
        this.data.articlesByAuthor[authorUuid] = anchor;
        if (UserStore.isUserMe(authorUuid)) {
            this.data.myArticles = anchor;
        }
        return anchor;
    },

    _addSortedArticle: function(anchor, article) {
        anchor.sortedArticles.push(article);
    },

    _compareArticles: function(a1, a2) {
        return a2.createdDate - a1.createdDate;
    },

    _addArticle: function(post, saved) {
        let article = new Article(post);

        if (saved === true) {
            this.data.mySavedArticles = preend(article, this.data.mySavedArticles);
            return article;
        }
        let anchor = this.getArtOwner(article.authorUuid);
        if (this.data.articlesByUuid[article.articleUuid] == null) {
            this.data.articlesByUuid[article.articleUuid] = article;
            anchor.addArticle(article);
        }
        if (article.rank != null) {
            let authorTagMgr = AuthorStore.getAuthorTagMgr(article.authorUuid);
            authorTagMgr.addArticleRank(article.rank);
        }
        return article;
    },

    _removeArticle: function(artUuids, authorUuid, silent) {
        _.forEach(artUuids, function(articleUuid) {
            let anchor = this.getArtOwner(authorUuid);
            anchor.removeArticle(articleUuid);

            let article = this.data.articlesByUuid[articleUuid];
            AuthorStore.removeArticleRank(article, silent);
            delete this.data.articlesByUuid[articleUuid];
        }.bind(this));
    },

    _indexAuthors: function(artList) {
        let articlesByUuid = this.data.articlesByUuid;
        let articlesByAuthor = this.data.articlesByAuthor;

        artList && _.forOwn(artList, function(jsonArt, key) {
            let article = articlesByUuid[jsonArt.articleUuid];
            if (article == null) {
                return;
            }
            if (article.author == null) {
                article.author = UserStore.getUserByUuid(article.authorUuid);
            }
            let anchor = this.getArtOwner(article.authorUuid);
            anchor.addSortedArticle(article);

            if (UserStore.isUserMe(article.authorUuid)) {
                this.data.myArticles = anchor;
            }
        }.bind(this));
    },

    _addFromJson: function(items) {
        let articlesByUuid = this.data.articlesByUuid;
        items && _.forOwn(items, function(it, key) {
            if (articlesByUuid[it.articleUuid] == null) {
                let article = new Article(it);
                articlesByUuid[it.articleUuid] = article;
            }
        });
        this._indexAuthors(items);
    },

    _addSavedJson: function(items) {
        items && _.forOwn(items, function(it, key) {
            if (this.data.mySavedArticles[it.articleUuid] == null) {
                this.data.mySavedArticles[it.articleUuid] = new Article(it);
            }
        }.bind(this));
    },

    exports: {
    }
});

export { EProductStore, ArticleStore };
export default ArticleStore;
