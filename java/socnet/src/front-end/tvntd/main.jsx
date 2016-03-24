/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

window.jQuery = window.$ = require("jquery");
window._                 =  require("lodash");
window.GlobalConfigs     = require('./config/config');

require("jquery-ui");
require("bootstrap");
require("fastclick");
require("moment");
require("moment-timezone");
require("fullcalendar");
require("notification");
require("smartwidgets");
require("sparkline");

import React    from 'react-mod';
import {render} from 'react-dom';
import {Router} from 'react-router';
import History  from 'vntd-shared/utils/History.jsx';
import Routes from './tvntd-router.jsx'

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
