/**
 * Created by Vy Nguyen (2016)
 */
'use strict';

export default class ErrorDispatch
{
    constructor(xhdr, text, error) {
        this.xhdr = xhdr;
        this.error = error;
        this.text  = text;
    }

    handleServerError(xhdr, text) {
        return false;
    }

    handle404Error(xhdr, text) {
        console.log("In 404 base class");
    }

    handle500Error(xhdr, text) {
        console.log("In 500 base class");
    }

    dispatch() {
        if (this.xhdr.status == 200) {
            return;
        }
        if (this.handleServerError(this.xhdr, this.text) == true) {
            return;
        }
        switch (this.xhdr.status) {
        case 400:
            this.handle404Error(this.xhdr, this.text);
            break;

        case 500:
            this.handle500Error(this.xhdr, this.text);
            break;

        default:
            break;
        }
    }
}
