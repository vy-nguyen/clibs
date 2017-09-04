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
import Startup          from 'vntd-root/pages/login/Startup.jsx';
import {Util}           from 'vntd-shared/utils/Enum.jsx';

import {
    ArticleStore, EProductStore, GlobStore
} from 'vntd-root/stores/ArticleStore.jsx';

class Author {
    constructor(data) {
        this.profile    = null;
        this.userUuid   = data.authorUuid;
        this.aboutList  = data.aboutList;
        this.authorTags = data.authorTags;

        if (this.profile != null) {
            this.coverImg = this.profile.coverImg0;
            this.imgList  = [];
        } else {
            this.coverImg = "/rs/img/demo/s1.jpg";
            this.imgList  = [
                "/rs/img/demo/s1.jpg",
                "/rs/img/demo/s2.jpg",
                "/rs/img/demo/s3.jpg"
            ];
        }
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
            data = ArticleRank.genArticleRankJson(article);
        }
        this.authorTag = authorTag;
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        if (article == null) {
            article = ArticleStore.addDefaultFromRank(this);
        }
        if (article != null) {
            article.rank = this;
        }
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
        return authorTag.addArticleRankObj(this);
    }

    updateArticleRank(tagInfo) {
        if (tagInfo.prevArticle != null) {
            this.prevArticle = tagInfo.prevArticle;
        }
        if (tagInfo.nextArticle != null) {
            this.nextArticle = tagInfo.nextArticle;
        }
    }

    updateFromJson(json) {
        _.forEach(json, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    getArticle() {
        return GlobStore.getArticle(this.artTag, this.articleUuid, this.authorUuid);
    }

    getArticleUuid() {
        return this.articleUuid;
    }

    getAuthorUuid() {
        return this.authorUuid;
    }

    getArtTitle() {
        return this.artTitle;
    }

    getRankOrder() {
        if (this.rank !== 0) {
            return this.rank;
        }
        if (this.msTime == null) {
            this.msTime = Date.parse(this.timeStamp);
        }
        return -this.msTime;
    }

    static genArticleRankJson(article) {
        return {
            artTag      : article.getArtTag(),
            artTitle    : article.getTitle(),
            articleUuid : article.getArticleUuid(),
            authorUuid  : article.getAuthorUuid(),
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
        };
    }
}

/*
 * Maintains binding from articles to a name tag.
 */
class AuthorTag {
    constructor(tag) {
        this.articles   = {};
        this.sortedArts = [];
        this._id = _.uniqueId('atag-');

        _.forEach(tag, function(v, k) {
            this[k] = v;
        }.bind(this));
        return this;
    }

    getId(prefix) {
        return (prefix || '') + this._id;
    }

    addArticleRank(json) {
        let rank = this.articles[json.articleUuid];

        if (rank != null) {
            if (json !== rank && !(json instanceof ArticleRank)) {
                rank.updateFromJson(json);
            }
            return rank;
        }
        return this.addArticleRankObj(new ArticleRank(json, this, null));
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

    static compareArticle(anchor, elm) {
        return anchor.getRankOrder() - elm.getRankOrder();
    }

    static compareArtByTitle(anchor, elm) {
        return anchor.artTitle.localeCompare(elm.artTitle);
    }

    addArticleRankObj(rank) {
        let artUuid = rank.articleUuid,
            artRank = this.articles[artUuid];

        if (artRank == null) {
            artRank = rank;
            this.articles[rank.articleUuid] = rank;
            Util.insertSorted(rank, this.sortedArts, AuthorTag.compareArticle);
        }
        return artRank;
    }

    removeArticleRank(rank) {
        rank.authorTag = null;
        delete this.articles[rank.articleUuid];

        _.forOwn(this.sortedArts, function(it, idx) {
            if (it.articleUuid === rank.articleUuid) {
                this.sortedArts.splice(idx, 1);
                return false;
            }
            return true;
        }.bind(this));
    }

    resortArtRank() {
        this.sortedArts.sort(AuthorTag.compareArticle);
    }

    getArticleRank(artUuid) {
        return this.articles[artUuid];
    }

    getSortedArticleRank() {
        return this.sortedArts;
    }

    resortArticleRank(opt) {
        this.sortedArts.sort();
    }
}

class AuthorTagMgr {
    constructor(uuid) {
        this.authorUuid  = uuid;
        this.authorTags  = {};
        this.sortedTags  = [];
        this.stringTags  = [];
        this.allArtRanks = null;
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

    getSortedTagList() {
        return this.sortedTags;
    }

    addAuthorTag(tag) {
        let authorTag = this.authorTags[tag.tagName];
        if (authorTag != null) {
            return authorTag;
        }
        authorTag = new AuthorTag(tag);
        this.authorTags[tag.tagName] = authorTag;

        Util.insertSorted(authorTag, this.sortedTags, AuthorTag.compareRank);
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
    }

    removeAuthorTag(tag) {
        delete this.authorTags[tag.tagName];
        _.forOwn(this.sortedTags, function(it, idx) {
            if (it.tagName === tag.tagName) {
                this.sortedTags.splice(idx, 1);
                return false;
            }
            return true;
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
        return authorTag.addArticleRank(rank);
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

    getAllArticleRanks() {
        let allRanks = {};
        if (this.allArtRanks != null) {
            return this.allArtRanks;
        }
        _.forOwn(this.authorTags, function(authorTag) {
            _.forOwn(authorTag.articles, function(artTag) {
                allRanks[artTag.articleUuid] = artTag;
            });
        });
        this.allArtRanks = allRanks;
        return allRanks;
    }

    getAllArtSelect() {
        let out = [], allRanks = this.getAllArticleRanks();

        _.forOwn(allRanks, function(rank) {
            out.push({
                value: rank.articleUuid,
                label: rank.artTitle
            });
        });
        return out;
    }

    getArticleRankList(tagName) {
        let authorTag = this.authorTags[tagName];
        if (authorTag != null) {
            return authorTag.sortedArts;
        }
        return null;
    }

    getArticleRankByUuid(articleUuid, authorUuid) {
        return AuthorStore.getArticleRankByUuid(articleUuid, authorUuid);
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
        let tag, tagRanks = [], len = this.sortedTags.length;

        this.btnId = btnId;
        for (let i = 0; i < len; i++) {
            tag      = this.sortedTags[i];
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
            let authorTag, tagRank, artRank, sortedArts;

            authorTag = this.authorTags[key];
            if (authorTag == null) {
                return;
            }
            sortedArts = authorTag.getSortedArticleRank();
            tagRank = {
                tagName: key,
                artUuid: []
            };
            artList.push(tagRank);
            if (sortedArts != null) {
                sortedArts.sort(AuthorTag.compareArtByTitle);
                _.forEach(sortedArts, function(rank, idx) {
                    rank.rank = 10 + idx;
                    tagRank.artUuid.push(rank.getArticleUuid());
                });
            }
            console.log(sortedArts);
            console.log(tagRank.artUuid);
                /*
            _.forEach(category, function(it, idx) {
                tagRank.artUuid.push(it.id);
                artRank = authorTag.getArticleRank(it.id);
                if (artRank != null) {
                    artRank.rank = idx + 1;
                }
            });
            if (sortedArts != null) {
                sortedArts.sort(AuthorTag.compareRank);
            }
                 */
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
            authorMap      : {},
            authorTagMgr   : {},
            authorEStoreMgr: {},
            authorUuids    : [],
            allArticleRanks: {}
        };
    },

    getAuthorList: function() {
        return this.data.authorMap;
    },

    getAuthorUuidList: function() {
        return this.data.authorUuids;
    },

    hasDiffAuthor: function(curr) {
        return curr !== this.data.authorUuids.length;
    },

    getAuthorByUuid: function(uuid) {
        return this.data.authorMap[uuid];
    },

    lookupArticleRankByUuid: function(uuid) {
        return this.data.allArticleRanks[uuid];
    },

    getArticleRankByUuid: function(uuid, authorUuid) {
        let article, rank = this.lookupArticleRankByUuid(uuid);

        if (rank != null) {
            return rank;
        }
        article = ArticleStore.getArticleByUuid(uuid, authorUuid);
        if (article == null) {
            return null;
        }
        return article.rank;
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

    updateAuthorTag: function(tagInfo, artRank) {
        let article, userUuid = tagInfo.userUuid,
            authorTagMgr = this.getAuthorTagMgr(userUuid),
            authorTag = authorTagMgr.getAuthorTag(tagInfo.tagName,
                            tagInfo.tagRank, tagInfo.favorite);

        if (artRank == null) {
            article = ArticleStore.getArticleByUuid(tagInfo.articleUuid, userUuid);
            artRank = new ArticleRank(null, authorTag, article);
        } else {
            artRank.detachTag();
        }
        artRank.attachTag(authorTag);
        artRank.updateArticleRank(tagInfo);

        Actions.updateArtRank(tagInfo, tagInfo.cbButtonId);
        this.trigger(this.data, artRank, "update");
    },

    updateAuthorEStoreTag: function(tagInfo, artRank) {
        let userUuid = tagInfo.userUuid,
            estoreMgr = this.getAuthorEStoreMgr(userUuid),
            estoreTag = estoreMgr.getAuthorTag(tagInfo.tagName,
                            tagInfo.tagRank, tagInfo.favorite);

        if (artRank == null) {
            let prod = EProductStore.getProductByUuid(tagInfo.articleUuid, userUuid);
            if (prod == null) {
                return;
            }
            artRank = new ArticleRank(null, estoreTag, prod);
        } else {
            artRank.detachTag();
        }
        artRank.attachTag(estoreTag);
        this.trigger(this.data, artRank, "update");
    },

    removeArticleRank: function(article, silent) {
        if (article && article.rank != null) {
            let tagMgr = this.getAuthorTagMgr(article.authorUuid);
            tagMgr.removeArticleRank(article.rank);
            if (silent !== true) {
                this.trigger(this.data, article.rank, "remove");
            }
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
        let authorMap = this.data.authorMap, authorUuids = this.data.authorUuids;

        _.forOwn(authorList, function(author, key) {
            let uuid = author.authorUuid;
            if (authorMap[uuid] == null) {
                authorMap[uuid] = new Author(author);
                Util.insertUnique(uuid, authorUuids, Util.compareUuid);
            }
            this.getAuthorTagMgr(uuid).addAuthorTagList(author.authorTags);
        }.bind(this));
        this.trigger(this.data, null, "authors");
    },

    /*
     * Update article ranks with data returned from the server.
     */
    _updateArticleRank: function(articleRank, trigger) {
        _.forOwn(articleRank, function(rank) {
            this.addArticleRankFromJson(rank);
        }.bind(this));

        if (trigger != null) {
            this.trigger(this.data, null, trigger);
        }
    },

    addArticleRankFromArticle(article) {
        return this.addArticleRankFromJson(ArticleRank.genArticleRankJson(article));
    },

    addArticleRankFromJson(rank) {
        let obj = this.getAuthorTagMgr(rank.authorUuid).addArticleRank(rank);
        this.data.allArticleRanks[obj.articleUuid] = obj;
        return obj;
    },

    /*
     * Update article ranks from array of articles.
     */
    _updateArtRankFromArticles: function(articles) {
        _.forOwn(articles, function(art) {
            if (art.rank != null && !(art.rank instanceof ArticleRank)) {
                this.addArticleRankFromJson(art.rank);
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

    onPostArticleSelectCompleted: function(data) {
        this._updateArticleRank(data.articleRank, "update");
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
        this._updateArticleRank(data.articleRank, "update");
    },

    onReRankTagCompleted: function(tagMgr) {
        this.trigger(this.data, tagMgr, "reRank");
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
        NavActions.buttonChange(btnId);
        this._updateArticleRank(data.articleRank, "update");
    },

    /**
     * Main entry at startup after getting data returned back from the server.
     */
    onStartupCompleted: function(data) {
        let authors = data.authors;
        if (authors != null) {
            this._addAuthorList(authors);
        }
        this._updateArticleRank(data.artRanks, null);
        ArticleStore.mainStartup(data);
        ArticleTagStore.mainStartup(data);
        Startup.mainStartup();

        this.trigger(this.data, data, "startup");
    },

    onGetDomainDataCompleted: function(data, context) {
        this._updateArticleRank(data.artRanks, "domain");
    }
});

export { AuthorStore, ArticleRank };
export default AuthorStore;
