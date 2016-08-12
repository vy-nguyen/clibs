/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';

import TabPanel       from 'vntd-shared/layout/TabPanel.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Blog           from 'vntd-root/components/Blog.jsx';
import Author         from 'vntd-root/components/Author.jsx';
import ProfileCover   from 'vntd-root/components/ProfileCover.jsx';
import AuthorStore    from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore   from 'vntd-root/stores/ArticleStore.jsx';
import UserPostView   from '../pages/user/UserPostView.jsx';
import ProductView    from '../pages/e-store/ProductView.jsx';
import ProductDetail  from '../pages/e-store/ProductDetail.jsx';
import Timeline       from '../pages/blog/Timeline.jsx';
import PostArticles   from './PostArticles.jsx';
import PostTimeline   from './PostTimeline.jsx';

let AuthorFeed = React.createClass({
    mixins: [
        Reflux.connect(ArticleStore),
        Reflux.connect(AuthorStore)
    ],

    getAuthorTab: function(uuid) {
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
            }, {
                domId  : 'product-' + uuid,
                tabText: 'Product',
                tabIdx : 5
            } ]
        };
    },

    _getActivePane: function() {
        let author = AuthorStore.getAuthorByUuid(this.props.authorUuid);
        if (author != null) {
            if (author.tabPanelIdx == null) {
                author.tabPanelIdx = 0;
            }
            return author.tabPanelIdx;
        }
        return 0;
    },

    _setActivePane: function(index) {
        let author = AuthorStore.getAuthorByUuid(this.props.authorUuid);
        if (author != null) {
            author.tabPanelIdx = index;
        }
    },

    _defaultPlugin: {
        render: function(plugin, img) {
            return null;
        },
        clickHandler: function(plugin, event) {
            event.stopPropagation();
        }
    },

    render: function() {
        let userUuid = this.props.authorUuid;
        let author = AuthorStore.getAuthorByUuid(userUuid);
        if (author == null) {
            return null;
        }
        let user = UserStore.getUserByUuid(userUuid);
        let articles = this.props.articles;

        if (articles == null) {
            articles = ArticleStore.getSortedArticlesByAuthor(user.userUuid).slice(0, 2);
        }
        let plugin = this.props.plugin;
        if (plugin == null) {
            plugin = this._defaultPlugin;
        }
        return (
            <div className="row">
                <SparklineContainer>
                    <div className="well well-light well-sm">
                        <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3">
                                <Author user={author}/>
                                {plugin.render.bind(this, plugin)(author.coverImg)}
                            </div>
                            <div className="col-sm-9 col-md-9 col-lg-9">
                                <TabPanel className="padding-top-10" context={this.getAuthorTab(author.userUuid)}>
                                    <PostArticles data={articles} user={user}/>
                                    <Blog author={author} user={user}/>
                                    <UserPostView userUuid={author.userUuid}/>
                                    <Timeline/>
                                    <ProductView/>
                                    <ProductDetail/>
                                </TabPanel>
                            </div>
                        </div>
                    </div>
                </SparklineContainer>
            </div>
        )
    },

    statics: {
        renderToggleView: function(authorUuid, article, toggleClick, cbArg) {
            let togglePlugin = {
                txtStyle: {
                    textAlign: "center",
                    color: "#ffffff"
                },
                upCallArg : cbArg,
                upCallback: toggleClick,
                authorUuid: authorUuid,
                articleUuid: article.articleUuid,
                content: "Click to hide",

                render: function(plugin, img) {
                    let divStyle = {
                        backgroundImage: "url(" + img + ")"
                    }
                    return (
                        <div className="row" style={divStyle} onClick={plugin.clickHandler.bind(this, plugin)}>
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
            };
            let articles = [ article ];
            return (
                <AuthorFeed authorUuid={authorUuid} articles={articles} plugin={togglePlugin}/>
            )
        }
    }
});
/*<PostTimeline data={this.author.activities}/> */

export default AuthorFeed;
