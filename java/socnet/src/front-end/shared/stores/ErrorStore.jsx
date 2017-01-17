/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import Actions       from 'vntd-root/actions/Actions.jsx';

class ErrorResp {
    constructor(id, resp, text, error) {
        this.errorId = id;
        if (resp == null) {
            this.resp = null;
            this.userText = text;
            this.errorCodeText = error;
        } else {
            this.updateError(resp, null, null);
        }
    }

    getErrorId() {
        return this.errorId;
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

    reportErrMesg: function(id, text, helpText) {
        if (id == null) {
            return;
        }
        let err = this.data[id];
        if (err == null) {
            this.data[id] = new ErrorResp(id, null, text, null);
            err = this.data[id];
        }
        err.updateUserText(text, helpText);
        this.trigger(this.data, err);
        return err;
    },

    reportFailure: function(id, resp, text, error) {
        let err = this.data.error;
        if (id != null) {
            err = this.data[id];
        }
        if (err != null) {
            err.updateError(resp, null, null);
        } else {
            err = new ErrorResp(id, resp, text, error);
            if (id != null) {
                this.data[id] = err;
            } else {
                this.data.error = err;
            }
        }
        this.trigger(this.data, err);
        return err;
    },

    reportInfo: function(id, userText, userHelp) {
        let error = this.reportFailure(id, null, null, null);
        error.updateUserText(userText, userHelp);
        return error;
    },

    clearError: function(id) {
        let err = this.data.error;
        if (id != null) {
            err = this.data[id];
        }
        if (err != null) {
            err.clearError();
            this.trigger(this.data, err);
        }
    },

    hasError: function(id, mesg) {
        if (id != null) {
            let err = this.data[id];
            if (err != null) {
                return err.hasError() ? err : null;
            }
            return null;
        }
        if (mesg === true) {
            return null;
        }
        if (this.data.error != null) {
            return this.data.error.hasError() ? this.data.error : null;
        }
        return null;
    },

    onAuthRequiredCompleted: function(id, context) {
        this.reportInfo(id, "You need to register or login", "Please register or login to post or comment");
        this.trigger(this.data, null);
    },

    onPermissionFailed: function(error) {
    },

    dumpData: function(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
});

export default ErrorStore; 
