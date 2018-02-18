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
        if (res.featureMenu != null) {
            this.updateFeatureMenu(res.featureMenu);
        }
        this.store.onGetPublishItemCompleted(res, 'uuidList', this);
    },

    updateFeatureMenu(menu) {
        if (this.featureMenu == null) {
            this.featureMenu = {
                value: "main",
                title: "Feature Ads"
            };
        }
        let usa = menu.usa.selOpt;
        this.featureMenu.selOpt = menu.tagMenu.selOpt;
        _.forEach(this.featureMenu.selOpt, function(entry) {
            entry.selOpt = usa;
        });
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

    getAllAds: function() {
        return this.store.data.itemsByUuid;
    },

    dumpData: function(header) {
        this.store.dumpData(header);
        console.log(this.featureMenu);
    }
});

export default AdPropertyStore;
