/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import _             from 'lodash';
import Actions       from 'vntd-root/actions/Actions.jsx';
import {ErrorAction} from 'vntd-shared/actions/ErrorDispatch.jsx';

let ErrorStore = Reflux.createStore({
    data: {},
    listenables: [
        Actions,
        ErrorAction
    ],

    _commonStore: function(error) {
        let data = this.data;
        data.respJSON = error.getRespJSON();
        data.respText = error.getRespText();
        data.errorCode = error.getErrorCode();

        if (data.respJSON != null) {
            data.serverText = data.respJSON.message;
        }
        this.trigger(this.data);
    },

    init: function() {
        this.data = {
            detail    : "",
            respText  : "",
            respJSON  : {},
            errorCode : 0,
            serverText: "",
            userReport: {}
        }
    },

    getErrorData: function() {
        return this.data;
    },

    getUserReport: function() {
        return this.data.userReport;
    },

    onAuthRequiredCompleted: function(cbObj) {
        this.data.userReport = {
            text: "You need to register or login",
            help: "Please register or login to post or comment"
        };
        console.log("trigger store");
        console.log(this.data.userReport);
        console.log(this.data);
        cbObj.failed(this.data.userReport);
        this.trigger(this.data.userReport);
    },

    onError300Failed: function(error) {
        this.generic = "300";
        this._commonStore(error);
    },

    onError400Failed: function(error) {
        this.generic = "400";
        this._commonStore(error);
    },

    onError450Failed: function(error) {
        this.generic = "500";
        this._commonStore(error);
    },

    onServerFailed: function(error) {
        this.generic = "Server error";
        this._commonStore(error);
    },

    onUserFailed: function(drror) {
        this.generic = "User error";
        this._commonStore(error);
    },

    onPermissionFailed: function(error) {
        this.generic = "Auth error";
        this._commonStore(error);
    },

    exports: {
    }
});

export default ErrorStore; 
