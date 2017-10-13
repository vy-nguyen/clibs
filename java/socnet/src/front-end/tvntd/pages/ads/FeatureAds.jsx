/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

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
        this._onSelected    = this._onSelected.bind(this);
        this._clickLabel    = this._clickLabel.bind(this);
        this._updateArtTags = this._updateArtTags.bind(this);
        this._updateArtTagsState = this._updateArtTagsState.bind(this);

        this._browse = [
        {
            label: "Share Room",
            start: 'S',
            exact: true,
            apps : <AdsRealtor/>,
            entry: {}
        },
        {
            label: "A-N",
            start: 'A',
            end  : 'N',
            exact: false,
            entry: {}
        }, {
            label: "M-Z",
            start: 'N',
            end  : 'Z',
            exact: false,
            entry: {}
        }, {
            label: "Tutoring",
            start: 'T',
            exact: true,
            entry: {}
        }, {
            label: "Doctor",
            start: 'D',
            exact: true,
            entry: {},
            alias: [
                "Doctors"
            ]
        }, {
            label: "Dentist",
            start: 'D',
            exact: true,
            entry: {}
        }, {
            label: "Pharmacy",
            start: 'P',
            exact: true,
            entry: {}
        }, {
            label: "Real Estates",
            start: 'R',
            exact: true,
            entry: {},
            alias: [
                "Realtor"
            ]
        }, {
            label: "Legal",
            start: 'L',
            exact: true,
            entry: {}
        }, {
            label: "Loan/Tax",
            start: 'L',
            exact: true,
            entry: {}
        }, {
            label: "Insurance",
            start: 'I',
            exact: true,
            entry: {}
        }, {
            label: "Food",
            start: 'F',
            exact: true,
            entry: {}
        }, {
            label: "Home",
            start: 'H',
            exact: true,
            entry: {}
        }, {
            label: "Car",
            start: 'C',
            exact: true,
            entry: {},
            alias: [
                "Automobile"
            ]
        } ];
        this._adFilter = new AdsCategory(this._browse, "fea-ads-", this._onSelected);
        this.state = {
            currLabel : this._browse[0],
            currentTag: null
        };
    }

    componentWillMount() {
        this.setState({
            currentTag: this._updateArtTags()
        });
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
        this.setState({
            currentTag: this._updateArtTags()
        });
    }

    _updateArtTags() {
        let label, select, defTag = [],
            tags = ArticleTagStore.getFilterTag("ads", this._adFilter.filterTagBuckets);

        _.forEach(tags, function(item, key) {
            label  = this._browse[key];
            select = [];
            _.forEach(item, function(tag) {
                defTag.push(tag.tagName);
                select.push({
                    label: tag.tagName,
                    value: tag.tagName
                });
            });
            label.entry.selectOpt = select;
        }.bind(this));
        return defTag;
    }

    _onSelected(entry, val) {
        if (val != null) {
            console.log("current tag " + val);
            console.log(entry);
            this.setState({
                currentTag: val
            });
        }
    }

    _clickLabel(label, entry) {
        let currTag = [];

        _.forEach(entry.selectOpt, function(item) {
            currTag.push(item.value);
        });
        this.setState({
            currLabel : label,
            currentTag: currTag
        });
    }

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
}

FeatureAds.propTypes = {
};

export default FeatureAds;
export { AdsCategory, FeatureAds }
