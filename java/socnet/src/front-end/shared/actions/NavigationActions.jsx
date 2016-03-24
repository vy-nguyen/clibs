/**
 * Created by griga on 11/24/15.
 */

import Reflux from 'reflux'

let NavigationActions = Reflux.createActions({
    activate: {},
    getItems: {asyncResult: true},
    fromMap: {}
});

NavigationActions.getItems.listen(() => {
    $.getJSON('api/menu-items')
        .then( this.completed, this.failed )
});

export default NavigationActions
