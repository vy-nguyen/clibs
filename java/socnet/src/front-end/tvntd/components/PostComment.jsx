/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';
import Reflux   from 'reflux';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import UserIcon        from 'vntd-root/components/UserIcon.jsx';
import CommentStore    from 'vntd-root/stores/CommentStore.jsx';
import {safeStringify} from 'vntd-shared/utils/Enum.jsx'; 

let CommentBox = React.createClass({

    _submitComment: function(e) {
        e.preventDefault();
        Actions.postComment({
            comment: safeStringify(this.refs.comment.value),
            articleUuid: this.props.articleUuid,
        });
        this.setState({
            sendDisable: " disabled",
            submiting: true
        });
    },

    _selectButton: function(type, likeState, shareState) {
        const likes = [ {
            like    : false,
            value   : -1,
            likeFmt: "text-danger"
        }, {
            like    : true,
            value   : 1,
            likeFmt: "text-info"
        } ];
        const shares = [ {
            share   : false,
            value   : -1,
            shareFmt: "text-danger"
        }, {
            share   : true,
            value   : 1,
            shareFmt: "text-info"
        } ];

        if (type === "like") {
            let choose = !likeState;
            if (choose === true) {
                return likes[1];
            }
            return likes[0];
        } else if (type === "share") {
            let choose = !shareState;
            if (choose === true) {
                return shares[1];
            }
            return shares[0];
        }
        return null;
    },

    _submitSelect: function(type, e) {
        e.preventDefault();
        let newState = this._selectButton(type, this.state.like, this.state.share);

        if (newState != null) {
            this.setState(newState);
        }
        Actions.postCmtSelect({
            kind       : type,
            amount     : newState.value,
            article    : true,
            favorite   : false,
            commentId  : 0,
            articleUuid: this.props.articleUuid
        });
    },

    _toggleComment: function(e) {
        e.preventDefault();
        let show = !this.state.commentShow;
        let boxId = "#comment-" + this.props.articleUuid;

        this.setState({commentShow: show});
        if (show === true) {
            $(boxId).show();
        } else {
            $(boxId).hide();
        }
    },

    getInitialState: function() {
        return {
            sendDisable: "",
            submiting  : false,
            like       : true,
            share      : true,
            likeFmt    : "text-info",
            shareFmt   : "text-info",
            commentShow: this.props.cmtShow,
            cmtBoxId   : _.uniqueId('comment-box-')
        }
    },

    componentDidMount: function() {
        $('#' + this.state.cmtBoxId).on('input', function() {
            $(this).css({'height': 'auto', 'overflow-y': 'hidden'}).height(this.scrollHeight);
        });
    },

    componentWillMount: function() {
        let artAttr = CommentStore.getArticleAttr(this.props.articleUuid);
        if (artAttr != null) {
            let newState = {};
            if (artAttr.didILikeIt() === true) {
                newState = this._selectButton('like', true, false);
            }
            this.setState(newState);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let nextState = {
            commentShow: nextProps.cmtShow
        };
        if (this.state.submiting === true) {
            this.refs.comment.value = "";
            nextState.sendDisable = "";
            nextState.submiting = false;
        }
        this.setState(nextState);
    },

    render: function() {
        let likeCount = 0, shareCount = 0, userLiked = null;
        let artAttr = CommentStore.getArticleAttr(this.props.articleUuid);
        if (artAttr != null) {
            likeCount = artAttr.likeCount;
            shareCount = artAttr.shareCount;

            let likedList = artAttr.getUserLiked();
            if (likedList != null) {
                userLiked = (
                    <p><br/><i className="fa fa-thumbs-up text-danger"></i> {likedList}</p>
                );
            }
        }
        return (
            <div className="row no-margin no-padding">
                <hr/>
                <div className="btn-group inline">
                    <button onClick={this._submitSelect.bind(this, "like")} className={this.state.likeFmt}
                        rel="tooltip" title="like or unlike">
                        <i className="fa fa-thumbs-up"></i>{"Like (" + likeCount + ")"}
                    </button>
                    <button onClick={this._toggleComment} className="text-info">
                        <i className="fa fa-comment"></i>{"Comments (" + this.props.cmtCount + ")"}
                    </button>
                    <button onClick={this._submitSelect.bind(this, "share")} className={this.state.shareFmt}>
                        <i className="fa fa-share"></i>{"Share (" + shareCount + ")"}
                    </button>
                    <button onClick={this._submitSelect.bind(this, "save")} className="text-info">
                        <i className="fa fa-book"></i>Save
                    </button>
                    <button onClick={this._submitSelect.bind(this, "pay")} className="text-info">
                        <i className="fa fa-money"></i>Micropay
                    </button>
                </div>
                {userLiked}
                <br/>
                <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                    <div className="row">
                        <div className="col-sm-11">
                            <textarea rows="2" ref="comment" className="form-control input-sm"
                                id={this.state.cmtBoxId} placeholder="Place your comments here..."/>
                        </div>
                        <div className="col-sm-1">
                            <button className={"btn btn-danger pull-right btn-block btn-sm" + this.state.sendDisable}
                                type="submit" disabled={this.state.submiting}
                                onClick={this._submitComment}>Send</button>
                        </div>
                    </div>
                </form>                                                                                  
                <br/>
            </div>
        );
    }
});

let CommentItem = React.createClass({

    _submitLike: function(e) {
        e.preventDefault();
        Actions.postCmtSelect({
            kind       : "like",
            amount     : 1,
            article    : false,
            favorite   : false,
            commentId  : this.props.data.commentId,
            articleUuid: this.props.articleUuid
        });
        this.setState({ submitedLike: true });
    },

    _makeFavorite: function(e) {
        e.preventDefault();
        Actions.switchComment(this.props.data);
    },

    getInitialState: function() {
        return {
            submitedLike: false
        }
    },

    render: function() {
        let user = this.props.user;
        if (user == null) {
            return null;
        }
        let favBtn = null;
        let favBtnText = "Mark Favorite";
        let favClassName = "fa fa-bookmark";

        if (this.props.data.favorite === true) {
            favBtnText = "Not Favorite";
            favClassName = "fa fa-thumbs-down";
        }
        favBtn = (
            <li>
                <button onClick={this._makeFavorite} className="text-warning"> 
                    <i className={favClassName}></i>{favBtnText}
                </button>
            </li>
        );
        return (
            <li className="message">
                <UserIcon className="username" userUuid={user.userUuid} width="40" height="40"/>
                <span className="message-text">
                    <a href-void className="username">  {user.lastName + ' ' + user.firstName}
                        <small className="text-muted pull-right ultra-light">{this.props.data.moment}</small>
                    </a>
                    {this.props.data.comment}
                </span>
                <ul className="list-inline">
                    <li>
                        <button onClick={this._submitLike} disabled={this.state.submitedLike} className="text-info">
                            <i className="fa fa-thumbs-up"></i>Like
                        </button>
                    </li>
                    {favBtn}
                    <li>
                        <span className="text-danger">
                            <i className="fa fa-thumbs-up"></i>  {this.props.data.likes ? this.props.data.likes : "(0)" } Likes
                        </span>
                    </li>
                </ul>
            </li>
        )
    }
});

let PostComment = React.createClass({
    mixins: [
        Reflux.listenTo(CommentStore, "_onNewComment"),
    ],

    getInitialState: function() {
        return {
            comment: CommentStore.getByArticleUuid(this.props.articleUuid)
        }
    },

    _onNewComment: function() {
        this.setState({
            comment: CommentStore.getByArticleUuid(this.props.articleUuid)
        });
    },

    render: function() {
        let normals = [];
        let favorites = [];
        let showComment = false;
        let commentArt = this.state.comment;

        if (commentArt != null) {
            normals = commentArt.getNormals();
            favorites = commentArt.getFavorites();
            showComment = commentArt.showComment;
        }
        let favCmnts = [];
        _.forOwn(favorites, function(item, idx) {
            favCmnts.push(<CommentItem key={_.uniqueId('comment-')}
                            user={UserStore.getUserByUuid(item.userUuid)} data={item}/>
            );
        });
        let norCmnts = [];
        _.forOwn(normals, function(item, idx) {
            norCmnts.push(<CommentItem key={_.uniqueId('comment-')}
                            user={UserStore.getUserByUuid(item.userUuid)} data={item}/>);
        });
        let favColumn = null;
        let favColumnId = 'fav-comment-' + this.props.articleUuid;
        if (!_.isEmpty(favorites)) {
            favColumn = (
                <div className="col-sm-12 col-md-6 col-lg-6 chat-body"
                    id={favColumnId} style={{ 'height': 'auto', 'maxHeight': 500 }}>
                    <ul>{favCmnts}</ul>
                </div>
            );
        }
        let norColumn = null;
        let norColumnId = 'nor-comment-' + this.props.articleUuid;
        if (favColumn == null) {
            if (!_.isEmpty(norCmnts)) {
                norColumn = (
                    <div className="col-sm-12 col-md-12 col-lg-12 chat-body"
                        id={norColumnId} style={{ 'height': 'auto', 'maxHeight': 500 }}>
                        {norCmnts}
                    </div>
                );
            }
        } else {
            norColumn = (
                <div className="col-sm-12 col-md-6 col-lg-6 chat-body"
                    id={norColumnId} style={{ 'height': 'auto', 'maxHeight': 500 }}>
                    {norCmnts}
                </div>
            );
        }
        let cmtCount = favCmnts.length + norCmnts.length;
        let styleFmt = showComment === true ? { height: "auto" } : { display: "none" };

        return (
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <CommentBox articleUuid={this.props.articleUuid} cmtCount={cmtCount} cmtShow={showComment}/>
                </div>
                <div id={"comment-" + this.props.articleUuid} style={styleFmt} className="col-sm-12 col-md-12 col-lg-12">
                    <div className="row no-margin no-padding">
                        {favColumn}
                        {norColumn}
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function() {
        this.componentDidUpdate();
    },

    componentDidUpdate: function() {
        [
            '#nor-comment-' + this.props.articleUuid,
            '#fav-comment-' + this.props.articleUuid
        ].forEach(function(id) {
            let dom = $(id);
            if (dom[0] != null) {
                dom.stop().animate({
                    scrollTop: dom[0].scrollHeight
                }, 800);
            }
        });
    }
});

export default PostComment;
