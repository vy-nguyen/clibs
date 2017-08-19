/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React          from 'react-mod';
import TabPanel       from 'vntd-shared/layout/TabPanel.jsx';
import ArticleBase    from 'vntd-shared/layout/ArticleBase.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Blog           from 'vntd-root/components/Blog.jsx';
import Author         from 'vntd-root/components/Author.jsx';
import AuthorStore    from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore   from 'vntd-root/stores/ArticleStore.jsx';
import UserPostView   from 'vntd-root/pages/user/UserPostView.jsx';
import EStore         from 'vntd-root/pages/e-store/EStore.jsx';
import Timeline       from 'vntd-root/pages/blog/Timeline.jsx';
import PostArticles   from './PostArticles.jsx';
import PostTimeline   from './PostTimeline.jsx';

const DefaultPlugin = {
    render: function(plugin, img) {
        return null;
    },

    clickHandler: function(plugin, event) {
        event.stopPropagation();
    }
};

class AuthorFeed extends ArticleBase
{
    constructor(props) {
        let tabIdx = 0, author;

        super(props);
        this._getAuthorTab  = this._getAuthorTab.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);

        author = AuthorStore.getAuthorByUuid(props.authorUuid);
        if (author != null) {
            if (author.tabPanelIdx == null) {
                author.tabPanelIdx = 0;
            } else {
                tabIdx = author.tabPanelIdx;
            }
        }
        this.state = {
            author  : author,
            tabIdx  : tabIdx,
            articles: ArticleStore
                .getSortedArticlesByAuthor(props.authorUuid).slice(0, 2)
        }
    }

    _updateArts(data, item, status, update, authorUuid) {
        if ((status === "refresh") ||
            (status === "delOk" && this.props.authorUuid !== item.authorUuid)) {
            return;
        }
        this.setState({
            articles: ArticleStore
                .getSortedArticlesByAuthor(this.props.authorUuid).slice(0, 2)
        });
    }

    _getAuthorTab(uuid) {
        return {
            getActivePane: this._getActivePane,
            setActivePane: this._setActivePane,

            tabItems: [ {
                domId  : 'article-' + uuid,
                tabText: 'Articles',
                tabIdx : 0
            }, {
                domId  : 'favorite-' + uuid,
                tabText: 'Favorites',
                tabIdx : 1
            }, {
                domId  : 'all-' + uuid,
                tabText: 'All',
                tabIdx : 2
            }, {
                domId  : 'timeline-' + uuid,
                tabText: 'Timeline',
                tabIdx : 3
            }, {
                domId  : 'estore-' + uuid,
                tabText: 'E-Store',
                tabIdx : 4
            } ]
        };
    }

    _getActivePane() {
        return this.state.tabIdx;
    }

    _setActivePane(index) {
        let author = this.state.author;
        if (author != null) {
            author.tabPanelIdx = index;
            this.setState({
                tabIdx: index
            });
        }
    }

    _renderTabPanel(author, articles, user) {
        return (
            <TabPanel className="padding-top-10"
                context={this._getAuthorTab(author.userUuid)}>
                <PostArticles data={articles} user={user}/>
                <Blog authorUuid={user.userUuid} user={user}/>
                <UserPostView userUuid={author.userUuid}/>
                <Timeline/>
                <EStore userUuid={author.userUuid}/>
            </TabPanel>
        );
    }

    _renderSideAuthor(author, articles, user, plugin) {
        return (
            <div className="row">
                <div className="col-sm-3 col-md-3 col-lg-3">
                    <Author user={author}/>
                    {plugin.render.bind(this, plugin)(author.coverImg)}
                </div>
                <div className="col-sm-9 col-md-9 col-lg-9">
                    {this._renderTabPanel(author, articles, user)}
                </div>
            </div>
        );
    }

    render() {
        let userUuid = this.props.authorUuid, user, articles, plugin, out,
            author = AuthorStore.getAuthorByUuid(userUuid);

        if (author == null) {
            return null;
        }
        user     = UserStore.getUserByUuid(userUuid);
        articles = this.props.articles || this.state.articles;
        plugin   = this.props.plugin || DefaultPlugin;

        if (this.props.wideFmt != null) {
            out = this._renderTabPanel(author, articles, user);
        } else {
            out = this._renderSideAuthor(author, articles, user, plugin);
        }
        return (
            <div className="row">
                <div className="well well-light well-sm">
                    {out}
                </div>
            </div>
        )
    }

    static renderToggleView(authorUuid, article, toggleClick, cbArg, wideFmt) {
        let togglePlugin = {
            txtStyle: {
                textAlign: "center",
                color    : "#ffffff"
            },
            upCallArg  : cbArg,
            upCallback : toggleClick,
            authorUuid : authorUuid,
            articleUuid: article.articleUuid,
            content    : "Click to hide",

            render: function(plugin, img) {
                let divStyle = {
                    backgroundImage: "url(" + img + ")"
                }
                return (
                    <div className="row hidden-xs hidden-sm" style={divStyle}
                        onClick={plugin.clickHandler.bind(this, plugin)}>
                        <br/>
                        <h3 style={plugin.txtStyle}>{plugin.content}</h3>
                        <br/>
                    </div>
                );
            },
            clickHandler: function(plugin, event) {
                event.stopPropagation();
                plugin.upCallback(plugin.articleUuid, plugin.upCallArg);
            }
        },
        articles = [ article ];
        return (
            <AuthorFeed authorUuid={authorUuid}
                articles={articles} plugin={togglePlugin} wideFmt={wideFmt}/>
        )
    }
}

export default AuthorFeed;
