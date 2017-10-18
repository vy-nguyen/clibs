/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import $            from 'jquery';
import _            from 'lodash';
import React        from 'react-mod';
import {Link}       from 'react-router';

import UiValidate   from 'vntd-shared/forms/validation/UiValidate.jsx';
import LoadHtml     from 'vntd-shared/utils/LoadHtml.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore   from 'vntd-shared/stores/ErrorStore.jsx';
import InputStore   from 'vntd-shared/stores/NestableStore.jsx';
import ErrorView    from 'vntd-shared/layout/ErrorView.jsx';
import StateButton  from 'vntd-shared/utils/StateButton.jsx';
import Wizard       from 'vntd-shared/layout/Wizard.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import History      from 'vntd-shared/utils/History.jsx';
import {htmlCodes}  from 'vntd-root/config/constants.js';
import Mesg         from 'vntd-root/components/Mesg.jsx';
import Lang         from 'vntd-root/stores/LanguageStore.jsx';

import StateButtonStore          from 'vntd-shared/stores/StateButtonStore.jsx';
import {SelectWrap}              from 'vntd-shared/forms/commons/GenericForm.jsx';
import {LoginAbout, LoginSocial} from './Login.jsx';

class RegisterHeader extends React.Component
{
    render() {
        return (
            <header id="header" className="animated fadeInDown">
                <div id="logo-group">
                    <span id="logo">
                        <img src="/rs/img/logo/flag.png" alt="Viet Nam"/>
                    </span>
                </div>
                <span id="extr-page-header-space">
                    <span className="hidden-mobile hiddex-xs">
                        <Mesg text="Already registered?"/>
                    </span>{htmlCodes.spaceNoBreak}
                    <Link to="/login" className="btn btn-danger">
                        <Mesg text="Sign In"/>
                    </Link>
                </span>
            </header>
        );
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class RegisterForm extends React.Component
{
    constructor(props) {
        super(props);
        this._reStart   = this._reStart.bind(this);
        this._getData   = this._getData.bind(this);
        this._onBlur    = this._onBlur.bind(this);
        this._onFocus   = this._onFocus.bind(this);
        this._hasError  = this._hasError.bind(this);
        this._resetRefs = this._resetRefs.bind(this);
        this._clickTerm = this._clickTerm.bind(this);

        this._resendEmail     = this._resendEmail.bind(this);
        this._submitRegister  = this._submitRegister.bind(this);
        this._registerResult  = this._registerResult.bind(this);
        this._getRegisterStep = this._getRegisterStep.bind(this);

        this._genderId  = "reg-gender-id";
        this._submitId  = "reg-submit-btn";
        this._submitBtn = StateButtonStore.createButton(this._submitId, function() {
            return StateButton.saveButtonFsm(Lang.translate("Fill in Forms"),
                                             Lang.translate("Register"),
                                             Lang.translate("Submitted"),
                                             Lang.translate("Register Failed"),
                                             Lang.translate("Click on TOS"));
        });
        this.state = {
            reSend  : 0,
            stepIdx : 0,
            okTerm  : false
        };
    }

    componentWillMount() {
        if (UserStore.isLogin()) {
            History.pushState(null, "/public");
            return;
        }
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._registerResult);
        if (UserStore.getAuthCode() == "reg-done") {
            ErrorStore.reportErrMesg("reg-ok", "Sucess");
        }
    }

    componentWillMount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _getRegisterStep() {
        return {
            containerFmt : "",
            getActivePane: this._getCurrentStep.bind(this),
            setActivePane: this._setCurrentStep.bind(this),

            tabItems: [ {
                domId  : 'reg-step-0',
                tabText: 'Step 1: Register',
                tabIdx : 0
            }, {
                domId  : 'reg-step-1',
                tabText: 'Step 2: Email Sent',
                tabIdx : 1
            } ]
        };
    }

    _getCurrentStep() {
        return this.state.stepIdx;
    }

    _setCurrentStep(step) {
    }

    _resendEmail() {
        let data = {
            email: this.state.email
        };
        if (!_.isEmpty(data.email)) {
            ErrorStore.clearError("reg-error");
            Actions.resendRegister(data);

            if (this.state.reSend >= 5) {
                ErrorStore.clearError("reg-error");
                ErrorStore.reportErrMesg("reg-ok",
                    "Warning: too many retries!  Please retry with different email");
            }
            if (this.state.reSend >= 10) {
                this._reStart();
            } else {
                this.setState({
                    reSend: this.state.reSend + 1
                });
            }
        } else {
            this._reStart();
        }
    }

    _clickTerm() {
        let data = this._getData();

        data.okTerm = !data.okTerm;
        this.setState(data);

        if (data.okTerm === false) {
            StateButtonStore.setButtonStateObj(this._submitBtn, "saving");
        } else {
            StateButtonStore.setButtonStateObj(this._submitBtn, "needSave");
        }
    }

    render() {
        let status = (
            <section>
                <ErrorView errorId="reg-error"
                    className="form-group alert alert-danger"/>
                <ErrorView errorId="reg-ok" className="form-group alert alert-info"/>
            </section>
        ),
        state = this.state,
        emailInput = (
            <section>
                <label className="input">
                    <i className="icon-append fa fa-envelope"/>
                    <input type="email" name="email" ref="email"
                        placeholder={Lang.translate("Email address")}
                        defaultValue={state.email}
                        onFocus={this._onFocus} onBlur={this._onBlur}
                        data-smart-validate-input="true"
                        data-required="true" data-email="true"
                        data-message-required={
                            Lang.translate("Please enter your email address")
                        }
                        data-message-email={
                            Lang.translate("Account is your email address")
                        }
                    />
                    <b className="tooltip tooltip-bottom-right">
                        <Mesg text="Needed to verify your account"/>
                    </b>
                </label>
            </section>
        ),
        passInp1 = (
            <section>
                <label className="input">
                    <i className="icon-append fa fa-lock"/>
                    <input type="password" name="password" ref="password0"
                        placeholder={Lang.translate("Password")}
                        defaultValue={state.password0}
                        id="password" onFocus={this._onFocus} onBlur={this._onBlur}
                        data-smart-validate-input="true" data-required="true"
                        data-minlength="3" data-maxnlength="20"
                        data-message={Lang.translate("You need a password")}/>
                    <b className="tooltip tooltip-bottom-right">
                        <Mesg text="Don't forget your password"/>
                    </b>
                </label>
            </section>
        ),
        passInp2 = (
            <section>
                <label className="input">
                    <i className="icon-append fa fa-lock"/>
                    <input type="password" name="passwordConfirm" ref="password1"
                        placeholder={Lang.translate("Confirm password")}
                        defaultValue={state.password1}
                        onFocus={this._onFocus} onBlur={this._onBlur}
                        data-smart-validate-input="true" data-required="true"
                        data-minlength="3" data-maxnlength="20"
                        data-message={Lang.translate("Password verification failed")}/> 
                    <b className="tooltip tooltip-bottom-right">
                        <Mesg text="Don't forget your password"/>
                    </b>
                </label>
            </section>
        ),
        nameInp = (
            <div className="row">
                <section className="col col-6">
                    <label className="input">
                        <input type="text" name="firstname" ref="firstName"
                            placeholder={Lang.translate("First name")}
                            defaultValue={state.firstName}
                            onFocus={this._onFocus} onBlur={this._onBlur}/>
                    </label>
                </section>
                <section className="col col-6">
                    <label className="input">
                        <input type="text" name="lastname" ref="lastName"
                            placeholder={Lang.translate("Last name")}
                            defaultValue={state.lastName}
                            onFocus={this._onFocus} onBlur={this._onBlur}/>
                    </label>
                </section>
            </div>
        ),
        genderSel = {
            inpHolder: state.gender != null ? state.gender : "Male",
            inpName  : this._genderId,
            selectOpt: [ {
                label: Lang.translate("Male"),
                value: "Male"
            }, {
                label: Lang.translate("Female"),
                value: "Female"
            } ]
        },
        genderInp = (
            <div className="row">
                <section className="col col-6">
                    <SelectWrap entry={genderSel}/>
                </section>
                <section className="col col-6">
                    <label className="input">
                        <input type="text" name="birthday" rel="birthday"
                            placeholder={Lang.translate("Your birth year")}
                            onFocus={this._onFocus}/>
                    </label>
                </section>
            </div>
        ),
        termsInp = (
            <section>
                <label className="checkbox">
                    <input type="checkbox" name="terms"
                        checked={this.state.okTerm}
                        ref="terms" id="terms" onChange={this._clickTerm}/>
                    <i/><Mesg text="I agree with the"/>
                    <a href="#" data-toggle="modal" data-target="#id-reg-modal">
                        <Mesg text=" Terms and Conditions "/>
                    </a>
                </label>
            </section>
        ),
        mainForm = (
            <div className="well no-padding">
                <UiValidate>
                    <form id="smart-form-register" className="smart-form client-form">
                        <header>
                            <Mesg text="Register to open your account"/>
                        </header>
                        <fieldset>
                            {status}
                        </fieldset>
                        <fieldset>
                            {emailInput}
                            {passInp1}
                            {passInp2}
                        </fieldset>
                        <fieldset>
                            {nameInp}
                            {genderInp}
                            {termsInp}
                        </fieldset>
                        <footer>
                            <StateButton btnId={this._submitId}
                                className="btn btn-success"
                                onClick={this._submitRegister}/>
                        </footer>

                        <div className="message">
                            <i className="fa fa-check"/>
                            <p><Mesg text="Thank you for your registration!"/></p>
                        </div>
                    </form>
                </UiValidate>
                <h5 className="text-center"><Mesg text="- Or sign in using -"/></h5>
                <LoginSocial/>
            </div>
        ),
        email = this.state.email,
        reSend = this.state.reSend > 0 ? "(" + this.state.reSend + ")" : null

        return (
            <Wizard context={this._getRegisterStep()} proText="Step">
                {mainForm}
                <div className="well">
                    <div className="row">
                        <div className="message">
                            <p>{this.state.stepMesg}</p>
                            <Mesg text="Please check your email address: "/>{email}
                            <br/>
                            <Mesg text="The email may show up in your spam folder"/>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <p><Mesg text="Don't receive confirmation email?"/></p>
                        {status}
                        <button className="btn btn-primary" onClick={this._resendEmail}>
                            <Mesg text="Send email again "/>{reSend}
                        </button>
                        <button className="btn btn-danger" onClick={this._reStart}>
                            <Mesg text="Register Again"/>
                        </button>
                    </div>
                </div>
            </Wizard>
        );
    }

    _resetRefs() {
        if (this.refs != null && this.refs.email != null) {
            this.refs.email.value = '';
            this.refs.password0.value = '';
            this.refs.password1.value = '';
            this.refs.firstName.value = '';
            this.refs.lastName.value  = '';
        }
    }

    _registerResult(data) {
        let form = $('#smart-form-register');

        form.find('input').prop('disabled', false);
        switch (data.authCode) {
        case "reg-done":
            ErrorStore.reportErrMesg("reg-ok", data.authMesg);
            break;

        case "reg-verify":
            Actions.verifyAccount({
                type: data.authCode,
                authVerifToken: data.authVerifToken
            });
            break;

        case "reg-failure":
            ErrorStore.reportErrMesg("reg-error", data.authMesg,
                                     "Try different email address");
            break;

        case "reg-email-sent":
            this.setState({
                stepIdx : 1,
                stepMesg: data.authMesg
            });
            break;

        case "reg-no-user":
            if (this.state.reSend <= 5) {
                ErrorStore.reportErrMesg("reg-error", data.authMesg,
                                         data.authHelp + ": invalid email ");
            }
            break;

        case "reg-user-exists":
            ErrorStore.reportErrMesg("reg-error", data.authMesg,
                                     data.authHelp + ": enter your email to login");
            break;

        case "user":
            break;

        default:
            ErrorStore.reportErrMesg("reg-error", data.authMesg);
        }
        this._resetRefs();
    }

    _hasError() {
        let email, passwd0 = this.refs.password0.value,
            passwd1 = this.refs.password1.value;

        if (passwd0 != "" && passwd1 != "" && passwd0 !== passwd1) {
            return "Confirmed password doesn't match";
        }
        email = this.refs.email.value;
        if (email != "") {
            if (validateEmail(email) === false) {
                return "Invalid email address format";
            }
        }
        return null;
     }

    _reStart() {
        ErrorStore.clearError("reg-ok");
        ErrorStore.clearError("reg-error");
        StateButtonStore.setButtonStateObj(this._submitBtn, "saving");

        this._resetRefs();
        this.setState({
            reSend  : 0,
            stepIdx : 0,
            okTerm  : false,
            stepMesg: null,
            email   : null
        });
    }

    _onFocus() {
        if (this._hasError() == null) {
            ErrorStore.clearError("reg-error");
        }
    }

    _onBlur() {
        let err = this._hasError();
        if (err != null) {
            ErrorStore.reportErrMesg("reg-error", err);
        }
    }

    _getData() {
        return {
            email    : this.refs.email.value,
            password0: this.refs.password0.value,
            password1: this.refs.password1.value,
            firstName: this.refs.firstName.value,
            lastName : this.refs.lastName.value,
            gender   : InputStore.getIndexString(this._genderId),
            okTerm   : this.state.okTerm
        };
    }

    _submitRegister() {
        let data = this._getData(),
            form = $('#smart-form-register');

        form.find('input').prop('disabled', true);
        Actions.register(data);
    }
}

class RegisterTos extends React.Component
{
    render() {
        return (
            <div className="modal fade"
                id="id-reg-modal" tabIndex="-1" role="dialog"
                aria-labelledby="id-reg-modal-label" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"
                                data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="id-reg-modal-label">
                                <Mesg text=" Terms & Conditions "/>
                            </h4>
                        </div>
                        <div className="modal-body custom-scroll terms-body">
                            <LoadHtml url="/public/terms-and-conditions" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default"
                                data-dismiss="modal">
                                <Mesg text="Cancel"/>
                            </button>
                            <button type="button" className="btn btn-primary"
                                id="i-agree">
                                <i className="fa fa-check"/><Mesg text=" I Agree"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Register extends React.Component
{
    render() {
        let aboutFmt = "col-md-5 col-lg-5 hidden-xs hidden-sm";
        return (
            <div id="extr-page" >
                <RegisterHeader/>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <div className={aboutFmt}>
                                <LoginAbout logoImg={false}/>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                                <RegisterForm/>
                            </div>
                        </div>
                    </div>
                    <RegisterTos/>
                </div>
            </div>
        )
    }
}

export default Register
export { RegisterForm, validateEmail }
