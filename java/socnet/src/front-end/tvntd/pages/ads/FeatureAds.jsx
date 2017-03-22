/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import BrowseSelection    from 'vntd-shared/layout/BrowseSelection.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';

const sample = [
    { value: "abc",    label: "abc" },
    { value: "def",    label: "def" },
    { value: "img",    label: "img" },
    { value: "dws",    label: "dws" },
];

function filterTagBuckets(tags)
{
    let index, letter, out = [], first = 65, last = 90;

    _.forEach(tags, function(tag) {
        if (tag.tagName != null) {
            letter = tag.tagName.charCodeAt(0);
            if (letter > last) {
                letter = letter - 32;
            }
            if (first <= letter <= last) {
                index = letter - first;
                if (out[index] == null) {
                    out[index] = [];
                }
                out[index].push(tag);
            }
        }
    });
    return out;
}

class FeatureAds extends React.Component
{
    constructor(props) {
        let index;

        super(props);
        this._onSelected    = this._onSelected.bind(this);
        this._updateArtTags = this._updateArtTags.bind(this);

        this.browse = [
            { label: "A-M", entry: {} },
            { label: "M-Z", entry: {} },

            { label: "Tutoring",     entry: {} },
            { label: "Doctor",       entry: {} },
            { label: "Dentist",      entry: {} },
            { label: "Pharmacy",     entry: {} },
            { label: "Real Estates", entry: {} },
            { label: "Legal",        entry: {} },
            { label: "Loan/Tax",     entry: {} },
            { label: "Insurance",    entry: {} },
            { label: "Food",         entry: {} },
            { label: "Home",         entry: {} },
            { label: "Car",          entry: {} }
        ];
        index = 0;
        _.forEach(this.browse, function(it) {
            it.entry = {
                index    : index++,
                select   : true,
                inpName  : 'ads-' + index,
                inpDefVal: null,
                selectOpt: null,
                onSelect : this._onSelected
            };
        }.bind(this));

        this.state = {
            currentTag: this._updateArtTags()
        };
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateArtTags);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateArtTags() {
    }

    _onSelected(entry, val) {
        console.log("select entry " + entry.index + " val " + val);
        console.log(val);
        this.setState({
            currentTag: val
        });
    }

    _renderTagAds(tagName) {
        let tag = ArticleTagStore.getTagByName(tagName);

        if (tag == null) {
            return null;
        }
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <ArticleTagBrief tag={tag}/>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="padding-top-10">
                <BrowseSelection labels={this.browse}/>
                <div className="row">
                    {this._renderTagAds(this.state.currentTag)}
                </div>
            </div>
        );
    }
}

FeatureAds.propTypes = {
};

export default FeatureAds;
