/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

window.GlobalConfigs = require('./config/config');
window.jQuery = require('jquery');
window.$ = window.jQuery;

require("bootstrap");
require("smartwidgets");
require("jquery-nestable");

import React    from 'react-mod';
import {render} from 'react-dom';
import {Router} from 'react-router';
import History  from 'vntd-shared/utils/History.jsx';
import Routes   from './tvntd-router.jsx'

require.ensure([], function(require) {
    var rootInstance = render((
        <Router history={History}>
            {Routes}
        </Router>
    ), document.getElementById('tvntd-root'));

    if (module.hot) {
        require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
            getRootInstances: function() {
                return [rootInstance];
            }
        });
    }
});
