/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import Reflux       from 'reflux';
import Actions      from 'vntd-root/actions/BusinessActions.jsx';

let BusinessStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    init() {
        this.data = {};
    },

    onStartupLayoutCompleted(json) {
        this.data.layout = json;
        this._parseLayoutJson(json);
        this.trigger(this.data, json, 'startup');
    },

    mainStartup(json) {
    },

    getBranchInfo() {
        return this.data.branchInfo;
    },

    getNavbarLeft() {
        return this.data.navbarLeft;
    },

    getNavbarRight() {
        return this.data.navbarRight;
    },

    getSideNav() {
        return this.data.layout.sidebar;
    },

    getFooter() {
        return this.data.layout.footer;
    },

    _parseLayoutJson(json) {
        let data = this.data;

        data.branchInfo  = [];
        data.navbarLeft  = [];
        data.navbarRight = [];

        _.forEach(data.layout.navbar, function(elm) {
            if (elm.brand === true) {
                data.branchInfo.push(elm);
            } else if (elm.left === true) {
                data.navbarLeft.push(elm);
            } else {
                data.navbarRight.push(elm);
            }
        });
    },

    dumpData(text) {
        console.log(text);
        console.log(this.data);
    }
});

export default BusinessStore;
