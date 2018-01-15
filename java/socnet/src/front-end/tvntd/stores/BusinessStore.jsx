/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import Reflux       from 'reflux';

import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import BizActions   from 'vntd-root/actions/BusinessActions.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';

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

class BusinessStore extends Reflux.Store
{
    constructor() {
        super();
        this.data = {
            layout: {}
        };
        this.listenables = [Actions, BizActions];
    }

    onLoginCompleted(resp, status) {
        console.log("on login completed, biz store " + status);
        console.log("user store");
        console.log(UserStore);
        console.log(this);
    }

    onStartupLayoutCompleted(json) {
        console.log("Biz layout completed");
        this.data.layout = json;
        this.busInfo = new BusinessInfo(json.busInfo);

        UserStore.mainStartup(json);
        this._parseLayoutJson(json);
        this.trigger(this.data, json, 'startup');
    }

    mainStartup(json) {
    }

    hasData() {
        return this.busInfo != null ? true : false;
    }

    getBranchInfo() {
        return this.data.branchInfo;
    }

    getNavbarFormat() {
        return this.data.layout.navbarFormat;
    }

    getBusinessInfo() {
        return this.busInfo;
    }

    getTopBanner() {
        return this.data.layout.topBanner || {};
    }

    getCopyright() {
        return this.data.layout.copyright || {};
    }

    getNavbarLeft() {
        return this.data.navbarLeft;
    }

    getNavbarRight() {
        return this.data.navbarRight;
    }

    getSideNav() {
        return this.data.layout.sidebar || {};
    }

    getSideNavFormat() {
        return this.data.layout.sidebarFormat || {};
    }

    getFooter() {
        return this.data.layout.footer || {};
    }

    getMainPage() {
        return this.data.layout.mainPage || {};
    }

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
    }

    dumpData(text) {
        console.log(text);
        console.log(this.data);
    }
}

var BizStore = Reflux.initStore(BusinessStore);

export default BizStore;
