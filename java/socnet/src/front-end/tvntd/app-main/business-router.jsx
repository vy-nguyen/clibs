/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import {Route, Redirect, IndexRoute, DefaultRoute} from 'react-router';

import BusLayout     from 'vntd-shared/layout/BusinessLayout.jsx';
import {Login}       from 'vntd-root/pages/login/Login.jsx';
import Logout        from 'vntd-root/pages/login/Logout.jsx';
import Register      from 'vntd-root/pages/login/Register.jsx';
import RecoverAcct   from 'vntd-root/pages/login/Forgot.jsx';
import LoginRequired from 'vntd-shared/utils/LoginRequired.jsx';

import BusinessMain  from 'vntd-root/pages/business/MainPage.jsx';

const _publicBusiness = (
    <Route path="/bus">
        <IndexRoute component={BusinessMain}/>

    </Route>
),

_loginRoutes = (
    <Route path="/login">
        <IndexRoute component={Login}/>
        <Route path="logout" component={Logout}/>
    </Route>
),

_registerRoutes = (
    <Route path="/register">
        <IndexRoute component={Register}/>
        <Route path="form" component={Register}/>
        <Route path="recover" component={RecoverAcct}/>
    </Route>
),

_loginRequired = (
    <Route handler={LoginRequired}>
        <Redirect from="/" to="/api"/>
        <Route path="/api">
        </Route>

        <Redirect from="/" to="/admin"/>
        <Route path="/admin">
        </Route>

        <Redirect from="/" to="/user"/>
        <Route path="/user">
        </Route>

        <Redirect from="/" to="/domain"/>
        <Route path="/domain">
        </Route>

        <Redirect from="/" to="/newsfeed"/>
        <Route path="/newsfeed">
        </Route>
    </Route>
),

Routes = (
    <Route>
        <Route path="/" component={BusLayout}>
            <IndexRoute component={BusinessMain}/>
            {_publicBusiness}
        </Route>
    </Route>
),
    
_custLoginRoutes = (
    <Route path="/login">
        <Route path="/logout" component={Logout}/>
    </Route>
);

export default Routes;
export { Routes };
