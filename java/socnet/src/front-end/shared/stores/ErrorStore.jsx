/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import Actions       from 'vntd-root/actions/Actions.jsx';
import Lang          from 'vntd-root/stores/LanguageStore.jsx';

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
        return this.resp != null ? this.resp.cbContext : null;
    }

    getErrorCode() {
        return this.resp != null ? this.resp.status : "0";
    }

    getErrorHeader() {
        return this.errorCodeText;
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

    getFormatStyle() {
        return this.messageStyle != null ? this.messageStyle : "alert alert-danger";
    }

    hasError() {
        return (this.error != null);
    }

    clearError() {
        this.error = null;
        this.messageStyle = null;
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

    updateMessage(header, style, message) {
        this.resp = null;
        this.errorCodeText = header;
        this.messageStyle  = style;
        this.userText = this.error = message;
    }

    updateError(resp, userText, userHelp) {
        this.resp = resp;
        this.errorCodeText = null;
        this.parseError();
        this.updateUserText(userText, userHelp);
    }

    parseError() {
        let status, json;

        if (this.resp == null) {
            return;
        }
        json   = this.resp.responseJSON;
        status = this.resp.status;
        if (status === 0 || (200 <= status && status < 300)) {
            this.error = null;
            return;
        }
        if (json != null) {
            this.userText = Lang.translate(json.message);
            this.userHelp = Lang.translate(json.error);
            this.errorCodeText = json.type;
        } else {
            if (300 <= status && status < 400) {
                this.errorCodeText = this.resp.statusText;
                this.userText = "Error 300";
                this.userHelp = Lang.translate("Refresh the web browser");

            } else if (400 <= status && status < 500) {
                this.errorCodeText = this.resp.statusText;
                this.userText = "Error 400";
                this.userHelp = Lang.translate("Refresh the web browser");

            } else {
                this.errorCodeText = this.resp.statusText;
                this.userText = "Error 500";
                this.userHelp = Lang.translate("Refresh the web browser");
            }
        }
        this.error = this.errorCodeText;
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

    /**
     * Trigger the error when we know the error object.
     */
    triggerError: function(id, err) {
        if (id == null || err == null) {
            return null;
        }
        err.errorId   = id;
        this.data[id] = err;
        this.trigger(this.data, err);
        return err;
    },

    reportErrMesg: function(id, text, helpText) {
        if (id == null) {
            return null;
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

    /**
     * Report message to hidden Error dialog matching with the id.
     */
    reportMesg: function(id, header, style, mesg) {
        if (id == null) {
            return null;
        }
        let err = this.data[id];
        if (err == null) {
            this.data[id] = new ErrorResp(id, null, mesg, null);
            err = this.data[id];
        }
        err.updateMessage(header, style, mesg);
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
        this.reportInfo(id, Lang.translate("You need to login first"),
                        Lang.translate("Please login to post or comment"));
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
