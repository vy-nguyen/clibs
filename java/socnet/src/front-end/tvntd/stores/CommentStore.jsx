/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

class CommentText {
    constructor(data) {
        this._id          = _.uniqueId('id-comment-');
        this.articleUuid  = data.articleUuid;
        this.commentId    = data.commentId;
        this.commentDate  = data.commentDate;
        this.comment      = data.comment;
        this.userUuid     = data.userUuid;
        this.likes        = data.likes;
        this.favorite     = data.favorite;
        this.moment       = moment(data.commentDate, "MM/DD/YY h:mm").fromNow();
        this.userLiked    = data.userLiked;
        console.log(this);
        return this;
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
        return this;
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

    switchComment(id) {
        if (this.favorites[id] == null) {
            let comment = this.normals[id];
            comment.favorite = !comment.favorite;
            this.favorites[id] = comment;
            delete this.normals[id];
        } else {
            let comment = this.favorites[id];
            comment.favorite = !comment.favorite;
            this.normals[id] = comment;
            delete this.favorites[id];
        }
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
    data: {
        comentByArticleUuid: {}
    },
    listenables: [Actions],

    init: function() {
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
        console.log(data);
    },

    onPostCommentCompleted: function(data) {
        this._updateComments(data.comments, true);
        this.trigger(this.data);
    },

    onSwitchCommentCompleted: function(data) {
        let cmtArt = this.getByArticleUuid(data.articleUuid);
        if (cmtArt != null) {
            cmtArt.switchComment(data.commentId);
            this.trigger(cmtArt);
        }
    },

    getByArticleUuid: function(articleUuid) {
        return this.data.comentByArticleUuid[articleUuid];
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    },

    _addComment: function(it, show) {
        let cmtArt = this.data.comentByArticleUuid[it.articleUuid];
        if (cmtArt == null) {
            cmtArt = new ArticleComment(it);
            this.data.comentByArticleUuid[it.articleUuid] = cmtArt;
        }
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
