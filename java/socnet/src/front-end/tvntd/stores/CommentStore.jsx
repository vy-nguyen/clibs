/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

class CommentAttr {
    constructor(brief) {
        this.articleUuid = brief.articleUuid;
        this.commentId   = brief.commentId;
        this.updateAttr(brief);
        return this;
    }

    _updateCount(result, list) {
        if (result == null || _.isEmpty(list)) {
            result = {
                count: 0
            };
        }
        if (list != null) {
            _.forEach(list, function(uuid) {
                result.count++;
                result[uuid] = UserStore.getUserByUuid(uuid);
            });
        }
        return result;
    }

    updateAttr(attr) {
        this.userLiked   = this._updateCount(this.userLiked, attr.userLiked);
        this.userShared  = this._updateCount(this.userShared, attr.userShared);
        this.score       = attr.score;
        this.favorite    = attr.favorite;
    }

    getUsersLiked() {
        return this.userLiked;
    }

    getUsersShared() {
        return this.userShared;
    }

    getSharedCount() {
        return this.userShared.count;
    }

    getUserLiked() {
        return this.userLiked;
    }

    getLikedCount() {
        return this.userLiked.count;
    }

    toggleFavorite() {
        this.favorite = !this.favorite;
    }

    didILikeIt() {
        let myUuid = UserStore.getSelf().userUuid;
        return this.userLiked[myUuid] != null ? true : false;
    }

    getUserLikedList() {
        let out = [];

        this.userListIter('like', function(user) {
            out.push(user.lastName + " " + user.firstName);
        });
        if (!_.isEmpty(out)) {
            return out.join(", ");
        }
        return null;
    }

    userListIter(kind, iterFn) {
        let list = kind === 'like' ? this.userLiked : this.userShared;

        _.forOwn(list, function(uuid,  key) {
            if (uuid != null && key !== "count") {
                iterFn(uuid);
            }
        });
    }
}

/**
 * Store comment attributes for Article.
 */
class CommentArtAttr extends CommentAttr
{
    constructor(brief) {
        super(brief);
    }

    updateAttr(attr) {
        super.updateAttr(attr);

        if (attr.creditEarned != null) {
            this.creditEarned = attr.creditEarned;
        }
        if (attr.moneyEarned != null) {
            this.moneyEarned  = attr.moneyEarned;
        }
    }
}

class CommentText {
    constructor(data, artOwner) {
        this.commentDate = data.commentDate;
        this.comment     = data.comment;
        this.userUuid    = data.userUuid;
        this.moment      = moment(data.commentDate, "MM/DD/YY h:mm").fromNow();
        this.artOwner    = artOwner;
        this.commentAttr = new CommentAttr(data);
        return this;
    }

    updateAttr(data) {
        this.commentAttr.updateAttr(data);
    }

    isFavorite() {
        return this.commentAttr.favorite;
    }

    getLikedCount() {
        return this.commentAttr.getLikedCount();
    }

    getUserLiked() {
        return this.commentAttr.getUserLiked();
    }

    getCommentId() {
        return this.commentAttr.commentId;
    }

    getArticleUuid() {
        return this.commentAttr.articleUuid;
    }

    toggleFavorite() {
        return this.commentAttr.toggleFavorite();
    }

    amIArticleAuthor() {
        return UserStore.isUserMe(this.artOwner.getAuthorUuid());
    }

    getUserLiked() {
        return this.commentAttr.getUserLiked();
    }

    getUserLikedList() {
        return this.commentAttr.getUserLikedList();
    }

    userListIter(kind, iterFn) {
        this.commentAttr.userListIter(kind, iterFn);
    }
}

class ArticleComment {
    constructor(brief) {
        this.articleUuid    = brief.getArticleUuid();
        this.authorUuid     = brief.getAuthorUuid();
        this.showComment    = true;
        this.favorites      = {};
        this.normals        = {};
        this.normalSorted   = [];
        this.favoriteSorted = [];
        this.articleAttr    = new CommentArtAttr(brief);
        return this;
    }

    getAuthorUuid() {
        return this.authorUuid;
    }

    updateArtAttr(data) {
        this.articleAttr.updateAttr(data);
    }

    updateAttr(data) {
        if (data.article === true) {
            this.updateArtAttr(data);
        } else {
            let cmt = this.getComment(data.creditEarned);
            if (cmt != null) {
                cmt.updateAttr(data);
            }
        }
    }

    didILikeIt() {
        return this.articleAttr != null ? this.articleAttr.didILikeIt() : false;
    }

    getArticleAttr() {
        return this.articleAttr;
    }

    getCommentAttr(id) {
        let cmt = this.favorites[id];

        if (cmt != null) {
            return cmt.commentAttr;
        }
        cmt = this.normals[id];
        if (cmt != null) {
            return cmt.commentAttr;
        }
        return null;
    }

    getComment(id) {
        let cmt = this.favorites[id];

        if (cmt != null) {
            return cmt;
        }
        return this.normals[id];
    }

    addComment(data) {
        if (this.articleUuid !== data.articleUuid) {
            return false;
        }
        if (data.favorite === true) {
            if (this.favorites[data.commentId] == null) {
                this.favorites[data.commentId] = new CommentText(data, this);
            }
        } else {
            if (this.normals[data.commentId] == null) {
                this.normals[data.commentId] = new CommentText(data, this);
            }
        }
        return true;
    }

    toggleFavComment(id) {
        let comment;

        if (this.favorites[id] == null) {
            comment = this.normals[id];
            comment.toggleFavorite();

            this.favorites[id] = comment;
            delete this.normals[id];
            return comment;
        }
        comment = this.favorites[id];
        comment.toggleFavorite();
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

    userListIter(kind, iterFn) {
        this.articleAttr.userListIter(kind, iterFn);
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
            if (this.favorites.length !== old.favorites.length ||
                this.normals.length !== old.normals.length) {
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

    onGetCommentsCompleted: function(data) {
        if (data.comments != null) {
            console.log("Get comments data");
            console.log(data);
            this._updateComments(data.comments, true, false);
            this.trigger(this.data, null);
        }
    },

    onPostCommentCompleted: function(data) {
        let comments = data.comments;
        if (comments != null && comments[0] != null) {
            this._updateComments(comments, true, true);
            this.trigger(this.data, this.getByArticleUuid(comments[0].articleUuid));
        }
    },

    onPostCommentFailed: function(data) {
        this.data.error = data;
        this.trigger(this.data, null);
    },

    onUpdateCommentCompleted: function(data, cmtArt) {
        cmtArt.toggleFavComment(data.commentId);
        this.trigger(this.data, cmtArt);
    },

    onPostCmtSelectCompleted: function(data) {
        console.log("select completed...");
        console.log(data);

        let cmtArt = this.getByArticleUuid(data.articleUuid);
        cmtArt.updateAttr(data);
        this.trigger(this.data, cmtArt);
    },

    /*
     * Main entry at startup after getting data returned back from the server.
     */
    mainStartup(data) {
        let uuidList = [], uuidDict = {};

        if (data.articles != null) {
            _.forOwn(data.articles, function(it, key) {
                uuidDict[it.articleUuid] = it.articleUuid;
            });
        }
        if (data.artRanks != null) {
            _.forOwn(data.artRanks, function(it, key) {
                uuidDict[it.articleUuid] = it.articleUuid;
            });
        }
        _.forOwn(uuidDict, function(it) {
            uuidList.push(it);
        });
        if (!_.isEmpty(uuidList)) {
            Actions.getComments({
                authorUuid: UserStore.getSelfUuid(),
                uuidType  : "artCmt",
                uuids     : uuidList 
            });
        }
        this.updateArticleRanks(data.artRanks);
    },

    updateArticleRanks(artRanks) {
        let brief, anchor = this.data.commentByArticleUuid;

        _.forEach(artRanks, function(rank) {
            brief = AuthorStore.lookupArticleRankByUuid(rank.articleUuid);
            anchor[brief.getArticleUuid()] = new ArticleComment(brief);
        });
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

    _addComment: function(it, show, newCmt) {
        let cmtArt = this.getByArticleUuid(it.articleUuid);

        cmtArt.showComment = show;
        cmtArt.addComment(it);
        return cmtArt;
    },

    _updateComments: function(commentList, show, newCmt) {
        _.forOwn(commentList, function(it, key) {
            this._addComment(it, show, newCmt);
        }.bind(this));
    }
});

export default CommentStore;
