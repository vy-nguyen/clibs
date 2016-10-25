/**
 * Modified by Vy Nguyen (2016).
 */
'use strict';

import Reflux from 'reflux';

let NavigationActions = Reflux.createActions({

    activate:     { children:    ['completed'] },
    getItems:     { asyncResult: true },

    /* Button action */
    buttonChange:       { children:    ['completed'] },
    buttonChangeFailed: { children:    ['failed'] }
});

NavigationActions.getItems.listen(function() {
    $.getJSON('api/menu-items')
        .then(this.completed, this.failed)
});

NavigationActions.activate.listen(function(item) {
    this.completed(item);
});

NavigationActions.buttonChange.listen(function(btnId) {
    this.completed(btnId);
});

NavigationActions.buttonChangeFailed.listen(function(btnId) {
    this.failed(btnId);
});

export default NavigationActions
