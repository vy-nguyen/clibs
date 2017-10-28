/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import SelectComp         from 'vntd-shared/component/SelectComp.jsx';
import BrowseSelection    from 'vntd-shared/layout/BrowseSelection.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
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

class FeatureAds extends React.Component
{
    constructor(props) {
        let index;

        super(props);
        this._updateArtTagsState = this._updateArtTagsState.bind(this);

        this.state = {
        };
        this._locMenu = [ {
            value: "CA",
            label: "California",
            title: "Select County",
            selFn: this._renderAdsRealtor,
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
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateArtTagsState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateArtTagsState() {
    }

    _renderTag(selected, arg) {
        console.log("----- render tag---");
        console.log(selected);
        console.log(arg);

        return (
            <div className="padding-top-10">
                <div className="row">
                    <div className="panel-body">
                        <AdsTableListing tagList={arg} detail={true}/>
                    </div>
                </div>
            </div>
        ); 
    }

    _renderAdsRealtor(selected, entry) {
        console.log("render ads realtor ");
        console.log(selected);
        console.log(entry);
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

        /*
    render() {
        let out, current = this.state.currentTag, label = this.state.currLabel;

        if (label.apps == null) {
            out = (
                <div className="row">
                    <div className="panel-body">
                        <AdsTableListing tagList={current} detail={true}/>
                    </div>
                </div>
            );
        } else {
            out = label.apps;
        }
        return (
            <div className="padding-top-10">
                <div className="row">
                    <BrowseSelection labels={this._browse} onClick={this._clickLabel}/>
                </div>
                {out}
            </div>
        );
    }
         */
}

FeatureAds.propTypes = {
};

export default FeatureAds;
export { AdsCategory, FeatureAds }
