/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux   from 'reflux';

/**
 * Error notification action.
 */
const completedFailedFn = {
    children: ['completed', 'failed']
};

let ErrorAction = Reflux.createActions({
    error300: completedFailedFn,
    error400: completedFailedFn,
    error500: completedFailedFn,

    server  : completedFailedFn,
    user    : completedFailedFn,
    permission: completedFailedFn
});

ErrorAction.error300.listen(function(error) {
    this.failed(error);
});

ErrorAction.error400.listen(function(error) {
    this.failed(error);
});

ErrorAction.error500.listen(function(error) {
    this.failed(error);
});

ErrorAction.server.listen(function(error) {
    this.failed(error);
});

ErrorAction.user.listen(function(error) {
    this.failed(error);
});

ErrorAction.permission.listen(function(error) {
    this.failed(error);
});

class ErrorDispatch
{
    constructor(xhdr, text, error) {
        this.xhdr = xhdr;
        this.error = error;
        this.text  = text;
        return this;
    }

    getXHDR() {
        return this.xhdr;
    }

    getErrorCode() {
        return this.xhdr.status;
    }

    getError() {
        return this.error;
    }

    getText() {
        return this.text;
    }

    handle() {
        let status = this.xhdr.status;
        if (status === 0) {
            console.log("no error");
        } else if (200 <= status && status < 300) {
            return;

        } else if (300 <= status && status < 400) {
            ErrorAction.error300(this);

        } else if (400 <= status && status < 500) {
            ErrorAction.error400(this);

        } else {
            ErrorAction.error500(this);
        }
    }

    getRespJSON() {
        return this.xhdr.responseJSON;
    }

    getRespText() {
        return this.xhdr.response;
    }

    dispatch(serverFail, clientFail, cbArg) {
        let status = this.xhdr.status;

        if (200 <= status && status < 300) {
            return;
        }
        if (300 <= status && status < 400) {

        } else if (400 <= this.xhdr.status && this.xhdr.status < 500) {
            if (clientFail) {
                clientFail(this, cbArg);
            }
        } else {
            if (serverFail) {
                serverFail(this, cbArg);
            }
        }
    }

    dispatchDefault(mesgText, mesgDiv) {
        let status = this.xhdr.status;

        if (200 <= status && status < 300) {
            return;
        }
        let mesg = this.error;
        if (this.xhdr.responseJSON) {
            mesg = this.xhdr.responseJSON.message;
        }
        $(mesgText).empty().html(mesg + " (code " + status + ")");
        $(mesgDiv).show();
    }
}

export { ErrorAction }
export default ErrorDispatch;
