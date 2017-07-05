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
import {AdsCategory}      from './FeatureAds.jsx';

class YellowPage extends React.Component
{
    constructor(props) {
        super(props);
        this._clickLabel    = this._clickLabel.bind(this);
        this._onSelected    = this._onSelected.bind(this);
        this._updateArtTags = this._updateArtTags.bind(this);

        this.browse = [
            { label: "A", start: 'A', end: 'A', exact: false, entry: {} },
            { label: "B", start: 'B', end: 'B', exact: false, entry: {} },
            { label: "C", start: 'C', end: 'C', exact: false, entry: {} },
            { label: "D", start: 'D', end: 'D', exact: false, entry: {} },
            { label: "E", start: 'E', end: 'E', exact: false, entry: {} },
            { label: "F", start: 'F', end: 'F', exact: false, entry: {} },
            { label: "G", start: 'G', end: 'G', exact: false, entry: {} },
            { label: "H", start: 'H', end: 'H', exact: false, entry: {} },
            { label: "I", start: 'I', end: 'I', exact: false, entry: {} },
            { label: "J", start: 'J', end: 'J', exact: false, entry: {} },
            { label: "K", start: 'K', end: 'K', exact: false, entry: {} },
            { label: "L", start: 'L', end: 'L', exact: false, entry: {} },
            { label: "M", start: 'M', end: 'M', exact: false, entry: {} },
            { label: "N", start: 'N', end: 'N', exact: false, entry: {} },
            { label: "O", start: 'O', end: 'O', exact: false, entry: {} },
            { label: "P", start: 'P', end: 'P', exact: false, entry: {} },
            { label: "Q", start: 'Q', end: 'Q', exact: false, entry: {} },
            { label: "R", start: 'R', end: 'R', exact: false, entry: {} },
            { label: "S", start: 'S', end: 'S', exact: false, entry: {} },
            { label: "T", start: 'T', end: 'T', exact: false, entry: {} },
            { label: "U", start: 'U', end: 'U', exact: false, entry: {} },
            { label: "V", start: 'V', end: 'V', exact: false, entry: {} },
            { label: "W", start: 'W', end: 'W', exact: false, entry: {} },
            { label: "X", start: 'X', end: 'X', exact: false, entry: {} },
            { label: "Y", start: 'Y', end: 'Y', exact: false, entry: {} },
            { label: "Z", start: 'Z', end: 'Z', exact: false, entry: {} }
        ];
        this._adFilter = new AdsCategory(this.browse, "yp-", this._onSelected);
        this.state = {
            currentTag: null
        };
    }

    componentWillMount() {
        this.setState({
            currentTag: this._updateArtTags()
        });
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
        let label, select, defTag = [],
            tags = ArticleTagStore.getFilterTag("ads", this._adFilter.filterTagBuckets);

        _.forEach(tags, function(item, key) {
            label  = this.browse[parseInt(key)];
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
            this.setState({
                currentTag: [val]
            });
        }
    }

    _clickLabel(label, entry) {
        let currTag = [];
        _.forEach(entry.selectOpt, function(item) {
            currTag.push(item.value);
        });
        this.setState({
            currentTag: currTag
        });
    }

    render() {
        return YellowPage.renderAds(this.browse,
                                    this.state.currentTag, this._clickLabel);
    }

    static renderAds(browse, currentTag, onClickFn) {
        let search = ArticleTagStore.getAllPublicTagsString(false, "ads"),
            searchHolder = "Category Search";

        return (
            <div className="padding-top-10">
                <BrowseSelection labels={browse} onClick={onClickFn}
                    searchItems={search} searchHolder={searchHolder}/>

                <div className="row">
                    <div className="panel-body">
                        <AdsTableListing tagList={currentTag}/>
                    </div>
                </div>
            </div>
        );
    }
}

YellowPage.propTypes = {
};

export default YellowPage;
