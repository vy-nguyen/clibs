/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import {Route, Redirect, IndexRoute, DefaultRoute} from 'react-router';

import Layout        from './pages/layout/Layout.jsx';
import Public        from './pages/public/Public.jsx';
import {Login}       from './pages/login/Login.jsx';
import Register      from './pages/login/Register.jsx';
import RecoverAcct   from './pages/login/Forgot.jsx';
import Blog          from './pages/blog/Blog.jsx';
import Timeline      from './pages/blog/Timeline.jsx';
import NewsFeed      from './pages/news-feed/NewsFeed.jsx';
import SocialWall    from './pages/wall/SocialWall.jsx';
import ProductView   from './pages/e-store/ProductView.jsx';
import ProductDetail from './pages/e-store/ProductDetail.jsx';
import LoginRequired from 'vntd-shared/utils/LoginRequired.jsx';

const Routes = (
    <Route>
        <Route path="/" component={Layout} url={"/public/start"}>
            <IndexRoute component={Public}/>
            <Redirect from="/" to ="public"/>
            <Route path="public">
                <Route path="aboutus" component={Public} subHeader={true}/>
                <Route path="vietnam" component={NewsFeed} subHeader={true}/>
                <Route path="economic" component={NewsFeed} subHeader={true}/>
                <Route path="education" component={NewsFeed} subHeader={true}/>
                <Route path="tech" component={Blog} subHeader={true}/>
            </Route>

            <Redirect from="public" to="public/proto"/>
            <Route path="public/proto">
                <Route path="blog" component={Blog} subHeader={true}/>
                <Route path="timeline" component={Timeline} subHeader={true}/>
                <Route path="wall" component={SocialWall} subHeader={true}/>
                <Route path="news" component={NewsFeed} subHeader={true}/>
            </Route>

            <Redirect from="public/proto" to="public/proto/estore"/>
            <Route path="public/proto/estore">
                <Route path="product-view" component={ProductView} subHeader={true}/>
                <Route path="product-detail" component={ProductDetail} subHeader={true}/>
            </Route>

            <Route path="login" component={Login}/>
            <Redirect from="/" to="register"/>
            <Route path="register">
                <Route path="form" component={Register}/>
                <Route path="recover" component={RecoverAcct}/>
            </Route>

            <Route handler={LoginRequired}>
            </Route>
        </Route>
    </Route>
);

export default Routes;
