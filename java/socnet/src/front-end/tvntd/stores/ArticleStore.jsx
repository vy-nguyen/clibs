/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import _         from 'lodash';
import Actions   from 'vntd-root/actions/Actions.jsx';
import UserStore from 'vntd-shared/stores/UserStore.jsx';

import {insertSorted, preend} from 'vntd-shared/utils/Enum.jsx';

class Article {
    constructor(data) {
        this._id          = _.uniqueId('id-article-');
        this.author       = undefined;
        this.commentList  = data.commentList;
        this.authorUuid   = data.authorUuid;
        this.articleUuid  = data.articleUuid;
        this.articleUrl   = data.articleUrl;
        this.likeCount    = data.likeCount;
        this.rankCount    = data.rankCount;
        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.transactions = data.transactions;
        this.createdDate  = Date.parse(data.createdDate);
        this.content      = data.content;
        this.contentOId   = data.contentOId;
        this.pictures     = data.pictures;
        this.topic        = data.toppic;
        return this;
    }
}

let ArticleStore = Reflux.createStore({
    data: {
        articlesByUuid: {},
        articlesByAuthor: {},
        mySavedArticles: {},
        myPostResult: null,

        artUuidByDate: [],
        artUuidByScore: [],

        errorText: "",
        errorResp: null
    },
    listenables: Actions,

    /**
     * Public API for the store.
     */
    getArticlesByAuthor: function(uuid) {
        let articles = this.data.articlesByAuthor[uuid];
        if (articles !== undefined) {
            return articles;
        }
        return null;
    },

    getArticleByUuid: function(artUuid) {
        let article = this.data.articlesByUuid[artUuid];
        if (article !== undefined) {
            return article;
        }
        return null;
    },

    sortArticlesByDate: function(articles) {
    },

    sortArticlesByScore: function(articles) {
    },

    debugDump: function(header) {
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
        this.trigger(this.data);
    },

    onLogoutCompleted: function() {
        this._resetStore();
        this.trigger(this.data);
    },

    onRefreshArticlesCompleted: function(data) {
        this._addFromJson(data.articles);
        this.trigger(this.data);
    },

    /**
     * Save/publish user post.
     */
    onPendingPostCompleted: function(post) {
        this.data.myPostResult = post;
    },

    onSaveUserPostFailed: function(err) {
        err.dispatch(this._errorHandler, this._errorHandler, null);
        this.trigger(this.data);
    },

    onSaveUserPostCompleted: function(post) {
    },

    onPublishUserPostFailed: function(err) {
        err.dispatch(this._errorHandler, this._errorHandler, null);
        this.trigger(this.data);
    },

    onPublishUserPostCompleted: function(post) {
        this._addArticle(post);
        this.data.myPostResult = post;
        this.trigger(this.data);
    },

    /**
     * Internal methods.
     */
    _errorHandler: function(error) {
        this.data.errorText = error.getText();
        this.data.errorResp = error.getXHDR();
    },

    _resetStore: function() {
        this.data.articlesByUuid = {};
        this.data.articlesByAuthor = {};
        this.data.mySavedArticles = {};

        this.artUuidByDate = [];
        this.artUuidByScore = [];

        this.data.errorText = "";
        this.data.errorResp = null;
    },

    _createArtAnchor: function(article) {
        let anchor = new Object;

        anchor.sortedArticles = [];
        anchor.sortedArticles.push(article);
        anchor[article.articleUuid] = article;
        this.data.articlesByAuthor[article.authorUuid] = anchor;
        return anchor;
    },

    _addSortedArticle: function(anchor, article) {
        anchor.sortedArticles.push(article);
        // insertSorted(article, anchor.sortedArticles, this._compareArticles);
    },

    _compareArticles: function(a1, a2) {
        return a2.createdDate - a1.createdDate;
    },

    _addArticle: function(post) {
        let article = new Article(post);
        article.author = UserStore.getUserByUuid(article.authorUuid);

        let anchor = this.data.articlesByAuthor[article.authorUuid];
        if (anchor === undefined) {
            anchor = this._createArtAnchor(article);
        }
        anchor[article.articleUuid] = article;
        anchor.sortedArticles = preend(article, anchor.sortedArticles);
        // this._addSortedArticle(anchor, article);
        this.data.articlesByUuid[article.articleUuid] = article;
    },

    _removeArticle: function(artUuid) {
    },

    _indexAuthors: function(artList) {
        _.forOwn(artList, function(jsonArt, key) {
            let article = this.data.articlesByUuid[jsonArt.articleUuid];
            if (article === undefined) {
                return;
            }
            if (article.author === undefined) {
                article.author = UserStore.getUserByUuid(article.authorUuid);
            }
            let anchor = this.data.articlesByAuthor[article.authorUuid];
            if (anchor === undefined) {
                anchor = this._createArtAnchor(article);

            } else if (anchor[article.articleUuid] === undefined) {
                anchor[article.articleUuid] = article;
                this._addSortedArticle(anchor, article);
            }
        }.bind(this));
    },

    _addFromJson: function(items) {
        _.forOwn(items, function(it, key) {
            if (this.data.articlesByUuid[it.articleUuid] === undefined) {
                let article = new Article(it);

                article.author = UserStore.getUserByUuid(article.authorUuid);
                this.data.articlesByUuid[it.articleUuid] = article;
            }
        }.bind(this));

        this._indexAuthors(items);
    },

    exports: {
    }
});

export default ArticleStore;
