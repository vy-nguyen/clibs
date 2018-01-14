/**
 * Copyright by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

import Lang              from 'vntd-root/stores/LanguageStore.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore  from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton       from 'vntd-shared/utils/StateButton.jsx';
import Wizard            from 'vntd-shared/layout/Wizard.jsx';
import ErrorView         from 'vntd-shared/layout/ErrorView.jsx';
import Actions           from 'vntd-root/actions/Actions.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';

import {LoginLayout}           from 'vntd-root/pages/login/Login.jsx';
import {FormData, ProcessForm} from 'vntd-shared/forms/commons/ProcessForm.jsx';

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class RegisterLayout extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);

        this._onClickTos = this._onClickTos.bind(this);
        this.initData();
        return this;
    }

    initData() {
        const labelFmt = 'control-label col-xs-3 col-sm-3 col-md-3 col-lg-3',
            inputFmt = 'control-label col-xs-8 col-sm-8 col-md-8 col-lg-8';

        let register = [ {
            inpType  : 'email',
            field    : 'email',
            inpHolder: 'Email address',
            labelIcon: 'fa fa-envelope',
            tipText  : 'Needed to verify your account'
        }, {
            inpType  : 'password',
            field    : 'password0',
            inpHolder: 'Password',
            labelIcon: 'fa fa-lock',
            tipText  : "Don't forget your password"
        }, {
            inpType  : 'password',
            field    : 'password1',
            inpHolder: 'Confirm password',
            labelIcon: 'fa fa-lock',
            tipText  : 'Verify your password'
        } ],
        profile = [ {
            field    : 'firstName',
            labelTxt : 'First name',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'lastName',
            labelTxt : 'Last name',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            select   : true,
            field    : 'gender',
            selectOpt: [ {
                value: 'Male',
                label: 'Male'
            }, {
                value: 'Female',
                label: 'Female'
            } ],
            inpHolder: 'Male',
            labelTxt : 'Your gender',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field    : 'birthday',
            labelTxt : 'Birth year',
            labelFmt : labelFmt,
            inputFmt : inputFmt
        }, {
            field     : 'terms',
            checkedBox: true,
            labelTxt  : '  I Agree Term of Service',
            onClick   : this._onClickTos
        } ];

        this.forms = {
            formId     : 'reg-form',
            formFmt    : 'smart-form client-form padding-10',
            submitFn   : Actions.register,
            hiddenHead : null,
            hiddenTail : null,
            formEntries: [ {
                legend : 'Your account login',
                entries: register
            }, {
                twoCols : true,
                inline  : true,
                leftFmt : 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
                rightFmt: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
                legend  : 'Your profile',
                entries : profile
            } ],
            buttons: [ {
                btnName  : 'register-submit',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm(
                        Lang.translate('Fill in Forms'),
                        Lang.translate('Register'),
                        Lang.translate('Submitted'),
                        Lang.translate('Register Failed'),
                        Lang.translate('Click on TOS')
                    );
                }
            } ]
        };
    }

    // @Override
    //
    onBlur(entry) {
        if (this.needTOS == null) {
            super.onBlur(entry);
        }
    }

    _onClickTos(entry) {
        let btn = this.forms.buttons[0], btnObj = this.buttons[btn.btnName];

        if (entry.inpDefVal === true) {
            this.needTOS = null;
            StateButtonStore.setButtonStateObj(btnObj, "needSave");
        } else {
            this.needTOS = true;
            StateButtonStore.setButtonStateObj(btnObj, "saving");
        }
    }

    // @Override
    //
    validateInput(data, errFlags) {
        if (validateEmail(data.email) === false) {
            errFlags.email    = true;
            errFlags.errText  = Lang.translate("Invalid email address");
            errFlags.helpText = Lang.translate("You need to enter valid email");
            return null;
        }
        if (data.password0 !== data.password1) {
            errFlags.password0 = true;
            errFlags.password1 = true;
            errFlags.errText   = Lang.translate("Passwords don't match");
            errFlags.helpText  = Lang.translate("Please verify your password");
            return null;
        }
        if (data.terms === false) {
            errFlags.terms    = true;
            errFlags.errText  = Lang.translate("You need to agree on our TOS");
            errFlags.helpText = Lang.translate("Click agree on TOS");
            return null;
        }
        if (!_.isEmpty(errFlags)) {
            return null;
        }
        return {
            email    : data.email,
            password0: data.password0,
            password1: data.password1,
            firstName: data.firstName,
            lastName : data.lastName,
            gender   : data.gender,
            okTerm   : data.terms,
            birthday : data.birthday
        };
    }

    submitNotif(store, result, status, cb) {
        console.log("submit notif");
        console.log(result);
        super.submitNotif(store, result, status, cb);
    }

    renderHeader() {
        return (
            <header><Mesg text="We will mail you a login link"/></header>
        );
    }

    render(onBlur, onSubmit) {
        return LoginLayout.renderForm(this, onBlur, onSubmit);
    }
}

class RegisterForm extends React.Component
{
    constructor(props) {
        super(props);

        this.data = new RegisterLayout(props, props.suffix);
        this.defValue = {
            terms: true
        };
    }

    render() {
        let clsName = this.props.className || 'well no-padding';

        return (
            <div>
                <div className={clsName}>
                    <ProcessForm form={this.data}
                        defValue={this.defValue} store={UserStore}/>
                </div>
            </div>
        );
    }
}

class BoostRegister extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            stepIdx: 0,
            reSend : 0,
            okTerm : false
        };
        this._reStart         = this._reStart.bind(this);
        this._resendEmail     = this._resendEmail.bind(this);
        this._getRegisterStep = this._getRegisterStep.bind(this);
    }

    _getRegisterStep() {
        return {
            containerFmt : "",
            setActivePane: function(step) {
                this.setState({
                    stepIdx: step
                });
            },
            getActivePane: function() {
                return this.state.stepIdx;
            }.bind(this),
            tabItems: [ {
                domId  : 'reg-step-0',
                tabText: Lang.translate('Step 1: Register'),
                tabIdx : 0
            }, {
                domId  : 'reg-step-1',
                tabText: Lang.translate('Step 2: Email Sent'),
                tabIdx : 1
            } ]
        };
    }

    _reStart() {
    }

    _resendEmail() {
    }

    render() {
        let status, email = this.state.email,
            reSend = this.state.reSend > 0 ? "(" + this.state.reSend + ")" : null;

        status = (
            <section>
                <ErrorView errorId="reg-error" className="form-group alert alert-danger"/>
                <ErrorView errorId="reg-ok" className="form-group alert alert-info"/>
            </section>
        );
        return (
            <Wizard context={this._getRegisterStep()} proText="Step">
                <RegisterForm/>
                <div className="well">
                    <div className="row">
                        <div className="message">
                            <p>{this.state.stepMesg}</p>
                            <Mesg text="Please check your email address: "/>{email}
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <p><Mesg text="Don't receive confirmation email?"/></p>
                        {status}
                        <button className="btn btn-primary" onClick={this._resendEmail}>
                            <Mesg text="Send email again "/>{reSend}
                        </button>
                        <button className="btn btn-danger" onClick={this._reStart}>
                            <Mesg text="Register again"/>
                        </button>
                    </div>
                </div>
            </Wizard>
        );
    }
}

export default BoostRegister;
