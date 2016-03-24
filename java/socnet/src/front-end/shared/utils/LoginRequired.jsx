/**
 * Vy Nguyen (2016)
 */
'use strict';

import React       from 'react-mod';
import Router      from 'react-router';
import UserStore   from '../stores/UserStore.jsx';

let LoginRequired = React.createClass({
    statics: {
        willTransitionTo: function(transition, params, query, callback) {
            if (!UserStore.isLogin()) {
                transition.redirect("/login", null, {redirect: transition.path});
            }
            callback();
        }
    },

    render: function() {
        return <Router.RouterHandler/>;
    }
});

export default LoginRequired
