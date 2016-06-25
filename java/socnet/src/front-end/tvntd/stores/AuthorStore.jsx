/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux from 'reflux';
import _ from 'lodash';

import Actions      from 'vntd-root/actions/Actions.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

class Author {
    constructor(data) {
        this._id       = _.uniqueId('id-author-');
        this.profile   = null;
        this.userUuid  = data.authorUuid;
        this.coverImg  = this.profile ? this.profile.coverImg0 : "/rs/img/demo/s1.jpg";
        this.aboutList = data.aboutList;
        this.authorTags = data.authorTags;

        this.frontArticleUuid = data.frontArticleUuid;
        this.favoriteArticles = data.favoriteArticles;
        this.timeLineArticles = data.timeLineArticles;
        return this;
    }

    getUser() {
        if (this.profile == null) {
            this.profile = UserStore.getUserByUuid(this.userUuid);
        }
        return this.profile;
    }
}

let AuthorStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    getAuthorList: function() {
        return this.data.authorMap;
    },

    getAuthorTags: function(uuid) {
        return this.data.authorTags[uuid];
    },

    getTagsByAuthorUuid: function(uuid) {
        let tags = this.data.rawTagList[uuid];
        return tags != null ? tags : [];
    },

    getAuthorUuidList: function() {
        return this.data.authorUuids;
    },

    getAuthorByUuid: function(uuid) {
        return this.data.authorMap[uuid];
    },

    addAuthorList: function(authorList) {
        _.forEach(authorList, function(author, key) {
            if (this.data.authorMap[author.authorUuid] == null) {
                this.data.authorMap[author.authorUuid] = new Author(author);
            }
            if (this.data.authorTags[author.authorUuid] == null) {
                this.data.authorTags[author.authorUuid] = author.authorTags;
                this.data.rawTagList[author.authorUuid] = _.map(author.authorTags, function(it) {
                    return it.tagName;
                });
            }
            this.data.authorUuids.push(author.authorUuid);
        }.bind(this));
    },

    iterAuthor: function(uuidList, func) {
        if (uuidList == null) {
            _.forOwn(this.data.authorMap, func);
        } else {
            _.forOwn(uuidList, function(uuid, key) {
                let author = this.data.authorMap[uuid];
                if (author != null) {
                    func(author, key);
                } else {
                }
            }.bind(this));
        }
    },

    _updateArticleRank: function(data) {
        console.log("update result");
        console.log(data);
    },
    
    reset: function() {
        this.data = {
            authorMap: {},
            authorTags: {},
            rawTagList: {},
            authorUuids: []
        };
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    },

    init: function() {
        this.reset();
    },

    onUpdateArtRankCompleted: function(data) {
        this._updateArticleRank(data);
    },

    onPostArticleSelectCompleted: function(data) {
        this._updateArticleRank(data);
    },

    onInitCompleted: function(json) {
    },

    onPreloadCompleted: function(data) {
        this.addAuthorList(data.authors);
        this.trigger(this.data);
    },

    onGetAuthorsCompleted: function(data) {
        this.addAuthorList(data.authors);
        this.trigger(this.data);
    },

    onGetArticleRankCompleted: function(data) {
        console.log("Get article ranks");
        console.log(data);
    },

    onStartupCompleted: function(data) {
        if (data.userDTO && data.userDTO.authors) {
            this.addAuthorList(data.userDTO.authors);
            Actions.getArticleRank({
                uuids: this.getAuthorUuidList()
            });
            this.trigger(this.data);
        }
    },

    exports: {
    }
});

export default AuthorStore;
