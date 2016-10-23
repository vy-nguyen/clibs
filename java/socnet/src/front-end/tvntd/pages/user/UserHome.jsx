/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Reflux              from 'reflux';
import {Link}              from 'react-router';

import History             from 'vntd-shared/utils/History.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import TabPanel            from 'vntd-shared/layout/TabPanel.jsx';
import EditorPost          from 'vntd-shared/forms/commons/EditorPost.jsx';
import UserPostView        from 'vntd-root/pages/user/UserPostView.jsx';
import ArticleStore        from 'vntd-root/stores/ArticleStore.jsx';
import PostArticles        from 'vntd-root/components/PostArticles.jsx';
import ProfileCover        from 'vntd-root/components/ProfileCover.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import UserAvatar          from './UserAvatar.jsx';
import Friends             from './Friends.jsx';

class UserHome extends React.Component
{
    constructor(props) {
        super(props);
        this.getUserTab = this.getUserTab.bind(this);
        this.getMyUserTab = this.getMyUserTab.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);
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
                domId  : 'connections',
                tabText: 'Connections',
                tabIdx : 3
            }, {
                domId  : 'block-chain',
                tabText: 'Block Chains',
                tabIdx : 4
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
                domId  : 'saved-articles',
                tabText: 'Saved Articles',
                tabIdx : 1
            }, {
                domId  : 'manage-articles',
                tabText: 'Mananged Articles',
                tabIdx : 2
            }, {
                domId  : 'connections',
                tabText: 'Connections',
                tabIdx : 3
            }, {
                domId  : 'block-chain',
                tabText: 'Block Chains',
                tabIdx : 4
            } ]
        }
    }

    _getOwner() {
        let { userUuid } = this.props.params;
        return UserStore.getUserByUuid(userUuid);
    }

    _getActivePane() {
        let owner = this._getOwner();
        if (owner != null) {
            if (owner.tabPanelIdx == null) {
                owner.tabPanelIdx = 0;
            }
            return owner.tabPanelIdx;
        }
        return 0;
    }

    _setActivePane(index) {
        let owner = this._getOwner();
        if (owner != null) {
            owner.tabPanelIdx = index;
        }
    }

    render() {
        let me = true;
        let self = this._getOwner();

        if (self == null) {
            History.pushState(null, "/");
            return;
        }
        let articles = null;
        let postView = null;
        let saveArticles = null;
        let tabCtx = this.getUserTab();
        let { userUuid } = this.props.params;

        if (userUuid != null) {
            me = false;
            articles = ArticleStore.getSortedArticlesByAuthor(userUuid);
        } else {
            tabCtx = this.getMyUserTab();
            articles = ArticleStore.getMyArticles();
            if (articles == null) {
                articles = {};
            }
            postView = <UserPostView userUuid={self.userUuid}/>;
            saveArticles = <PostArticles userUuid={self.userUuid} data={ArticleStore.getMySavedArticles()}/>
        }
        let editorFmt = "";
        if (me === true) {
            editorFmt = <EditorPost/>
        }
        return (
            <div id="user-home">
                <ProfileCover userUuid={self.userUuid}/>
                <UserAvatar data={{doFileDrop: false}} userUuid={self.userUuid}/>
                {editorFmt}
                {/*<Link to={{ pathname: "/user/" + "123450", query: { editor: false } }}>User profile</Link>*/}
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-10">
                        <TabPanel context={tabCtx}>
                            <PostArticles userUuid={self.userUuid} data={articles}/>
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

export default UserHome;
