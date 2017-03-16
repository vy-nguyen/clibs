/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import BrowseSelection    from 'vntd-shared/layout/BrowseSelection.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';

const sample = [
    { value: "abc",    label: "abc" },
    { value: "def",    label: "def" },
    { value: "img",    label: "img" },
    { value: "dws",    label: "dws" },
];

class YellowPage extends React.Component
{
    constructor(props) {
        let index, entry;

        super(props);
        this._onSelected = this._onSelected.bind(this);
        this.browse = [
            { label: "A", entry: {} },
            { label: "B", entry: {} },
            { label: "C", entry: {} },
            { label: "D", entry: {} },
            { label: "E", entry: {} },
            { label: "F", entry: {} },
            { label: "G", entry: {} },
            { label: "H", entry: {} },
            { label: "I", entry: {} },
            { label: "J", entry: {} },
            { label: "K", entry: {} },
            { label: "L", entry: {} },
            { label: "M", entry: {} },
            { label: "N", entry: {} },
            { label: "O", entry: {} },
            { label: "P", entry: {} },
            { label: "Q", entry: {} },
            { label: "R", entry: {} },
            { label: "S", entry: {} },
            { label: "T", entry: {} },
            { label: "U", entry: {} },
            { label: "V", entry: {} },
            { label: "W", entry: {} },
            { label: "X", entry: {} },
            { label: "Y", entry: {} },
            { label: "Z", entry: {} }
        ];
        index = 0;
        _.forEach(this.browse, function(it) {
            entry           = it.entry;
            entry.index     = index++;
            entry.select    = true;
            entry.inpName   = 'yp-' + index;
            entry.inpDefVal = null;
            entry.selectOpt = sample;
            entry.onSelect  = this._onSelected;
        }.bind(this));
    }

    _onSelected(entry, val) {
    }

    render() {
        return (
            <BrowseSelection labels={this.browse}/>
        );
    }
}

YellowPage.propTypes = {
};

export default YellowPage;
