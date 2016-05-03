/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

export default class ErrorDispatch
{
    constructor(xhdr, text, error) {
        this.xhdr = xhdr;
        this.error = error;
        this.text  = text;
    }

    getXHDR() {
        return this.xhdr;
    }

    getError() {
        return this.error;
    }

    getText() {
        return this.text;
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
}
