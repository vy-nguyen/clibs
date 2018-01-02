/**
 * Copyright by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import Reflux from 'reflux';
import $      from 'jquery';

import { postRestCall, getJSON } from './Actions.jsx';

const completedFailedFn = {
    children: ['completed', 'faled']
},
completedFailedAlwaysFn = {
    children: ['completed', 'failed', 'always']
};

const Actions = Reflux.createActions({
    startup:          completedFailedFn,
    startupLayout:    completedFailedFn
});

Actions.startup.listen(function(url) {
    $('[data-toggle="tooltip"]').tooltip();
    getJSON(url, this, false, "startup", null, true);
});

Actions.startupLayout.listen(function(url) {
    $('[data-toggle="tooltip"]').tooltip();
    getJSON(url, this, false, "startup", null, true);
});

export default Actions;
