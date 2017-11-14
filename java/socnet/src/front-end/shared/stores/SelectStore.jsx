/**
 * Written by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _         from 'lodash';
import Reflux    from 'reflux';
import Actions   from 'vntd-root/actions/Actions.jsx';

let SelectStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    init: function() {
    }


});

export default SelectStore;
