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
        this.likeCount   = data.likeCount;
        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.transactions = data.transactions;
        this.postDate     = data.postDate;
        this.content      = data.content;
        this.pictures     = data.pictures;
        return this;
    }
}

let ArticleStore = Reflux.createStore({
    data: {
        articleList: [],
        articlesByAuthor: [],
        authorUuids: []
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
        articles = this.data.articleList.filter(function(it) {
            return it.authorUuid === uuid;
        }).map(function(it) {
            return it;
        });
        if (articles.length === 0) {
            return null;
        }
        this.data.articlesByAuthor[uuid] = articles;
        return articles;
    },

    init: function() {
        this._resetStore();
        this.listenTo(UserStore, this._userUpdate);
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
        this.data.articleList = _.concat(this.data.articleList, data.articles);
        this.trigger(this.data);
    },

    _resetStore: function() {
        this.data.articleList = [];
        this.data.articlesByAuthor = [];
        this.data.authorUuids = [];
    },

    _userUpdate: function(userList) {
        _(this.data.articleList).forEach(function(it) {
            if (it.author == undefined) {
                it.author = UserStore.getUserByUuid(it.authorUuid);
            }
        });
    },

    _addFromJson: function(items) {
        _(items).forEach(function(it) {
            var article = new Article(it);
            article.author = UserStore.getUserByUuid(article.authorUuid);

            this.data.articleList.push(article);
        }.bind(this));
        this._userUpdate();
    },

    exports: {
    }
});

export default ArticleStore;
