/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

class CommentAttr {
    constructor(data) {
        this.articleUuid  = data.articleUuid;
        this.commentId    = data.commentId;
        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.score        = data.score;
        this.likeCount    = data.likes;
        this.shareCount   = data.shared;
        this.favorite     = data.favorite;
        this.userLiked    = data.userLiked;
        this.userShared   = data.userShared;
        this.updateCount(data);
        return this;
    }

    updateCount(data) {
        if (data.kind === 'like') {
            this.likeCount = data.amount;

        } else if (data.kind == 'share') {
            this.shareCount = data.amount;
        }
    }

    updateAttr(attr) {
        if (attr.userLiked != null) {
            this.userLiked = attr.userLiked;
            this.likeCount = attr.userLiked.length;
        }
        if (attr.userShared != null) {
            this.userShared = attr.userShared;
            this.shareCount = attr.userShared.length;
        }
        this.score       = attr.score;
        this.favorite    = attr.favorite;
        this.moneyEarned = attr.moneyEarned;
    }

    getUsersLiked() {
        return this.userLiked;
    }

    getUsersShared() {
        return this.userShared;
    }

    getUserLiked() {
    }

    didILikeIt() {
        let ret = false;
        let myUuid = UserStore.getSelf().userUuid;
        _.forOwn(this.userLiked, function(it, idx) {
            if (it === myUuid) {
                ret = true;
                return false;
            }
        });
        return ret;
    }

    getUserLiked() {
        let out = [];
        _.forOwn(this.userLiked, function(it, idx) {
            let user = UserStore.getUserByUuid(it);
            if (user != null) {
                out.push(user.lastName + " " + user.firstName);
            }
        });
        if (!_.isEmpty(out)) {
            return out.join(", ");
        }
        return null;
    }
}

class CommentText {
    constructor(data) {
        this._id          = _.uniqueId('id-comment-');
        this.commentDate  = data.commentDate;
        this.comment      = data.comment;
        this.userUuid     = data.userUuid;
        this.moment       = moment(data.commentDate, "MM/DD/YY h:mm").fromNow();
        this.commentAttr  = new CommentAttr(data);
        return this;
    }

    updateAttr(data) {
        this.commentAttr.updateAttr(data);
    }

    getFavorites() {
        return this.commentAttr.favorite;
    }

    getUserLiked() {
        return this.commentAttr.userLiked;
    }

    getCommentId() {
        return this.commentAttr.commentId;
    }

    getArticleUuid() {
        return this.commentAttr.articleUuid;
    }
}

class ArticleComment {
    constructor(data) {
        this.articleUuid = data.articleUuid;
        this.showComment = data.showComment;
        this.favorites = {};
        this.normals = {};
        this.normalSorted = [];
        this.favoriteSorted = [];

        this.articleAttr = null;
        return this;
    }

    updateArtAttr(data) {
        if (this.articleAttr == null) {
            this.articleAttr = new CommentAttr(data);
        } else {
            this.articleAttr.updateCount(data);
        }
    }

    updateAttr(data) {
        if (data.article === true) {
            this.updateArtAttr(data);
        } else {
            let cmt = this.getComment(data.creditEarned);
            if (cmt != null) {
                console.log(data);
                cmt.updateAttr(data);
            }
        }
    }

    didILikeArticle() {
        return this.articleAttr != null ? this.articleAttr.didILikeIt() : false;
    }

    getArticleAttr() {
        return this.articleAttr;
    }

    getComment(id) {
        let cmtAttr = this.favorites[id];
        if (cmtAttr != null) {
            return cmtAttr;
        }
        return this.normals[id];
    }

    addComment(data) {
        if (this.articleUuid !== data.articleUuid) {
            return false;
        }
        if (data.favorite === true) {
            if (this.favorites[data.commentId] == null) {
                this.favorites[data.commentId] = new CommentText(data);
            }
        } else {
            if (this.favorites[data.commentId] == null) {
                this.normals[data.commentId] = new CommentText(data);
            }
        }
    }

    toggleFavComment(id) {
        if (this.favorites[id] == null) {
            let comment = this.normals[id];
            comment.favorite = !comment.favorite;
            this.favorites[id] = comment;
            delete this.normals[id];
            return comment;
        }
        let comment = this.favorites[id];
        comment.favorite = !comment.favorite;
        this.normals[id] = comment;
        delete this.favorites[id];
        return comment;
    }

    iterFavComments(func) {
        _.forOwn(this.favorites, func);
    }
    iterNormalComments(func) {
        _.forOwn(this.normals, func);
    }

    getFavorites() {
        return this.getComments(this.favorites);
    }

    getNormals() {
        return this.getComments(this.normals);
    }

    getComments(list) {
        let result = [];
        _.forOwn(list, function(it, idx) {
            result.push(it);
        });
        return result;
    }

    newComment(old) {
        if (old == null) {
            return true;
        }
        if (this.articleUuid === old.articleUuid) {
            if (this.favorites.length !== old.favorites.length || this.normals.length !== old.normals.length) {
                return true;
            }
        }
        return false;
    }
}

let CommentStore = Reflux.createStore({
    data: {},
    listenables: [Actions],

    init: function() {
        this.data = {
            commentByArticleUuid: {},
            error: null
        }
    },

    onPreloadCompleted: function(raw) {
        this._updateComments(raw.comments, false);
        this.trigger(this.data);
    },

    onStartupCompleted: function(data) {
        if (data.articles) {
            let articleList = [];
            _.forOwn(data.articles, function(it, key) {
                articleList.push(it.articleUuid);
            });
            Actions.getComments({
                uuids: articleList
            });
        }
    },

    onGetCommentsCompleted: function(data) {
        this._updateComments(data.comments, true);
        this.trigger(this.data);
    },

    onPostCommentCompleted: function(data) {
        this._updateComments(data.comments, true);
        this.trigger(this.data);
    },

    onPostCommentFailed: function(data) {
        this.data.error = data;
        this.trigger(this.data);
    },

    postCmtSelectCompleted: function(data) {
        let cmtArt = this.addArtComment(data);
        cmtArt.updateAttr(data);
        this.trigger(this.data);
    },

    getArticleAttr: function(articleUuid) {
        let cmtArt = this.getByArticleUuid(articleUuid);
        if (cmtArt != null) {
            return cmtArt.getArticleAttr();
        }
        return null;
    },

    getArticleCommentAttr: function(articleUuid, commentId) {
        let cmtArt = this.getByArticleUuid(articleUuid);
        if (cmtArt != null) {
            return cmtArt.getCommentAttr(commentId);
        }
        return null;
    },

    getByArticleUuid: function(articleUuid) {
        return this.data.commentByArticleUuid[articleUuid];
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    },

    addArtComment: function(data) {
        let cmtArt = this.data.commentByArticleUuid[data.articleUuid];
        if (cmtArt == null) {
            cmtArt = new ArticleComment(data);
            this.data.commentByArticleUuid[data.articleUuid] = cmtArt;
        }
        return cmtArt;
    },

    toggleFavComment: function(data) {
        let cmtArt = this.getByArticleUuid(data.articleUuid);
        if (cmtArt != null) {
            let cmt = cmtArt.toggleFavComment(data.commentId);
            Actions.updateComment({
                kind       : 'fav',
                article    : false,
                favorite   : cmt.favorite,
                commentId  : cmt.commentId,
                articleUuid: cmt.articleUuid
            });
            this.trigger(cmtArt);
        }
    },

    addArtAttr: function(attr) {
        let cmtArt = this.addArtComment({
            articleUuid: attr.articleUuid,
            showComment: false
        });
        cmtArt.updateArtAttr(attr);
    },

    _addComment: function(it, show) {
        let cmtArt = this.addArtComment(it);
        cmtArt.showComment = show;
        cmtArt.addComment(it);
        return cmtArt;
    },

    _updateComments: function(commentList, show) {
        _.forOwn(commentList, function(it, key) {
            this._addComment(it, show);
        }.bind(this));
    }
});

export default CommentStore;
