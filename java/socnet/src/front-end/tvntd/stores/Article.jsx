/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _      from 'lodash';

import Actions          from 'vntd-root/actions/Actions.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import {Util}           from 'vntd-shared/utils/Enum.jsx';
import {
}

class Author {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        });
        this.profile    = null;
        this.userUuid   = data.authorUuid;

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
            console.log(category);
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

/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import moment       from 'moment';
import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import CommentStore from 'vntd-root/stores/CommentStore.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import WebUtils     from 'vntd-shared/utils/WebUtils.jsx';

import {Util}       from 'vntd-shared/utils/Enum.jsx';
import {VConst}     from 'vntd-root/config/constants.js';

let currentTime = (new Date).getTime();

class Article {
    constructor(data) {
        let date;

        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        date            = new Date(data.createdDate);
        this.dateString = moment(date).format("DD/MM/YYYY - HH:mm");
        this.author     = UserStore.getUserByUuid(data.authorUuid);

        if (data.rank != null) {
            CommentStore.addArtAttr(data.rank);
            this.rank = AuthorStore.addArticleRankFromJson(data.rank);
        }
        return this;
    }

    getArticleUuid() {
        return this.articleUuid;
    }

    getAuthorUuid() {
        return this.authorUuid;
    }

    getTagName() {
        return this.rank.tagName;
    }

    getTitle() {
        return this.topic;        
    }

    isPublished() {
        return this.published;
    }

    getRankOrder() {
    }

    getArtTag() {
        return VConst.blog;
    }

    getSortedAnchor() {
        return VConst.blogs;
    }

    requestData() {
        if (this.rank != null && this.rank.hasArticle === false) {
            return null;
        }
        if (this.noData === true && this.ownerStore != null) {
            this.ownerStore.requestItems(Actions.getArticles);
        }
        return WebUtils.spinner();
    }

    getArticleRank() {
        if (this.rank != null) {
            return this.rank;
        }
        if (this.noData === true) {
            return AuthorStore.lookupArticleRankByUuid(this.articleUui);
        }
        return null;
    }

    getRank() {
        let artRank = this.getArticleRank();

        if (artRank != null) {
            return artRank.getRankOrder();
        }
        return 0;
    }

    updateFromJson(jsonArt) {
        _.forEach(jsonArt, function(v, k) {
            this[k] = v;
        }.bind(this));

        if (jsonArt.noData == null) {
            delete this.noData;
        }
    }

    /*
     * TODO: rework product and ads to do dynamic loading like article.
     */
    getArticle() {
        return this;
    }

    static newInstance(kind, data) {
        if (kind === VConst.blog) {
            return new Article(data);
        }
        if (kind === VConst.estore) {
            return new Product(data);
        }
        return new AdsItem(data);
    }

    static newDefInstance(kind, store, articleUuid, authorUuid) {
        let json = {
            authorUuid : authorUuid,
            articleUuid: articleUuid,
            createdDate: currentTime
        };
        return Article.newDefInstanceFrmRank(
            store, kind, AuthorStore.lookupArticleRankByUuid(articleUuid), json
        );
    }

    static newDefInstanceFrmRank(store, kind, artRank, json) {
        if (json == null) {
            json = {};
        }
        json.noData     = true;
        json.ownerStore = store;

        if (artRank != null) {
            kind             = artRank.artTag;
            json.authorUuid  = artRank.authorUuid;
            json.articleUuid = artRank.articleUuid;
            json.createdDate = artRank.timeStamp;
            json.topic       = artRank.getArtTitle();
            json.content     = artRank.contentBrief;
            json.createdDate = artRank.timeStamp;
            json.published   = true;
        }
        store.recordMissingUuid(json.articleUuid);
        return Article.newInstance(kind, json);
    }
}

class Product extends Article {
    constructor(data) {
        super(data);
    }

    getTagName() {
        return this.publicTag;
    }

    getTitle() {
        return this.prodTitle;
    }

    isPublished() {
        return true;
    }

    getArtTag() {
        return VConst.estore;
    }

    getSortedAnchor() {
        return VConst.prods;
    }
}

class AdsItem extends Article {
    constructor(data) {
        super(data);
    }

    getTagName() {
        return this.adsRank.tagName;
    }

    getTitle() {
        return this.busName;
    }

    isPublished() {
        return true;
    }

    getArtTag() {
        return VConst.ad;
    }

    getSortedAnchor() {
        return VConst.ads;
    }
}

class AuthorShelf {
    constructor(article, authorUuid) {
        this.getData   = 0;
        this.articles  = {};
        this.savedArts = {};
        this.authorUuid = authorUuid;

        this[VConst.ads]     = [];
        this[VConst.blogs]   = [];
        this[VConst.prods]   = [];
        this.sortedSavedArts = [];

        if (article != null) {
            this.addSortedArticle(article);
        }
        return this;
    }

    addArticle(article, preend) {
        if (article == null) {
            return;
        }
        if (this.articles[article.articleUuid] != null) {
            this.removeArticle(article.articleUuid);
        }
        this.addSortedArticle(article, preend);
    }

    _cmpArticle(anchor, elm) {
        return elm.createdDate - anchor.createdDate;
    }

    removeArticle(articleUuid) {
        let root, article = this.articles[articleUuid];

        if (article != null) {
            root = article.getSortedAnchor();
            Util.removeArray(this[root], article, 0, this._cmpArticle);
            delete this.articles[articleUuid];
        }
        article = this.savedArts[articleUuid];
        if (article != null) {
            Util.removeArray(this.sortedSavedArts, article, 0, this._cmpArticle);
            delete this.savedArts[articleUuid];
        }
    }

    addSortedArticle(article, pre) {
        let root = article.getSortedAnchor();

        if (article.isPublished()) {
            if (this.articles[article.articleUuid] !== article) {
                this.articles[article.articleUuid] = article;
                if (pre === true) {
                    this[root] = Util.preend(article, this[root]);
                } else {
                    Util.insertSorted(article, this[root], this._cmpArticle);
                }
            }
            return;
        }
        this.addSortedSavedArts(article);
    }

    addSortedSavedArts(article) {
        if (this.savedArts[article.articleUuid] !== article) {
            this.savedArts[article.articleUuid] = article;
            Util.insertSorted(article, this.sortedSavedArts, this._cmpArticle);
        }
    }

    hasData() {
        return true;
    }

    getSortedArticles() {
        return this[VConst.blogs];
    }

    getSortedSavedArts() {
        return this.sortedSavedArts;
    }

    getArticle(artUuid) {
        if (this.articles[artUuid] != null) {
            return this.articles[artUuid];
        }
        return this.savedArts[artUuid];
    }

    iterArticles(func, arg) {
        _.forOwn(this[VConst.blogs], function(item, key) {
            func(item, arg);
        });
    }
}

class CommonStore {
    constructor(kind) {
        this.init(kind);
    }

    init(kind) {
        this.data = {
            getItemCount : 0,
            itemsByAuthor: {},
            itemsByUuid  : {},

            requestUuids : null,
            missingUuids : null,
            myItems      : null,
            errorText    : "",
            errorResp    : null,
            itemKinds    : {},
            storeKind    : kind,
            listenChanges: {}
        }
        return this.data;
    }

    listenChanges(listener, key) {
        this.data.listenChanges[key] = listener;
    }

    _notifyListeners(code, changeList) {
        let storeKind = this.data.storeKind;

        _.forOwn(this.data.listenChanges, function(callback, key) {
            callback[key](storeKind, code, changeList);
        });
    }

    getItemsByAuthor(uuid, fetch) {
        let anchor, items = [], owners;

        if (fetch === true) {
            owners = UserStore.getFetchedUuidList(this.storeKind);
            if (owners != null && !_.isEmpty(owners)) {
                Actions.getPublishProds({
                    authorUuid: UserStore.getSelfUuid(),
                    uuidType  : "user",
                    reqKind   : this.storeKind,
                    uuids     : owners
                });
            }
        }
        anchor = this.getItemOwner(uuid);
        if (anchor.hasData() === true) {
            anchor.iterArticles(function(it) {
                items.push(it);
            });
        }
        return items;
    }

    iterAuthorItemStores(uuid, func, arg) {
        let anchor = this.getItemOwner(uuid);
        if (anchor != null) {
            anchor.iterArticles(func, arg);
        }
        return anchor;
    }

    getItemOwner(uuid) {
        let anchor = this.data.itemsByAuthor[uuid];
        if (anchor == null) {
            anchor = this._createOwnerAnchor(uuid, null);
            this.data.itemsByAuthor[uuid] = anchor;
        }
        return anchor;
    }

    /*
     * Return author's items sorted to display.
     */
    getSortedItemsByAuthor(uuid) {
        let anchor = this.getItemOwner(uuid);
        return anchor.getSortedArticles();
    }

    getMyItems() {
        if (this.data.myItems != null) {
            return this.data.myItems.sortedArticles;
        }
        return null;
    }

    getMySavedItems() {
        let myShelf = this.data.myItems;
        return (myShelf != null) ? myShelf.getSortedSavedArts() : null;
    }

    getItemByUuid(uuid, authorUuid) {
        let item = this.data.itemsByUuid[uuid];

        if (item == null) {
            if (authorUuid == null) {
                return null;
            }
            item = this._addDefaultItem(this.data.storeKind, this, uuid, authorUuid);
        }
        return item;
    }

    getAuthorUuid(articleUuid) {
        let item = this.data.itemsByUuid[articleUuid];
        if (item != null) {
            return item.authorUuid;
        }
        return null;
    }

    onPublishItemCompleted(item, store) {
        let it = this._addItemStore(item, true), pubTag = it.publicTag;

        this._notifyListeners("add", [it]);
        store.trigger(this.data, [it], "postOk", true, it.authorUuid);
    }

    onPublishItemFailure(item, store) {
        store.trigger(this.data, null, "failure", false, item.authorUuid);
    }

    onGetPublishItemCompleted(data, key, store) {
        let items = [];

        CommentStore.onGetCommentsCompleted(data);
        _.forEach(data[key], function(item) {
            items.push(this._addItemStore(item, false));
        }.bind(this));

        this.data.requestUuids = null;
        if (!_.isEmpty(items)) {
            this._notifyListeners("add", items);
        }
        store.trigger(this.data, items, "getOk", !_.isEmpty(items), null);
    }

    onGetPublishItemFailure(data, store) {
        store.trigger(this.data, null, "failure", false, null);
    }

    requestItems(actionFn) {
        let uuids;

        if (this.data.requestUuids != null ||
            this.data.missingUuids == null || _.isEmpty(this.data.missingUuids)) {
            return;
        }
        uuids = [];
        this.data.requestUuids = this.data.missingUuids;
        this.data.missingUuids = null;

        _.forOwn(this.data.requestUuids, function(v, k) {
            uuids.push(k);
        });
        actionFn({
            authorUuid: null,
            uuidType  : this.data.storeKind,
            reqKind   : this.data.storeKind,
            uuids     : uuids
        });
    }

    onDeleteItemCompleted(data, store) {
        let out = this._removeItemStore(data.uuids, data.authorUuid);

        this._notifyListeners("remove", out);
        store.trigger(this.data, [data], "delOk", true, data.authorUuid);
    }

    recordMissingUuid(uuid) {
        let missing = this.data.missingUuids;

        if (missing == null) {
            this.data.missingUuids = {};
            missing = this.data.missingUuids;
        }
        missing[uuid] = true;
        return missing;
    }

    updateMissingUuid(uuids) {
        let store = this.data.itemsByUuid,
            missing = this.data.missingUuids;

        _.forEach(uuids, function(uid, key) {
            if (store[key] == null) {
                if (this.data.missingUuids == null) {
                    this.data.missingUuids = {};
                    missing = this.data.missingUuids;
                }
                missing[key] = true;
            }
        }.bind(this));
    }

    updatePublicTags(tags, actionFn) {
        _.forEach(tags, function(t) {
            if (t.articleRank != null) {
                this.updateMissingUuid(t.articleRank);
            }
        }.bind(this));
        this.requestItems(actionFn);
    }

    /**
     * Internal methods, used by derrived stores.
     */
    errorHandler(error, store) {
        this.data.errorText = error.getErrorCodeText();
        this.data.errorResp = error.getUserText();
        store.trigger(this.data, null, "failure", false, null);
    }

    _createOwnerAnchor(authorUuid, article) {
        let anchor = new AuthorShelf(article, authorUuid);

        this.data.itemsByAuthor[authorUuid] = anchor;
        if (UserStore.isUserMe(authorUuid)) {
            this.data.myItems = anchor;
        }
        return anchor;
    }

    /**
     * Add default article when we only have article uuid and author uuid.
     */
    _addDefaultItem(kind, store, articleUuid, authorUuid) {
        return this._addItemStore(
            Article.newDefInstance(kind, store, articleUuid, authorUuid), false
        );
    }

    /**
     * Add default article generated from article rank.
     */
    addDefaultFromRank(artRank) {
        return this._addItemStore(
            Article.newDefInstanceFrmRank(this, this.data.storeKind, artRank, null),
            false
        );
    }

    /**
     * Add article item to the store where item is in json format or Article type.
     */
    _addItemStore(item, preend) {
        let articleUuid, authorUuid, anchor, authorTagMgr, article;

        articleUuid = item.articleUuid;
        authorUuid  = item.authorUuid;
        anchor      = this.getItemOwner(authorUuid);
        article     = this.data.itemsByUuid[articleUuid];

        if (article == null) {
            if (item instanceof Article) {
                article = item;
            } else {
                article = Article.newInstance(this.data.storeKind, item);
            }
            this.data.itemsByUuid[articleUuid] = article;
            anchor.addArticle(article, preend);
        } else {
            article.updateFromJson(item);
        }
        if (item.rank != null) {
            authorTagMgr = AuthorStore.getAuthorTagMgr(authorUuid);
            article.rank = authorTagMgr.addArticleRank(item.rank);
        } else {
            article.rank = AuthorStore.lookupArticleRankByUuid(articleUuid);
        }
        return article;
    }

    _removeItemStore(itemUuids, authorUuid, silent) {
        let item, result = [], anchor = this.getItemOwner(authorUuid);

        _.forEach(itemUuids, function(articleUuid) {
            anchor.removeArticle(articleUuid);
            item = this.data.itemsByUuid[articleUuid];
            result.push(item);

            if (silent == true) {
                AuthorStore.removeArticleRank(item, silent);
            }
            delete this.data.itemsByUuid[articleUuid];
        }.bind(this));
        return result;
    }

    _triggerStore(store, item, code) {
        store.trigger(this.data, item, code, true, item.authorUuid);
    }

    addFromJson(items, key, index) {
        let oldArt, kind = this.data.storeKind, itemsByKey = this.data[key];

        _.forOwn(items, function(it, k) {
            oldArt = itemsByKey[it.articleUuid];

            if (oldArt == null) {
                itemsByKey[it.articleUuid] = Article.newInstance(kind, it);

            } else if (oldArt.noData == true) {
                oldArt.updateFromJson(it);
            }
        }.bind(this));

        if (index == true) {
            this.indexAuthors(items);
        }
        return this.data;
    }

    indexAuthors(items) {
        let itemsByUuid = this.data.itemsByUuid,
            itemsByAuthor = this.data.itemsByAuthor;

        _.forOwn(items, function(jsonItem, key) {
            let anchor, item = itemsByUuid[jsonItem.articleUuid];
            if (item == null) {
                return;
            }
            if (item.author == null) {
                item.author = UserStore.getUserByUuid(item.authorUuid);
            }
            anchor = this.getItemOwner(item.authorUuid);
            anchor.addSortedArticle(item);

            if (UserStore.isUserMe(item.authorUuid)) {
                this.data.myItems = anchor;
            }
        }.bind(this));
    }
    
    dumpData(hdr) {
        console.log(hdr);
        console.log(this.data);
    }
}

export {CommonStore, Article}
export default CommonStore;
