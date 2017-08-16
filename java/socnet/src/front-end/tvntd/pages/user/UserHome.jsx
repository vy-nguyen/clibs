/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import {Link}              from 'react-router';

import History             from 'vntd-shared/utils/History.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import TabPanel            from 'vntd-shared/layout/TabPanel.jsx';
import ArticleBase         from 'vntd-shared/layout/ArticleBase.jsx';
import SmallBreadcrumbs    from 'vntd-shared/layout/SmallBreadcrumbs.jsx';
import EditorPost          from 'vntd-shared/forms/commons/EditorPost.jsx';
import UserPostView        from 'vntd-root/pages/user/UserPostView.jsx';
import EStorePost          from 'vntd-root/pages/e-store/EStorePost.jsx';
import EStore              from 'vntd-root/pages/e-store/EStore.jsx';
import ArticleStore        from 'vntd-root/stores/ArticleStore.jsx';
import PostArticles        from 'vntd-root/components/PostArticles.jsx';
import ProfileCover        from 'vntd-root/components/ProfileCover.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import UserAvatar          from './UserAvatar.jsx';
import Friends             from './Friends.jsx';

class UserHome extends ArticleBase
{
    constructor(props) {
        let all;
        super(props);

        this.getUserTab     = this.getUserTab.bind(this);
        this.getMyUserTab   = this.getMyUserTab.bind(this);
        this._getEditTab    = this._getEditTab.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);

        this._getActEditPane   = this._getActEditPane.bind(this);
        this._setActEditPane   = this._setActEditPane.bind(this);
        this._getActPaneCommon = this._getActPaneCommon.bind(this);
        this._setActPaneCommon = this._setActPaneCommon.bind(this);

        all = this._getArticles(props.params.userUuid);
        this.state = {
            tabIndex : 0,
            articles : all.articles,
            savedArts: all.savedArts
        };
    }

    _updateArts(store, data, status, update, authorUuid) {
        let all;

        if (update === true) {
            all = this._getArticles(this.props.params.userUuid);
            this.setState({
                articles : all.articles,
                savedArts: all.savedArts
            });
        }
    }

    _getArticles(userUuid) {
        if (userUuid != null && !UserStore.isUserMe(userUuid)) {
            return {
                articles : ArticleStore.getSortedArticlesByAuthor(userUuid),
                savedArts: null
            };
        }
        return {
            articles : ArticleStore.getMyArticles(),
            savedArts: ArticleStore.getMySavedArticles()
        };
    }

    getUserTab() {
        return {
            getActivePane: this._getActivePane,
            setActivePane: this._setActivePane,

            tabItems: [ {
                domId  : 'published-articles',
                tabText: 'Published Articles',
                tabIdx : 0
            }, {
                domId  : 'publised-estore',
                tabText: 'Publised EStore',
                tabIdx : 1
            }, {
                domId  : 'connections',
                tabText: 'Connections',
                tabIdx : 4
            }, {
                domId  : 'block-chain',
                tabText: 'Block Chains',
                tabIdx : 5
            } ]
        }
    }

    getMyUserTab() {
        return {
            getActivePane: this._getActivePane,
            setActivePane: this._setActivePane,

            tabItems: [ {
                domId  : 'published-articles',
                tabText: 'Published Articles',
                tabIdx : 0
            }, {
                domId  : 'publised-estore',
                tabText: 'My EStore',
                tabIdx : 1
            }, {
                domId  : 'saved-articles',
                tabText: 'Saved Articles',
                tabIdx : 2
            }, {
                domId  : 'manage-articles',
                tabText: 'Mananged Articles',
                tabIdx : 3
            }, {
                domId  : 'connections',
                tabText: 'Connections',
                tabIdx : 4
            }, {
                domId  : 'block-chain',
                tabText: 'Block Chains',
                tabIdx : 5
            } ]
        };
    }

    _getEditTab() {
        const editTab = {
            getActivePane: this._getActEditPane,
            setActivePane: this._setActEditPane,
            tabItems: [ {
                domId  : 'post-article',
                tabText: 'Post Article',
                tabIdx : 0
            }, {
                domId  : 'post-product',
                tabText: 'Post Product',
                tabIdx : 1
            } ]
        };
        return editTab;
    }

    _getOwner() {
        return UserStore.getUserByUuid(this.props.params.userUuid);
    }

    _getActivePane() {
        return this._getActPaneCommon('tabPanelIdx');
    }

    _getActEditPane() {
        return this._getActPaneCommon('editPanelIdx');
    }

    _getActPaneCommon(key) {
        let owner = this._getOwner();
        if (owner != null) {
            if (owner[key] == null) {
                owner[key] = 0;
            }
            return owner[key];
        }
        return 0;
    }
    
    _setActivePane(index) {
        this._setActPaneCommon('tabPanelIdx', index);
    }

    _setActEditPane(index) {
        this._setActPaneCommon('editPanelIdx', index);
        this._setActPaneCommon('tabPanelIdx', index);
        this.setState({
            tabIndex: this.state.tabIndex + 1
        });
    }

    _setActPaneCommon(key, index) {
        let owner = this._getOwner();
        if (owner != null) {
            owner[key] = index;
        }
    }

    render() {
        let me = true, route, postView, saveArticles, tabCtx, articles, editTab, all,
            userUuid = this.props.params.userUuid,
            self = this._getOwner();

        if (self == null) {
            History.pushState(null, "/");
            return null;
        }
        postView = null;
        tabCtx = this.getUserTab();
        articles = this.state.articles;

        if (userUuid != null) {
            me = false;
            route = "/user/" + userUuid;
            saveArticles = null;
        } else {
            route = "/user";
            tabCtx = this.getMyUserTab();
            postView = <UserPostView userUuid={self.userUuid}/>;
            saveArticles =
                <PostArticles userUuid={self.userUuid}
                    data={this.state.savedArts} edit={true}/>;
        }
        if (articles == null) {
            articles = {};
        }
        editTab = null;
        if (me === true) {
            editTab = (
                <TabPanel context={this._getEditTab()}>
                    <EditorPost/>
                    <EStorePost/>
                </TabPanel>
            );
        }
        return (
            <div id="user-home">
                <SmallBreadcrumbs id="route-map" crumb="User" route={route}/>
                <ProfileCover userUuid={self.userUuid}/>
                <UserAvatar data={{doFileDrop: false}} userUuid={self.userUuid}/>
                {editTab}
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-10">
                        <TabPanel context={tabCtx}>
                            <PostArticles userUuid={self.userUuid} data={articles}/>
                            <EStore userUuid={self.userUuid} noProto={true}/>
                            {saveArticles}
                            {postView}
                            <Friends userUuid={self.userUuid}/>
                            <div><h1>Nothing yet</h1></div>
                        </TabPanel>
                    </article>
                </div>
            </div>
        )
    }
}

/*
    <Link to={{ pathname: "/user/" + "123450", query: { editor: false } }}>
        User profile
    </Link>
*/

export default UserHome;
