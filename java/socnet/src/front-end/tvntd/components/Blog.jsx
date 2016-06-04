/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react-mod';
import _            from 'lodash';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';

import {getRandomInt, safeStringify} from 'vntd-shared/utils/Enum.jsx';

let BlogItem = React.createClass({
    render: function() {
        let article = this.props.article;
        const artInfo = [ {
            format: "fa fa-calendar",
            info  : article.createDate
        }, {
            format: "fa fa-comments",
            info  : "20" // this.props.article.comments
        }, {
            format: "fa fa-thumbs-up",
            info  : article.likeCount
        } ];
        let artInfoBlock = artInfo.map(function(it) {
            return (
                <li key={_.uniqueId("blog-item-")}>
                    <i className={it.format}></i>
                    <a href-void="#"> {it.info}</a>
                </li>
            );
        });
        let imgUrl = article.pictureUrl;
        if (imgUrl != null && !_.isEmpty(imgUrl)) {
            imgUrl = imgUrl[getRandomInt(0, imgUrl.length - 1)];
        } else {
            imgUrl = this.props.user.userImgUrl;
        }
        let content = safeStringify(article.content);
        return (
            <div className="row">
                <div className="col-md-4">
                    <img src={imgUrl} className="img-responsive"/>
                    <ul className="list-inline padding-10">
                        {artInfoBlock}
                    </ul>
                </div>
                <div className="col-md-8 padding-left-0">
                    <h3 className="margin-top-0">
                        <a href-void="#">{article.topic}</a>
                        <br/>
                    </h3>
                    <p>{content.slice(0, 600)} ...</p>
                    <a className="btn btn-primary">Read more</a>
                </div>
            </div>
        );
    }
});

let Blog = React.createClass({
    getInitialState: function() {
        return {
            articles: ArticleStore.getSortedArticlesByAuthor(this._getUserUuid())
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let articles = ArticleStore.getSortedArticlesByAuthor(this._getUserUuid());
        if (this.state.articles.length != articles.length) {
            this.setState({
                articles: articles
            });
        }
    },

    render: function() {
        let user = this.props.user;
        if (user == null) {
            return null;
        }
        let articles = [];
        if (this.state.articles != null) {
            articles = this.state.articles.slice(0, this.state.articles.length);
        }
        let items = null;
        if (articles && !_.isEmpty(articles)) {
            items = [];
            _.forOwn(articles, function(art, idx) {
                items.push(
                    <BlogItem key={_.uniqueId("blog-article-")}
                        article={art} author={this.props.author} user={this.props.user}/>
                );
            }.bind(this));
        } else {
            items = (
                <div>
                    <h2>{user.firstName} doesn't have any articles</h2>
                </div>
            );
        }
        return (
            <div className="well padding-10">
                {items}
            </div>
        );
    },

    _getUserUuid: function() {
        let userUuid = this.props.user.userUuid;
        if (userUuid == null) {
            userUuid = this.props.author.userUuid;
        }
        return userUuid;
    }
});

export default Blog;
