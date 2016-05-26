/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import AuthorFeed         from 'vntd-root/components/AuthorFeed.jsx';

import SubHeader          from '../layout/SubHeader.jsx';
import BigBreadcrumbs     from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';

import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore       from 'vntd-root/stores/ArticleStore.jsx';
import Author             from 'vntd-root/components/Author.jsx';
import PostItem           from 'vntd-root/components/PostItem.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';
import Timeline           from '../blog/Timeline.jsx';

let FeedArticle = React.createClass({
    render: function() {
        return (
<div>
    <div className="post">
        <div className="user-block">
            <img className="img-circle img-bordered-sm" src="/rs/images/user1-128x128.jpg" alt="user image"/>
            <span className='username'>
                <a href="#">Nam Vo</a>
                <a href='#' className='pull-right btn-box-tool'><i className='fa fa-times'></i></a>
            </span>
            <span className='description'>Shared publicly - 7:30 PM today</span>
        </div>
        <p>Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore the hate as they create awesome tools to help create filler text for everyone from bacon lovers to Charlie Sheen fans.</p>
        <ul className="list-inline">
            <li><a href="#" className="link-black text-sm"><i className="fa fa-share margin-r5"></i> Share</a></li>
            <li><a href="#" className="link-black text-sm"><i className="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>
            <li className="pull-right"><a href="#" className="link-black text-sm"><i className="fa fa-comments-o margin-r-5"></i> Comments (5)</a></li>
        </ul>
        <input className="form-control input-sm" type="text" placeholder="Type a comment"/>
    </div>

    <div className="post clearfix">
        <div className='user-block'>
            <img className='img-circle img-bordered-sm' src='/rs/images/user7-128x128.jpg' alt='user image'/>
            <span className='username'>
                <a href="#">Tom Nguyen</a>
                <a href='#' className='pull-right btn-box-tool'><i className='fa fa-times'></i></a>
            </span>
            <span className='description'>Sent you a message - 3 days ago</span>
        </div>
        <p>Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore the hate as they create awesome tools to help create filler text for everyone from bacon lovers to Charlie Sheen fans.</p>

        <form className='form-horizontal'>
            <div className='form-group margin-bottom-none'>
                <div className='col-sm-10'>
                    <input className="form-control input-sm" placeholder="Response"/>
                </div>
                <div className='col-sm-2'>
                    <button className='btn btn-danger pull-right btn-block btn-sm'>Send</button>
                </div>
            </div>
        </form>
    </div>

    <div className="post">
        <div className='user-block'>
            <img className='img-circle img-bordered-sm' src='/rs/images/user6-128x128.jpg' alt='user image'/>
            <span className='username'>
                <a href="#">Adam Jones</a>
                <a href='#' className='pull-right btn-box-tool'><i className='fa fa-   times'></i></a>
            </span>
            <span className='description'>Posted 5 photos - 5 days ago</span>
        </div>
        <PostItem pictures={[
            "/rs/images/photo1.png", "/rs/images/photo2.png", "/rs/images/photo3.jpg",
            "/rs/images/photo4.jpg", "/rs/images/photo1.png"]} />

        <ul className="list-inline">
            <li><a href="#" className="link-black text-sm"><i className="fa fa-share margin-r-5"></i> Share</a></li>
            <li><a href="#" className="link-black text-sm"><i className="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>
            <li className="pull-right"><a href="#" className="link-black text-sm"><i className="fa fa-comments-o margin-r-5"></i> Comments (5)</a></li>
        </ul>
        <input className="form-control input-sm" type="text" placeholder="Type a comment"/>
    </div>
</div>
        )
    }
});

let FeedContent = React.createClass({
    render: function() {
        return (
<div className="row">
    <div className="col-sm-12">
        <div className="padding-10">
            <ul className="nav nav-tabs tabs-pull-left">
                <li className="active"><a href="#f1" data-toggle="tab">Articles</a></li>
                <li><a href="#f2" data-toggle="tab">Timeline</a></li>
            </ul>
            <div className="tab-content padding-top-10">
                <div className="tab-pane fade in active" id="f1">
                    <FeedArticle/>
                </div>
                <div className="tab-pane fade" id="f2">
                    <Timeline/>
                </div>
            </div>
        </div>
    </div>
</div>
        )
    }
});

let NewsFeed = React.createClass({
    mixins: [Reflux.connect(AuthorStore), Reflux.connect(ArticleStore)],

    render: function() {
        let author = AuthorStore.getAuthorByUuid("123452");
        if (author == null) {
            return null;
        }
        let articles = ArticleStore.getArticlesByAuthor("123452");
        return (
<div id="author-content">
    <div className="row">
        <BigBreadcrumbs className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
        <SubHeader/>
    </div>
    <AuthorFeed userUuid={"123451"} />
    <AuthorFeed userUuid={"123450"} />
    <div className="row"> 
        <div className="well well-light well-sm">
            <div className="col-sm-4 col-md-4 col-lg-4">
                <ProfileCover data={{imageId: author._id, imageList: author.coverImg}}/>
                <Author user={author}/>
            </div>
            <div className="col-sm-8 col-md-8 col-lg-8">
                <FeedContent/>
            </div>
        </div>
    </div>
</div>
        )
    }
});

export default NewsFeed;
