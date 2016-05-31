/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';
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
        this.ignore       = data.ignore;
        this.moment       = data.moment;
        return this;
    }
}

class ArticleComment {
    constructor(data) {
        this.articleUuid = data.articleUuid;
        this.showComment = data.showComment;
        this.favorites = {};
        this.normals = {};
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
}

let CommentStore = Reflux.createStore({
    data: {
        comentByArticleUuid: {}
    },
    listenables: [Actions],

    init: function() {
    },

    onPreloadCompleted: function(raw) {
        this._updateComments(raw.comments);
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

    _updateComments: function(commentList) {
        _.forOwn(commentList, function(it, key) {
            let cmtArt = this.data.comentByArticleUuid[it.articleUuid];
            if (cmtArt == null) {
                cmtArt = new ArticleComment(it);
                this.data.comentByArticleUuid[it.articleUuid] = cmtArt;
            }
            cmtArt.addComment(it);
        }.bind(this));
        this.dumpData("Comment store");
    }
});

export default CommentStore;
