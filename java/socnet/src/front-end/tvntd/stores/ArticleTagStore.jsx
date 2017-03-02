/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _         from 'lodash';
import Reflux    from 'reflux';
import Actions   from 'vntd-root/actions/Actions.jsx';

import {EProductStore}             from 'vntd-root/stores/ArticleStore.jsx';
import {insertSorted, removeArray} from 'vntd-shared/utils/Enum.jsx';

class ArtTag {
    constructor(data) {
        this._id  = _.uniqueId('id-art-tag-');
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        if (_.isEmpty(this.parentTag)) {
            this.parentTag = null;
        }
        return this;
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
            removeArray(this.subTags, sub, 0, function(a, b) {
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
}

let ArticleTagStore = Reflux.createStore({
    data: {},
    listenables: [Actions],

    init: function() {
        this.data = {
            publicTags : {},
            pubTagIndex: {},
            sortedPubTags: [],
            sortedIdxTags: [],
            sortedTagKind: {},
            deletedTags: {}
        };
    },

    /* Admin actions to list users. */
    onStartupCompleted: function(data) {
        let tagData = data.publicTags; 
        if (tagData != null) {
            _.forEach(tagData.publicTags, function(tag) {
                this._addTag(new ArtTag(tag));
            }.bind(this));
            this._updateParents();
            this.trigger(this.data, tagData);
        }
    },

    /* Signal to sync up data with server. */
    onSyncServerCompleted: function() {
        let pubTags = this.data.sortedPubTags;

        _.forEach(pubTags, function(tag) {
            EProductStore.updateMissingUuid(tag.articleRank);
        });
        EProductStore.requestProducts();
    },

    /* Public methods. */
    addTagInput: function(tag) {
        this._addTag(new ArtTag(tag));
        this.trigger(this.data);
    },

    addPublicTag: function(tagName, rank, parentName, articleUuid) {
        let tag = this.data.pubTagIndex[tagName];
        if (tag == null) {
            tag = new ArtTag({
                tagName  : tagName,
                rankScore: rank,
                parentTag: parentName,
                subTags  : [],
                articleRank: [ articleUuid ]
            });
            this._addTag(tag);
            this.trigger(this.data);

        } else if (tag.articleRank != null) {
            let artRank = tag.articleRank;
            if (artRank.indexOf(articleUuid) < 0) {
                artRank.push(articleUuid);
                this.trigger(this.data);
            }
        }
    },

    addToPublicTag: function(tagName, tagKind, uuid) {
        let tag = this.data.pubTagIndex[tagName];
        if (tag != null) {
            console.log("add to public tag " + tag);
            if (tag.tagKind === tagKind) {
                console.log("same tag kind " + tagKind);
            }
            tag.articleRank.push(uuid);
        }
        console.log(tag);
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
        return curName;
    },

    removePublicTag: function(tagName) {
        let self = this.data.pubTagIndex[tagName];
        if (self != null) {
            this._removeTag(self);
            this.trigger(this.data);
        }
    },

    removeSubTag(tag, sub) {
        tag.removeSubTag(sub);
        this.trigger(this.data, tag, sub);
    },

    getAllPublicTags: function(topLevel, pubMode) {
        if (topLevel == null || topLevel === true) {
            let result = [];
            let allTags = this.data.sortedPubTags;

            _.forEach(allTags, function(tag) {
                if (tag.tagKind === pubMode) {
                    result.push(tag);
                }
            });
            return result;
        }
        return this.data.sortedIdxTags;
    },

    getPublicTagsSelOpt: function(kind) {
        let result = [];
        _.forOwn(this.data.sortedIdxTags, function(tag) {
            if (tag.tagKind === kind) {
                result.push({
                    value: tag.tagName,
                    label: tag.tagName
                });
            }
        });
        return result;
    },

    getAllPublicTagsString: function(topLevel) {
        let tagStrings = [];
        let tags = this.getAllPublicTags(topLevel);

        _.forOwn(tags, function(it) {
            tagStrings.push(it.tagName);
        });
        return tagStrings;
    },

    getSubmitTags: function() {
        let pubTags = [], delTags = [];

        this._toTagArray(pubTags, this.data.publicTags);
        this._toTagArray(delTags, this.data.deletedTags);
        return {
            publicTags : pubTags,
            deletedTags: delTags
        }
    },

    _toTagArray: function(array, tagMgr) {
        _.forOwn(tagMgr, function(tag) {
            this._flatTagArray(array, tag);
        }.bind(this));
        return array;
    },

    _flatTagArray: function(array, tag) {
        if (tag.subTags != null) {
            _.forEach(tag.subTags, function(sub) {
                this._flatTagArray(array, sub);
            }.bind(this));
        }
        array.push({
            tagName  : tag.tagName,
            rankScore: tag.rankScore != null ? tag.rankScore : 50,
            parentTag: tag.parentTag,
            tagKind  : tag.tagKind,
            subTags  : [],
            articleRank: tag.articleRank != null ? tag.articleRank : []
        });
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

    _addTag: function(tagObj) {
        let tagIndex = this.data.pubTagIndex;

        if (tagIndex[tagObj.tagName] == null) {
            tagIndex[tagObj.tagName] = tagObj;
            insertSorted(tagObj, this.data.sortedIdxTags, this._compareTags);
        }
        if (tagObj.parentTag != null) {
            let t = tagIndex[tagObj.parentTag];
            if (t != null) {
                t.addSubTag(tagObj);
            }
        } else if (this.data.publicTags[tagObj.tagName] == null) {
            this.data.publicTags[tagObj.tagName] = tagObj;
            insertSorted(tagObj, this.data.sortedPubTags, this._compareTags);
        }
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
            removeArray(sortedIdxTags, t, 0, this._compareTagName);
        }.bind(this));

        if (tagObj.parentTag != null) {
            tagObj.detachParent(tagIndex[tagObj.parentTag]);
        }
        delete tagIndex[tagObj.tagName];
        removeArray(sortedIdxTags, tagObj, 0, this._compareTagName);

        if (this.data.publicTags[tagObj.tagName] != null) {
            delete this.data.publicTags[tagObj.tagName];
            removeArray(this.data.sortedPubTags, tagObj, 0, this._compareTagName);
        }
        this.data.deletedTags[tagObj.tagName] = tagObj;
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
    getPublishedArticles: function(tagName, artUuids) {
        let tag = this.data.pubTagIndex[tagName];
        if (tag != null) {
            _.forOwn(tag.articleRank, function(uuid) {
                artUuids.push({
                    artUuid: uuid,
                    artTag : tag
                });
            });
            if (tag.subTags != null) {
                _.forOwn(tag.subTags, function(sub) {
                    this.getPublishedArticles(sub.tagName, artUuids);
                }.bind(this));
            }
        }
        return artUuids;
    },

    /*
     * @return true if the given uuid is listed in this store.
     */
    hasPublishedArticle: function(artUuid) {
        let ret = false;
        let tags = this.data.pubTagIndex;
        _.forOwn(tags, function(t) {
            _.forOwn(t.articleRank, function(uuid) {
                if (uuid === artUuid) {
                    ret = true;
                    return false; // bail out early.
                }
            });
            if (ret == true) {
                return false;
            }
        });
        return ret;
    },

    getTagTableData: function(edit, kind, ownerUuid) {
        let parentTag, userUuid, data = [];

        _.forEach(this.data.sortedIdxTags, function(tag) {
            if (((kind != null) && (tag.tagKind !== kind)) ||
                ((ownerUuid != null) && (ownerUuid !== tag.userUuid))) {
                return;
            }
            if (edit === true) {
                userUuid  = tag.userUuid;
                parentTag = tag.parentTag != null ? tag.parentTag : "root";
                data.push({
                    tagName  : tag.tagName,
                    ownerUuid: tag.userUuid,
                    parentTag: {
                        select   : true,
                        inpHolder: tag.parentTag,
                        inpDefVal: tag.parentTag,
                        selectOpt: [ "123", "234", "532" ],
                        inpName  : _.uniqueId(parentTag)
                    },
                    rankScore: {
                        inpValue : tag.rankScore,
                        inpDefVal: tag.rankScore,
                        inpHolder: 100,
                        inpName  : tag.tagName + "-" + userUuid
                    },
                    tagKind: {
                        select   : true,
                        inpHolder: tag.tagKind,
                        inpDefVal: tag.tagKind,
                        selectOpt: [ "abc", "def" ],
                        inpName  : tag.tagName + "-" + tag.tagKind
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

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default ArticleTagStore;
