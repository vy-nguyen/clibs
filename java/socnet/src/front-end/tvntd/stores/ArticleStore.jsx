/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux       from 'reflux';
import Actions      from 'vntd-root/actions/Actions.jsx';
import CommonStore  from 'vntd-root/stores/CommonStore.jsx';

let EProductStore = Reflux.createStore({
    store: {},
    listenables: Actions,

    init: function() {
        this.store = new CommonStore('estore');
    },

    getProductsByAuthor: function(uuid) {
        return this.store.getItemsByAuthor(uuid, true);
    },

    iterAuthorEStores: function(uuid, func, arg) {
        return this.store.iterAuthorItemStores(uuid, func, arg);
    },

    getProductOwner: function(uuid) {
        return this.store.getItemOwner(uuid);
    },

    getSortedProductsByAuthor: function(uuid) {
        return this.store.getSortedItemsByAuthor(uuid);
    },

    getProductByUuid: function(uuid) {
        return this.store.getItemByUuid(uuid);
    },

    onPublishProductCompleted: function(product) {
        this.store.onPublishItemCompleted(product, this);
    },

    onPublishProductFailure: function(product) {
        this.store.onPublishItemFailure(product, this);
    },

    onGetPublishProdsCompleted: function(data) {
        this.store.onGetPublishItemCompleted(data, 'products', this);
    },

    onGetPublishProdsFailure: function(data) {
        this.store.onGetPublishItemFailure(data, this);
    },

    onDeleteProductCompleted: function(data) {
        this.store.onDeleteItemCompleted(data, this);
    },

    updateMissingUuid: function(uuids) {
        this.store.updateMissingUuid(uuids);
    },

    requestProducts: function() {
        this.store.requestItems();
    },

    dumpData: function(header) {
        this.store.dumpData(header);
    }
});

let ArticleStore = Reflux.createStore({
    store: {},
    listenables: Actions,

    init: function() {
        this.store = new CommonStore('blog');
    },

    /**
     * Public API for the store.
     */
    getArticlesByAuthor: function(uuid) {
        return this.store.getItemsByAuthor(uuid, false);
    },

    getArtOwner: function(uuid) {
        return this.store.getItemOwner(uuid);
    },

    /*
     * Return author's articles sorted to display.
     */
    getSortedArticlesByAuthor: function(uuid) {
        return this.store.getSortedItemsByAuthor(uuid);
    },

    getAuthorUuid: function(articleUuid) {
        return this.store.getAuthorUuid(articleUuid); 
    },

    iterAuthorArticles: function(uuid, func, arg) {
        return this.store.iterAuthorItemStores(uuid, func, arg);
    },

    getMyArticles: function() {
        return this.store.getMyItems();
    },

    getMySavedArticles: function() {
        return this.store.getMySavedItems();
    },

    getArticleByUuid: function(artUuid) {
        return this.store.getItemByUuid(artUuid);
    },

    sortArticlesByDate: function(articles) {
    },

    sortArticlesByScore: function(articles) {
    },

    dumpData: function(header) {
        this.store.dumpData(header);
    },

    /**
     * Event handlers.
     */
    onPreloadCompleted: function(json) {
        let data = this.store.addFromJson(json.articles, 'itemsByUuid', true);
        this.trigger(data, null, "preload", true, null);
    },

    onLogoutCompleted: function() {
        let data = this.store.init();
        this.trigger(data, null, "logout", true, null);
    },

    onRefreshArticlesCompleted: function(data) {
        let out = this.store.addFromJson(data.articles, 'itemsByUuid', true);
        this.store.addFromJson(data.pendPosts, 'mySavedItems');
        this.trigger(out, null, "startup", true, null);
    },

    onStartupCompleted: function(data) {
        if (data.articles) {
            let out = this.store.addFromJson(data.articles, 'itemsByUuid', true);
            this.trigger(out, null, "startup", true, null);
        }
    },

    /**
     * Save/publish user post.
     */
    onPendingPostCompleted: function(post) {
        this.store.onPendingPostCompleted(post);
    },

    onSaveUserPostFailed: function(err) {
        this.store.errorHandler(err);
    },

    onSaveUserPostCompleted: function(post) {
        this.store._addItemStore(post, true, this, "save"); 
    },

    onPublishUserPostFailed: function(err) {
        this.store.errorHandler(err);
    },

    onPublishUserPostCompleted: function(post) {
        this.store.onPendingPostCompleted(post);
        this.store._addItemStore(post, false);
        this.store._triggerStore(this, post, "publish");
    },

    onUpdateUserPostCompleted: function(post) {
        this.store._removeItemStore([post.articleUuid], post.authorUuid, true);
        this.store._addItemStore(post, false);
        this.store._triggerStore(this, post, "publish");
    },

    onDeleteUserPostCompleted: function(data) {
        this.store._removeItemStore(data.uuids, data.authorUuid);
        this.store._triggerStore(this, data, "delOk");
    },
});

export { EProductStore, ArticleStore };
export default ArticleStore;
