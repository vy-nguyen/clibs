/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import Actions       from 'vntd-root/actions/Actions.jsx';

class Error {
    constructor(resp, text, error) {
        this.updateError(resp, null, null);
    }

    getContext() {
        return this.resp.cbContext;
    }

    getErrorCode() {
        return this.resp.status;
    }

    getErrorCodeText() {
        return this.errorCodeText;
    }

    getUserText() {
        return this.userText;
    }

    getUserHelp() {
        return this.userHelp;
    }

    hasError() {
        return (this.error != null);
    }

    clearError() {
        this.error = null;
    }

    updateUserText(userText, userHelp) {
        if (userText != null) {
            this.userText = userText; 
            this.userHelp = userHelp;
            if (this.error == null) {
                this.error = this.userText;
            }
        }
    }

    updateError(resp, userText, userHelp) {
        this.resp = resp;
        this.errorCodeText = null;
        this.parseError();
        this.updateUserText(userText, userHelp);
    }

    parseError() {
        if (this.resp == null) {
            return;
        }
        let status = this.resp.status;
        if (status === 0 || (200 <= status && status < 300)) {
            this.error = null;
            return;
        }
        if (300 <= status && status < 400) {
            this.errorCodeText = this.resp.statusText;
            this.userText = "Error 300";
            this.userHelp = "Refresh the page";

        } else if (400 <= status && status < 500) {
            this.errorCodeText = this.resp.statusText;
            this.userText = "Error 400";
            this.userHelp = "Refresh the page";

        } else {
            this.errorCodeText = this.resp.statusText;
            this.userText = "Error 500";
            this.userHelp = "Refresh the page";
        }
        this.error = this.errorCodeText;
        if (this.resp.responseJSON != null) {
            this.userText = this.resp.responseJSON.message;
            this.userHelp = this.resp.responseJSON.action;
        }
    }
}

let ErrorStore = Reflux.createStore({
    data: {},
    listenables: [
        Actions
    ],

    init: function() {
        this.data = {}
    },

    getErrorData: function() {
        return this.data;
    },

    getUserReport: function() {
        return this.data.userReport;
    },

    reportFailure: function(id, resp, text, error) {
        if (id != null) {
            if (this.data[id] == null) {
                this.data[id] = new Error(resp, text, error);
            } else {
                this.data[id].updateError(resp, null, null);
            }
            this.trigger(this.data);
            return this.data[id];
        }
        if (this.data.error == null) {
            this.data.error = new Error(resp, text, error);
        } else {
            this.data.error.updateError(resp, null, null);
        }
        this.trigger(this.data);
        return this.data.error;
    },

    reportInfo: function(id, userText, userHelp) {
        let error = this.reportFailure(id, null, null, null);
        error.updateUserText(userText, userHelp);
        return error;
    },

    clearError: function(id) {
        if (id != null) {
            if (this.data[id] != null) {
                this.data[id].clearError();
                this.trigger(this.data);
            }
        } else if (this.data.error != null) {
            this.data.error.clearError();
            this.trigger(this.data);
        }
    },

    hasError: function(id) {
        if (id != null) {
            let err = this.data[id];
            if (err != null) {
                return err.hasError() ? err : null;
            }
            return null;

        } else if (this.data.error != null) {
            return this.data.error.hasError() ? this.data.error : null;
        }
        return null;
    },

    onAuthRequiredCompleted: function(id, context) {
        this.reportInfo(id, "You need to register or login", "Please register or login to post or comment");
        this.trigger(this.data);
    },

    onPermissionFailed: function(error) {
    },

    exports: {
    }
});

export default ErrorStore; 
