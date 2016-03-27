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

    handleServerError(xhdr, text, cbArg) {
        return false;
    }

    handle400Error(xhdr, text, cbArg) {} 
    handle401Error(xhdr, text, cbArg) {}

    handle404Error(xhdr, text, cbArg) {
        console.log("In 404 base class");
        console.log(xhdr);
        console.log(text);
    }

    handle500Error(xhdr, text, cbArg) {
        console.log("In 500 base class");
    }

    dispatch(cbArg) {
        if (this.xhdr.status == 200) {
            return;
        }
        if (this.handleServerError(this.xhdr, this.text, cbArg) == true) {
            return;
        }
        switch (this.xhdr.status) {
        case 400:
            this.handle400Error(this.xhdr, this.text, cbArg);
            break;

        case 401:
            this.handle401Error(this.xhdr, this.text, cbArg);
            break;

        case 404:
            this.handle404Error(this.xhdr, this.text, cbArg);
            break;

        case 500:
            this.handle500Error(this.xhdr, this.text, cbArg);
            break;

        default:
            break;
        }
    }
}
