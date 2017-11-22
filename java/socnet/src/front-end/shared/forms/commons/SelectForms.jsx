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

export class SelectSubForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
    }

    validateInput(data, errFlags) {
        errFlags.errText = null;
        return data;
    }
}

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
            <ProcessForm form={opt.formObj}
                value={opt.defVal} store={opt.store} onBlur={this._onBlur}/>
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
        console.log("base validate data");
        console.log(this);
        _.forEach(this.props.selection.selOpt, function(opt) {
            if (opt.selected === true) {
                let sub, err = {};

                sub = opt.formObj.getAndValidateForm(err);
                InputStore.storeItemIndex(this.inpName, sub, true);

                data[this.props.inpName] = sub;
                return false;
            }
            return true;
        }.bind(this));

        errFlags.errText = null;
        console.log(data);
        return data;
    }

    render() {
        return <SelectFormRender {...this.props}/>;
    }
}

export default SelectForms;
