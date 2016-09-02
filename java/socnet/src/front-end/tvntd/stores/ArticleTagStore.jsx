/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _         from 'lodash';
import Reflux    from 'reflux';
import Actions   from 'vntd-root/actions/Actions.jsx';

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
        this.subTags.push(sub);
    }

    addSelf(tagMgr) {
        tagMgr.pubTagIndex[this.tagName] = this;
        if (this.parentTag != null) {
            let t = tagMgr.pubTagIndex[this.parentTag];
            if (t != null) {
                t.addSubTag(this);
            }
        } else {
            tagMgr.publicTags[this.tagName] = this;
        }
    }

    changeParent(parentName, tagMgr) {
        this.detachParent(tagMgr);
        if (parentName == null || _.isEmpty(parentName)) {
            parentName = null;
        }
        this.parentTag = parentName;
        if (parentName != null) {
            parent = tagMgr.publicTags[parentName];
            if (parent != null) {
                parent.addSubTag(this);
            }
        } else {
            tagMgr.publicTags[this.tagName] = this;
        }
    }

    detachParent(tagMgr) {
        if (this.parentTag != null) {
            let parent = tagMgr.publicTags(this.parentTag);
            if (parent != null) {
                parent.removeSubTag(this);
            }
            this.parentTag = null;
        } else {
            delete tagMgr.publicTags[this.tagName];
        }
    }

    removeSelf(tagMgr) {
        _.forEach(this.subTags, function(t) {
            delete tagMgr.pubTagIndex[t.tagName];
        }.bind(this));

        this.detachParent(tagMgr);
        delete tagMgr.pubTagIndex[this.tagName];
        tagMgr.deletedTags[this.tagName] = this;
    }

    removeSubTag(sub) {
        if (this.subTags != null) {
            let idx = this.subTags.indexOf(sub);
            if (idx >= 0) {
                this.subTags.splice(idx, 1);
            }
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
            deletedTags: {}
        };
    },

    /* Admin actions to list users. */
    onStartupCompleted: function(data) {
        let tagData = data.publicTags; 
        if (tagData != null) {
            let tagObjs = [];
            _.forEach(tagData.publicTags, function(tag) {
                let obj = new ArtTag(tag);
                this.data.pubTagIndex[tag.tagName] = obj;
                tagObjs.push(obj);
            }.bind(this));

            _.forEach(tagObjs, function(obj) {
                obj.addSelf(this.data);
            }.bind(this));
            this.trigger(this.data);
        }
    },

    /* Public methods. */
    addTagInput: function(tag) {
        let obj = new ArtTag(tag);
        obj.addSelf(this.data);
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
            tag.addSelf(this.data);
            this.trigger(this.data);

        } else if (tag.articleRank != null) {
            let artRank = tag.articleRank;
            if (artRank.indexOf(articleUuid) < 0) {
                artRank.push(articleUuid);
                this.trigger(this.data);
            }
        }
    },

    changeParent(tagName, parentName) {
        let self = this.data.pubTagIndex[tagName];
        if (self != null) {
            self.changeParent(parentName, this.data);
            this.trigger(this.data);
        }
    },

    changeTagValue(curName, newName, rank) {
        let tagMgr = this.data;
        let self = this.data.pubTagIndex[curName];

        if (self != null) {
            if (rank != null && !_.isEmpty(rank)) {
                self.rankScore = rank;
            }
            if (newName != null && !_.isEmpty(newName)) {
                self.removeSelf(tagMgr);
                self.tagName = newName;
                self.addSelf(tagMgr);
                this.trigger(tagMgr);
            }
            return self.tagName;
        }
        return curName;
    },

    removePublicTag: function(tagName) {
        let tagMgr = this.data;
        let tag = tagMgr.pubTagIndex[tagName];

        if (tag != null) {
            tag.removeSelf(tagMgr);
            this.trigger(this.data);
        }
    },

    removeSubTag(tag, sub) {
        tag.removeSubTag(sub);
        this.trigger(this.data);
    },

    getAllPublicTags: function() {
        return this.data.publicTags;
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
            subTags  : [],
            articleRank: tag.articleRank != null ? tag.articleRank : []
        });
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

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default ArticleTagStore;
