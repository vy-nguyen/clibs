/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import $        from 'jquery';
import React    from 'react-mod';
import ReactTooltip     from 'react-tooltip'

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import ModalConfirm     from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx'
import UserIcon         from 'vntd-root/components/UserIcon.jsx';
import LanguageStore    from 'vntd-root/stores/LanguageStore.jsx';
import CommentStore     from 'vntd-root/stores/CommentStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import {Util}           from 'vntd-shared/utils/Enum.jsx';

class LikeDialog extends React.Component
{
    constructor(props) {
        super(props);
        this._likeDialog = this._likeDialog.bind(this);
    }

    _likeDialog() {
        this.refs.likeList.openModal();
    }

    render() {
        let likeModal = null, likeList = [], likeNames = [],
            comment   = this.props.comment,
            likeCount = comment.getLikedCount();

        comment.userListIter('like', function(user) {
            likeNames.push(user.lastName + " " + user.firstName);
            likeList.push(
                <UserIcon className="username" inlineName={true}
                    userUuid={user.userUuid} width="40" height="40"/>
            );
        });
        if (!_.isEmpty(likeList)) {
            likeNames = likeNames.join(", ");
            likeModal = (
                <ModalConfirm ref="likeList" height="auto" modalTitle="Likes">
                    <div className="modal-content padding-10">
                        {likeList}
                    </div>
                </ModalConfirm>
            );
        }
        return (
            <span className="text-info">
                {likeModal}
                <a onClick={this._likeDialog} data-tip={likeNames}>
                    <i className="fa fa-thumbs-up"></i>({likeCount})
                    <Mesg text="Likes"/>
                </a>
                <ReactTooltip/>
            </span>
        );
    }
}

class CommentBox extends React.Component
{
    constructor(props) {
        super(props);
        this._getFormat     = this._getFormat.bind(this);
        this._updateState   = this._updateState.bind(this);
        this._selectValue   = this._selectValue.bind(this);
        this._submitComment = this._submitComment.bind(this);
        this._toggleComment = this._toggleComment.bind(this);

        this.state = {
            articleUuid: null,
            sendDisable: "",
            submiting  : false,
            cmtBoxId   : _.uniqueId('comment-box-')
        };
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

    _getFormat() {
        let artAttr, likeFmt, shareFmt, shareCount, likedList, likeCount,
            likedListSpan = null;

        if (!UserStore.isLogin()) {
            return {
                likeFmt   : "text-muted",
                shareFmt  : "text-muteed",
                likedList : null,
                likeCount : 0,
                shareCount: 0,
                clickMuted: true,
                userLiked : <p><br/>{likedListSpan}</p>
            }
        }
        artAttr = this.props.artAttr;
        if (artAttr != null) {
            shareCount = artAttr.getSharedCount();
            likeCount  = artAttr.getLikedCount();
            likedList  = artAttr.getUserLikedList();

            if (likedList != null) {
                likedListSpan = (
                    <span>
                        <i className="fa fa-thumbs-up text-danger"></i> {likedList}
                    </span>
                );
            }
            if (artAttr.didILikeIt() === true) {
                likeFmt    = "text-muted text-danger";
                shareFmt   = "text-muted text-danger";
            } else {
                likeFmt    = "text-info";
                shareFmt   = "text-info";
            }
        } else {
            likedList  = null;
            likeCount  = 0;
            shareCount = 0;
            likeFmt    = "text-info";
            shareFmt   = "text-info";
        }
        return {
            likeFmt   : likeFmt,
            shareFmt  : shareFmt,
            likedList : likedList,
            likeCount : likeCount,
            shareCount: shareCount,
            clickMuted: false,
            userLiked : <p><br/>{likedListSpan}</p>
        }
    }

    _updateState(data, cmt) {
        let artUuid = this.state.articleUuid;

        if (cmt == null || cmt.articleUuid !== artUuid) {
            return;
        }
        console.log("comment update...");
        console.log(cmt);

        if (this.refs.comment != null) {
            this.refs.comment.value = "";
        }
        this.setState({
            articleUuid: null,
            sendDisable: "",
            submiting  : false,
        });
    }

    _submitComment(e) {
        e.preventDefault();
        Actions.postComment({
            comment    : this.refs.comment.value,
            articleUuid: this.props.articleUuid,
        });
        this.setState({
            articleUuid: this.props.articleUuid,
            sendDisable: " disabled",
            submiting  : true
        });
    }

    _selectValue(type) {
        let liked, artAttr = this.props.artAttr;

        liked = (artAttr != null && artAttr.didILikeIt() === true);
        if (liked === true) {
            return -1;
        }
        return 1;
    }

    _submitSelect(type, e) {
        let value = this._selectValue(type);

        Actions.postCmtSelect({
            kind       : type,
            amount     : value,
            article    : true,
            favorite   : false,
            commentId  : 0,
            articleUuid: this.props.articleUuid
        });
    }

    _toggleComment(e) {
        let show  = !this.props.cmtShow,
            boxId = "#comment-" + this.props.articleUuid;

        this.setState({commentShow: show});
        if (show === true) {
            $(boxId).show();
        } else {
            $(boxId).hide();
        }
    }

    render() {
        let submitFmt, btnFmt, btnRows, statusFmt,
            artAttr = this.props.artAttr, error = this.state.error,
            placeHolder = (error != null) ?
                this.state.error.text :
                LanguageStore.tooltip("Place your comments here...");

        statusFmt = this._getFormat();
        submitFmt = "btn btn-danger btn-primary pull-right " + this.state.sendDisable;
        btnFmt    = "btn btn-link profile-link-btn";
        btnRows   = (
            <div className="margin-top-10">
                <button className={submitFmt}
                    disabled={this.state.submiting} onClick={this._submitComment}>
                    <Mesg text="Post"/>
                </button>
                <a href-void className={btnFmt} data-tip="Add Location">
                    <i className="fa fa-location-arrow"></i>
                </a>
                <a href-void className={btnFmt} data-tip="Add Photo">
                    <i className="fa fa-camera"></i>
                </a>
                <a href-void className={btnFmt} data-tip="Add File">
                    <i className="fa fa-file"></i>
                </a>
            </div>
        );
        return (
            <div className="row no-margin no-padding">
                <hr/>
                <div className="btn-group inline">
                    <button onClick={this._submitSelect.bind(this, "like")}
                        disabled={statusFmt.clickMuted} className={statusFmt.likeFmt}
                        data-tip={statusFmt.likedList}>
                        <i className="fa fa-thumbs-up"/>
                        <Mesg text="Like"/> ({statusFmt.likeCount})
                    </button>
                    <button onClick={this._toggleComment} className="text-info"
                        data-tip={LanguageStore.tip("toggle to hide/show comments")}>
                        <i className="fa fa-comment"></i>
                        <Mesg text="Comments"/> ({this.props.cmtCount})
                    </button>
                    <button onClick={this._submitSelect.bind(this, "share")}
                        disabled={statusFmt.clickMuted} className={statusFmt.shareFmt}
                        data-tip={LanguageStore.tip("Not yet available")}>
                        <i className="fa fa-share"></i>
                        <Mesg text="Share"/> ({statusFmt.shareCount})
                    </button>
                    <button onClick={this._submitSelect.bind(this, "save")}
                        disabled={statusFmt.clickMuted} className="text-info"
                        data-tip={LanguageStore.tip("Not yet available")}>
                        <i className="fa fa-book"></i><Mesg text="Save"/>
                    </button>
                    <button onClick={this._submitSelect.bind(this, "pay")}
                        disabled={statusFmt.clickMuted} className="text-info"
                        data-tip={LanguageStore.tip("Not yet available")}>
                        <i className="fa fa-money"></i><Mesg text="Micropay"/>
                    </button>
                </div>
                <ReactTooltip/>
                {statusFmt.userLiked}
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
        this._submitLike   = this._submitLike.bind(this);
        this._makeFavorite = this._makeFavorite.bind(this);
        StateButtonStore.createButton(this._getLikeBtnId(), this._createBtn.bind(this));
    }

    _submitLike(btnId) {
        let btnState = StateButtonStore.goNextState(btnId),
            amount = (btnState.getStateCode() === "liked") ? 1 : -1,
            data = this.props.data;

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
        let cmt = this.props.data,
            cmtArt = CommentStore.getByArticleUuid(cmt.getArticleUuid());

        if (cmtArt != null) {
            Actions.updateComment({
                kind       : 'fav',
                article    : false,
                amount     : 0,
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
        let likeList, likeCount,
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
        likeCount = comment.getLikedCount();
        if (likeCount === 0) {
            likeList = (
                <span className="text-info">
                    <i className="fa fa-thumbs-up"></i>(0) <Mesg text="Likes"/>
                </span>
            );
        } else {
            likeList = <LikeDialog comment={comment}/>;
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

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data, cmtArt) {
        let commentArt, artUuid = this.props.articleUuid;

        if (this.state.comment == null) {
            if (cmtArt == null) {
                commentArt = CommentStore.getByArticleUuid(artUuid);
            } else {
                commentArt = cmtArt;
            }
        } else {
            if (cmtArt != null && cmtArt.articleUuid != artUuid) {
                return;
            }
            commentArt = CommentStore.getByArticleUuid(artUuid);
        }
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
                        artAttr={CommentStore.getArticleAttr(artUuid)}
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
