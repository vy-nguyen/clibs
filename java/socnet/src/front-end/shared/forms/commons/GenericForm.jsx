/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import TA                from 'react-typeahead';
import Select            from 'react-select';
import DropzoneComponent from 'react-dropzone-component';

import Mesg              from 'vntd-root/components/Mesg.jsx';
import {EditorEntry}     from 'vntd-shared/forms/editors/Editor.jsx';
import ErrorView         from 'vntd-shared/layout/ErrorView.jsx';
import InputStore        from 'vntd-shared/stores/NestableStore.jsx';

class SelectWrap extends React.Component
{
    constructor(props) {
        let val, entry = props.entry;

        super(props);
        if (entry.inpHolder != null) {
            val = InputStore.storeItemIndex(entry.inpName, entry.inpHolder);
        } else {
            val = null;
        }
        this.state = {
            value: val
        };
    }

    _defOnSelect(entry, val) {
        let onSelected = this.props.onSelected;

        entry.inpHolder = val.value;
        InputStore.storeItemIndex(this.props.entry.inpName, val.value, true);
        this.setState({
            value: val.value
        });
        if (onSelected != null) {
            onSelected(entry, val);
        }
    }

    render() {
        let entry = this.props.entry;
        return (
            <Select options={entry.selectOpt}
                name={entry.inpName} value={this.state.value}
                onChange={this._defOnSelect.bind(this, entry)}
            />
        );
    }
}

function htmlCheckBox(entry)
{
    let opt = [
        '<input type="checkbox" value="' + entry.inpHolder +
        '" id="' + entry.inpName + '"' +
        (entry.checked === true ? ' checked="checked">' : '>')
    ];
    if (entry.labelText != null) {
        opt.push('<label for="' + entry.inpName + '">' + entry.labelText + '</label>');
    }
    return opt.join('\n');
}

function htmlSelect(entry)
{
    let opt = [
        '<select id="' + entry.inpName + '">'
    ];

    if (entry.selectOpt != null) {
        if (_.isEmpty(entry.inpDefVal)) {
            opt.push('<option value="">-none-');
        }
        _.forEach(entry.selectOpt, function(elm) {
            if (elm.value === entry.inpDefVal) {
                opt.push('<option selected value="' + elm.value + '">' + elm.label);
            } else {
                opt.push('<option value="' + elm.value + '">' + elm.label);
            }
        });
    }
    opt.push('</select>');
    return opt.join('\n');
}

class TAWrap extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            value: InputStore.getItemIndex(props.entry.inpName)
        };
        this._defOnBlur   = this._defOnBlur.bind(this);
        this._defOnSelect = this._defOnSelect.bind(this);
    }

    _defOnSelect(val) {
        let entry = this.props.entry;

        InputStore.storeItemIndex(entry.inpName, val, true);
        if (entry.onSelect != null) {
            entry.onSelect(val);
        }
        this.setState({
            value: val
        });
    }

    _defOnBlur(val) {
        this._defOnSelect(val.target.value);
    }

    render() {
        let entry = this.props.entry, fmt;
        fmt = this.props.taFormat != null ? this.props.taFormat : {
            input: 'form-control input-sm'
        };
        return (
            <TA.Typeahead options={entry.taOptions}
                maxVisible={entry.maxVisible ? entry.maxVisible : 6}
                placeholder={entry.inpHolder} value={this.state.value} customClasses={fmt}
                onBlur={this._defOnBlur} onOptionSelected={this._defOnSelect}/>
        );
    }
}

function htmlInput(entry)
{
    return '<input id="' + entry.inpName +
        '" type="text" class="form-control" value="' + entry.inpDefVal +
        '" placeholder="' + entry.inpHolder + '">';
}

function renderHtmlInput(entry)
{
    if (entry.typeAhead === true) {
        return "";
    }
    if (entry.select === true) {
        return htmlSelect(entry);
    }
    if (entry.checked != null) {
        return htmlCheckBox(entry);
    }
    return htmlInput(entry);
}

function cloneInputEntry(entry, base)
{
    return {
        inpHolder: entry.inpHolder,
        inpDefVal: entry.inpDefVal,
        inpName  : _.uniqueId(base),
        select   : entry.select,
        selectOpt: entry.selectOpt
    };
}

class InputWrap extends React.Component
{
    constructor(props) {
        super(props);
        this._onBlur = this._onBlur.bind(this);
    }

    _onBlur(event) {
        let val, { entry, onBlur } = this.props;

        val = this.refs[entry.inpName].value;
        InputStore.storeItemIndex(entry.inpName, val, true);
        if (onBlur != null) {
            onBlur(entry, val);
        }
    }

    render() {
        let { entry, bind, onBlur, onSelected } = this.props;

        if (entry.typeAhead === true) {
            return <TAWrap entry={entry}/>
        }
        if (entry.select === true) {
            return <SelectWrap entry={entry} bind={bind} onSelected={onSelected}/>
        }
        if (entry.dropzone === true) {
            const eventHandlers = {
                complete: entry.dzComplete,
                success : entry.dzSuccess,
                sending : entry.dzSending,
                error   : entry.dzError,
                init    : function(dz) {
                    if (entry.bind != null) {
                        entry.bind.dropzone = dz;
                    } else {
                        entry.dropzone = dz;
                    }
                }
            };
            return <DropZoneWrap entry={entry} eventHandlers={eventHandlers}/>
        }
        if (entry.editor === true) {
            return (
                <EditorEntry id={entry.id} entry={entry}/>
            );
        }
        if (entry.button != null) {
            return (
                <div className={"input-group " + entry.inpClass}>
                    <input id={entry.inpName} type="text" className="form-control"
                        onBlur={this._onBlur} ref={entry.inpName}
                        defaultValue={entry.inpDefVal} placeholder={entry.inpHolder}
                    />
                    <span className="input-group-btn">
                        <button className="btn btn-primary" onClick={entry.btnClick}>
                            <Mesg text={entry.button}/>
                        </button>
                        {entry.inlineButtons}
                    </span>
                </div>
            );
        }
        return  (
            <input id={entry.inpName} type="text" className="form-control"
                onBlur={this._onBlur} ref={entry.inpName}
                defaultValue={entry.inpDefVal} placeholder={entry.inpHolder}/>
        );
    }
}

class DropZoneWrap extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let { entry, eventHandlers } = this.props;
        const djsConfig = GenericForm.getDjsConfig(),
        componentConfig = {
            iconFiletypes   : ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl         : entry.url != null ? entry.url : '/user/upload-img'
        },
        id = entry.djsId != null ? entry.djsId : _.uniqueId('dropzone-');

        return (
            <DropzoneComponent className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                id={id} dictDefaultMessage={entry.defaultMesg}
                config={componentConfig}
                eventHandlers={eventHandlers} djsConfig={djsConfig}
            />
        );
   }
}

class InputBox extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
    }
}

class InputInline extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
    }
}

/*
 * Form format:
 * formEntry {
 *     legend: "",
 *     entries: [
 *         labelFmt: "",
 *         labelTxt: "",
 *         inputFmt: "",
 *         inpName : "",
 *         inpHolder: ""
 *     ]
 * }
 * Form {
 *     formFmt: "",
 *     hiddenHead: "",
 *     hiddenTail: "",
 *     formEntries: []
 *     buttons: [ {
 *         btnFmt: "",
 *         btnText" "",
 *         onClick: function...
 *     } ]
 * }
 */
class GenericForm extends React.Component
{
    constructor(props) {
        super(props);
    }

    _btnClick(button, event) {
        let dataRefs = {},
            entries = this.props.form.formEntries;

        event.preventDefault();
        _.forEach(entries, function(section) {
            GenericForm.readContent(section.entries, dataRefs);
        });
        button.onClick(dataRefs, button);
    }

    static readContent(entries, dataRefs) {
        _.forEach(entries, function(item) {
            dataRefs[item.inpName] = InputStore.getItemIndex(item.inpName);
        });
        return dataRefs;
    }

    static getDjsConfig() {
        const token  = $("meta[name='_csrf']").attr("content"),
            header = $("meta[name='_csrf_header']").attr("content");

        return {
            addRemoveLinks: true,
            acceptedFiles : "image/*",
            params : {},
            headers: {
                [header]: token
            }
        };
    }

    static renderInputBox(entry, bind, onBlur, onSelected) {
        let labelFmt = entry.labelFmt != null ?
            entry.labelFmt : "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2",

        inputFmt = entry.inputFmt != null ?
            entry.inputFmt : "control-label col-xs-10 col-sm-10 col-md-10 col-lg-10",

        style = entry.errorFlag == true ? { color:'red' } : null,
        label = (
            <label className={labelFmt} style={style} for="textinput">
                {entry.labelTxt}
            </label>
        );

        return (
            <div className="row" key={_.uniqueId('gen-inp-')}>
                <div className="form-group">
                    {label}
                    <div className={inputFmt}>
                        <InputWrap entry={entry} bind={bind}
                            onBlur={onBlur} onSelected={onSelected}/>
                        <ErrorView mesg={true} errorId={entry.errorId}/>
                    </div>
                </div>
            </div>
        );
    }

    static renderInputInline(entry, bind, onBlur, onSelected) {
        let labelFmt = entry.labelFmt != null ?
            entry.labelFmt : "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2";

        let inputFmt = entry.inputFmt != null ?
            entry.inputFmt : "control-label col-xs-10 col-sm-10 col-md-10 col-lg-10";

        let style = entry.errorFlag == true ? { color:'red' } : null;

        return (
            <div className="inbox-info-bar no-padding" key={_.uniqueId('gen-inp-')}>
                <div className="row">
                    <div className="form-group">
                        <label className={labelFmt}>
                            <strong style={style}>{entry.labelTxt}</strong>
                        </label>
                        <div className={inputFmt}>
                            <InputWrap entry={entry} bind={bind}
                                onBlur={onBlur} onSelected={onSelected}/>
                            <ErrorView mesg={true} errorId={entry.errorId}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let form = this.props.form;
        let formButtons = null;

        if (form.buttons != null) {
            let buttons = form.buttons.map(function(item, idx) {
                return (
                    <button key={_.uniqueId('form-btn-')} type={"button"}
                        className={item.btnFormat}
                        onClick={this._btnClick.bind(this, item)}>
                        {item.btnText}
                    </button>
                );
            }.bind(this));

            formButtons = (
                <div className="row">
                    <div className="col-sm-offset-2 col-sm-10">
                        <div className="btn-group pull-right" role="group">
                            {buttons}
                        </div>
                    </div>
                </div>
            );
        }
        let formEntries = form.formEntries.map(function(item) {
            let renderFn = item.inline !== true ?
                GenericForm.renderInputBox : GenericForm.renderInputInline,
            entries = item.entries.map(function(entry) {
                return renderFn(entry);
            }.bind(this));

            return (
                <div key={_.uniqueId('form-fields')}>
                    {item.legend != null ? <legend>{item.legend}</legend> : null}
                    <fieldset>
                        {entries}
                    </fieldset>
                </div>
            );
        }.bind(this));

        return (
            <form className={form.formFmt}
                encType="multipart/form-data" acceptCharset="utf-8">
                {form.hiddenHead}
                {formEntries}
                {formButtons}
            </form>
        );
    }
}

export {
    SelectWrap, TAWrap, InputWrap, DropZoneWrap, InputBox, InputInline, GenericForm,
    renderHtmlInput, cloneInputEntry
};
export default GenericForm;
