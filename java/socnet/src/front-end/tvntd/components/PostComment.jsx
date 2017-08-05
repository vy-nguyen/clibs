/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import $        from 'jquery';
import React    from 'react-mod';
import {renderToString} from 'react-dom-server';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx'
import UserIcon         from 'vntd-root/components/UserIcon.jsx';
import LanguageStore    from 'vntd-root/stores/LanguageStore.jsx';
import CommentStore     from 'vntd-root/stores/CommentStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import {Util}           from 'vntd-shared/utils/Enum.jsx';

class CommentBox extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState   = this._updateState.bind(this);
        this._selectButton  = this._selectButton.bind(this);
        this._submitComment = this._submitComment.bind(this);
        this._toggleComment = this._toggleComment.bind(this);

        let clickMuted = false;
        let likeFmt    = "text-info";
        let shareFmt   = "text-info";

        if (!UserStore.isLogin()) {
            clickMuted = true;
            likeFmt    = "text-muted";
            shareFmt   = "text-muted";
        }
        this.state = {
            clickMuted : clickMuted,
            sendDisable: "",
            submiting  : false,
            like       : true,
            share      : true,
            likeFmt    : likeFmt,
            shareFmt   : shareFmt,
            commentShow: props.cmtShow,
            artAttr    : CommentStore.getArticleAttr(props.articleUuid),
            cmtBoxId   : _.uniqueId('comment-box-')
        }
    }

    componentDidMount() {
        this.unsub = CommentStore.listen(this._updateState);
        $('#' + this.state.cmtBoxId).on('input', function() {
            $(this).css({'height': 'auto', 'overflow-y': 'hidden'})
                .height(this.scrollHeight);
        });
    }

    componentWillUmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        if (this.state.submiting !== true) {
            return;
        }
        let newState = {}
        let artAttr  = CommentStore.getArticleAttr(this.props.articleUuid);

        if (artAttr != null) {
            if (artAttr.didILikeIt() === true) {
                newState = this._selectButton('like', true, false);
            }
            newState.artAttr = artAttr;
        }
        if (this.refs.comment != null) {
            this.refs.comment.value = "";
        }
        newState.sendDisable = "";
        newState.submiting = false;
        this.setState(newState);
    }

    _submitComment(e) {
        e.preventDefault();
        Actions.postComment({
            comment    : this.refs.comment.value,
            articleUuid: this.props.articleUuid,
        });
        this.setState({
            sendDisable: " disabled",
            submiting  : true
        });
    }

    _selectButton(type, likeState, shareState) {
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
    }

    _submitSelect(type, e) {
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
    }

    _toggleComment(e) {
        e.preventDefault();
        let show  = !this.state.commentShow;
        let boxId = "#comment-" + this.props.articleUuid;

        this.setState({commentShow: show});
        if (show === true) {
            $(boxId).show();
        } else {
            $(boxId).hide();
        }
    }

    render() {
        let submitFmt, btnFmt, btnRows, likeCount = 0, shareCount = 0,
            userLiked = <p><br/></p>,
            artAttr = this.state.artAttr, error = this.state.error,
            placeHolder = (error != null) ?
                this.state.error.text :
                LanguageStore.tooltip("Place your comments here...");

        if (artAttr != null) {
            likeCount = artAttr.likeCount;
            shareCount = artAttr.shareCount != null ? artAttr.shareCount : 0;

            let likedList = artAttr.getUserLiked();
            if (likedList != null) {
                userLiked = (
                    <p>
                        <br/>
                        <i className="fa fa-thumbs-up text-danger"></i> {likedList}
                    </p>
                );
            }
        }
        submitFmt = "btn btn-danger btn-primary pull-right " + this.state.sendDisable;
        btnFmt = "btn btn-link profile-link-btn";
        btnRows = (
            <div className="margin-top-10">
                <button className={submitFmt} type="submit"
                    disabled={this.state.submiting} onClick={this._submitComment}>
                    <Mesg text="Post"/>
                </button>
                <a href-void className={btnFmt}
                    rel="tooltip" data-placement="bottom" title="Add Location">
                    <i className="fa fa-location-arrow"></i>
                </a>
                <a href-void className={btnFmt}
                    data-placement="bottom" title="Add Photo">
                    <i className="fa fa-camera"></i>
                </a>
                <a href-void className={btnFmt} rel="tooltip"
                    data-placement="bottom" title="Add File">
                    <i className="fa fa-file"></i>
                </a>
            </div>
        );
        return (
            <div className="row no-margin no-padding">
                <hr/>
                <div className="btn-group inline">
                    <button onClick={this._submitSelect.bind(this, "like")}
                        disabled={this.state.clickMuted} className={this.state.likeFmt}
                        rel="tooltip" title={LanguageStore.tooltip("like or unlike")}>
                        <i className="fa fa-thumbs-up"></i>
                        <Mesg text="Like"/> ({likeCount})
                    </button>
                    <button onClick={this._toggleComment} className="text-info"
                        rel="tooltip"
                        title={LanguageStore.tip("toggle to hide/show comments")}>
                        <i className="fa fa-comment"></i>
                        <Mesg text="Comments"/> ({this.props.cmtCount})
                    </button>
                    <button onClick={this._submitSelect.bind(this, "share")}
                        disabled={this.state.clickMuted} className={this.state.shareFmt}
                        rel="tooltip" title={LanguageStore.tip("Not yet available")}>
                        <i className="fa fa-share"></i>
                        <Mesg text="Share"/> ({shareCount})
                    </button>
                    <button onClick={this._submitSelect.bind(this, "save")}
                        disabled={this.state.clickMuted} className="text-info"
                        rel="tooltip" title={LanguageStore.tip("Not yet available")}>
                        <i className="fa fa-book"></i><Mesg text="Save"/>
                    </button>
                    <button onClick={this._submitSelect.bind(this, "pay")}
                        disabled={this.state.clickMuted} className="text-info"
                        rel="tooltip" title={LanguageStore.tip("Not yet available")}>
                        <i className="fa fa-money"></i><Mesg text="Micropay"/>
                    </button>
                </div>
                {userLiked}
                <form encType="multipart/form-data"
                    acceptCharset="utf-8" className="form-horizontal">
                    <div className="row">
                        <div className="col-sm-12">
                            <textarea rows="2" ref="comment"
                                className="form-control input-sm"
                                id={this.state.cmtBoxId} placeholder={placeHolder}/>
                            {btnRows}
                        </div>
                    </div>
                </form>
                <br/>
            </div>
        );
    }
}

class CommentItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likeFmtStr  : <span><i className="fa fa-thumbs-up"></i> Like</span>,
            unlikeFmtStr: <span><i className="fa fa-thumbs-up"></i> Unlike</span>
        };
        this._submitLike = this._submitLike.bind(this);
        this._makeFavorite = this._makeFavorite.bind(this);
        StateButtonStore.createButton(this._getLikeBtnId(), this._createBtn.bind(this));
    }

    _submitLike(btnId) {
        let btnState = StateButtonStore.goNextState(btnId);
        let amount = (btnState.getStateCode() === "liked") ? 1 : -1;
        let data = this.props.data;
        Actions.postCmtSelect({
            kind       : "like",
            amount     : amount,
            article    : false,
            favorite   : data.isFavorite(),
            commentId  : data.getCommentId(),
            articleUuid: data.getArticleUuid()
        });
    }

    _makeFavorite(e) {
        e.preventDefault();
        let cmt = this.props.data;
        let cmtArt = CommentStore.getByArticleUuid(cmt.getArticleUuid());
        if (cmtArt != null) {
            Actions.updateComment({
                kind       : 'fav',
                article    : false,
                favorite   : !cmt.isFavorite(),
                commentId  : cmt.getCommentId(),
                articleUuid: cmt.getArticleUuid()
            }, cmtArt);
        }
    }

    _getLikeBtnId() {
        let data = this.props.data;
        return "co-like-" + data.getCommentId() + "-" + data.getArticleUuid();
    }

    _createBtn() {
        let likeFmt = this.state.likeFmtStr;
        return {
            success: {
                text     : likeFmt,
                disabled : false,
                nextState: "liked",
                className: "text-info"
            },
            failure: {
                text     : likeFmt,
                disabled : false,
                nextState: "liked",
                className: "text-info"
            },
            liked: {
                text     : this.state.unlikeFmtStr,
                disabled : false,
                nextState: "success",
                className: "text-muteed"
            }
        };
    }

    componentWillMount() {
        let likeBtnId = this._getLikeBtnId();

        if (Util.findUuid(this.props.data.getUserLiked(),
                          null, UserStore.getSelfUuid()) != -1) {
            StateButtonStore.setButtonState(likeBtnId, "liked");
        }
    }

    render() {
        let user = this.props.user;
        if (user == null) {
            return null;
        }
        let likeList,
            favBtn    = null,
            likeBtnId = this._getLikeBtnId(),
            comment   = this.props.data,
            userLiked = comment.getUserLiked();

        if (comment.amIArticleAuthor()) {
            let favBtnText   = LanguageStore.translate("Favorites");
            let favClassName = "fa fa-bookmark";
            if (comment.isFavorite() === true) {
                favBtnText = LanguageStore.translate("Not Favorite");
                favClassName = "fa fa-thumbs-down";
            }
            favBtn = (
                <li>
                    <button onClick={this._makeFavorite} className="text-warning"> 
                        <i className={favClassName}></i>{favBtnText}
                    </button>
                </li>
            );
        }
        if (userLiked == null || userLiked.length == 0) {
            likeList = (
                <span className="text-info">
                    <i className="fa fa-thumbs-up"></i>(0) <Mesg text="Likes"/>
                </span>
            );
        } else {
            likeList = (
                <span className="text-info">
                    <a href-void rel="tooltip" title={comment.getUserLikedList()}>
                        <i className="fa fa-thumbs-up"></i>({userLiked.length})
                        <Mesg text="Likes"/>
                    </a>
                </span>
            );
        }
        return (
            <li className="message">
                <UserIcon className="username"
                    userUuid={user.userUuid} width="40" height="40"/>
                <span className="message-text">
                    <a href-void className="username">
                        {user.lastName + ' ' + user.firstName}
                        <small className="pull-right text-info">  {comment.moment}</small>
                    </a>
                    {comment.comment}
                </span>
                <ul className="list-inline">
                    <li>
                        <StateButton btnId={likeBtnId}
                            onClick={this._submitLike.bind(this, likeBtnId)}/>
                    </li>
                    {favBtn}
                    <li>{likeList}</li>
                </ul>
            </li>
        )
    }
}

class PostComment extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState = this._updateState.bind(this);
        this._componentDidUpdate = this._componentDidUpdate.bind(this);

        this.state = {
            artUuid: props.articleUuid,
            comment: CommentStore.getByArticleUuid(props.articleUuid)
        }
    }

    componentDidMount() {
        this.unsub = CommentStore.listen(this._updateState);
        this._componentDidUpdate();
    }

    componentWillUmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data, cmtArt) {
        let commentArt, artUuid = this.props.articleUuid;

        /*
        if (cmtArt == null || cmtArt.articleUuid !== artUuid) {
            return;
        }
         */
        commentArt = CommentStore.getByArticleUuid(artUuid);
        if (commentArt == null || commentArt.articleUuid !== artUuid) {
            return;
        }
        this.setState({
            artUuid: artUuid,
            comment: commentArt
        });
    }

    _componentDidUpdate() {
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

    render() {
        let normals = [],
            norCmnts = [],
            favCmnts = [],
            favorites = [],
            showComment = false,
            commentArt = this.state.comment,
            artUuid = this.props.articleUuid, favColumn = null, norColumn = null,
            favColumnId, norColumnId, cmtCount, styleFmt;

        if (artUuid !== this.state.artUuid) {
            commentArt = CommentStore.getByArticleUuid(artUuid);
        }
        if (commentArt != null) {
            normals     = commentArt.getNormals();
            favorites   = commentArt.getFavorites();
            showComment = commentArt.showComment;
        }
        _.forOwn(favorites, function(item, idx) {
            favCmnts.push(
                <CommentItem key={_.uniqueId('comment-')}
                    user={UserStore.getUserByUuid(item.userUuid)} data={item}/>
            );
        });
        _.forOwn(normals, function(item, idx) {
            norCmnts.push(
                <CommentItem key={_.uniqueId('comment-')}
                    user={UserStore.getUserByUuid(item.userUuid)} data={item}/>
            );
        });
        favColumnId = 'fav-comment-' + artUuid;
        if (!_.isEmpty(favorites)) {
            favColumn = (
                <div className="col-sm-12 col-md-6 col-lg-6 chat-body"
                    id={favColumnId} style={{ 'height': 'auto', 'maxHeight': 500 }}>
                    <ul>{favCmnts}</ul>
                </div>
            );
        }
        norColumnId = 'nor-comment-' + artUuid;
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
        cmtCount = favCmnts.length + norCmnts.length;
        styleFmt = showComment === true ? { height: "auto" } : { display: "none" };

        return (
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <CommentBox articleUuid={artUuid}
                        cmtCount={cmtCount} cmtShow={showComment}/>
                </div>
                <div id={"comment-" + artUuid}
                    style={styleFmt} className="col-sm-12 col-md-12 col-lg-12">
                    <div className="row no-margin no-padding">
                        {favColumn}
                        {norColumn}
                    </div>
                </div>
            </div>
        );
    }
}

export default PostComment;
