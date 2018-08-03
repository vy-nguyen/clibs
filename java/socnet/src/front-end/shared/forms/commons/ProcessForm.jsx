/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import ComponentBase      from 'vntd-shared/layout/ComponentBase.jsx';
import History            from 'vntd-shared/utils/History.jsx';
import StateButtonStore   from 'vntd-shared/stores/StateButtonStore.jsx';
import InputStore         from 'vntd-shared/stores/NestableStore.jsx';
import ErrorStore         from 'vntd-shared/stores/ErrorStore.jsx';
import ErrorView          from 'vntd-shared/layout/ErrorView.jsx';
import StateButton        from 'vntd-shared/utils/StateButton.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';

import { InputEntry }     from 'vntd-shared/forms/commons/GenericForm.jsx';

class FormData
{
    constructor(props, suffix) {
        this.props       = props;
        this.suffix      = suffix || "";
        this.dzImage     = null;
        this.imageId     = null;
        this.buttons     = null;
        this.submitBtn   = null;
        this.initialized = false;

        this.onFocus = this.onFocus.bind(this);
        this.onBlur  = this.onBlur.bind(this);
        this.onClick = this.onClick.bind(this);

        this._dzError   = this._dzError.bind(this);
        this._dzSuccess = this._dzSuccess.bind(this);
        return this;
    }

    getFormData() {
        return this.forms;
    }

    _getId(name) {
        return name + this.suffix;
    }

    clearError() {
        if (this.forms.formId != null) {
            ErrorStore.clearError(this.forms.formId);
        }
        this.errFlags = null;
    }

    clearData() {
        let entryInfo = [];

        this.iterFormFields(null, null, function(arg, entry) {
            InputStore.freeItemIndex(entry.inpName);
        });
        if (this.dzImage != null) {
            this.dzImage.removeAllFiles();
        }
        this.iterFormFields(entryInfo, null, function(einfo, entry, section) {
            entry.errorFlag = false;
            if (entry.editor === true) {
                entry.inpDefVal = "";
            } else {
                entry.inpDefVal = null;
            }
        });
        this.clearError();
    }

    setImageId(imgId) {
        this.imageId = imgId;
    }

    getImageId(imgId) {
        return this.imageId;
    }

    getFormId() {
        return this.forms.formId || null;
    }

    getData(entryInfo) {
        let retVal, info, imgRec = InputStore.getItemIndex(this.getImageId());

        if (imgRec == null) {
            imgRec = {
                articleUuid: 0,
                adImgs     : [],
                mainImg    : null
            };
        }
        retVal = {
            authorUuid : 0,
            articleUuid: imgRec.articleUuid,
            adImgs     : imgRec.adImgs,
            mainImg    : imgRec.mainImg,
            imageRec   : imgRec
        };
        this.iterFormFields(entryInfo, null, function(einfo, entry, section) {
            retVal[entry.field] = InputStore.getIndexString(entry.inpName);
            info = {
                section: section,
                field  : entry.field,
                entryId: entry.inpName,
                emptyOk: entry.emptyOk
            };
            if (entry.dropzone === true) {
                info.emptyOk = true;
            }
            einfo.push(info);
            return einfo;
        });
        return retVal;
    }

    getAndValidateForm(errFlags) {
        let field, value, data, entryInfo = [];

        data = this.getData(entryInfo);
        _.forEach(entryInfo, function(info) {
            field = info.field;
            value = data[field];

            if (info.emptyOk == null && ((value == null) ||
                (typeof value === 'string' && value === ''))) {
                errFlags[field]   = true;
                errFlags.helpText = Lang.translate("Enter values in highlighted fields");
                errFlags.errText  = Lang.translate("Please correct highlighted values");
            }
        });
        data = this.validateInput(data, errFlags);
        if (errFlags.errText == null) {
            return data;
        }
        ErrorStore.reportErrMesg(this.getFormId(), errFlags.errText, errFlags.helpText);
        return null;
    }

    _dzSend(entry, files, xhr, form) {
        form.append('name', files.name);
        form.append('formId', this.getFormId());
        form.append('imageId', entry.field);
        form.append('authorUuid', '');
        form.append('articleUuid', '');
    }

    _dzSuccess(dz, hdr, progress) {
        this.uploadImageOk(hdr);
    }

    _dzError(a) {
        console.log("dzError...");
        console.log(a);
    }

    setData(value) {
        if (this.initialized === true) {
            return;
        }
        this.defaultVal  = value;
        this.initialized = true;

        this.iterFormFields(null, null, function(sub, entry, section) {
            entry.inpName = this._getId(entry.inpName || entry.field);
            if (entry.dropzone === true) {
                this.setImageId(entry.inpName);
                entry.handlers = {
                    sending: this._dzSend.bind(this, entry),
                    success: this._dzSuccess,
                    error  : this._dzError,
                    init   : function(dz) {
                        this.dzImage = dz;
                    }.bind(this)
                }
            }
            if (entry.onFocus == null) {
                entry.onFocus = this.onFocus;
            }
            this._setDefValue(value, entry);
        }.bind(this));
    }

    modifyField(field, key, value) {
        this.iterFormFields(null, null, function(sub, entry, section) {
            if (entry.field === field) {
                entry[key] = value;
            }
            return sub;
        });
    }

    _setDefValue(value, entry) {
        let defVal;

        if (value != null && value[entry.field] != null) {
            defVal = value[entry.field];
            entry.inpDefVal = defVal;

        } else if (entry.inpDefVal != null) {
            defVal = entry.inpDefVal;
        } else {
            return;
        }
        InputStore.storeItemIndex(entry.inpName, defVal, false);
    }

    _setAllDefValues() {
        this.iterFormFields(null, null, function(sub, entry, section) {
            this._setDefValue(this.defaultVal, entry);
        }.bind(this));
    }

    uploadImageOk(result) {
        let imgId = this.getImageId(), img;

        if (imgId == null) {
            return null;
        }
        img = InputStore.getItemIndex(imgId);
        if (img == null) {
            img = {
                articleUuid: result.articleUuid,
                authorUuid : result.authorUuid,
                imgObjId   : result.imgObjId
            };
            InputStore.storeItemIndex(imgId, img, false);
        }
        return img;
    }

    setErrors(errFlags, save) {
        let val, hasValue = false;

        if (_.isEmpty(errFlags)) {
            return false;
        }
        if (save === true) {
            this.errFlags = errFlags;
        } else {
            // Merge with current errors and clear internal errors.
            //
            _.merge(errFlags, this.errFlags);
            this.errFlags = null;
        }
        this.iterFormFields(errFlags, null, function(flags, entry, section) {
            if (flags[entry.field] != null) {
                entry.errorFlag = true;
            } else {
                entry.errorFlag = null;
            }
            entry.errorId = entry.inpName;
            val = InputStore.getItemIndex(entry.inpName);
            if (val != null) {
                hasValue = true;
                entry.inpDefVal = val;
            }
            return flags;
        });
        return hasValue;
    }

    iterFormFields(cbObj, iterSection, iterField) {
        _.forEach(this.forms.formEntries, function(fItem) {
            if (iterSection != null) {
                cbObj = iterSection(cbObj, fItem);
            }
            _.forEach(fItem.entries, function(entry) {
                if (iterField != null) {
                    cbObj = iterField(cbObj, entry, fItem);
                }
                return cbObj;
            })
        });
        return cbObj;
    }

    createButtons() {
        let obj, buttons = this.forms.buttons;

        if (this.buttons != null) {
            return;
        }
        this.buttons = {};
        if (buttons != null) {
            _.forEach(buttons, function(btn) {
                if (!_.isEmpty(this.suffix)) {
                    btn.btnName = btn.btnName + this.suffix;
                }
                obj = StateButtonStore.createButton(btn.btnName, btn.btnCreate);
                this.buttons[btn.btnName] = obj;
                if (btn.btnSubmit === true) {
                    this.submitBtn = btn;
                }
            }.bind(this));
        }
    }

    renderButtons(onSubmit) {
        let buttons, name, form = this.forms;

        if (form.buttons == null) {
            return null;
        }
        if (this.buttons == null) {
            this.createButtons();
        }
        buttons = form.buttons.map(function(btn) {
            name = btn.btnName;
            if (btn.btnSubmit !== true) {
                return (
                    <StateButton btnId={name} className={btn.btnFmt}
                        onClick={this.onClick.bind(this, btn, this.buttons[name])}/>
                );
            }
            return (
                <StateButton btnId={name} className={btn.btnFmt} onClick={onSubmit}/>
            );
        }.bind(this));
        return (
            <div className="btn-group pull-right">
                {buttons}
            </div>
        );
    }

    renderTwoCols(section, onBlur) {
        let blur, col1, col2, entry, leftFmt, rightFmt,
            out = [], entries = section.entries, length = entries.length;

        if (section.leftFmt != null) {
            leftFmt  = section.leftFmt;
            rightFmt = section.rightFmt ? section.rightFmt : section.leftFmt;
        } else {
            leftFmt  = "col-xs-12 col-sm-12 col-md-6 col-lg-6";
            rightFmt = leftFmt;
        }
        for (let i = 0; i < length; i = i + 2) {
            col2  = null;
            entry = entries[i];

            col1 = InputEntry.render(entry, onBlur);
            if ((i + 1) < length) {
                entry = entries[i + 1];
                col2  = InputEntry.render(entry, onBlur);
            }
            out.push(
                <div className="row" key={_.uniqueId('form-col-')}>
                    <div className={leftFmt}>
                        {col1}             
                    </div>
                    <div className={rightFmt}>
                        {col2}             
                    </div>
                </div>
            );
        }
        return out;
    }

    renderForm(onBlur) {
        let entries, legend, form = this.forms;

        return form.formEntries.map(function(section) {
            if (section.twoCols != null) {
                entries = this.renderTwoCols(section, onBlur);
            } else {
                entries = section.entries.map(function(entry) {
                    return InputEntry.render(entry, onBlur);
                });
            }
            legend = section.legend != null ?
                <legend><Mesg text={section.legend}/></legend> : null;

            return (
                <div className={section.sectFmt} key={_.uniqueId('form-fields')}>
                    {legend}
                    <fieldset>
                        {entries}
                    </fieldset>
                </div>
            );
        }.bind(this));
    }

    /**
     * Get brief message to shortern the form.
     */
    getBriefMesg() {
        return "Write something...";
    }

    renderHeader() {
        return null;
    }

    renderFooter() {
        return null;
    }

    changeSubmitState(state, click, text, disable) {
        let btn = this.submitBtn, btnObj;
        if (btn != null) {
            btnObj = StateButtonStore
                .setButtonStateObj(this.buttons[btn.btnName], state);

            if (btnObj != null && text != null) {
                btnObj.changeStateInfo(text, disable);
            }
            if (click === true) {
                this.onClick(btn, btnObj);
            }
        }
    }

    isSubmitting(btnName) {
        if (btnName != null) {
            return StateButtonStore.isButtonInState(btnName, "saving");
        }
        if (this.submitBtn == null) {
            return false;
        }
        if (this._onClickBtn == null) {
            console.log("Checking " + this.submitBtn.btnName);
            return StateButtonStore.isButtonInState(this.submitBtn.btnName, "saving");
        }
        return true;
    }

    onBlur(entry) {
        this.changeSubmitState("needSave", false);
    }

    onFocus(entry) {
        ErrorStore.clearError(this.getFormId());
        if (this.submitBtn != null) {
            if (StateButtonStore.isButtonInState(this.submitBtn.btnName, "failure")) {
                this.changeSubmitState("needSave", false);
            }
        }
    }

    onClick(btn, btnState) {
        if (btn.btnCancel === true) {
            this.clearData();
            History.goBack();
            return;
        }
        this._onClickBtn = this.buttons[btn.btnName];
        StateButtonStore.setButtonStateObj(this._onClickBtn, "saving");
    }

    validateInput(data, errFlags) {
        return data;
    }

    submitNotif(store, data, result, status, cb) {
        console.log("Base submit notif " + status);
        this.clearData();
        this.changeSubmitState("saved", false);

        if (this._onClickBtn != null) {
            StateButtonStore.setButtonStateObj(this._onClickBtn, "success");
        }
        this._onClickBtn = null;
    }

    submitError(store, result, status) {}
    submitFailure(store, result, status) {}

    submitFailureBase(store, result, status, context) {
        this.submitFailure(store, result, status, context);
        this.changeSubmitState("failure", false);
        this._setAllDefValues();
    }

    submitErrorBase(store, result, status) {
        console.log("Base submit error " + status);
        this.changeSubmitState("failure", false);
        ErrorStore.reportErrMesg(this.getFormId(), result.error, result.message);
        return this.submitError(store, result, status);
    }

    submitAct(data) {
        let submitFn = this.forms.submitFn;

        this.changeSubmitState("saving", false);
        if (submitFn != null) {
            submitFn(data);
        }
    }

    render(onBlur, onSubmit) {
        return (
            <div className={this.forms.formFmt}>
                {this.renderHeader()}
                {this.renderForm(onBlur)}
                <ErrorView errorId={this.getFormId()}/>
                {this.renderButtons(onSubmit)}
                {this.renderFooter()}
            </div>
        );
    }

    // Utility functions
    //
    checkInputNum(data, errFlags, key) {
        if (data[key] !== "") {
            let val = parseInt(data[key]);
            if (val === NaN) {
                errFlags[key] = true;
                errFlags.helpText = Lang.translate('Invalid value');
                errFlags.errText  = Lang.translate('Please correct highlighted values');
            }
            return val;
        }
        return 0;
    }
}

class ProcessForm extends ComponentBase
{
    constructor(props) {
        super(props, null, props.store);

        this._onFocusBrief = this._onFocusBrief.bind(this);
        this._onBlurInput  = this._onBlurInput.bind(this);
        this._submitClick  = this._submitClick.bind(this);
        this._updateState  = this._updateState.bind(this);
        this._getInitState = this._getInitState.bind(this);

        this.state = this._getInitState(props ? props.brief : false);
        this._setContext(props);
    }

    _getInitState(brief) {
        return {
            errFlags: {},
            inpBrief: brief
        };
    }

    _setContext(props) {
        let value = props.value, context = props.form;

        if (value == null) {
            value = props.defValue || context.defValue;
        }
        context.setData(value);
    }

    componentWillMount() {
        this._setContext(this.props);
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.form != nextProps.form) {
            this._setContext(nextProps);
        }
    }

    _onBlurInput(entry) {
        let context = this.props.form;

        context.clearError();
        context.onBlur(entry);
        if (!_.isEmpty(this.state.errFlags)) {
            this.setState({
                errFlags: {}
            });
        }
        if (this.props.onBlur != null) {
            this.props.onBlur(context);
        }
    }

    _onFocusBrief(key) {
        this.setState({
            inpBrief: false
        });
    }

    _updateState(data, result, status, isArr, cb) {
        let errFlags = null, context = this.props.form, error = data.getError();

        console.log("update " + status + ", error " + error);
        if (context.isSubmitting() !== true) {
            return;
        }
        if (error != null || status === "failure" || result.error != null) {
            let store = this.props.store;

            if (status === "failure") {
                errFlags = context.submitFailureBase(data, result, status, cb);
            }
            if (result.error != null || error != null) {
                errFlags = context.submitErrorBase(data, result, status, cb);
            }
            if (errFlags != null && ! _.isEmpty(errFlags)) {
                this.setState({
                    errFlags: errFlags
                });
            }
            return;
        }
        context.submitNotif(data, data, result, status, cb);

        if (this._imgDz != null) {
            this._imgDz.removeAllFiles();
        }
        this.setState(this._getInitState());
    }

    _submitClick() {
        let data, context = this.props.form, errFlags = {};

        data = context.getAndValidateForm(errFlags);
        if (errFlags.errText == null) {
            context.submitAct(data);
            return;
        }
        this.setState({
            errFlags: errFlags
        });
    }

    render() {
        let hasVal, context = this.props.form, inpHolder = context.getBriefMesg();

        hasVal = context.setErrors(this.state.errFlags, false);
        if (this.state.inpBrief === true && hasVal === false) {
            return (
                <input ref="briefBox" className="form-control"
                    placeholder={inpHolder} onFocus={this._onFocusBrief}/>
            );
        }
        return context.render(this._onBlurInput, this._submitClick);
    }
}

ProcessForm.propTypes = {
    form    : PropTypes.object.isRequired,
    store   : PropTypes.object.isRequired,
    brief   : PropTypes.boolean,
    value   : PropTypes.object,
    defValue: PropTypes.object
};

export default ProcessForm;
export { FormData, ProcessForm }
