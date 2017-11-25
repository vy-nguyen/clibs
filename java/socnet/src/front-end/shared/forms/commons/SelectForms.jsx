/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import InputStore          from 'vntd-shared/stores/NestableStore.jsx';
import SelectComp          from 'vntd-shared/component/SelectComp.jsx'; 
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

export class SelectFormRender extends React.Component
{
    constructor(props) {
        super(props);
        this._selChoice = this._selChoice.bind(this);
        this.initForms(props);
    }

    initForms(props) {
        _.forEach(props.selection.selOpt, function(opt) {
            opt.selFn = this._selChoice.bind(this, opt);
        }.bind(this));
    }

    _selChoice(opt) {
        _.forEach(this.props.selection.selOpt, function(entry) {
            entry.selected = false;
        });
        opt.selected = true;

        return (
            <ProcessForm form={opt.formObj} value={opt.defVal} store={opt.store}/>
        );
    }

    render() {
        return (
            <SelectComp id={this.props.inpName || "sel-form"}
                selectOpt={this.props.selection}/>
        );
    }
}

export class SelectForms
{
    constructor(inpName, suffix, selection) {
        this.props = {
            inpName  : inpName,
            suffix   : suffix,
            selection: selection
        };
        _.forEach(selection.selOpt, function(opt) {
            opt.formObj = new opt.form(null, suffix);
            if (this.inpName == null) {
                this.inpName = opt.formObj._getId(inpName);
            }
        }.bind(this));
        this.validateInput = this.validateInput.bind(this);
    }

    validateInput(data, errFlags) {
        _.forEach(this.props.selection.selOpt, function(opt) {
            if (opt.selected === true) {
                let sub, err = {}, key = this.props.inpName;

                sub = opt.formObj.getAndValidateForm(err);
                if (!_.isEmpty(err)) {
                    opt.formObj.setErrors(err, true);
                    _.merge(errFlags, err);
                } else {
                    InputStore.storeItemIndex(this.inpName, sub, true);
                    if (errFlags[key] === true) {
                        errFlags[key] = null;
                        errFlags.errText = null;
                    }
                }
                data[key] = sub;
                return false;
            }
            return true;
        }.bind(this));

        return data;
    }

    submitNotif(store, data, id, status) {
        _.forEach(this.props.selection.selOpt, function(opt) {
            if (opt.selected === true) {
                opt.formObj.submitNotif(store, data, id, status);
                return false;
            }
            return true;
        }.bind(this));
    }

    render() {
        return <SelectFormRender {...this.props}/>;
    }
}

export default SelectForms;
