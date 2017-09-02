/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _         from 'lodash';
import Reflux    from 'reflux';
import Actions   from 'vntd-root/actions/Actions.jsx';

import {VntdGlob}            from 'vntd-root/config/constants.js';
import {tagKinds}            from 'vntd-root/components/TagInfo.jsx';
import {GenericForm}         from 'vntd-shared/forms/commons/GenericForm.jsx';
import {Util}                from 'vntd-shared/utils/Enum.jsx';
import {GlobStore}           from 'vntd-root/stores/ArticleStore.jsx';
import AuthorStore           from 'vntd-root/stores/AuthorStore.jsx';

import ErrorView from 'vntd-shared/layout/ErrorView.jsx';
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
        return prefix + this._id;
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
            ErrorView.stackTrace();
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

/*
 * This store manages tags having published articles.  Tags keeping track of all
 * articles are managed by AuthorStore.
 */
let ArticleTagStore = Reflux.createStore({
    data: null,
    listenables: [Actions],

    init: function() {
        this.data = {
            routeMap     : {},
            publicTags   : {},  // only public tags
            pubTagIndex  : {},  // all tags
            sortedPubTags: [],
            sortedIdxTags: [],
            sortedTagKind: {},
            sortedByOwner: {},
            unResolved   : {}
        };
    },

    /* Admin actions to list users. */
    mainStartup: function(data) {
        let curr, allTags, tagData = data.publicTags; 

        this.data.domainUuid = data.domainUuid;
        if (tagData != null) {
            allTags = this.data.pubTagIndex;
            _.forEach(tagData.publicTags, function(tag) {
                curr = allTags[tag.tagName];
                if (curr != null) {
                    curr.updateTag(tag, this.data.unResolved);
                } else {
                    this._addTag(new ArtTag(tag));
                }
            }.bind(this));
            this._updateParents();
            this.trigger(this.data, tagData);
        }
        _.forEach([ "blog", "estore", "ads" ], function(kind) {
            let store = GlobStore.getStoreKind(kind);
            store.listenChanges(this, 'onItemsChanged');
        }.bind(this));
    },

    /* Signal to sync up data with server. */
    onSyncServerCompleted: function() {
        let store, data = this.data, kind = [ "estore", "ads" ];

        _.forEach(kind, function(k) {
            store = GlobStore.getStoreKind(k, true);
            store.updatePublicTags(data.sortedTagKind[k]);
        });
    },

    onItemsChanged: function(storeKind, code, changeList) {
        let tagName, tag, rank, artUuid, data = this.data, unResolved = data.unResolved;

        _.forEach(changeList, function(article) {
            artUuid = article.getArticleUuid();
            rank    = AuthorStore.lookupArticleRankByUuid(artUuid);
            tag     = unResolved[artUuid];

            if (tag != null) {
                tag.resolveArticleRank(unResolved, rank);
            } else {
                tagName = article.getTagName();
                if (tagName != null) {
                    tag = data.pubTagIndex[tagName];
                    if (tag != null && tag.tagKind === storeKind) {
                        tag.resolveArticleRank(null, rank);
                    }
                }
            }
        });
    },

    onGetPublishAdsCompleted: function(data) {
        this.trigger(this.data);
    },

    onChangeTagArtCompleted: function(data) {
        let root = this.data;
        _.forEach(data.publicTags, function(raw) {
            let tagObj = root.pubTagIndex[raw.tagName];

            if (tagObj == null) {
                tagObj = this.addPublicTag(raw, raw.parentTag, null);
            }
            tagObj.updateArticles(root.unResolved, raw.articleRank);
        }.bind(this));
    },

    /* Public methods. */
    addTagInput: function(tag) {
        this._addTag(new ArtTag(tag));
        this.trigger(this.data);
    },

    addPublicTag: function(artRank, parentTag, articleUuid) {
        let tag = this.data.pubTagIndex[artRank.tagName];
        if (tag == null) {
            this._addNewPublicTag(artRank, parentTag, articleUuid);
            this.trigger(this.data);
        } else {
            tag.addArticleRank(this.data.unResolved, articleUuid);
        }
    },

    getFilterTag: function(kind, filterFn, arg) {
        if (this.data.sortedTagKind[kind] != null) {
            return filterFn(this.data.sortedTagKind[kind], arg);
        }
        return null;
    },

    getTagByName: function(tagName) {
        let tag = this.data.pubTagIndex[tagName];
        if (tag != null) {
            return tag;
        }
        return this.data.publicTags[tagName];
    },

    updatePublicTags: function(tagRanks, tagMgr) {
        this.trigger(this.data, tagMgr);
    },

    changeParent(tagName, parentName) {
        let tagIndex = this.data.pubTagIndex;
        let self = tagIndex[tagName];
        if (self != null) {
            if (parentName == null || _.isEmpty(parentName)) {
                parentName = null;
            }
            if (self.parentTag != null) {
                self.detachParent(tagIndex[self.parentTag]);
            }
            self.parentTag = parentName;
            if (parentName != null) {
                self.attachParent(tagIndex[self.parentTag]);
            }
            this.trigger(this.data);
        }
    },

    /**
     * data = { curTag, parent, rank, tagName }
     */
    changeTagValue(data) {
        let pubTagIndex = this.data.pubTagIndex;
        let self = pubTagIndex[data.curTag];

        if (self != null) {
            let trigger = false;
            let rank = parseInt(data.rank);
            if (data.rank != null && !_.isEmpty(data.rank) && Number.isInteger(rank)) {
                self.rankScore = rank;
                this._resortTags();
                trigger = true;
            }
            if (data.tagName != null && !_.isEmpty(data.tagName)) {
                this._removeTag(self);
                self.tagName = data.tagName;

                this._addTag(self);
                trigger = true;
            }
            if (data.parent != null && !_.isEmpty(data.parent)) {
                if (self.parentTag != null) {
                    self.detachParent(pubTagIndex[self.parentTag]);
                }
                let parent = pubTagIndex[data.parent];
                if (parent != null) {
                    self.attachParent(parent);
                }
                trigger = true;
            }
            self.tagKind = data.tagKind;
            if (trigger === true) {
                this.trigger(this.data);
            }
            return self.tagName;
        }
        return data.curTag;
    },

    removePublicTag: function(tagName) {
        let self = this.data.pubTagIndex[tagName];
        if (self != null) {
            this._removeTag(self);
            this.trigger(this.data);
        }
    },

    addPubListTags: function(tags) {
        _.forEach(tags, function(tag) {
            this._addNewPublicTag(tag, tag.parentTag, null);
        }.bind(this));
        this.trigger(this.data);
    },

    removePubListTags: function(tags) {
        let rec;
        _.forEach(tags, function(tag) {
            rec = this.data.pubTagIndex[tag.tagName];
            if (rec != null) {
                this._removeTag(rec);
            }
        }.bind(this));
        this.trigger(this.data);
    },

    removeSubTag(tag, sub) {
        tag.removeSubTag(sub);
        this.trigger(this.data, tag, sub);
    },

    getAllPublicTags: function(topLevel, pubMode) {
        let allTags, result = [];

        if (topLevel == null || topLevel === true) {
            allTags = this.data.sortedPubTags;
        } else {
            allTags = this.data.sortedIdxTags;
        }
        _.forEach(allTags, function(tag) {
            if (tag.tagKind === pubMode) {
                result.push(tag);
            }
        });
        return result;
    },

    getPublicTagsSelOpt: function(kind) {
        let result = [];
        _.forOwn(this.data.sortedIdxTags, function(tag) {
            if (kind == null || tag.tagKind === kind) {
                Util.insertSorted({
                    value: tag.tagName,
                    label: tag.tagName
                }, result, function(t1, t2) {
                    return t1.value.localeCompare(t2.value);
                });
            }
        });
        return result;
    },

    getAllPublicTagsString: function(topLevel, pubMode) {
        let tagStrings = [];
        let tags = this.getAllPublicTags(topLevel, pubMode);

        _.forOwn(tags, function(it) {
            tagStrings.push(it.tagName);
        });
        return tagStrings;
    },

    _addNewPublicTag: function(artRank, parentTag, articleUuid) {
        let tag = this.data.pubTagIndex[artRank.tagName];
        if (tag != null) {
            tag.update(artRank);
            return tag;
        }
        tag = new ArtTag({
            tagName  : artRank.tagName,
            userUuid : artRank.authorUuid,
            rankScore: artRank.rank || artRank.rankScore,
            parentTag: parentTag,
            tagKind  : artRank.tagKind,
            routeLink: artRank.routeLink,
            imgOid   : artRank.imgOid,
            subTags  : [],
            articleRank: []
        });
        tag.addArticleRank(this.data.unResolved, articleUuid);
        this._addTag(tag);
        return tag;
    },

    /**
     * Compare function between tag a and b.
     */
    _computeRank: function(tag) {
        let count, rank = parseInt(tag.rankScore),
            tagIndex = this.data.pubTagIndex;

        for (count = 0; tag != null && tag.parentTag != null && count < 20; count++) {
            rank = rank + 100;
            tag = tagIndex[tag.parentTag];
        }
        return rank;
    },

    _compareTags: function(a, b) {
        let aRank = this._computeRank(a);
        let bRank = this._computeRank(b);
        return aRank - bRank; 
    },

   /**
    * Main method to add tag to this store.
    */
    _addTag: function(tagObj) {
        let tagList, ownerUuid, tagIndex = this.data.pubTagIndex;

        ownerUuid = tagObj.userUuid;
        if (tagIndex[tagObj.tagName] == null) {
            tagIndex[tagObj.tagName] = tagObj;
            Util.insertSorted(tagObj, this.data.sortedIdxTags, this._compareTags);
        }
        if (tagObj.parentTag != null) {
            let t = tagIndex[tagObj.parentTag];
            if (t != null) {
                t.addSubTag(tagObj);
            }
        } else if (ownerUuid === VntdGlob.publicUuid) {
            this.data.publicTags[tagObj.tagName] = tagObj;
            Util.insertSorted(tagObj, this.data.sortedPubTags, this._compareTags);
        } else {
            tagList = this.data.sortedByOwner[ownerUuid];
            if (tagList == null) {
                tagList = [];
                this.data.sortedByOwner[ownerUuid] = tagList;
            }
            Util.insertSorted(tagObj, tagList, this._compareTags);
        }
        this._addSortedTagKind(tagObj);

        if (tagObj.routeLink != null) {
            let parent, parentTag = tagObj.parentTag;

            while (parentTag != null && tagObj != null) {
                parent = tagIndex[parentTag];
                if (parent == null) {
                    break;
                }
                tagObj    = parent;
                parentTag = tagObj.parentTag;
            }
            this.data.routeMap[tagObj.routeLink] = tagObj;
        }
        // Sorted articles published in the tag, saved unresolved to fetch later.
        //
        tagObj.sortArticles(this.data.unResolved);
    },

    _addSortedTagKind: function(tagObj) {
        let tagKind, index = tagObj.tagKind != null ? tagObj.tagKind : "blog";

        tagKind = this.data.sortedTagKind[index];
        if (tagKind == null) {
            this.data.sortedTagKind[index] = [];
            tagKind = this.data.sortedTagKind[index];
        }
        Util.insertSorted(tagObj, tagKind, this._compareTags);
    },

    _updateParents: function() {
        let tagIndex = this.data.pubTagIndex;
        _.forEach(tagIndex, function(tagObj) {
            if (tagObj.parentTag != null) {
                let t = tagIndex[tagObj.parentTag];
                if (t != null) {
                    t.addSubTag(tagObj);
                }
            }
        });
    },

    _compareTagName: function(a, b) {
        return (a.tagName === b.tagName) ? 0 : 1;
    },

    _removeTag: function(tagObj) {
        let tagIndex = this.data.pubTagIndex;
        let sortedIdxTags = this.data.sortedIdxTags;

        _.forEach(tagObj.subTags, function(t) {
            delete tagIndex[t.tagName];
            Util.removeArray(sortedIdxTags, t, 0, this._compareTagName);
        }.bind(this));

        if (tagObj.parentTag != null) {
            tagObj.detachParent(tagIndex[tagObj.parentTag]);
        }
        delete tagIndex[tagObj.tagName];
        Util.removeArray(sortedIdxTags, tagObj, 0, this._compareTagName);

        if (this.data.publicTags[tagObj.tagName] != null) {
            delete this.data.publicTags[tagObj.tagName];
            Util.removeArray(this.data.sortedPubTags, tagObj, 0, this._compareTagName);
        }
    },

    _resortTags: function() {
        this.data.sortedIdxTags.sort(this._compareTags);
        this.data.sortedPubTags.sort(this._compareTags);
    },

    getPublicTag: function(tagName) {
        return this.data.pubTagIndex[tagName];
    },

    /*
     * @return list of article uuids under the given tag.
     */
    getPublishedArticles: function(tagName, artUuids, uuidDict) {
        let uuid, tag = this.data.pubTagIndex[tagName];

        if (tag != null) {
            _.forOwn(tag.sortedArts, function(artRankObj) {
                artRankObj.publishTag = tag;
                uuid = artRankObj.getArticleUuid();

                if (uuidDict[uuid] == null) {
                    uuidDict[uuid] = uuid;
                    artUuids.push(new PublishArtTag(artRankObj, tag, uuid));
                }
            });
            if (tag.subTags != null) {
                _.forOwn(tag.subTags, function(sub) {
                    this.getPublishedArticles(sub.tagName, artUuids, uuidDict);
                }.bind(this));
            }
        }
        return artUuids;
    },

    /*
     * @return true if the given uuid is listed in this store.
     */
    hasPublishedArticle: function(artUuid) {
        let artTag = AuthorStore.lookupArticleRankByUuid(artUuid);
        if (artTag != null) {
            return artTag.publishTag != null;
        }
        return false;
    },

    /*
     * @return tag associated with the link routing.
     */
    getTagFromRoute(route) {
        return this.data.routeMap[route];
    },

    /*
     * @return tag data to display in a table.
     */
    getTagTableData: function(edit, kind, ownerUuid) {
        let parentTag, userUuid, parents, data = [];

        parents = this.getPublicTagsSelOpt(kind);
        _.forEach(this.data.sortedIdxTags, function(tag) {
            if (((kind != null) && (tag.tagKind !== kind)) ||
                ((ownerUuid != null) && (ownerUuid !== tag.userUuid))) {
                return;
            }
            if (edit === true) {
                userUuid  = tag.userUuid;
                parentTag = tag.parentTag != null ? tag.parentTag : "";
                data.push({
                    rowId    : _.uniqueId(tag.tagName),
                    tagName  : tag.tagName,
                    ownerUuid: tag.userUuid,
                    parentTag: {
                        select   : true,
                        inpHolder: parentTag,
                        inpDefVal: parentTag,
                        selectOpt: parents,
                        inpName  : tag.getId('parent-')
                    },
                    rankScore: {
                        inpValue : tag.rankScore,
                        inpDefVal: tag.rankScore,
                        inpHolder: 100,
                        inpName  : tag.getId('rank-')
                    },
                    tagKind: {
                        select   : true,
                        inpHolder: tag.tagKind,
                        inpDefVal: tag.tagKind,
                        selectOpt: tagKinds,
                        inpName  : tag.tagName + "-" + tag.tagKind
                    },
                    routeLink: {
                        inpValue : tag.routeLink,
                        inpDefVal: tag.routeLink || "",
                        inpHolder: "routing link",
                        inpName  : tag.getId('route-')
                    },
                    imgOid: {
                        inpValue : tag.imgOid,
                        inpDefVal: tag.imgOid || "",
                        inpHolder: "background img",
                        inpName  : tag.getId('bg-')
                    }
                });
            } else {
                data.push({
                    tagName  : tag.tagName,
                    parentTag: tag.parentTag,
                    rankScore: tag.rankScore,
                    ownerUuid: tag.userUuid,
                    tagKind  : tag.tagKind
                });
            }
        });
        return data;
    },

    cloneTagTableRow: function(row, count) {
        let i, out = [],
            rpTag = row.parentTag,
            parent = rpTag.inpHolder != null ? rpTag.inpHolder : "",
            parentTag = {
                inpHolder: parent,
                inpDefVal: parent,
                selectOpt: rpTag.selectOpt,
                select   : rpTag.select
            };

        for (i = 0; i < count; i++) {
            out.push({
                clone  : true,
                rowId  : _.uniqueId('new-tag'),
                tagName: {
                    inpHolder: 'Enter new tag',
                    inpName  : _.uniqueId('new-tag-'),
                    inpDefVal: ''
                },
                ownerUuid: row.ownerUuid,
                parentTag: GenericForm.cloneInputEntry(parentTag, 'new-tag-'),
                rankScore: GenericForm.cloneInputEntry(row.rankScore, 'new-tag-'),
                tagKind  : GenericForm.cloneInputEntry(row.tagKind, 'new-tag-'),
                routeLink: GenericForm.cloneInputEntry(row.routeLink, 'new-tag-'),
                imgOid   : GenericForm.cloneInputEntry(row.imgOid, 'new-tag-')
            });
        }
        return out;
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default ArticleTagStore;
