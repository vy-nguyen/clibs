/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import {SelectWrap}        from 'vntd-shared/forms/commons/GenericForm.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import {ColFmtMap}         from 'vntd-root/config/constants.js';
import Mesg                from 'vntd-root/components/Mesg.jsx';

class SelectComp extends React.Component
{
    constructor(props) {
        let selectKeys = [], select = props.selectOpt;

        super(props);
        select.formEntry = this._creatSelForm(select);
        this.selDepth    = this._buildSelectForms(select, 1, 1);
        this._selectCall = this._selectCall.bind(this);

        let selKey = this._getSelectKeys(select, selectKeys, null, null, null);
        this.state = {
            activeKey : selKey,
            selectKeys: selectKeys
        };
    }

    _getSelectKeys(select, selectKeys, preKeys, selected, selectedVal) {
        let entry, selKey, chosen, nextSel;

        selKey = select.value;
        for (let i = 0; select != null; i++) {
            if (select.selOpt != null) {
                selKey  = select.value;
                nextSel = select.selOpt;
                selectKeys.push(selKey);

                if (preKeys != null && preKeys[i + 1] != null) {
                    chosen = preKeys[i + 1];
                } else {
                    chosen = null;
                }
                // Locate the maching selected entry instead of the default@0
                //
                for (let j = 0; j < nextSel.length; j++) {
                    entry = nextSel[j];
                    if (selected != null && selected.owner === select) {
                        selectKeys.push(selectedVal);
                        return selectedVal;
                    }
                    if (chosen == null || entry.value === chosen) {
                        select = entry;
                        break;
                    }
                }
            } else {
                selectKeys.push(select.value);
                select = null;
            }
        }
        return selKey;
    }

    _buildSelectForms(select, depth, maxDepth) {
        let key, selectVal, formEntry;

        _.forEach(select.selOpt, function(entry) {
            if (entry.selOpt != null) {
                maxDepth = this._buildSelectForms(entry, depth + 1, maxDepth);
            }
            if (entry.selOpt != null) {
                entry.formEntry = this._creatSelForm(entry);
            }
        }.bind(this));

        depth++;
        if (depth > maxDepth) {
            return depth;
        }
        return maxDepth;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _selectCall(entry, value) {
        let activeKey, selectKeys = [],
            selected = this.state.selectKeys, select = this.props.selectOpt;

        activeKey = this._getSelectKeys(select, selectKeys, selected, entry, value);
        this.setState({
            activeKey : activeKey,
            selectKeys: selectKeys
        });
    }

    _creatSelForm(entry) {
        return {
            select   : true,
            owner    : entry,
            field    : 'sel-comp',
            inpName  : entry.value,
            selectOpt: entry.selOpt,
            labelTxt : entry.label
        };
    }

    static findEntry(select, key) {
        if (select.value === key) {
            return select;
        }
        if (select.selOpt == null) {
            return null;
        }
        let selOpt = select.selOpt;
        for (let i = 0; i < selOpt.length; i++) {
            if (selOpt[i].value === key) {
                return selOpt[i];
            }
        }
        return null;
    }

    _getActiveKey(entry, selectKeys, curIdx) {
        curIdx++;
        if (curIdx < selectKeys.length) {
            return selectKeys[curIdx];
        }
        if (entry && entry.selOpt) {
            return entry.selOpt[0].value;
        }
        return null;
    }

    _renderForm(query) {
        let selectKeys = this.state.selectKeys, active = [],
            select = this.props.selectOpt, entry, actLen, curKey,
            cols = parseInt(12 / this.selDepth);
        
        if (cols < 2) {
            cols = 2;
        }
        for (let i = 0; select != null; i++) {
            if (i < selectKeys.length) {
                entry = SelectComp.findEntry(select, selectKeys[i]);
            } else {
                entry = null;
            }
            if (entry == null && select.selOpt != null) {
                entry  = select.selOpt[0];
            }
            select = entry;
            curKey = this._getActiveKey(entry, selectKeys, i);

            if (entry != null) {
                active.push(entry);
                if (entry.formEntry != null) {
                    query.push(
                        <div className={ColFmtMap[cols]} key={_.uniqueId()}>
                            <SelectWrap entry={entry.formEntry} value={curKey}
                                title={entry.title} onSelected={this._selectCall}/>
                        </div>
                    );
                }
            }
        }
        actLen = active.length - 1;
        for (let i = actLen; i >= 0; i--) {
            entry = active[i];
            if (entry.selFn != null) {
                return entry.selFn(entry, selectKeys, active[actLen].value);
            }
        }
        return null;
    }

    render() {
        let query = [], id = this.props.id || _.uniqueId('selc-'),
            out = this._renderForm(query);

        return (
            <div className="row">
                <div className={ColFmtMap[0]}>
                    <div className="row">
                        {query}
                    </div>
                </div>
                <div className={ColFmtMap[0]}>
                    {out}
                </div>
            </div>
        );
    }
}

SelectComp.propTypes = {
    id       : PropTypes.string,
    selectOpt: PropTypes.object
};

export default SelectComp;
