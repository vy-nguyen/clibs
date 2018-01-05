/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import Reflux       from 'reflux';
import Actions      from 'vntd-root/actions/BusinessActions.jsx';

class BusinessInfo
{
    constructor(json) {
        _.forOwn(json, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    getArticle() {
        return this;
    }
}

let BusinessStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    init() {
        this.data = {
            layout: {}
        };
    },

    onStartupLayoutCompleted(json) {
        this.data.layout = json;
        this.busInfo = new BusinessInfo(json.busInfo);

        this._parseLayoutJson(json);
        this.trigger(this.data, json, 'startup');
    },

    mainStartup(json) {
    },

    getBranchInfo() {
        return this.data.branchInfo;
    },

    getNavbarFormat() {
        return this.data.layout.navbarFormat;
    },

    getBusinessInfo() {
        return this.busInfo;
    },

    getTopBanner() {
        return this.data.layout.topBanner || {};
    },

    getCopyright() {
        return this.data.layout.copyright || {};
    },

    getNavbarLeft() {
        return this.data.navbarLeft;
    },

    getNavbarRight() {
        return this.data.navbarRight;
    },

    getSideNav() {
        return this.data.layout.sidebar || {};
    },

    getSideNavFormat() {
        return this.data.layout.sidebarFormat || {};
    },

    getFooter() {
        return this.data.layout.footer || {};
    },

    getMainPage() {
        return this.data.layout.mainPage || {};
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
