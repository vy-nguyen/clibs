/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import $                 from 'jquery';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

import TA                from 'react-typeahead';
import Select            from 'react-select';
import DropzoneComponent from 'react-dropzone-component';

import Lang              from 'vntd-root/stores/LanguageStore.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import {EditorEntry}     from 'vntd-shared/forms/editors/Editor.jsx';
import StateButton       from 'vntd-shared/utils/StateButton.jsx';
import ErrorView         from 'vntd-shared/layout/ErrorView.jsx';
import InputStore        from 'vntd-shared/stores/NestableStore.jsx';
import ErrorStore        from 'vntd-shared/stores/ErrorStore.jsx';

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
            onSelected(entry, val.value);
        }
    }

    render() {
        let entry = this.props.entry, title = this.props.title, out,
            value = this.props.value != null ? this.props.value : this.state.value;

        out = (
            <Select options={entry.selectOpt}
                name={entry.inpName} value={value}
                onChange={this._defOnSelect.bind(this, entry)}
            />
        );
        if (title != null) {
            return (
                <div>
                    <b>{title}</b>
                    {out}
                </div>
            );
        }
        return out;
    }
}

SelectWrap.propTypes = {
    title : PropTypes.string,
    name  : PropTypes.string,
    value : PropTypes.string,
    entry : PropTypes.object.isRequired
};

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
        if (this.props.onBlur != null) {
            this.props.onBlur();
        }
    }

    render() {
        let entry = this.props.entry, fmt;
        fmt = this.props.taFormat != null ? this.props.taFormat : {
            input: 'form-control input-sm'
        };
        return (
            <TA.Typeahead options={entry.taOptions}
                maxVisible={entry.maxVisible ? entry.maxVisible : 6}
                placeholder={entry.inpHolder} value={this.state.value}
                customClasses={fmt}
                onBlur={this._defOnBlur} onOptionSelected={this._defOnSelect}/>
        );
    }
}

class InputWrap extends React.Component
{
    constructor(props) {
        super(props);
        this._onBlur   = this._onBlur.bind(this);
        this._onFocus  = this._onFocus.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentWillUnmount() {
        let entry = this.props.entry;
        if (this.refs[entry.inpName] != null) {
            this.refs[entry.inpName].value = null;
        }
    }

    _onBlur() {
        let val, { entry, onBlur } = this.props;

        if (this.refs[entry.inpName] != null) {
            val = this.refs[entry.inpName].value;
            InputStore.storeItemIndex(entry.inpName, val, true);
        }
        if (entry.errorFlag === true) {
            entry.errorFlag = false;
            ErrorStore.clearError(entry.errorId);
        }
        if (onBlur != null) {
            onBlur(entry, val);
        }
    }

    _onFocus() {
        let entry = this.props.entry;

        if (entry.errorFlag === true) {
            entry.errorFlag = false;
            ErrorStore.clearError(entry.errorId);
        }
        if (entry.onFocus != null) {
            entry.onFocus(entry);
        }
    }

    _onChange() {
        let entry = this.props.entry;

        entry.inpDefVal = !entry.inpDefVal;
        InputStore.storeItemIndex(entry.inpName, entry.inpDefVal, true);
        if (entry.onClick != null) {
            entry.onClick(entry);
        }
    }

    componentWillUpdate(nextProps) {
        let next = nextProps.entry,
            curr = this.props.entry,
            val  = InputStore.getItemIndex(next.inpName),
            dom  = this.refs[curr.inpName];

        if (dom != null) {
            dom.value = val || next.inpDefVal;
        }
    }

    render() {
        let { entry, bind, onBlur, onSelected } = this.props,
            handlers, type = entry.inpType != null ? entry.inpType : "text";

        if (entry.typeAhead === true) {
            return <TAWrap entry={entry} onBlur={onBlur}/>
        }
        if (entry.select === true) {
            return <SelectWrap entry={entry} bind={bind} onSelected={onSelected}/>
        }
        if (entry.dropzone === true) {
            if (entry.handlers != null) {
                handlers = entry.handlers;
            } else {
                handlers = {
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
            }
            return <DropZoneWrap entry={entry} eventHandlers={handlers}/>
        }
        if (entry.editor === true) {
            return <EditorEntry entry={entry} onBlur={this._onBlur}/>;
        }
        if (entry.button != null) {
            return (
                <div className={"input-group " + entry.inpClass}>
                    <input id={entry.inpName} type="text" className="form-control"
                        onFocus={this._onFocus}
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
        if (entry.checkedBox != null) {
            return (
                <div className="form-check">
                    <label className="form-check-label">
                        <input type="checkbox" ref={entry.inpName} name={entry.inpName}
                            defaultChecked={entry.inpDefVal}
                            onFocus={this._onFocus} onChange={this._onChange}/>
                        <i/><Mesg text={entry.labelTxt}/>
                    </label>
                </div>
            );
        }
        if (entry.component != null) {
            return entry.component;
        }
        handlers = entry.inpHolder ? Lang.translate(entry.inpHolder) : null;
        return (
            <input id={entry.inpName} type={type} className="form-control"
                onBlur={this._onBlur} ref={entry.inpName} onFocus={this._onFocus}
                defaultValue={entry.inpDefVal} placeholder={handlers}/>
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
        let { entry, bind, onBlur, onSelected } = this.props,
        labelFmt = entry.labelFmt != null ?
            entry.labelFmt : "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2",

        inputFmt = entry.inputFmt != null ?
            entry.inputFmt : "control-label col-xs-10 col-sm-10 col-md-10 col-lg-10",

        style = entry.errorFlag == true ? { color:'red' } : null,
        label = (
            <label className={labelFmt} style={style}>
                <Mesg text={entry.labelTxt}/>
            </label>
        );

        return (
            <div className="form-group" key={_.uniqueId('gen-inp-')}>
                {label}
                <div className={inputFmt}>
                    <InputWrap entry={entry} bind={bind}
                        onBlur={onBlur} onSelected={onSelected}/>
                    <ErrorView mesg={true} errorId={entry.errorId}/>
                </div>
            </div>
        );
    }
}

class InputInline extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let { entry, bind, onBlur, onSelected } = this.props,
        labelFmt = entry.labelFmt != null ?
            entry.labelFmt : "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2",

        inputFmt = entry.inputFmt != null ?
            entry.inputFmt : "control-label col-xs-10 col-sm-10 col-md-10 col-lg-10",

        style = entry.errorFlag == true ? { color:'red' } : null;

        return (
            <div className="inbox-info-bar no-padding" key={_.uniqueId('gen-inp-')}>
                <div className="row">
                    <div className="form-group">
                        <label className={labelFmt}>
                            <strong style={style}>
                                <Mesg text={entry.labelTxt}/>
                            </strong>
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
}

class InputToolTip extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let entry = this.props.entry,
            style = entry.errorFlag == true ? { color: 'red' } : null;

        return (
            <section>
                <label className="label"><Mesg text={entry.labelTxt}/></label>
                <label className="input">
                    <i className={"icon-append " + entry.labelIcon}/>
                    <InputWrap entry={entry} onBlur={entry.onBlur}/>
                    <b className="tooltip tooltip-bottom-right">
                        <Mesg text={entry.tipText}/>
                    </b>
                    <ErrorView mesg={true} errorId={entry.inpName}/>
                </label>
            </section>
        );
    }
}

class InputEntry
{
    static render(entry, onBlur) {
        if (entry.inline != null) {
            return (
                <InputInline entry={entry} onBlur={onBlur}
                    onFocus={entry.onFocus} onSelected={entry.onSelect}/>
            );
        }
        if (entry.tipText != null) {
            entry.onBlur = onBlur;
            return <InputToolTip entry={entry}/>;
        }
        if (entry.checkedBox != null) {
            return <InputWrap entry={entry}/>;
        }
        if (entry.editor === true && entry.labelTxt == null) {
            return (
                <div className={entry.inputFmt}>
                    <EditorEntry entry={entry} onChange={onBlur}/>
                </div>
            );
        }
        return (
            <InputBox entry={entry} onBlur={onBlur}
                onFocus={entry.onFocus} onSelected={entry.onSelect}/>
        );
    }
}

/*
 */
class GenericForm
{
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

    static htmlCheckBox(entry) {
        let opt = [
            '<input type="checkbox" value="' + entry.inpHolder +
            '" id="' + entry.inpName + '"' +
            (entry.checked === true ? ' checked="checked">' : '>')
        ];
        if (entry.labelText != null) {
            opt.push('<label for="' + entry.inpName + '">' +
                entry.labelText + '</label>');
        }
        return opt.join('\n');
    }

    static htmlSelect(entry) {
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

    static htmlInput(entry) {
        return '<input id="' + entry.inpName +
            '" type="text" class="form-control" value="' + entry.inpDefVal +
            '" placeholder="' + entry.inpHolder + '">';
    }

    static renderHtmlInput(entry) {
        if (entry.typeAhead === true) {
            return "";
        }
        if (entry.select === true) {
            return GenericForm.htmlSelect(entry);
        }
        if (entry.checked != null) {
            return GenericForm.htmlCheckBox(entry);
        }
        return GenericForm.htmlInput(entry);
    }

    static cloneInputEntry(entry, base) {
        return {
            inpHolder: entry.inpHolder,
            inpDefVal: entry.inpDefVal,
            inpName  : _.uniqueId(base),
            select   : entry.select,
            selectOpt: entry.selectOpt
        };
    }
}

export {
    SelectWrap, TAWrap, InputWrap, DropZoneWrap, InputBox, InputInline, GenericForm,
    InputToolTip, InputEntry
};
export default GenericForm;
