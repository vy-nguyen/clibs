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

import {EditorEntry}     from 'vntd-shared/forms/editors/Editor.jsx';
import ErrorView         from 'vntd-shared/layout/ErrorView.jsx';
import NestableStore     from 'vntd-shared/stores/NestableStore.jsx';

class SelectWrap extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            value: props.entry.inpHolder
        };
    }

    _defOnSelect(entry, val) {
        let onSelected = this.props.onSelected;
        if (onSelected != null) {
            onSelected(entry, val);
        }
        entry.taValue   = val.value;
        entry.inpHolder = val.value;
        this.setState({
            value: val.value
        });
    }

    render() {
        let entry = this.props.entry;
        return (
            <Select options={entry.selectOpt} name={entry.inpName} value={this.state.value}
                onChange={this._defOnSelect.bind(this, entry)}
            />
        );
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
        let dataRefs = {};
        let entries = this.props.form.formEntries;

        event.preventDefault();
        _.forEach(entries, function(section) {
            _.forEach(section.entries, function(item) {
                if (item.typeAhead === true || item.select === true) {
                    dataRefs[item.inpName] = item.taValue;
                } else {
                    dataRefs[item.inpName] = this.refs[item.inpName].value;
                }
            }.bind(this));
        }.bind(this));
        button.onClick(dataRefs, button);
    }

    static _defOnSelect(entry, val) {
        entry.taValue = val;
    }

    static _defOnBlur(entry, val) {
        entry.taValue = val.target.value;
    }

    static renderTypeAhead(entry, bind, onBlur, onSelected) {
        return (
            <TA.Typeahead options={entry.taOptions} maxVisible={entry.maxVisible ? entry.maxVisible : 6}
                placeholder={entry.inpHolder} value={entry.inpHolder}
                customClasses={{input: 'form-control input-sm'}}
                onBlur={onBlur != null ? onBlur.bind(bind, entry) : GenericForm._defOnBlur.bind(this, entry)}
                onOptionSelected={onSelected != null ?
                    onSelected.bind(bind, entry) : GenericForm._defOnSelect.bind(this, entry)}
            />
        );
    }

    static renderInput(entry, bind, onBlur, onSelected) {
        if (entry.typeAhead === true) {
            return GenericForm.renderTypeAhead(entry, bind, onBlur, onSelected);
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
            return GenericForm.renderDropzone(entry, eventHandlers);
        }
        if (entry.editor === true) {
            return (
                <EditorEntry id={entry.id} entry={entry}/>
            );
        }
        return  (
            <input type="text" className="form-control" onBlur={onBlur}
                ref={entry.inpName} defaultValue={entry.inpDefVal} placeholder={entry.inpHolder}/>
        );
    }

    static getDjsConfig() {
        const token  = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");
        return {
            addRemoveLinks: true,
            acceptedFiles : "image/*",
            params : {},
            headers: {
                [header]: token
            }
        };
    }

    static renderDropzone(entry, eventHandlers) {
        const djsConfig = GenericForm.getDjsConfig();
        const componentConfig = {
            iconFiletypes   : ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl         : entry.url != null ? entry.url : '/user/upload-img'
        };
        const id = entry.djsId != null ? entry.djsId : _.uniqueId('dropzone-');
        return (
            <DropzoneComponent className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                id={id} dictDefaultMessage={entry.defaultMesg}
                config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}
            />
        );
    }

    static renderInputBox(entry, bind, onBlur, onSelected) {
        let labelFmt = entry.labelFmt != null ? entry.labelFmt : "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2";
        let inputFmt = entry.inputFmt != null ?
            entry.inputFmt : "control-label col-xs-10 col-sm-10 col-md-10 col-lg-10";
        let style = entry.errorFlag == true ? { color:'red' } : null;
        let label = <label className={labelFmt} style={style} for="textinput">{entry.labelTxt}</label>;

        return (
            <div className="row" key={_.uniqueId('gen-inp-')}>
                <div className="form-group">
                    {label}
                    <div className={inputFmt}>
                        {GenericForm.renderInput(entry, bind, onBlur, onSelected)}
                        <ErrorView mesg={true} errorId={entry.errorId}/>
                    </div>
                </div>
            </div>
        );
    }

    static renderInputInline(entry, bind, onBlur, onSelected) {
        let labelFmt = entry.labelFmt != null ? entry.labelFmt : "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2";
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
                            {GenericForm.renderInput(entry, bind, onBlur, onSelected)}
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
                        className={item.btnFormat} onClick={this._btnClick.bind(this, item)}>
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
            let renderFn = item.inline !== true ? GenericForm.renderInputBox : GenericForm.renderInputInline;
            let entries = item.entries.map(function(entry) {
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
            <form className={form.formFmt} encType="multipart/form-data" acceptCharset="utf-8">
                {form.hiddenHead}
                {formEntries}
                {formButtons}
            </form>
        );
    }
}

export { SelectWrap, GenericForm };
export default GenericForm;
