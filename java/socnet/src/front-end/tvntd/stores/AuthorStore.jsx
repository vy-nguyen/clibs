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
    data: {
        authorMap: {}
    },
    listenables: Actions,

    getAuthorList: function() {
        return this.data.authorMap;
    },

    getAuthorUuidList: function() {
        let uuids = [];
        _.forOwn(this.data.authorMap, function(author, key) {
            uuids.push(author.userUuid);
        });
        return uuids;
    },

    getAuthorByUuid: function(uuid) {
        return this.data.authorMap[uuid];
    },

    addAuthorList: function(authorList) {
        _.forEach(authorList, function(author, key) {
            if (this.data.authorMap[author.authorUuid] == null) {
                this.data.authorMap[author.authorUuid] = new Author(author);
            }
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

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    },

    init: function() {
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

    onStartupCompleted: function(data) {
        if (data.userDTO.authors) {
            this.addAuthorList(data.userDTO.authors);
            this.trigger(this.data);
        }
    },

    exports: {
    }
});

export default AuthorStore;
