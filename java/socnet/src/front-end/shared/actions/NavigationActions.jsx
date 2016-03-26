/**
 * Created by griga on 11/24/15.
 * Modified by Vy Nguyen (2016).
 */
'use strict';

import Reflux from 'reflux';

let NavigationActions = Reflux.createActions({

    activate:     { children:    ['completed'] },
    getItems:     { asyncResult: true }
});

NavigationActions.getItems.listen(function() {
    $.getJSON('api/menu-items')
        .then(this.completed, this.failed)
});

NavigationActions.activate.listen(function(item) {
    this.completed(item);
});

export default NavigationActions
