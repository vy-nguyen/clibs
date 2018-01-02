/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

window.GlobalConfigs = require('vntd-root/config/config');
window.jQuery = require('jquery');
window.$ = window.jQuery;

require("bootstrap");
require("smartwidgets");
require("jquery-nestable");

import React     from 'react-mod';
import {render}  from 'react-dom';
import {Router}  from 'react-router';
import History   from 'vntd-shared/utils/History.jsx';
import BusRoutes from './business-router.jsx'

require.ensure([], function(require) {
    let rootInstance;

    rootInstance = render((
        <Router history={History}>
            {BusRoutes}
        </Router>
    ), document.getElementById('business-root'));

    if (module.hot) {
        require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
            getRootInstances: function() {
                return [rootInstance];
            }
        });
    }
});
