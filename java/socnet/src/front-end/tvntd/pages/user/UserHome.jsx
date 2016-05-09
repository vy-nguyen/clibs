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
import ArticleStore        from 'vntd-root/stores/ArticleStore.jsx';
import PostArticles        from 'vntd-root/components/PostArticles.jsx';
import ProfileCover        from 'vntd-root/components/ProfileCover.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import UserAvatar          from './UserAvatar.jsx';
import Friends             from './Friends.jsx';

let UserHome = React.createClass({
    mixins: [Reflux.connect(UserStore), Reflux.connect(ArticleStore)],

    userTab: {
        tabItems: [ {
            domId  : 'published-articles',
            tabText: 'Published Articles',
            tabIdx : 0
        }, {
            domId  : 'connections',
            tabText: 'Connections',
            tabIdx : 2
        }, {
            domId  : 'block-chain',
            tabText: 'Block Chains',
            tabIdx : 3
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
            domId  : 'connections',
            tabText: 'Connections',
            tabIdx : 2
        }, {
            domId  : 'block-chain',
            tabText: 'Block Chains',
            tabIdx : 3
        } ]
    },

    componentWillMount: function() {
        let articles = this._getMyArticles();
        if (articles === null) {
            Actions.refreshArticles(self);
        } else {
            this.setState({
                myArticles: articles
            });
        }
    },

    componentDidMount: function() {
        this.listenTo(ArticleStore, this._onArticleUpdate);
    },

    render: function() {
        let me = true;
        let { userUuid } = this.props.params;
        let self = UserStore.getUserByUuid(userUuid);

        if (self === null) {
            return (
                <div className="row">
                    <h1>'Invalid user page, no such uuid: ' + self.userUuid</h1>
                    <Link to="/"><button>Go back to home</button></Link>
                </div>
            );
        }
        let tabCtx = this.userTab;
        if (userUuid !== null && userUuid !== undefined) {
            me = false;
        } else {
            tabCtx = this.myUserTab;
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
                            <PostArticles uuid={[self.userUuid]} data={this.state.myArticles}/>
                            <PostArticles uuid={[self.userUuid]}/>
                            <Friends userUuid={self.userUuid}/>
                            <div><h1>Nothing yet</h1></div>
                        </TabPanel>
                    </article>
                </div>
            </div>
        )
    },

    _getMyArticles: function() {
        let self = UserStore.getSelf();
        if (self === null) {
            return null;
        }
        let anchor = ArticleStore.getArticlesByAuthor(self.userUuid);
        if (anchor) {
            return anchor.sortedArticles;
        }
        return null;
    },

    _onArticleUpdate: function() {
        let articles = this._getMyArticles();
        if (articles !== null) {
            ArticleStore.debugDump("This is store");

            this.setState({
                myArticles: articles
            });
        }
    }
});

export default UserHome;
