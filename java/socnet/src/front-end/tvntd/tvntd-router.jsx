/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import {Route, Redirect, IndexRoute, DefaultRoute} from 'react-router';

import Layout        from './pages/layout/Layout.jsx';
import {Login}       from './pages/login/Login.jsx';
import Logout        from './pages/login/Logout.jsx';
import Register      from './pages/login/Register.jsx';
import RecoverAcct   from './pages/login/Forgot.jsx';
import Timeline      from './pages/blog/Timeline.jsx';
import SocialWall    from './pages/wall/SocialWall.jsx';
import UserHome      from './pages/user/UserHome.jsx';
import UserAccount   from './pages/user/UserAccount.jsx';
import UserTrans     from './pages/user/UserTransaction.jsx';
import UserProfile   from './pages/user/UserProfile.jsx';
import UserConnect   from './pages/user/UserConnect.jsx';
import ListUsers     from './pages/admin/ListUsers.jsx';
import SetTags       from './pages/admin/SetTags.jsx';
import MainBlog      from './pages/blog/MainBlog.jsx';
import MainAds       from './pages/ads/MainAds.jsx';
import PublicUrlArt  from './pages/public/PublicUrlArt.jsx';
import NewsFeed      from './pages/news-feed/NewsFeed.jsx';
import LoginRequired from 'vntd-shared/utils/LoginRequired.jsx';

import CustLogin     from './pages/personal/Login.jsx';
import CustMain      from './pages/personal/MainPage.jsx';
import {MainPage, AboutUs}  from './pages/public/MainPage.jsx';

const _publicRoutes = (
    <Route path="public">
        <Route path="aboutus" component={AboutUs}/>
        <Route path="article/:author/:articleUuid" component={PublicUrlArt}/>
        <Route path="ads" component={MainAds} subHeader={false}/>
        <Route path=":blog" component={MainBlog} subHeader={true}/>
        <Route path=":estore" component={MainBlog} subHeader={true}/>
        <Route path=":edu" component={MainBlog} subHeader={true}/>
        <Route path=":news" component={MainBlog} subHeader={true}/>
        <Route path=":tech" component={MainBlog} subHeader={true}/>
    </Route>
),

_publicProtoRoutes = (
    <Route path="public/proto">
        <IndexRoute component={SocialWall}/>
        <Route path="timeline" component={Timeline} subHeader={true}/>
        <Route path="wall" component={SocialWall} subHeader={true}/>
    </Route>
),

_loginRoutes = (
    <Route path="login">
        <IndexRoute component={Login}/>
        <Route path="logout" component={Logout}/>
    </Route>
),

_registerRoutes = (
    <Route path="register">
        <IndexRoute component={Register}/>
        <Route path="form" component={Register}/>
        <Route path="recover" component={RecoverAcct}/>
    </Route>
),

_loginRequired = (
    <Route handler={LoginRequired}>
        <Redirect from="/" to="api"/>
        <Route path="api">
        </Route>

        <Redirect from="/" to="admin"/>
        <Route path="admin">
            <IndexRoute component={UserConnect} userList={null}/>
            <Route path="profile" component={UserProfile}/>
            <Route path="account" component={UserAccount}/>
            <Route path="list-users" component={ListUsers} userList={null}/>
            <Route path="set-tags" component={SetTags}/>
        </Route>

        <Redirect from="/" to="user"/>
        <Route path="user">
            <IndexRoute component={UserHome}/>
            <Route path="profile" component={UserProfile}/>
            <Route path="domain" component={CustMain} subheader={true}/>
            <Route path="account" component={UserAccount}/>
            <Route path="transaction" component={UserTrans}/>
            <Route path="all" component={UserConnect} userList={null}/>
            <Route path=":userUuid" component={UserHome}/>
        </Route>

        <Redirect from="/" to="newsfeed"/>
        <Route path="newsfeed">
            <IndexRoute component={NewsFeed}/>
        </Route>
    </Route>
),

Routes = (
    <Route>
        <Route path="/" component={Layout} url={"/public/start"}>
            <IndexRoute component={MainPage}/>
            <Redirect from="/" to ="public"/>
            {_publicRoutes}

            <Redirect from="public" to="public/proto"/>
            {_publicProtoRoutes}

            <Redirect from="/" to="login"/>
            {_loginRoutes}

            <Redirect from="/" to="register"/>
            {_registerRoutes}

            {_loginRequired}
        </Route>
    </Route>
),
    
_custLoginRoutes = (
    <Route path="login">
        <IndexRoute component={CustLogin}/>
        <Route path="logout" component={Logout}/>
    </Route>
),

PersonalRoutes = (
    <Route>
        <Route path="/" component={Layout} url={"/public/start"}>
            <IndexRoute component={CustMain} subheader={true}/>
            <Redirect from="/" to="public"/>
            {_publicRoutes}

            <Redirect from="/" to="login"/>
            {_custLoginRoutes}

            <Redirect from="/" to="register"/>
            {_registerRoutes}

            {_loginRequired}
        </Route>
    </Route>
);

export default Routes;
export { Routes, PersonalRoutes }
