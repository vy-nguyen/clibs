/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';
import Spinner            from 'react-spinjs';

import SelectComp         from 'vntd-shared/component/SelectComp.jsx';
import BrowseSelection    from 'vntd-shared/layout/BrowseSelection.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';
import AdsTableListing    from './AdsTableListing.jsx';
import AdsRealtor         from './AdsRealtor.jsx';

class AdsCategory
{
    constructor(map, baseName, selectFn) {
        let dictIndex = {}, index = 0, i, start, end;

        this.browse = map;
        _.forEach(this.browse, function(it) {
            it.entry = {
                index    : index++,
                select   : true,
                inpName  : baseName + index,
                inpDefVal: null,
                selectOpt: null,
                onSelect : selectFn
            };
            if (it.exact === true) {
                dictIndex[it.label] = it;
                _.forEach(it.alias, function(a) {
                    dictIndex[a] = it;
                });
            } else {
                end   = it.end.charCodeAt(0);
                start = it.start.charCodeAt(0);
                if (start >= end) {
                    if (start == end) {
                        dictIndex[it.start] = it;
                    } else {
                        console.log("AdsCategory bug!  Need to pass propder value");
                    }
                    return;
                }
                for (i = start; i < end; i++) {
                    dictIndex[String.fromCharCode(i)] = it;
                }
            }
        }.bind(this));

        this.indexMap = dictIndex;
        this.filterTagBuckets = this.filterTagBuckets.bind(this);
    }

    filterTagBuckets(tags) {
        let index, key, rec, out = [];

        _.forEach(tags, function(tag) {
            if (tag.tagName != null) {
                rec = this.indexMap[tag.tagName];
                if (rec == null) {
                    key = tag.tagName.substring(0, 1);
                    rec = this.indexMap[key];
                    if (rec == null) {
                        return;
                    }
                }
                index = rec.entry.index;
                if (out[index] == null) {
                    out[index] = [];
                }
                out[index].push(tag);
            }
        }.bind(this));
        return out;
    }
}

class TagsFilter
{
    constructor(selOpt) {
        this.selOpt = selOpt;
        this.tagMap = {};
        this._iterSelectOpt(selOpt);

        this.filterTagBuckets = this.filterTagBuckets.bind(this);
    }

    _iterSelectOpt(selOpt) {
        if (selOpt.tags != null) {
            let value = [];
            this.tagMap[selOpt.value.toUpperCase()] = value;
            _.forEach(selOpt.tags, function(t) {
                this.tagMap[t.toUpperCase()] = value;
            }.bind(this));
        }
        if (selOpt.selOpt != null) {
            _.forEach(selOpt.selOpt, function(it) {
                this._iterSelectOpt(it);
            }.bind(this));
        }
    }

    filterTagBuckets(tags) {
        let out = [];

        _.forEach(tags, function(tag) {
            let value = this.tagMap[tag.tagName.toUpperCase()];

            if (value != null) {
                out.push(tag.tagName);
                value.push(tag.tagName);
            }
        }.bind(this));
        return out;
    }

    lookupTag(entry) {
        console.log("lookup entry " + entry.value.toUpperCase());
        console.log(entry);
        console.log(this);
        return this.tagMap[entry.value.toUpperCase()];
    }

    lookupSelection(selected) {
        let prev, curr;

        prev = null;
        curr = this.selOpt;
        for (let i = 0; i < selected.length; i++) {
            prev = curr;
            console.log("lookup matching " + selected[i]);
            curr = SelectComp.findEntry(curr, selected[i]);
            if (curr == null) {
                return prev;
            }
        }
        console.log(selected);
        return curr;
    }
}

class FeatureAds extends React.Component
{
    constructor(props) {
        let index;

        super(props);
        this._renderTag          = this._renderTag.bind(this);
        this._renderAdsRealtor   = this._renderAdsRealtor.bind(this);
        this._updateArtTagsState = this._updateArtTagsState.bind(this);
        this._updateFeatureAds   = this._updateFeatureAds.bind(this);

        this.state = {
            adsMenu: AdPropertyStore.getAdsFeatures()
        };
        this._locMenu = [ {
            value: "CA",
            label: "California",
            title: "Select County",
            selOpt: [ {
                value: "Al",
                label: "Alameda County"
            }, {
                value: "SC",
                label: "Santa Clara County"
            }, {
                value: "SM",
                label: "San Mateo County"
            }, {
                value: "SF",
                label: "San Francisco"
            } ]
        }, {
            value: "TX",
            label: "Texas"
        }, {
            value: "VA",
            label: "Virgina"
        } ];
        this._adsMenu = {
            value: "main",
            title: "Feature Ads",
            selFn: this._renderAdsRealtor,
            selOpt: [ {
                value: "room",
                label: "Share Room",
                title: "Select State",
                selFn: this._renderAdsRealtor,
                selOpt: this._locMenu
            }, {
                value: "doctor",
                label: "Doctor/Dentist/Pharmacy",
                tags : [ "doctor", "ba", "hospital", "dentist", "pharma" ],
                title: "Select State",
                selFn: function(opt) {
                    return <h1>Doctor</h1>;
                },
                selOpt: this._locMenu
            }, {
                value: "realtor",
                label: "Realtor & Renting",
                tags : [ "real", "renting" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            }, {
                value: "house",
                label: "Housing Contractor/Plumber",
                tags : [ "contractor", "housing", "paniting", "plumber" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            }, {
                value: "tutor",
                label: "Tutoring",
                tags : [ "tutor", "day", "hoc" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            }, {
                value: "loan",
                label: "Loan/Tax",
                tags : [ "loan", "tax", "refi" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            }, {
                value: "food",
                label: "Food Ordering",
                tags : [ "food", "cartering", "com" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            }, {
                value: "car",
                label: "Automobile",
                tags : [ "car", "xe" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            }, {
                value: "legal",
                label: "Legal",
                tags : [ "legal", "lua", "attoney" ],
                title: "Select State",
                selFn: this._renderTag,
                selOpt: this._locMenu
            } ]
        };
        this._filterTag = new TagsFilter(this._adsMenu);
        ArticleTagStore.getFilterTag("ads", this._filterTag.filterTagBuckets);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateArtTagsState);
        this.unsubAds = AdPropertyStore.listen(this._updateFeatureAds);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsubAds();
            this.unsub = null;
            this.unsubAds = null;
        }
    }

    _updateFeatureAds() {
        this.setState({
            adsMenu: AdPropertyStore.getAdsFeatures()
        });
    }

    _updateArtTagsState() {
        ArticleTagStore.getFilterTag("ads", this._filterTag.filterTagBuckets);
    }

    _renderTag(entry, args, active) {
        let tags = this._filterTag.lookupTag(entry);

        return (
            <div className="padding-top-10">
                <div className="row">
                    <div className="panel-body">
                        <AdsTableListing tagList={tags} detail={true}/>
                    </div>
                </div>
            </div>
        ); 
    }

    _renderAdsRealtor(entry, args, active) {
        let selected = this._filterTag.lookupSelection(args);
        console.log("Selected entry");
        console.log(selected);
        return (
            <div className="padding-top-10">
                <AdsRealtor location={entry}/>
            </div>
        );
    }

    render() {
        return (
            <SelectComp id="feature-ads" selectOpt={this._adsMenu}/>
        );
    }
}

FeatureAds.propTypes = {
};

export default FeatureAds;
export { AdsCategory, FeatureAds }
