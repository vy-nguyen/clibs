/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Reflux              from 'reflux';
import {Link}              from 'react-router';

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

let UserHome = React.createClass({
    mixins: [
        Reflux.connect(ArticleStore),
        Reflux.listenTo(ArticleStore, "_onArticleUpdate")
    ],

    userTab: {
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
    },
    myUserTab: {
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
    },

    getInitialState: function() {
        return ArticleStore.getArticleStore()
    },

    componentWillMount: function() {
        this._updateArticle();
    },

    componentWillUpdate: function() {
        this._updateArticle();
    },

    _updateArticle: function() {
        let owner = this._getOwner();
        if (owner !== null) {
            ArticleStore.getSortedArticlesByAuthor(owner.userUuid);
        }
    },

    render: function() {
        let me = true;
        let self = this._getOwner();

        if (self === null) {
            return (
                <div className="row">
                    <h1>
                        Invalid user page
                        <Link to="/"><button>Go back to home</button></Link>
                    </h1>
                </div>
            );
        }
        let articles = null;
        let tabCtx = this.userTab;
        let { userUuid } = this.props.params;

        if (userUuid !== null && userUuid !== undefined) {
            me = false;
            articles = ArticleStore.getSortedArticlesByAuthor(userUuid);
        } else {
            tabCtx = this.myUserTab;
            articles = {};
            if (this.state.myArticles !== null) {
                articles = this.state.myArticles.sortedArticles;
            }
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
                            {me === true ? <PostArticles userUuid={self.userUuid} data={this.state.mySavedArticles}/> : null}
                            {me === true ? <UserPostView userUuid={self.userUuid}/> : null}
                            <Friends userUuid={self.userUuid}/>
                            <div><h1>Nothing yet</h1></div>
                        </TabPanel>
                    </article>
                </div>
            </div>
        )
    },

    _getOwner: function() {
        let { userUuid } = this.props.params;
        return UserStore.getUserByUuid(userUuid);
    },

    _onArticleUpdate: function() {
    }
});

export default UserHome;
