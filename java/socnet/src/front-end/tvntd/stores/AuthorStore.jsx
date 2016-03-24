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
        this._id        = _.uniqueId('id-author-');
        this.authorUser = undefined;
        this.coverImg   = data.coverImg;
        this.userUuid   = data.userUuid;
        this.aboutList  = data.aboutList;
        return this;
    }
}

let AuthorStore = Reflux.createStore({
    data: {
        authorList: []
    },
    listenables: Actions,

    getAuthorList: function() {
        return this.data.authorList;
    },

    getAuthorByUuid: function(uuid) {
        return _.find(this.data.authorList, { userUuid: uuid });
    },

    init: function() {
        this.listenTo(UserStore, this._userUpdate);
    },

    onInitCompleted: function(json) {
        _addFromJson(json);
        this.trigger(this.data);
    },

    onPreloadCompleted: function(data) {
        this._addFromJson(data.authors);
        this.trigger(this.data);
    },

    _userUpdate: function(userList) {
        _(this.data.authorList).forEach(function(it) {
            if (it.authorUser == undefined) {
                it.authorUser = UserStore.getUserByUuid(it.userUuid);
            }
        });
    },

    _addFromJson: function(items) {
        _(items).forEach(function(it) {
            var author = new Author(it);
            if (author.authorUser == undefined) {
                author.authorUser = UserStore.getUserByUuid(it.userUuid);
            }
            this.data.authorList.push(author);
        }.bind(this));
        this._userUpdate();
    },

    exports: {
    }
});

export default AuthorStore;
