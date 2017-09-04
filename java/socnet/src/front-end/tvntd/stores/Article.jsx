/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import moment       from 'moment';

import {VConst}     from 'vntd-root/config/constants.js';

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

class Article {
    constructor(data) {
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.author       = UserStore.getUserByUuid(data.authorUuid);
        this.createdDate  = Date.parse(data.createdDate);
        this.dateString   = moment(this.createdDate).format("DD/MM/YYYY - HH:mm");

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

        this[VConst.ads]     = [];
        this[VConst.blogs]   = [];
        this[VConst.prods]   = [];
        this.sortedSavedArts = [];

        if (article != null) {
            this.addSortedArticle(article);
        }
        return this;
    }

    addArticle(article) {
        if (article == null) {
            return;
        }
        if (this.articles[article.articleUuid] != null) {
            this.removeArticle(article.articleUuid);
        }
        this.addSortedArticle(article, true);
    }

    _cmpArticle(anchor, elm) {
        if (anchor.createdDate === elm.createdDate) {
            return 0;
        }
        if (anchor.createdDate > elm.createdDate) {
            return -1;
        }
        return 1;
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

    addArticleRankObj(rank) {
        let artUuid = rank.articleUuid,
            artRank = this.articles[artUuid];

        if (artRank == null) {
            artRank = rank;
            this.articles[rank.articleUuid] = rank;
            Util.insertSorted(rank, this.sortedArts, this.compareRank);
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
        let tagRanks = [], len = this.sortedTags.length;

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
            let sortedArts = authorTag != null ?
                authorTag.getSortedArticleRank() : null;

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

function sortArticle(pivot, article) {
    return article.createdDate - pivot.createdDate;
}

class PublishArtTag {
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

class ArtTag {
    constructor(data) {
        let artUuids;

        this._id = _.uniqueId('tag-');
        this.sortedArts = null;
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
        let rank, sortedArts, store = GlobStore.getStoreKind(this.tagKind);

        if (this.sortedArts != null) {
            // We already has the sorted list.  Don't need to do anything here.
            return;
        }
        sortedArts = [];
        _.forOwn(this.articleRank, function(artUuid) {
            rank = AuthorStore.lookupArticleRankByUuid(artUuid);

            if (rank == null) {
                unResolved[artUuid] = this;
            } else {
                this.articleRank[rank.getArticleUuid()] = rank;
                Util.insertSorted(rank, sortedArts, sortArticle);
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
            Util.insertSorted(artRank, this.sortedArts, sortArticle);
        }
    }

    addArticleRank(unResolved, artUuid) {
        let artRank;

        if (artUuid == null) {
            return;
        }
        artRank = AuthorStore.lookupArticleRankByUuid(artUuid);
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

export {AuthorShelf, AuthorTag, ArticleTag, ArticleRank, Article}
export default Article;
