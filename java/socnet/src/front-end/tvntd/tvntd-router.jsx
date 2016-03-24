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
            <Redirect from="/" to ="/public"/>
            <Route path="public" component={Public} subHeader={true}>
                <Route path="aboutus" component={Public}/>
            </Route>

            <Redirect from="articles" to="articles/politics"/>
            <Route path="articles">
                <Route path="politics" component={NewsFeed} subHeader={true} url={"/api/articles/politics"}/>
                <Route path="economics" component={NewsFeed} subHeader={true} url={"/api/articles/economics"}/>
                <Route path="finances" component={NewsFeed} subHeader={true} url={"/api/articles/finances"}/>
                <Route path="forum" component={NewsFeed} subHeader={true} url={"/api/articles/forum"}/>
            </Route>

            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
            <Route path="recover" component={RecoverAcct}/>
            <Route path="blog" component={Blog}/>
            <Route path="timeline" component={Timeline} subHeader={true}/>
            <Route path="social" component={SocialWall} subHeader={true}/>

            <Redirect from="estore" to="estore/product-view"/>
            <Route path="estore">
                <Route path="product-view" component={ProductView}/>
                <Route path="product-detail" component={ProductDetail}/>
            </Route>

            <Route handler={LoginRequired}>
            </Route>
        </Route>
    </Route>
);

export default Routes;
