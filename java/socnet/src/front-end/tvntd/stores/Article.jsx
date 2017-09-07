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
 * Maintains binding from articles to a name tag.
 */
export class AuthorTag {
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

class ArticleBase {
    constructor(store) {
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
        if (this.msTime == null) {
            this.msTime = Date.parse(this.timeStamp);
        }
        return -this.msTime;
    }
}

export class ArticleRank extends ArticleBase {
    constructor(data, store, authorTag, article) {
        super(store);
        if (data == null) {
            data = ArticleRank.genArticleRankJson(article);
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
}

export class Article extends ArticleBase {
    constructor(data, store) {
        let date;

        super(store);
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        date            = new Date(data.createdDate);
        this.dateString = moment(date).format("DD/MM/YYYY - HH:mm");
        this.author     = UserStore.getUserByUuid(data.authorUuid);
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
        if (this.rank != null) {
            return this.rank;
        }
        if (this.noData === true) {
            this.rank = this.authorStore.lookupArticleRankByUuid(this.articleUuid);
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
        return ArticleRank.genArticleRankJson(this);
    }
}

export class Product extends Article {
    constructor(data) {
        super(data);
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
    constructor(data) {
        super(data);
    }

    // @Override
    //
    getTagName() {
        return this.adsRank.tagName;
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
