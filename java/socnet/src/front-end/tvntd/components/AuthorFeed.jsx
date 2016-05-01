/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';

import PostArticles   from './PostArticles.jsx';
import PostTimeline   from './PostTimeline.jsx';
import Author         from 'vntd-root/components/Author.jsx';
import ProfileCover   from 'vntd-root/components/ProfileCover.jsx';
import AuthorStore    from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore   from 'vntd-root/stores/ArticleStore.jsx';
import ProductView    from '../pages/e-store/ProductView.jsx';
import ProductDetail  from '../pages/e-store/ProductDetail.jsx';
import Timeline       from '../pages/blog/Timeline.jsx';

let paneData = {
    postPaneId: "abc",
    postDate: "3/15/2016",
    moneyEarned: "100",
    creditEarned: "200"
};

let AuthorFeed = React.createClass({

    render: function() {
        let author = AuthorStore.getAuthorByUuid(this.props.userUuid);
        let articles = ArticleStore.getArticlesByAuthor(this.props.userUuid);
        if (author == undefined || articles == undefined) {
            return null;
        }
        let art_id = 'article-' + author.userUuid;
        let fav_id = 'favorite-' + author.userUuid;
        let tln_id = 'timeline-' + author.userUuid;
        let est_id = 'estore-' + author.userUuid;
        let prd_id = 'product-' + author.userUuid;

        return (
<div className="row">
    <SparklineContainer>
        <div className="well well-light well-sm">
            <div className="row">
                <div className="col-sm-2 col-md-2 col-lg-3">
                    <ProfileCover data={{imageId: author._id, imageList: author.coverImg}}/>
                    <Author data={author} user={author.authorUser}/>
                </div>
                <div className="col-sm-10 col-md-10 col-lg-9">
                    <ul className="nav nav-tabs tabs-pull-left">
                        <li className="active"><a href={'#' + art_id} data-toggle="tab">Articles</a></li>
                        <li><a href={'#' + fav_id} data-toggle="tab">Favorites</a></li>
                        <li><a href={'#' + tln_id} data-toggle="tab">Timeline</a></li>
                        <li><a href={'#' + est_id} data-toggle="tab">E-Store</a></li>
                        <li><a href={'#' + prd_id} data-toggle="tab">Product</a></li>
                    </ul>
                    <div className="tab-content padding-top-10">
                        <div className="tab-pane fade in active" id={art_id}>
                            <PostArticles data={articles}/>
                        </div>
                        <div className="tab-pane fade" id={fav_id}>
                            <PostArticles data={author.favorites}/>
                        </div>
                        <div className="tab-pane fade" id={tln_id}>
                            <Timeline/>
                        </div>
                        <div className="tab-pane fade" id={est_id}>
                            <ProductView/>
                        </div>
                        <div className="tab-pane fade" id={prd_id}>
                            <ProductDetail/>
                        </div>
                    </div>
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
