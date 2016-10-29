/**
 * Vy Nguyen (2016)
 */
'use strict';

import React       from 'react-mod';
import Router      from 'react-router';
import UserStore   from '../stores/UserStore.jsx';

class LoginRequired extends React.Component
{
    static willTransitionTo(transition, params, query, callback) {
        if (!UserStore.isLogin()) {
            transition.redirect("/login", null, {redirect: transition.path});
        }
        callback();
    }

    render() {
        return <Router.RouterHandler/>;
    }
}

export default LoginRequired;
