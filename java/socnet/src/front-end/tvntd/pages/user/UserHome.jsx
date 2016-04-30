/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Reflux              from 'reflux';
import {Link}              from 'react-router';

import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import MarkdownEditor      from 'vntd-shared/forms/editors/MarkdownEditor.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import TabPanelStore       from 'vntd-shared/stores/TabPanelStore.jsx';
import TabPanel            from 'vntd-shared/layout/TabPanel.jsx';
import ArticleStore        from 'vntd-root/stores/ArticleStore.jsx';
import PostArticles        from 'vntd-root/components/PostArticles.jsx';
import ProfileCover        from 'vntd-root/components/ProfileCover.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import UserAvatar          from './UserAvatar.jsx';
import Friends             from './Friends.jsx';

let UserHome = React.createClass({
    mixins: [Reflux.connect(UserStore), Reflux.connect(ArticleStore)],

    userTab: {
        init    : false,
        reactId : 'user-home',
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
        reactId : 'my-home',
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

        if (this.userTab.init !== true) {
            this.userTab.init = true;
            TabPanelStore.setTabPanel(this.userTab.reactId, this.userTab);
            TabPanelStore.setTabPanel(this.myUserTab.reactId, this.myUserTab);
        }
        if (self === null) {
            return (
                <div className="row">
                    <h1>'Invalid user page, no such uuid: ' + self.userUuid</h1>
                    <Link to="/"><button>Go back to home</button></Link>
                </div>
            );
        }
        let tabId = this.userTab.reactId;
        if (userUuid !== null && userUuid !== undefined) {
            me = false;
        } else {
            tabId = this.myUserTab.reactId;
        }
        let editorFmt = "";
        if (me === true) {
            editorFmt = (
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-10">
                        <JarvisWidget id="my-post" color="purple">
                            <header><span className="widget-icon"> <i className="fa fa-pencil"/>  </span>
                                <h2>Publish Post</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <MarkdownEditor className="custom-scroll" style={{height:280}}/>
                                    <button className="btn btn-primary margin-top-10 pull-right">Post</button>
                                    <button className="btn btn-primary margin-top-10 pull-right">Save</button>
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
            );
        }
        return (
            <div id="user-home">
                <ProfileCover userUuid={self.userUuid}/>
                <UserAvatar data={{doFileDrop: false}} userUuid={self.userUuid}/>
                {editorFmt}
                {/*<Link to={{ pathname: "/user/" + "123450", query: { editor: false } }}>User profile</Link>*/}
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-10">
                        <TabPanel tabId={tabId}>
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
        if (self == null) {
            return null;
        }
        return ArticleStore.getArticlesByAuthor(self.userUuid);
    },

    _onArticleUpdate: function() {
        let articles = this._getMyArticles();
        if (articles !== null) {
            this.setState({
                myArticles: articles
            });
        }
    }
});

export default UserHome;
