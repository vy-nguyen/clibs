/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux from 'reflux';
import React  from 'react-mod';
import _      from 'lodash';

import Actions        from 'vntd-root/actions/Actions.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import {insertSorted} from 'vntd-shared/utils/Enum.jsx';

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

class AuthorTag {
    constructor(tag) {
        this._id        = _.uniqueId('id-author-tag-');
        this.articles   = {};
        this.sortedArts = [];
        this.tagName    = tag.tagName;
        this.headNotif  = tag.headNotif;
        this.isFavorite = tag.isFavorite;
        this.rank       = tag.rank;
        this.notifCount = tag.notifCount;
        this.headChain  = tag.headChain;
        return this;
    }

    addArticleRank(rank) {
        if (this.articles[rank.articleUuid] != null) {
            return;
            //this.removeArticleRank(rank);
        }
        this.articles[rank.articleUuid] = rank;
        insertSorted(rank, this.sortedArts, function(r1, r2) {
            return r1.rank - r2.rank;
        });
    }

    removeArticleRank(rank) {
        delete this.articles[rank.articleUuid];
        _.forOwn(this.sortedArts, function(it, idx) {
            if (it.articleUuid === rank.articleUuid) {
                this.sortedArts = this.sortedArts.splice(idx, 1);
                return false;
            }
        }.bind(this));
    }

    getArticleRank(artUuid) {
        return this.articles[artUuid];
    }

    getSortedArticleRank() {
        return this.sortedArts;
    }
}

class AuthorTagMgr {
    constructor(uuid) {
        this.authorUuid = uuid;
        this.authorTags = {};
        this.sortedTags = [];
        this.stringTags = [];
        return this;
    }

    addAuthorTag(tag) {
        let authorTag = this.authorTags[tag.tagName];
        if (authorTag != null) {
            this.removeAuthorTag(tag);
        }
        authorTag = new AuthorTag(tag);
        this.authorTags[tag.tagName] = authorTag;

        insertSorted(authorTag, this.sortedTags, function(t1, t2) {
            return t1.rank - t2.rank;
        });
        this.stringTags = _.map(this.sortedTags, function(it) {
            return it.tagName;
        });
        return authorTag;
    }

    addAuthorTagList(tagList) {
        _.forOwn(tagList, function(it) {
            this.addAuthorTag(it);
        }.bind(this));
    }

    removeAuthorTag(tag) {
        delete this.authorTags[tag.tagName];
        _.forOwn(this.sortedTags, function(it, idx) {
            if (it.tagName === tag.tagName) {
                this.sortedTags = this.sortedTags.splice(idx, 1);
                return false;
            }
        }.bind(this));
    }

    createAuthorTag(rank) {
        return this.addAuthorTag({
            tagName   : rank.tagName,
            headNotif : rank.notifCount,
            isFavorite: rank.favorite,
            rank      : rank.rank,
            notifCount: rank.notifCount
        });
    }

    addArticleRank(rank) {
        let authorTag = this.authorTags[rank.tagName];
        if (authorTag == null) {
            authorTag = this.createAuthorTag(rank);
            this.authorTags[rank.tagName] = authorTag;
        }
        authorTag.addArticleRank(rank);
    }

    removeArticleRank(rank) {
        let authorTag = this.authorTags[rank.tagName];
        if (authorTag != null) {
            authorTag.removeArticleRank(rank);
        }
    }

    getArticleRank(tagName, articleUuid) {
        let authorTag = this.authorTags[tagName];
        if (authorTag != null) {
            return authorTag.getArticleRank(articleUuid);
        }
        return null;
    }

    getArticleRankList(tagName) {
        let authorTag = this.authorTags[tagName];
        if (authorTag != null) {
            return authorTag.sortedArts;
        }
        return null;
    }

    getArticleRankByUuid(articleUuid) {
        let rank = null;
        _.forOwn(this.authorTags, function(authorTag) {
            if (rank == null) {
                rank = authorTag.getArticleRank(articleUuid);
            }
            if (rank != null) {
                return false;
            }
        });
        return rank;
    }

    getStringTags() {
        return this.stringTags;
    }

    swapSortedTags(frIdx, toIdx) {
        let tmp = this.sortedTags[frIdx];
        this.sortedTags[frIdx] = this.sortedTags[toIdx];
        this.sortedTags[toIdx] = tmp;
    }

    reRankTag(tag, inc) {
        let len = this.sortedTags.length;
        for (let i = 0; i < len; i++) {
            if (this.sortedTags[i] === tag) {
                let toIdx = ((inc === true) ? (i + len - 1) : (i + 1)) % len;
                this.swapSortedTags(i, toIdx);
                break;
            }
        }
        Actions.reRankTags(this);
    }

    /**
     * Invoke the renderFn to format output based on tag tree.
     */
    getTreeViewJson(renderFn, output) {
        _.forOwn(this.sortedTags, function(tag) {
            let sortedRank = tag.getSortedArticleRank();
            if (_.isEmpty(sortedRank)) {
                renderFn(tag, null, output);
            } else {
                renderFn(tag, sortedRank, output);
            }
        });
        return output;
    }
}

let AuthorStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    getAuthorList: function() {
        return this.data.authorMap;
    },

    getAuthorUuidList: function() {
        return this.data.authorUuids;
    },

    getAuthorByUuid: function(uuid) {
        return this.data.authorMap[uuid];
    },

    /**
     * @return string tags used for autocomplete.
     */
    getTagsByAuthorUuid: function(uuid) {
        return this.getAuthorTagMgr(uuid).getStringTags();
    },

    /**
     * @return the tag mgr matching with the author uuid.
     */
    getAuthorTagMgr: function(uuid) {
        let authorTagMgr = this.data.authorTagMgr[uuid];
        if (authorTagMgr == null) {
            this.data.authorTagMgr[uuid] = new AuthorTagMgr(uuid);
            return this.data.authorTagMgr[uuid];
        }
        return authorTagMgr;
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

    _addAuthorList: function(authorList) {
        _.forOwn(authorList, function(author, key) {
            let uuid = author.authorUuid;
            this.data.authorUuids.push(uuid);
            if (this.data.authorMap[uuid] == null) {
                this.data.authorMap[uuid] = new Author(author);
            }
            this.getAuthorTagMgr(uuid).addAuthorTagList(author.authorTags);
        }.bind(this));

        this.trigger(this.data);
    },

    _updateArticleRank: function(data) {
        _.forOwn(data.articleRank, function(rank) {
            this.getAuthorTagMgr(rank.authorUuid).addArticleRank(rank);
        }.bind(this));

        this.trigger(this.data);
    },
    
    reset: function() {
        this.data = {
            authorMap: {},
            authorTagMgr: {},
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
        this._addAuthorList(data.authors);
    },

    onGetAuthorsCompleted: function(data) {
        this._addAuthorList(data.authors);
    },

    onGetArticleRankCompleted: function(data) {
        this._updateArticleRank(data);
    },

    onReRankTagsCompleted: function(tagMgr) {
        this.trigger(this.data);
    },

    onStartupCompleted: function(data) {
        if (data.userDTO && data.userDTO.authors) {
            this._addAuthorList(data.userDTO.authors);
            Actions.getArticleRank({
                uuids: this.getAuthorUuidList()
            });
        }
    },

    exports: {
    }
});

export default AuthorStore;
