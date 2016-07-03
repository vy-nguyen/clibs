/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import _             from 'lodash';
import {ErrorAction} from 'vntd-shared/actions/ErrorDispatch.jsx';

let ErrorStore = Reflux.createStore({
    data: {},
    listenables: [ErrorAction],

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
            serverText: ""
        }
    },

    getErrorData: function() {
        return this.data;
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
