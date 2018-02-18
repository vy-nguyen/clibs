/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';
import Spinner            from 'react-spinjs';

import SelectComp         from 'vntd-shared/component/SelectComp.jsx';
import BrowseSelection    from 'vntd-shared/layout/BrowseSelection.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import AdPropertyStore    from 'vntd-root/stores/AdPropertyStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';
import AdsRealtor         from './AdsRealtor.jsx';
import AdsBusMap          from './AdsBusMap.jsx';

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
        return this.tagMap[entry.value.toUpperCase()];
    }

    lookupSelection(selected) {
        let prev, curr;

        prev = null;
        curr = this.selOpt;
        for (let i = 0; i < selected.length; i++) {
            prev = curr;
            curr = SelectComp.findEntry(curr, selected[i]);
            if (curr == null) {
                return prev;
            }
        }
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
        this._updateArtTagsState();
        return this;
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
        let curr = this.state.adsMenu, menu = AdPropertyStore.getAdsFeatures();

        this.setState({
            adsMenu: menu
        });
        if (menu != curr) {
            _.forEach(menu.selOpt, function(entry) {
                if (entry.zoom == null) {
                    entry.zoom = 11;
                }
                if (entry.tags == null) {
                    entry.selFn = this._renderAdsRealtor;
                } else {
                    entry.selFn = this._renderTag;
                }
            }.bind(this));
        }
        if (this._filterTag == null) {
            this._updateArtTagsState();
        }
    }

    _updateArtTagsState() {
        let adsMenu = this.state.adsMenu;

        if (adsMenu != null) {
            if (this._filterTag == null) {
                this._filterTag = new TagsFilter(adsMenu);
            }
            ArticleTagStore.getFilterTag("ads", this._filterTag.filterTagBuckets);
        }
    }

    _lookupSelected(args) {
        let selected = this._filterTag.lookupSelection(args);
        return {
            lat : selected.lat,
            lng : selected.lng,
            zoom: selected.zoom || 11,
            selected: selected
        };
    }

    _renderTag(entry, args, active) {
        if (this._filterTag == null) {
            return null;
        }
        let tags = this._filterTag.lookupTag(entry), pos = this._lookupSelected(args);

        return (
            <div className="padding-top-10">
                <AdsBusMap tagList={tags} center={pos} location={pos.selected}/>
            </div>
        );
        /*
        return (
            <div className="padding-top-10">
                <div className="row">
                    <div className="panel-body">
                        <AdsTableListing tagList={tags} detail={true}/>
                    </div>
                </div>
            </div>
        ); 
        */
    }

    _renderAdsRealtor(entry, args, active) {
        if (this._filterTag == null) {
            return null;
        }
        let pos = this._lookupSelected(args);

        return (
            <div className="padding-top-10">
                <AdsRealtor center={pos} location={pos.selected}/>
            </div>
        );
    }

    render() {
        let adsMenu = this.state.adsMenu;

        if (adsMenu == null) {
            return null;
        }
        return (
            <SelectComp id="feature-ads" selectOpt={adsMenu}/>
        );
    }
}

FeatureAds.propTypes = {
};

export default FeatureAds;
export { AdsCategory, FeatureAds }
