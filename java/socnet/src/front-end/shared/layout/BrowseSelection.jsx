/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import {
    SelectWrap, TAWrap
} from 'vntd-shared/forms/commons/GenericForm.jsx';

class BrowseSelection extends React.Component
{
    constructor(props) {
        super(props);
        this._onSearch   = this._onSearch.bind(this);
        this._onSelected = this._onSelected.bind(this);
    }

    _onSearch() {
    }

    _onSelected(entry, val) {
        console.log("on selected " + entry.inpName + " " + val);
    }

    render() {
        let search = {
            taOptions : [ "abc", "def", "hef" ],
            maxVisible: 100,
            inpHolder : "abc",
            onSelect  : this._onSelected
        },
        inpLabels, entry, labels = [];

        inpLabels = this.props.labels;
        entry = inpLabels[0].entry;

        _.forEach(inpLabels, function(item) {
            labels.push(
                <li key={_.uniqueId('label-')}>
                    <h3>
                        <span className="label label-primary">{item.label}</span>
                    </h3>
                </li>
            );
        });
        return (
            <div className="container">
                <div className="row">
                    <ul className="list-inline">{labels}</ul>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <SelectWrap entry={entry}/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <div className="input-group">
                            <TAWrap entry={search}
                                taFormat={{input: 'form-control input-md'}}/>
                            <span className="input-group-btn">
                                <button className="btn btn-secondary"
                                    onClick={this._onSearch}>
                                    <i className="fa fa-search"/>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

BrowseSelection.propTypes = {
};

export default BrowseSelection;
