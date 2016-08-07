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

    removeSelf(tagMgr) {
        _.forEach(this.subTags, function(t) {
            t.parentTag = null;
            tagMgr.publicTags[t.tagName] = t;
        }.bind(this));

        if (this.parentTag != null) {
            let parent = tagMgr.pubTagIndex[this.parentTag];
            if (parent != null) {
                parent.removeSubTag(this);
            }
        }
        this.parentTag = null;
        delete tagMgr.pubTagIndex[this.tagName];
        delete tagMgr.publicTags[this.tagName];
        delete this.subTags;
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
        }
    },

    /* Admin actions to list users. */

    /* Public methods. */
    addTagInput: function(tag) {
        let obj = new ArtTag(tag);
        obj.addSelf(this.data);
        this.trigger(this.data);
    },

    addPublicTag: function(tagName, rank, parentName) {
        let tag = new ArtTag({
            tagName  : tagName,
            rankScore: rank,
            parentTag: parentName,
            subTags  : []
        });
        tag.addSelf(this.data);
        this.trigger(this.data);
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

    getPublicTag: function(tagName) {
        return this.data.pubTagIndex[tagName];
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    }
});

export default ArticleTagStore;
