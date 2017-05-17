/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';
import {
    SelectWrap, TAWrap
} from 'vntd-shared/forms/commons/GenericForm.jsx';

class BrowseSelection extends React.Component
{
    constructor(props) {
        let i, entry, labels = props.labels, len = labels.length;

        super(props);
        this._onSearch     = this._onSearch.bind(this);
        this._onSelected   = this._onSelected.bind(this);
        this._selectSearch = this._selectSearch.bind(this);

        for (i = 0; i < len; i++) {
            entry = labels[i].entry;
            this._setDefEntry(entry);

            if (entry.inpDefVal != null) {
                break;
            }
        }
        this.state = {
            select: entry
        };
    }

    getCurrEntry() {
        return this.state.entry;
    }

    _onSearch() {
    }

    _setDefEntry(entry) {
        if (!_.isEmpty(entry.selectOpt) && entry.inpDefVal == null) {
            entry.inpDefVal = entry.selectOpt[0].label;
        }
    }

    _clickLabel(label) {
        let entry = label.entry;

        this._setDefEntry(entry);
        entry.onSelect(entry, entry.inpDefVal);

        this.setState({
            select: entry
        });
        if (this.props.onClick != null) {
            this.props.onClick(label, entry);
        }
    }

    _onSelected(entry, val) {
        entry.inpDefVal = val;
        entry.onSelect(entry, val);
    }

    _selectSearch(val) {
    }

    render() {
        let search = {
            maxVisible: 100,
            taOptions : this.props.searchItems,
            inpHolder : this.props.searchHolder,
            inpDefVal : null,
            onSelect  : this._selectSearch
        },
        inpLabels, select = this.state.select, labels = [];

        inpLabels = this.props.labels;
        _.forEach(inpLabels, function(item) {
            let fmt = (select.inpDefVal === item.label) ?
                "btn btn-danger" : "btn btn-primary";

            labels.push(
                <button type="button" className={fmt} key={_.uniqueId('lbl-')}
                    onClick={this._clickLabel.bind(this, item)}>
                    <span>{item.label}</span>
                </button>
            );
        }.bind(this));

        return (
            <SparklineContainer>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="btn-group" role="group">
                            {labels}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <p></p>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <SelectWrap entry={select} value={select.inpDefVal}
                            onSelected={this._onSelected}/>
                    </div>
                    {/*
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
                    */}
                </div>
            </SparklineContainer>
        );
    }
};

BrowseSelection.propTypes = {
};

export default BrowseSelection;
