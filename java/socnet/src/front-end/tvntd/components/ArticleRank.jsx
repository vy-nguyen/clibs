/**
 * Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';

import Actions      from 'vntd-root/actions/Actions.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';

let ArticleRank = React.createClass({
    mixins: [Reflux.connect(ArticleStore)],

    getInitialState: function() {
        return {
            article    : null,
            fullArticle: false,
            buttonText : "Read more..."
        }
    },

    _getArticleResult: function() {
    },

    componentDidMount: function() {
        this.listenTo(ArticleStore, this._getArticleResult);
    },

    handleClick: function(event) {
        _toggleFullArticle(event);
    },

    _toggleFullArticle: function(event) {
        event.stopPropagation();
        if (this.state.article == null) {
            let article = ArticleStore.getArticleByUuid(this.props.articleUuid);
            if (article != null) {
                this.setState({
                    article: article
                });
            } else {
                Actions.getOneArticle(this.props.articleUuid);
            }
        }
        if (this.state.fullArticle == true) {
            if (this.state.article != null) {
                $('#' + this.state.article._id).hide();
            }
            this.setState({
                fullArticle: false,
                buttonText : "Read more..."
            });
        } else {
            if (this.state.article != null) {
                $('#' + this.state.article._id).show();
            }
            this.setState({
                fullArticle: true,
                buttonText : "Hide article..."
            });
        }
    },

    render: function() {
        let artPane = null;
        if (this.state.article != null) {
            let artStyle = this.state.fullArticle == false ? { display: "none" } : { height: "auto" };
            artPane = (
                <div className="row" style={artStyle} id={this.state.article._id}>
                    <PostPane data={this.state.article}/>
                    <a className="btn btn-primary" id={"art-rank-full-" + this.props.articleUuid} onClick={this._toggleFullArticle}>
                        {this.state.buttonText}
                    </a>
                </div>
            );
        }
        let rank = this.props.rank;
        return (
            <div>
                <div className="well padding-10">
                    <div className="row padding-10">
                        <div className="col-xs-4 col-sm-4 col-md-4">
                            <h3>{rank.artTitle}</h3>
                            <br/>
                            <i className="fa fa-calendar"/>1/1/1970
                            <i className="fa fa-comment"/>20
                            <i className="fa fa-thumbs-up"/>10
                        </div>
                        <div className="col-xs-7 col-sm-7 col-md-7">
                            <p>{rank.contentBrief}</p>
                            <a className="btn btn-primary" onClick={this._toggleFullArticle}>{this.state.buttonText}</a>
                        </div>
                    </div>
                </div>
                {artPane}
            </div>
        )
    },

    statics: {
        render: function(rank, refName) {
            return <ArticleRank rank={rank} articleUuid={rank.articleUuid} ref={refName}/>
        }
    }
});

export default ArticleRank;
