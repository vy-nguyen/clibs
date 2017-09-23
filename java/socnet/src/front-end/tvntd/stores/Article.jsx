/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                from 'lodash';
import moment           from 'moment';

import Actions          from 'vntd-root/actions/Actions.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import WebUtils         from 'vntd-shared/utils/WebUtils.jsx';
import {Util}           from 'vntd-shared/utils/Enum.jsx';
import {VConst}         from 'vntd-root/config/constants.js';

class ArticleSort {
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

    static compareByDate(anchor, elm) {
        return elm.createdDate - anchor.createdDate;
    }
}

export class Author {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.profile  = null;
        this.userUuid = data.authorUuid;

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

/*
 * Maintains binding from articles to a name tag owned by a user.
 */
export class AuthorTag {
    constructor(tag, authorStore) {
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

    addArticleRank(json, globStore) {
        let store, rank = this.articles[json.articleUuid];

        if (rank != null) {
            if (json !== rank && !(json instanceof ArticleBrief)) {
                rank.updateFromJson(json);
            }
            return rank;
        }
        store = globStore.getStoreKind(json.artTag);
        return this.addArticleRankObj(
            ArticleBrief.newArticleRank(json, store, this, null)
        );
    }

    addArticleRankObj(rank) {
        let artUuid = rank.articleUuid, artRank = this.articles[artUuid];

        if (artRank == null) {
            artRank = rank;
            this.articles[rank.articleUuid] = rank;
            Util.insertSorted(rank, this.sortedArts, ArticleSort.compareArticle);
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
        this.sortedArts.sort(ArticleSort.compareArticle);
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

/**
 * Manager managed tags/articles owned by an author/user.
 */
export class AuthorTagMgr {
    constructor(uuid, authorStore) {
        this.authorUuid  = uuid;
        this.authorTags  = {};
        this.sortedTags  = [];
        this.stringTags  = [];
        this.allArtRanks = null;
        this.authorStore = authorStore;
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
        authorTag = new AuthorTag(tag, this.authorStore);
        this.authorTags[tag.tagName] = authorTag;

        Util.insertSorted(authorTag, this.sortedTags, ArticleSort.compareRank);
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

    addArticleRank(rank, globStore) {
        let authorTag = this.authorTags[rank.tagName];
        if (authorTag == null) {
            authorTag = this.createAuthorTag(rank);
            this.authorTags[rank.tagName] = authorTag;
        }
        return authorTag.addArticleRank(rank, globStore);
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
        return this.authorStore.getArticleRankByUuid(articleUuid, authorUuid);
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
                sortedArts.sort(ArticleSort.compareArtByTitle);
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
                sortedArts.sort(ArticleSort.compareRank);
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

class ArticleBase {
    constructor(store) {
        this.isArticle  = true;
        this.ownerStore = store;
    }

    updateFromJson(json) {
        _.forEach(json, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    getArticle() {
        return this.ownerStore.getItemByUuid(this.articleUuid, null);
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

    getArtTag() {
        return this.artTag;
    }

    getRankOrder() {
        if (this.rank !== 0) {
            return this.rank;
        }
        return -this.timeStamp;
    }
}

export class ArticleBrief extends ArticleBase {
    constructor(data, store, authorTag, article) {
        super(store);
        if (data == null) {
            data = ArticleBrief.genArticleRankJson(article);
        }
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.authorTag = authorTag;
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
        this.tagName   = authorTag.tagName;
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

    static newArticleRank(data, store, authorTag, article) {
        let artRank = new ArticleBrief(data, store, authorTag, article);

        if (article == null) {
            article = store.addDefaultFromRank(artRank);
        }
        if (article != null) {
            article.rank = artRank;
        }
        return artRank;
    }
}

export class Article extends ArticleBase {
    constructor(data, store) {
        let date;

        super(store);
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.author = UserStore.getUserByUuid(data.authorUuid);
        return this;
    }

    // @Override
    //
    getTagName() {
        return this.rank.tagName;
    }

    // @Override
    //
    getTitle() {
        return this.topic;        
    }

    // @Override
    //
    isPublished() {
        return this.published;
    }

    // @Override
    //
    getRankOrder() {
        return this.getRank();
    }

    // @Override
    //
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
        if (this.rank == null) {
            if (this.noData === true) {
                this.rank = this.authorStore.lookupArticleRankByUuid(this.articleUuid);
            } else {
                return null;
            }
        }
        if (this.createdDate == null) {
            this._fillDateString(this.rank);
        }
        return this.rank;
    }

    getRank() {
        let artRank = this.getArticleRank();

        if (artRank != null) {
            return artRank.getRankOrder();
        }
        return 0;
    }

    // @Override
    //
    updateFromJson(jsonArt) {
        let rank = this.rank;

        super.updateFromJson(jsonArt);
        if (jsonArt.noData == null) {
            delete this.noData;
        }
        if (rank != null) {
            this.rank = rank;
        }
    }

    // @Override
    //
    getArticle() {
        return this;
    }

    genArticleRankJson() {
        return ArticleBrief.genArticleRankJson(this);
    }

    getTopic() {
        let artRank = this.getArticleRank();
        return artRank.artTitle;
    }

    getPictureUrl() {
        let artRank = this.getArticleRank();
        return artRank.imageUrl;
    }

    getContent() {
        return this.content;
    }

    getDateString() {
        if (this.dateString == null) {
            this._fillDateString(this.getArticleRank());
        }
        return this.dateString;
    }

    _fillDateString(artRank) {
        if (artRank != null) {
            let date = new Date(artRank.timeStamp);
            this.createdDate = artRank.timeStamp;
            this.dateString  = moment(date).format("DD/MM/YYYY HH:mm");
        }
    }
}

export class Product extends Article {
    constructor(data, store) {
        super(data, store);
    }

    // @Override
    //
    getTagName() {
        return this.publicTag;
    }

    // @Override
    //
    getTitle() {
        return this.prodTitle;
    }

    // @Override
    //
    isPublished() {
        return true;
    }

    // @Override
    //
    getArtTag() {
        return VConst.estore;
    }

    // @Override
    //
    getSortedAnchor() {
        return VConst.prods;
    }
}

export class AdsItem extends Article {
    constructor(data, store) {
        super(data, store);
    }

    // @Override
    //
    getTagName() {
        let artRank = this.getArticleRank();

        if (artRank != null) {
            return artRank.tagName;
        }
        return "Default";
    }

    // @Override
    //
    getTitle() {
        return this.busName;
    }

    // @Override
    //
    isPublished() {
        return true;
    }

    // @Override
    //
    getArtTag() {
        return VConst.ad;
    }

    // @Override
    //
    getSortedAnchor() {
        return VConst.ads;
    }
}

export class AuthorShelf {
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

    removeArticle(articleUuid) {
        let root, article = this.articles[articleUuid];

        if (article != null) {
            root = article.getSortedAnchor();
            Util.removeArray(this[root], article, 0, ArticleSort.compareByDate);
            delete this.articles[articleUuid];
        }
        article = this.savedArts[articleUuid];
        if (article != null) {
            Util.removeArray(this.sortedSavedArts, article, 0, ArticleSort.compareByDate);
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
                    Util.insertSorted(article, this[root], ArticleSort.compareByDate);
                }
            }
            return;
        }
        this.addSortedSavedArts(article);
    }

    addSortedSavedArts(article) {
        if (this.savedArts[article.articleUuid] !== article) {
            this.savedArts[article.articleUuid] = article;
            Util.insertSorted(article, this.sortedSavedArts, ArticleSort.compareByDate);
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

    iterArticles(func, arg, listKey) {
        let anchorKey = listKey == null ? VConst.blogs : listKey;

        _.forOwn(this[anchorKey], function(item, key) {
            func(item, arg);
        });
    }
}

export class PublishArtTag {
    constructor(artObj, artTag, uuid) {
        this.artObj = artObj;
        this.artTag = artTag;
        this.articleUuid = uuid;
    }

    getArticleUuid() {
        return this.articleUuid;
    }

    getAuthorUuid() {
        return this.artObj.getAuthorUuid();
    }

    getArticleRank() {
        return this.artObj;
    }

    getArticle() {
        return this.artObj.getArticle();
    }

    getTagObj() {
        return this.artTag;
    }
}

/**
 * ArtTag stores the binding between articles belonging to a public tag (e.g. all
 * articles published under 'politics' tag.
 */
export class ArtTag {
    constructor(data, authorStore) {
        let artUuids;

        this._id         = _.uniqueId('tag-');
        this.sortedArts  = null;
        this.authorStore = authorStore;

        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        if (_.isEmpty(this.parentTag)) {
            this.parentTag = null;
        }
        if (this.articleRank != null) {
            artUuids = {};
            _.forEach(this.articleRank, function(artUuid) {
                artUuids[artUuid] = artUuid;
            });
            this.articleRank = artUuids;
        } else {
            this.articleRank = {};
        }
        this.update = this.update.bind(this);
        return this;
    }

    getId(prefix) {
        return (prefix || '') + this._id;
    }

    update(artRank) {
        _.forOwn(artRank, function(value, key) {
            if (value != null && this[key] !== value) {
                this[key] = value;
            }
        }.bind(this));
    }

    updateTag(raw, unResolved) {
        let article;

        _.forEach(raw.articleRank, function(artUuid) {
            if (this.articleRank[artUuid] == null) {
                this.addArticleRank(unResolved, artUuid);
            }
        }.bind(this));
    }

    sortArticles(unResolved) {
        let rank, sortedArts, authorStore = this.authorStore;

        if (this.sortedArts != null) {
            // We already has the sorted list.  Don't need to do anything here.
            return;
        }
        sortedArts = [];
        _.forOwn(this.articleRank, function(artUuid) {
            rank = authorStore.lookupArticleRankByUuid(artUuid);

            if (rank == null) {
                unResolved[artUuid] = this;
            } else {
                this.articleRank[rank.getArticleUuid()] = rank;
                Util.insertSorted(rank, sortedArts, ArticleSort.compareByDate);
            }
        }.bind(this));

        if (!_.isEmpty(sortedArts)) {
            this.sortedArts = sortedArts;
        }
    }

    resolveArticleRank(unResolved, artRank) {
        if (unResolved != null) {
            delete unResolved[artRank.getArticleUuid()];
        }
        if (artRank.artTag == null) {
            console.log("Wrong type");
            console.log(artRank);
        }
        if (this.sortedArts == null) {
            this.sortedArts = [artRank];
        } else {
            this.articleRank[artRank.getArticleUuid()] = artRank;
            Util.insertSorted(artRank, this.sortedArts, ArticleSort.compareByDate);
        }
    }

    addArticleRank(unResolved, artUuid) {
        let artRank;

        if (artUuid == null) {
            return;
        }
        artRank = this.authorStore.lookupArticleRankByUuid(artUuid);
        if (artRank == null) {
            unResolved[artUuid] = this;
        }
        if (this.articleRank[artUuid] == null) {
            if (artRank != null) {
                this.resolveArticleRank(null, artRank);
            } else {
                this.articleRank[artUuid] = artUuid;
            }
        }
    }

    updateArticles(unResolved, articles) {
        _.forEach(articles, function(artUuid) {
            this.addArticleRank(unResolved, artUuid);
        }.bind(this));
    }

    debugPrint() {
        if (!_.isEmpty(this.sortedArts)) {
            _.forEach(this.sortedArts, function(article) {
                console.log("[" + article.createdDate + "] " + article.getTitle());
            });
        }
    }

    addSubTag(sub) {
        if (this.subTags == null) {
            this.subTags = [];
        }
        this.removeSubTag(sub);
        this.subTags.push(sub);
    }

    removeSubTag(sub) {
        if (this.subTags != null) {
            Util.removeArray(this.subTags, sub, 0, function(a, b) {
                return (a.tagName === b.tagName) ? 0 : 1;
            });
        }
    }

    attachParent(parentObj) {
        if (parentObj != null) {
            parentObj.addSubTag(this);
            this.parentTag = parentObj.tagName;
        }
    }

    detachParent(parentObj) {
        if (parentObj != null) {
            parentObj.removeSubTag(this);
            this.parentTag = null;
        }
    }

    getImgUrl() {
        if (this.imgOid == null) {
            return "/rs/img/bg/cover.png";
        }
        return "/rs/img/bg/" + this.imgOid;
    }

    getRouteLink() {
        let base = "/app/public/";
        if (this.routeLink == null) {
            return base;
        }
        return base + this.routeLink;
    }
}
