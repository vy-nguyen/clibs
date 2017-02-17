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
import EStore              from 'vntd-root/pages/e-store/EStore.jsx';
import ArticleStore        from 'vntd-root/stores/ArticleStore.jsx';
import Lang                from 'vntd-root/stores/LanguageStore.jsx';
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

        this._getActEditPane   = this._getActEditPane.bind(this);
        this._setActEditPane   = this._setActEditPane.bind(this);
        this._getActPaneCommon = this._getActPaneCommon.bind(this);
        this._setActPaneCommon = this._setActPaneCommon.bind(this);

        let { userUuid } = props.params;
        this.state = {
            tabIndex: 0,
            articles: this._getArticles(userUuid)
        };
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

    _updateStore(store, data, status, update, authorUuid) {
        let { userUuid } = this.props.params;
        console.log("Update store " + update);
        if (update === true) {
            this.setState({
                articles: this._getArticles(userUuid)
            });
        }
    }

    _getArticles(userUuid) {
        if (userUuid != null) {
            return ArticleStore.getSortedArticlesByAuthor(userUuid);
        }
        return ArticleStore.getMyArticles();
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
                tabText: Lang.translate('Published Articles'),
                tabIdx : 0
            }, {
                domId  : 'publised-estore',
                tabText: Lang.translate('My EStore'),
                tabIdx : 1
            }, {
                domId  : 'saved-articles',
                tabText: Lang.translate('Saved Articles'),
                tabIdx : 2
            }, {
                domId  : 'manage-articles',
                tabText: Lang.translate('Mananged Articles'),
                tabIdx : 3
            }, {
                domId  : 'connections',
                tabText: Lang.translate('Connections'),
                tabIdx : 4
            }, {
                domId  : 'block-chain',
                tabText: Lang.translate('Block Chains'),
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
                tabText: Lang.translate('Post Article'),
                tabIdx : 0
            }, {
                domId  : 'post-product',
                tabText: Lang.translate('Post Product'),
                tabIdx : 1
            } ]
        };
        return editTab;
    }

    _getOwner() {
        let { userUuid } = this.props.params;
        return UserStore.getUserByUuid(userUuid);
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
        let me, self, postView, saveArticles, tabCtx, articles, editTab;
        me = true;
        self = this._getOwner();

        if (self == null) {
            History.pushState(null, "/");
            return;
        }
        postView = null;
        saveArticles = null;
        tabCtx = this.getUserTab();
        articles = this.state.articles;
        let { userUuid } = this.props.params;

        if (userUuid != null) {
            me = false;
            articles = this._getArticles(userUuid);
        } else {
            tabCtx = this.getMyUserTab();
            postView = <UserPostView userUuid={self.userUuid}/>;
            saveArticles =
                <PostArticles userUuid={self.userUuid} data={ArticleStore.getMySavedArticles()} edit={true}/>
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

export default UserHome;
