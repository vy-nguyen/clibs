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
import EditorPost          from 'vntd-shared/forms/commons/EditorPost.jsx';
import UserPostView        from 'vntd-root/pages/user/UserPostView.jsx';
import EStorePost          from 'vntd-root/pages/e-store/EStorePost.jsx';
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
        this.getUserTab     = this.getUserTab.bind(this);
        this.getMyUserTab   = this.getMyUserTab.bind(this);
        this._getEditTab    = this._getEditTab.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);
        this._updateStore   = this._updateStore.bind(this);

        this.state = this._getArticles(props);
    }

    componentDidMount() {
        this.unsub = ArticleStore.listen(this._updateStore);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateStore(store, data, status) {
        console.log("update store " + status);
        let articles = this._getArticles();
        if (articles != null && this.state.articles.length != articles.length) {
            this.setState(articles);
        }
    }

    _getArticles(props) {
        let { userUuid } = this.props.params;
        if (userUuid != null) {
            return {
                articles: ArticleStore.getSortedArticlesByAuthor(userUuid)
            };
        }
        return {
            articles: ArticleStore.getMyArticles()
        }
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
        };
    }

    _getEditTab() {
        return {
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
        let postView = null;
        let saveArticles = null;
        let tabCtx = this.getUserTab();
        let articles = this.state.articles;
        let { userUuid } = this.props.params;

        if (articles == null) {
            articles = {};
        }
        if (userUuid != null) {
            me = false;
        } else {
            tabCtx = this.getMyUserTab();
            postView = <UserPostView userUuid={self.userUuid}/>;
            saveArticles = <PostArticles userUuid={self.userUuid} data={ArticleStore.getMySavedArticles()}/>
        }
        let editTab = null;
        if (me === true) {
            editTab = (
                <TabPanel context={this._getEditTab()}>
                    <EditorPost/>
                    <EStorePost/>
                </TabPanel>
            );
        }
        /*<Link to={{ pathname: "/user/" + "123450", query: { editor: false } }}>User profile</Link>*/
        return (
            <div id="user-home">
                <ProfileCover userUuid={self.userUuid}/>
                <UserAvatar data={{doFileDrop: false}} userUuid={self.userUuid}/>
                {editTab}
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
