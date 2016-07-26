/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import {Route, Redirect, IndexRoute, DefaultRoute} from 'react-router';

import Layout        from './pages/layout/Layout.jsx';
import Public        from './pages/public/Public.jsx';
import MainPage      from './pages/public/MainPage.jsx';
import {Login}       from './pages/login/Login.jsx';
import Logout        from './pages/login/Logout.jsx';
import Register      from './pages/login/Register.jsx';
import RecoverAcct   from './pages/login/Forgot.jsx';
import Blog          from './pages/blog/Blog.jsx';
import Timeline      from './pages/blog/Timeline.jsx';
import NewsFeed      from './pages/news-feed/NewsFeed.jsx';
import SocialWall    from './pages/wall/SocialWall.jsx';
import ProductView   from './pages/e-store/ProductView.jsx';
import ProductDetail from './pages/e-store/ProductDetail.jsx';
import UserHome      from './pages/user/UserHome.jsx';
import UserAccount   from './pages/user/UserAccount.jsx';
import UserTrans     from './pages/user/UserTransaction.jsx';
import UserProfile   from './pages/user/UserProfile.jsx';
import UserConnect   from './pages/user/UserConnect.jsx';
import ListUsers     from './pages/admin/ListUsers.jsx';
import MainBlog      from './pages/blog/MainBlog.jsx';
import LoginRequired from 'vntd-shared/utils/LoginRequired.jsx';

const Routes = (
    <Route>
        <Route path="/" component={Layout} url={"/public/start"}>
            <IndexRoute component={MainPage}/>
            <Redirect from="/" to ="public"/>
            <Route path="public">
                <Route path="blogs" component={MainBlog} subHeader={true}/>
                <Route path="vietnam" component={NewsFeed} subHeader={true}/>
                <Route path="economic" component={NewsFeed} subHeader={true}/>
                <Route path="education" component={NewsFeed} subHeader={true}/>
                <Route path="tech" component={Blog} subHeader={true}/>
            </Route>

            <Redirect from="public" to="public/proto"/>
            <Route path="public/proto">
                <IndexRoute component={SocialWall}/>
                <Route path="blog" component={Blog} subHeader={true}/>
                <Route path="timeline" component={Timeline} subHeader={true}/>
                <Route path="wall" component={SocialWall} subHeader={true}/>
                <Route path="news" component={NewsFeed} subHeader={true}/>
            </Route>

            <Redirect from="public/proto" to="public/proto/estore"/>
            <Route path="public/proto/estore">
                <IndexRoute component={ProductView}/>
                <Route path="product-view" component={ProductView} subHeader={true}/>
                <Route path="product-detail" component={ProductDetail} subHeader={true}/>
            </Route>

            <Redirect from="/" to="login"/>
            <Route path="login">
                <IndexRoute component={Login}/>
                <Route path="logout" component={Logout}/>
            </Route>
            
            <Redirect from="/" to="register"/>
            <Route path="register">
                <IndexRoute component={Register}/>
                <Route path="form" component={Register}/>
                <Route path="recover" component={RecoverAcct}/>
            </Route>

            <Route handler={LoginRequired}>
                <Redirect from="/" to="api"/>
                <Route path="api">
                </Route>

                <Redirect from="/" to="admin"/>
                <Route path="admin">
                    <IndexRoute component={UserConnect} userList={null}/>
                    <Route path="list-users" component={ListUsers} userList={null}/>
                </Route>

                <Redirect from="/" to="user"/>
                <Route path="user">
                    <IndexRoute  component={UserHome}/>
                    <Route path="profile" component={UserProfile}/>
                    <Route path="account" component={UserAccount}/>
                    <Route path="transaction" component={UserTrans}/>
                    <Route path="all" component={UserConnect} userList={null}/>
                    <Route path=":userUuid" component={UserHome}/>
                </Route>
            </Route>
        </Route>
    </Route>
);

export default Routes;
