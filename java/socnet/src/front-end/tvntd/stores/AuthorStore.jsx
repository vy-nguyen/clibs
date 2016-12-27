/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import Reflux from 'reflux';
import React  from 'react-mod';

import Actions          from 'vntd-root/actions/Actions.jsx';
import NavActions       from 'vntd-shared/actions/NavigationActions.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';

import {ArticleStore, EProductStore} from 'vntd-root/stores/ArticleStore.jsx';
import {insertSorted, insertUnique, compareUuid} from 'vntd-shared/utils/Enum.jsx';

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

class ArticleRank {
    constructor(data, authorTag, article) {
        if (data == null) {
            data = {
                artTitle    : article.topic,
                articleUuid : article.articleUuid,
                authorUuid  : article.authorUuid,
                contentBrief: null,
                creditEarned: 0,
                favorite    : false,
                likes       : 0,
                moneyEarned : 0,
                notifCount  : 0,
                notifHead   : 0,
                rank        : 0,
                score       : 0,
                shares      : 0,
                tagName     : "My Post",
                tagRank     : null,
                userLiked   : [],
                userShared  : [],
                defaultRank : true
            }
        }
        this.authorTag = authorTag;
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this._id = _.uniqueId('id-art-rank-');
        return this;
    }

    detachTag() {
        if (this.authorTag != null) {
            this.authorTag.removeArticleRank(this);
        }
        this.authorTag = null;
    }

    attachTag(authorTag) {
        this.authorTag = authorTag;
        this.tagName = authorTag.tagName;
        authorTag.addArticleRankObj(this);
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

    addArticleRank(json) {
        if (this.articles[json.articleUuid] != null) {
            return;
        }
        this.addArticleRankObj(new ArticleRank(json, this, null));
    }

    static compareRank(r1, r2) {
        if (r1.rank == null) {
            r1.rank = 0;
        }
        if (r2.rank == null) {
            r2.rank = 0;
        }
        return r1.rank - r2.rank;
    }

    addArticleRankObj(rank) {
        let artUuid = rank.articleUuid;
        let artRank = this.articles[artUuid];

        if (artRank == null) {
            this.articles[rank.articleUuid] = rank;
            insertSorted(rank, this.sortedArts, this.compareRank);
        }
    }

    removeArticleRank(rank) {
        rank.authorTag = null;
        delete this.articles[rank.articleUuid];

        _.forOwn(this.sortedArts, function(it, idx) {
            if (it.articleUuid === rank.articleUuid) {
                this.sortedArts.splice(idx, 1);
                return false;
            }
        }.bind(this));
    }

    resortArtRank() {
        this.sortedArts.sort(this.compareRank);
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

    getAuthorTag(tagName, tagRank, isFav) {
        let authorTag = this.authorTags[tagName];
        if (authorTag != null) {
            return authorTag;
        }
        return this.addAuthorTag({
            tagName   : tagName,
            headNotif : 0,
            isFavorite: isFav,
            rank      : tagRank,
            notifCount: 0,
            headChain : 0
        });
    }

    getAuthorTagList() {
        return this.authorTags;
    }

    addAuthorTag(tag) {
        let authorTag = this.authorTags[tag.tagName];
        if (authorTag != null) {
            return authorTag;
        }
        authorTag = new AuthorTag(tag);
        this.authorTags[tag.tagName] = authorTag;

        insertSorted(authorTag, this.sortedTags, AuthorTag.compareRank);
        this.stringTags = _.map(this.sortedTags, function(it) {
            return it.tagName;
        });
        for (let i = 0; i < this.sortedTags.length; i++) {
            let t = this.sortedTags[i];
        }
        return authorTag;
    }

    addAuthorTagList(tagList) {
        _.forOwn(tagList, function(it) {
            this.addAuthorTag(it);
        }.bind(this));
    }

    updatePrivateTags(tagRanks, artRanks) {
        console.log("Update private tags");
        console.log(tagRanks);
        console.log(artRanks);
        console.log(this);
    }

    removeAuthorTag(tag) {
        delete this.authorTags[tag.tagName];
        _.forOwn(this.sortedTags, function(it, idx) {
            if (it.tagName === tag.tagName) {
                this.sortedTags.splice(idx, 1);
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
        for (let i = 0; i < len; i++) {
            this.sortedTags[i].rank = i;
        }
        Actions.reRankTag(this);
    }

    commitTagRanks(btnId, articleOrder) {
        let tagRanks = [];
        let len = this.sortedTags.length;

        this.btnId = btnId;
        for (let i = 0; i < len; i++) {
            let tag = this.sortedTags[i];

            tag.rank = i + 1;
            tagRanks.push({
                tagName: tag.tagName,
                parent : null,
                pubTag : false,
                rank   : tag.rank
            });
        }
        let artList = [];
        _.forOwn(articleOrder, function(category, key) {
            let tagRank = {
                tagName: key,
                artUuid: []
            };
            artList.push(tagRank);
            let authorTag = this.authorTags[key];
            let sortedArts = authorTag != null ? authorTag.getSortedArticleRank() : null;

            _.forEach(category, function(it, idx) {
                tagRank.artUuid.push(it.id);
                if (sortedArts != null) {
                    let rank = _.find(sortedArts, function(o) {
                        return o.articleUuid === it.id;
                    });
                    rank.rank = idx;
                }
            });
            if (sortedArts != null) {
                sortedArts.sort(AuthorTag.compareRank);
            }
        }.bind(this));

        Actions.commitTagRanks(this, {
            userUuid: this.authorUuid,
            tagRanks: tagRanks,
            artList : artList
        });
    }

    /**
     * Invoke the renderFn to format output based on tag tree.
     */
    getTreeViewJson(renderFn, output) {
        _.forEach(this.sortedTags, function(tag) {
            let sortedRank = tag.getSortedArticleRank();
            if (_.isEmpty(sortedRank)) {
                renderFn(tag, null, output);
            } else {
                renderFn(tag, sortedRank, output);
            }
        });
        return output;
    }

    getUserTags() {
        return this.sortedTags;
    }
}

let AuthorStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    reset: function() {
        this.data = {
            authorMap: {},
            authorTagMgr: {},
            authorEStoreMgr: {},
            authorUuids: []
        };
    },

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
         if (uuid == null && UserStore.getSelf() != null) {
             uuid = UserStore.getSelf().userUuid;
         }
         if (uuid != null) {
            return this.getAuthorTagMgr(uuid).getStringTags();
         }
        return null;
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

    getAuthorEStoreMgr: function(uuid) {
        let estoreMgr = this.data.authorEStoreMgr[uuid];
        if (estoreMgr == null) {
            this.data.authorEStoreMgr[uuid] = new AuthorTagMgr(uuid);
            return this.data.authorEStoreMgr[uuid];
        }
        return estoreMgr;
    },

    /**
     * @return authorTag for the user matching with the name.
     */
    getAuthorTag: function(uuid, tagName) {
        let tagMgr = this.getAuthorTagMgr(uuid);
        return tagMgr.getAuthorTag(tagName, 50, false);
    },

    /**
     * @return artRank matching with author uuid and article uuid.
     */
    getArticleRank: function(authorUuid, articleUuid) {
        let tagMgr = this.getAuthorTagMgr(authorUuid);
        return tagMgr.getArticleRankByUuid(articleUuid);
    },

    updateAuthorTag: function(tagInfo, artRank) {
        let authorTagMgr = this.getAuthorTagMgr(tagInfo.userUuid);
        let authorTag = authorTagMgr.getAuthorTag(tagInfo.tagName, tagInfo.tagRank, tagInfo.favorite);

        if (artRank == null) {
            let article = ArticleStore.getArticleByUuid(tagInfo.articleUuid);
            if (article == null) {
                return;
            }
            artRank = new ArticleRank(null, authorTag, article);
        } else {
            artRank.detachTag();
        }
        artRank.attachTag(authorTag);
        this.trigger(this.data, artRank);

        Actions.updateArtRank(tagInfo, tagInfo.cbButtonId);
    },

    updateAuthorEStoreTag: function(tagInfo, artRank) {
        let estoreMgr = this.getAuthorEStoreMgr(tagInfo.userUuid);
        let estoreTag = estoreMgr.getAuthorTag(tagInfo.tagName, tagInfo.tagRank, tagInfo.favorite);

        if (artRank == null) {
            let prod = EProductStore.getProductByUuid(tagInfo.articleUuid);
            if (prod == null) {
                return;
            }
            artRank = new ArticleRank(null, estoreTag, prod);
        } else {
            artRank.detachTag();
        }
        artRank.attachTag(estoreTag);
        this.trigger(this.data, artRank);
    },

    removeArticleRank: function(article) {
        if (article.rank != null) {
            let tagMgr = this.getAuthorTagMgr(article.authorUuid);
            tagMgr.removeArticleRank(article.rank);
            this.trigger(this.data, article.rank, "remove");
        }
    },

    iterAuthor: function(uuidList, func) {
        if (uuidList == null) {
            _.forOwn(this.data.authorMap, function(author, key) {
                if (author.getUser() != null) {
                    func(author, key);
                }
            });
        } else {
            _.forOwn(uuidList, function(uuid, key) {
                let author = this.data.authorMap[uuid];
                if (author != null && author.getUser() != null) {
                    func(author, key);
                }
            }.bind(this));
        }
    },

    _addAuthorList: function(authorList) {
        _.forOwn(authorList, function(author, key) {
            let uuid = author.authorUuid;
            if (this.data.authorMap[uuid] == null) {
                this.data.authorMap[uuid] = new Author(author);
                insertUnique(uuid, this.data.authorUuids, compareUuid);
            }
            this.getAuthorTagMgr(uuid).addAuthorTagList(author.authorTags);
        }.bind(this));

        this.trigger(this.data);
    },

    /*
     * Update article ranks with data returned from the server.
     */
    _updateArticleRank: function(data) {
        _.forOwn(data.articleRank, function(rank) {
            this.getAuthorTagMgr(rank.authorUuid).addArticleRank(rank);
        }.bind(this));

        this.trigger(this.data);
    },

    /*
     * Update article ranks from array of articles.
     */
    _updateArtRankFromArticles: function(articles) {
        _.forOwn(articles, function(art) {
            let rank = art.rank;
            if (rank != null) {
                this.getAuthorTagMgr(rank.authorUuid).addArticleRank(rank);
            }
        }.bind(this));
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

    onReRankTag: function(tagMgr) {
        this.trigger(this.data);
    },

    onCommitTagRanksCompleted: function(data) {
        let tagMgr = data.cbContext;
        NavActions.buttonChange(tagMgr.btnId);

        tagMgr.updatePrivateTags(data.tagRanks, data.artList);
        ArticleTagStore.updatePublicTags(data.tagRanks, tagMgr);
    },

    onCommitTagRanksFailed: function(err) {
        let tagMgr = err.getContext();
        NavActions.onButtonChangeFailed(tagMgr.btnId);
    },

    onUpdateArtRankCompleted: function(data) {
        let btnId = data.cbContext;
        NavActions.buttonChange(tagMgr.btnId);
    },

    onStartupCompleted: function(data) {
        let authors = data.authors;
        if (authors != null) {
            this._addAuthorList(authors);
            //Actions.getArticleRank({
            //    authorUuid: 0,
            //    uuids: this.getAuthorUuidList()
            //});
        }
        if (data.articles != null) {
            this._updateArtRankFromArticles(data.articles);
        }
    },

    statics: {
        createDefArtRank: function(articleUuid) {
            let article = ArticleStore.getArticleByUuid(articleUuid);
            if (article != null) {
                return new ArticleRank(null, null, article);
            }
            return null;
        }
    }
});

export default AuthorStore;
