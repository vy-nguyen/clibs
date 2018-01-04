/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import {Route, Redirect, IndexRoute, DefaultRoute} from 'react-router';

import BusLayout     from 'vntd-shared/layout/BusinessLayout.jsx';
import LoginRequired from 'vntd-shared/utils/LoginRequired.jsx';
import Logout        from 'vntd-root/pages/login/Logout.jsx';
import Register      from 'vntd-root/pages/login/Register.jsx';
import RecoverAcct   from 'vntd-root/pages/login/Forgot.jsx';
import CustLogin     from 'vntd-root/pages/personal/Login.jsx';
import BusinessMain  from 'vntd-root/pages/business/MainPage.jsx';

const _registerRoutes = (
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
    </Route>
),

_custLoginRoutes = (
    <Route path="/login">
        <IndexRoute component={CustLogin}/>
        <Route path="/logout" component={Logout}/>
    </Route>
),

Routes = (
    <Route>
        <Route path="/" component={BusLayout} url="/public/get-json/json/drugstore">
            <IndexRoute component={BusinessMain}/>
        
            <Route path="/catalog/:name">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/blog">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/aboutus">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/documentation">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/account/:name">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/product/:name">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/email">
                <IndexRoute component={BusinessMain}/>
            </Route>
            <Route path="/contact/:name">
                <IndexRoute component={BusinessMain}/>
            </Route>

            {_custLoginRoutes}
            {_registerRoutes}
            {_loginRequired}
        </Route>
    </Route>
);
    
export default Routes;
export { Routes };
