/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux            from 'reflux';
import Actions           from 'vntd-root/actions/Actions.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import ErrorDispatch     from 'vntd-shared/actions/ErrorDispatch.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';

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
    listenables: [Actions, NavigationActions],

    getMenuItems: function() {
        return this.data.items;
    },

    onActivateCompleted: function(item) {
        Actions.clickMenuItem(item);
    },

    onStartupCompleted: function(json) {
        this.data.menuItems = json.items;

        NavigationStore.replaceMenuItems(this.data.menuItems);
        this.trigger(this.data);
    },

    onStartupFailed: function(xhdr, text, status) {
        let error = new ErrorHandler(xhdr, text, status);
        error.dispatch();
        error = null;
    }
});

export default RenderStore;
