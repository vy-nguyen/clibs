/**
 * Written by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import Reflux         from 'reflux';
import Actions        from 'vntd-root/actions/Actions.jsx';
import CommonStore    from 'vntd-root/stores/CommonStore.jsx';
import {AdsStore}     from 'vntd-root/stores/ArticleStore.jsx';

let AdPropertyStore = Reflux.createStore({
    store: {},
    listenables: Actions,

    init: function() {
        this.store = new CommonStore('realtor');
    },

    getAdsByUuid: function(uuid, authorUuid) {
        return this.store.getItemByUuid(uuid, authorUuid);
    },

    getAdsFeatures: function() {
        if (this.featureMenu == null) {
            Actions.getFeatureAds({});
            return null;
        }
        return this.featureMenu;
    },

    onPostRealtorAdsCompleted: function(res) {
        console.log("result from store ads");
        console.log(res);
        this.store.onPublishItemCompleted(res, this);
    },

    onPostRealtorAdsFailure: function(res) {
        this.store.onPublishItemFailure(res, this);
    },

    onDeleteRealtorAdsCompleted: function(data) {
        this.store.onDeleteItemCompleted(data, this);
    },

    onGetRealtorAdsCompleted: function(data) {
        this.store.onGetPublishItemCompleted(data, 'ads', this);
    },

    onGetRealtorAdsFailure: function(data) {
        this.store.onGetPublishItemFailure(data, this);
    },

    onGetFeatureAdsCompleted: function(res) {
        console.log("complete get feature ads");
        console.log(res);
    },

    updateMissingUuid: function(uuids) {
        this.store.updateMissingUuid(uuids);
    },

    updatePublicTags: function(tags) {
        this.store.updatePublicTags(tags, Actions.getPublishAds);
    },

    requestAds: function() {
        this.store.requestItems(Actions.getPublishAds);
    },

    dumpData: function(header) {
        this.store.dumpData(header);
    }
});

export default AdPropertyStore;
