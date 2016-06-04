/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';

import TabPanel       from 'vntd-shared/layout/TabPanel.jsx';
import Author         from 'vntd-root/components/Author.jsx';
import ProfileCover   from 'vntd-root/components/ProfileCover.jsx';
import AuthorStore    from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore   from 'vntd-root/stores/ArticleStore.jsx';
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
            tabItems: [ {
                domId  : 'article-' + uuid,
                tabText: 'Articles',
                tabIdx : 0
            }, {
                domId  : 'favorite-' + uuid,
                tabText: 'Favorites',
                tabIdx : 1
            }, {
                domId  : 'timeline-' + uuid,
                tabText: 'Timeline',
                tabIdx : 2
            }, {
                domId  : 'estore-' + uuid,
                tabText: 'E-Store',
                tabIdx : 3
            }, {
                domId  : 'product-' + uuid,
                tabText: 'Product',
                tabIdx : 4
            } ]
        };
    },

    getInitialState: function() {
        return {
            articles: ArticleStore.getSortedArticlesByAuthor(this.props.user.userUuid)
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let articles = ArticleStore.getSortedArticlesByAuthor(this.props.user.userUuid)
        if (this.state.articles.length != articles.length) {
            this.setState({
                articles: articles
            });
        }
    },

    render: function() {
        let author = this.props.user;
        if (author == null) {
            return null;
        }
        let articles = [];
        if (this.state.articles != null) {
            articles = this.state.articles.slice(0, 2);
        }
        return (
            <div className="row">
                <SparklineContainer>
                    <div className="well well-light well-sm">
                        <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3">
                                <Author user={author}/>
                            </div>
                            <div className="col-sm-9 col-md-9 col-lg-9">
                                <TabPanel className="padding-top-10" context={this.getAuthorTab(author.userUuid)}>
                                    <PostArticles data={articles}/>
                                    <PostArticles data={author.favorites}/>
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
    }
});
/*<PostTimeline data={this.author.activities}/> */

export default AuthorFeed;
