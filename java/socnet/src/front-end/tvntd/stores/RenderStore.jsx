/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux         from 'reflux';
import Actions        from 'vntd-root/actions/Actions.jsx';
import ErrorDispatch  from 'vntd-shared/actions/ErrorDispatch.jsx';

class ErrorHandler extends ErrorDispatch
{
    handleServerError(xhdr, text) {
        console.log("Override error handler");
        return true;
    }
}

let RenderStore = Reflux.createStore({
    data: {
        menuItems: []
    },
    listenables: [Actions],

    getMenuItems: function() {
        return this.data.menuItems;
    },

    onStartupCompleted: function(json) {
        console.log("Startup done");
        console.log(json);
    },

    onStartupFailed: function(xhdr, text, status) {
        let error = new ErrorHandler(xhdr, text, status);
        error.dispatch();
        error = null;
    }
});

export default RenderStore;
