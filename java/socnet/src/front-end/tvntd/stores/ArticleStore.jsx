/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import _         from 'lodash';
import Actions   from 'vntd-root/actions/Actions.jsx';
import UserStore from 'vntd-shared/stores/UserStore.jsx';

class Article {
    constructor(data) {
        this._id         = _.uniqueId('id-article-');
        this.author      = undefined;
        this.commentList = undefined;
        this.authorUuid  = data.authorUuid;
        this.articleUuid = data.articleUuid;
        this.articleUrl  = data.articleUrl;
        this.coverImgUrl = data.coverImgUrl;
        this.likeCount    = data.likeCount;
        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.transactions = data.transactions;
        this.postDate     = data.postDate;
        this.content      = data.content;
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
    onSaveUserPostFailed: function(err) {
        err.dispatch(this._errorHandler, this._errorHandler, null);
        this.trigger(this.data);
    },

    onSaveUserPostCompleted: function(post) {
        console.log(post);
        console.log("Save user post ok");
        this.trigger(this.data);
    },

    onPublishUserPostFailed: function(err) {
        err.dispatch(this._errorHandler, this._errorHandler, null);
        this.trigger(this.data);
    },

    onPublishUserPostCompleted: function(post) {
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
        this.mySavedArticles = {};

        this.artUuidByDate = [];
        this.artUuidByScore = [];

        this.data.errorText = "";
        this.data.errorResp = null;
    },

    _addArticle: function(post) {
        let article = new Article(post);
        article.author = UserStore.getUserByUuid(article.authorUuid);

        let owned = this.data.articlesByAuthor[article.authorUuid];
        if (owned === undefined) {
            owned = new Object();
        }
        owned[article.articleUuid] = article;
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
            let owned = this.data.articlesByAuthor[article.authorUuid];
            if (owned === undefined) {
                owned = new Object();
                owned[article.articleUuid] = article;
                this.data.articlesByAuthor[article.authorUuid] = owned;

            } else if (owned[article.articleUuid] === undefined) {
                owned[article.articleUuid] = article;
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
