/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import Reflux       from 'reflux';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import LikeStat     from 'vntd-root/components/LikeStat.jsx';

import {getRandomInt, safeStringify} from 'vntd-shared/utils/Enum.jsx';

class BlogItem extends React.Component
{
    render() {
        let ctx = this.props.context;
        let authorUuid = this.props.authorUuid;
        let articleUuid = this.props.articleUuid;
        let artRank = null;

        let arg = {
            imgUrl: null,
            title : null,
            brief : null
        };
        let article = ArticleStore.getArticleByUuid(articleUuid);
        if (article == null) {
            artRank = AuthorStore.getArticleRank(authorUuid, articleUuid);
            if (artRank == null) {
                console.log("no rank info for  " + this.props.articleUuid);
                return null;
            }
            arg.imgUrl = artRank.imgUrl;
            arg.title  = artRank.topic;
        } else {
            let imgUrl = article.pictureUrl;
            if (imgUrl != null && !_.isEmpty(imgUrl)) {
                imgUrl = imgUrl[getRandomInt(0, imgUrl.length - 1)];
            } else {
                let user = UserStore.getUserByUuid(authorUuid);
                if (user == null) {
                    console.log("No matching user uuid " + authorUuid);
                    return null;
                }
                imgUrl = user.userImgUrl;
            }
            artRank    = article.rank;
            arg.imgUrl = imgUrl;
            arg.title  = article.topic;
        }
        if (artRank != null) {
            arg.brief  = artRank.contentBrief;
            arg.likeStat = {
                dateMoment  : artRank.timeStamp,
                likesCount  : artRank.userLiked.length,
                sharesCount : artRank.userShared.length,
                commentCount: article != null ? article.commentList.length : 0
            }
        } else {
            return null;
        }
        let btnFmt = ctx.getBtnFormat();
        return (
            <div className="content">
                <div className="row">
                    <div className="col-md-4">
                        <img src={arg.imgUrl} className="img-responsive"/>
                        <LikeStat data={arg.likeStat} className="padding-10"/>
                    </div>
                    <div className="col-md-8 padding-left-0">
                        <h3 className="margin-top-0">
                            <a href-void="#">{arg.title}</a>
                            <br/>
                        </h3>
                        {arg.brief}
                        <hr/>
                        <a className={btnFmt.className} onClick={ctx.clickHandler}>{btnFmt.buttonText}</a>
                    </div>
                </div>
            </div>
        );
    }
}

let Blog = React.createClass({

    mixins: [
        Reflux.connect(AuthorStore),
        Reflux.connect(ArticleStore)
    ],

    initState: {
        articleUuid: null,
        articleRank: null
    },

    _readArticle: function(articleUuid) {
        if (this.state.articleUuid === articleUuid) {
            this.setState({
                articleUuid: null
            });
        } else {
            this.setState({
                articleUuid: articleUuid
            });
        }
    },

    _renderSummarized: function(authorUuid, articleUuid) {
        let clickCb = {
            getBtnFormat: function() {
                if (this.state.articleUuid == null || this.state.articleUuid !== articleUuid) {
                    return {
                        className : "btn btn-primary",
                        buttonText: "Read more..."
                    }
                }
                return {
                    className : "btn btn-primary",
                    buttonText: "Hide article"
                }
            }.bind(this),

            clickHandler: this._readArticle.bind(this, articleUuid)
        };
        return <BlogItem authorUuid={authorUuid} articleUuid={articleUuid} context={clickCb}/>
    },

    _renderFull: function(articleUuid, article, artRank) {
        if (this.state.articleUuid == null || this.state.articleUuid !== articleUuid) {
            return null;
        }
        if (article != null) {
            return <PostPane data={article}/>;
        }
        return PostPane.renderArticleRank(artRank);
    },

    render: function() {
        let authorUuid = this.props.authorUuid;
        let articles = ArticleStore.getSortedArticlesByAuthor(authorUuid);
        let items = [];

        if (articles == null) {
            items.push(<h3>No post</h3>);
        } else {
            _.forEach(articles, function(art) {
                items.push(
                    <div className="row" key={_.uniqueId('blog-row-')}>
                        {this._renderSummarized(art.authorUuid, art.articleUuid)}
                        {this._renderFull(art.articleUuid, art, null)}
                    </div>
                );
            }.bind(this));
        }
        return <div>{items}</div>;
    }
});

export default Blog;
