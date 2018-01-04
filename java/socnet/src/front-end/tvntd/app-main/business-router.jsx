/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _     from 'lodash';
import React from 'react-mod';
import {Route, Redirect, IndexRoute, DefaultRoute} from 'react-router';

import BusLayout     from 'vntd-shared/layout/BusinessLayout.jsx';
import LoginRequired from 'vntd-shared/utils/LoginRequired.jsx';
import Logout        from 'vntd-root/pages/login/Logout.jsx';
import Register      from 'vntd-root/pages/login/Register.jsx';
import RecoverAcct   from 'vntd-root/pages/login/Forgot.jsx';
import CustLogin     from 'vntd-root/pages/personal/Login.jsx';
import BusinessMain  from 'vntd-root/pages/business/MainPage.jsx';
import AboutUs       from 'vntd-root/pages/business/AboutUs.jsx';
import Blog          from 'vntd-root/pages/business/Blog.jsx';
import Contact       from 'vntd-root/pages/business/Contact.jsx';
import Email         from 'vntd-root/pages/business/Email.jsx';
import Product       from 'vntd-root/pages/business/Product.jsx';
import Account       from 'vntd-root/pages/business/Account.jsx';
import Catalog       from 'vntd-root/pages/business/Catalog.jsx';
import Search        from 'vntd-root/pages/business/Catalog.jsx';
import Documentation from 'vntd-root/pages/business/Documentation.jsx';

const routeMap = [ {
    path: "/catalog/:name",
    key : "Catalog",
    comp: Catalog
}, {
    path: "/blog",
    key : "Blog",
    comp: Blog
}, {
    path: "/aboutus",
    key : "About Us",
    comp: AboutUs
}, {
    path: "/documentation",
    key : "Documentation",
    comp: Documentation
}, {
    path: "/account/:name",
    key : "Account",
    comp: Account
}, {
    path: "/product",
    key : "Product",
    comp: Product
}, {
    path: "/email",
    key : "Email",
    comp: Email
}, {
    path: "/contact/:name",
    key : "Contact",
    comp: Contact
}, {
    path: "/search",
    key : "Search",
    comp: Search
} ];

let _mainRoutes = routeMap.map(function(entry) {
    return (
        <Route path={entry.path} component={entry.comp}/>
    );
});

function lookupPathKey(path) {
}

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

            {_mainRoutes}
            {_loginRequired}
        </Route>

        {_custLoginRoutes}
        {_registerRoutes}
    </Route>
);

export default Routes;
