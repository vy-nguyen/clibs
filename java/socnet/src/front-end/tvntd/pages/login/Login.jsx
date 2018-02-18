/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'uses strict';

import $             from 'jquery';
import React         from 'react-mod';
import { Link }      from 'react-router';
import { htmlCodes } from 'vntd-root/config/constants.js';

import Actions       from 'vntd-root/actions/Actions.jsx';
import AboutUsStore  from 'vntd-root/stores/AboutUsStore.jsx';
import Mesg          from 'vntd-root/components/Mesg.jsx';
import Lang          from 'vntd-root/stores/LanguageStore.jsx';
import UserStore     from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';
import InputStore    from 'vntd-shared/stores/NestableStore.jsx';
import History       from 'vntd-shared/utils/History.jsx';
import StateButton   from 'vntd-shared/utils/StateButton.jsx';
import ErrorView     from 'vntd-shared/layout/ErrorView.jsx';

import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';
import { validateEmail } from 'vntd-shared/component/BoostRegister.jsx';

class LoginHeader extends React.Component
{
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <header id="header" className="animated fadeInDown">
                <div id="logo-group">
                    <span id="logo">
                        <img src="/rs/img/logo/flag.png"
                            style={{height:'40px'}} alt="Viet Nam"/>
                    </span>
                </div>
                <span id="extr-page-header-space">
                    <span className="hidden-mobile hiddex-xs">
                        <Mesg text="Need an account?"/>
                    </span>{htmlCodes.spaceNoBreak}
                    <Link to="/register/form" className="btn btn-danger"> 
                        <Mesg text="Create Account"/>
                    </Link>
                </span>
            </header>
        );
    }
}

class LoginAbout extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            login: AboutUsStore.getData().login
        }
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = AboutUsStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        this.setState({
            login: AboutUsStore.getData().login
        });
    }

    render() {
        let login = this.state.login,
            loginBox = login || { header: "Viet Nam Tu Do" },
            logoImg = this.props.logoImg == null ?
                <img src="/rs/img/logo/flag.png" className="pull-right display-image"
                    alt="" style={{width:'210px'}}/> : null;

        if (login == null) {
            return null;
        }
        return (
            <div>
                <h1 className="txt-color-red login-header-big">
                    {loginBox.headerBar}
                </h1>
                <div className="hero">
                    <div className="pull-left login-desc-box-l">
                        <h4 className="paragraph-header">{loginBox.headerText}</h4>
                        <div className="login-app-icons">
                            <button href="#" className="btn btn-danger btn-sm">
                                {loginBox.tourButton}
                            </button>
                            <span> </span>
                            <Link to="/public/aboutus"
                                className="btn btn-danger btn-sm">
                                {loginBox.aboutButton}
                            </Link>
                        </div>
                    </div>
                    {logoImg}
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h5 className="about-heading">{loginBox.aboutBrief}</h5>
                        <p>{loginBox.aboutText}</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h5 className="about-heading">{loginBox.siteBrief}</h5>
                        <p>{loginBox.siteText}</p>
                    </div>
                </div>
            </div>
        );
    }
}

class LoginSocial extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className="list-inline text-center">
                <li>
                    <a href-void="" className="btn btn-primary btn-circle">
                        <i className="fa fa-facebook"/>
                    </a>
                </li>
                <li>
                    <a href-void="" className="btn btn-info btn-circle">
                        <i className="fa fa-twitter"/>
                    </a>
                </li>
                <li>
                    <a href-void="" className="btn btn-warning btn-circle">
                        <i className="fa fa-linkedin"/>
                    </a>
                </li>
            </ul>
        );
    }
}

class LoginLayout extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initData();
        return this;
    }

    initData() {
        let login = [ {
            inpName  : 'email',
            inpType  : 'email',
            field    : 'email',
            inpHolder: 'Your email address',
            labelTxt : 'Email',
            labelIcon: 'fa fa-user',
            tipText  : 'Please enter your email address'
        }, {
            inpName  : 'password',
            inpType  : 'password',
            field    : 'password',
            inpHolder: 'Your password',
            labelTxt : 'Password',
            labelIcon: 'fa fa-lock',
            tipText  : 'Enter your password'
        }, {
            inpName   : 'remember',
            field     : 'remember',
            checkedBox: true,
            labelTxt  : 'Stay signed in'
        } ];
        this.forms = {
            formId    : 'login-cust',
            formFmt   : 'smart-form client-form',
            submitFn  : this.submitAction,
            formEntries: [ {
                entries: login
            } ],
            buttons: [ {
                btnName  : 'login-cust-submit',
                btnFmt   : 'btn btn-primary',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Sign In", "Submit",
                        "Login", "Login Failed", "Signing In...");
                }
            } ]
        };
    }

    validateInput(data, errFlags) {
        return LoginLayout.validateEmail(data, errFlags);
    }

    submitAction(data) {
        Actions.login($.param(data));
    }

    submitNotif(store, result, status) {
        if (LoginLayout.authResult(this.getFormId(), 0, result, status) < 0) {
            this.submitFailure(result, status);
        } else {
            super.submitNotif(store, result, status);
        }
    }

    renderHeader() {
        return (
            <header><Mesg text="Sign In"/></header>
        );
    }

    render(onBlur, onSubmit) {
        return LoginLayout.renderForm(this, onBlur, onSubmit);
    }

    static renderForm(context, onBlur, onSubmit) {
        return (
            <div className={context.forms.formFmt}>
                {context.renderHeader()}
                <ErrorView className="padding-10 alert alert-danger"
                    errorId={context.getFormId()}/>

                {context.renderForm(onBlur)}
                <footer>
                    {context.renderButtons(onSubmit)}
                </footer>
            </div>
        );
    }

    static validateEmail(data, errFlags) {
        if (validateEmail(data.email) == false) {
            errFlags.email    = true;
            errFlags.errText  = Lang.translate("Invalid email address");
            errFlags.helpText = Lang.translate("You need to enter valid email");
            return null;
        }
        return {
            email: data.email,
            password: data.password,
            remember: data.remember
        };
    }

    static authResult(id, retry, data, startPage) {
        let hdr, style, text;

        if (data.authError != null) {
            ErrorStore.triggerError(id, data.authError);
            return -1;
        }
        if (data.authCode === "reg-email-sent") {
            if (retry < 8) {
                hdr   = "Notification";
                style = "alert alert-success";
                text  = [
                    "We sent login link to your email:",
                    InputStore.getIndexString("email"),
                    "Please check the spam folder if you don't receive it."
                ];
            } else {
                hdr   = "Warning";
                style = "alert alert-warning";
                text  = [
                    "You requested to send email too many times.",
                    "We may take action to disable this account"
                ];
            }
            ErrorStore.reportMesg(id, hdr, style, text);
            retry = retry + 1;
        }
        if (data.authCode === "reg-no-user") {
            ErrorStore.reportMesg(id, "Error", "alert alert-warning",
                "You need to open an account with us first");
            return -1;
        }
        return retry;
    }
}

class EmailLayout extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initData();
        return this;
    }

    initData() {
        this.emailSent = 0;
        this.forms = {
            formId    : 'login-email',
            formFmt   : 'smart-form client-form',
            submitFn  : Actions.loginEmail,
            formEntries: [ {
                entries: [ {
                    inpName  : 'email-login',
                    inptype  : 'email',
                    field    : 'email',
                    inpHolder: 'Your email address',
                    labelTxt : 'Email',
                    labelIcon: 'fa fa-user',
                    tipText  : 'We will mail a login link to your email'
                } ]
            } ],
            buttons: [ {
                btnName  : 'login-email-submit',
                btnFmt   : 'btn btn-primary',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Login", "Email Login Link",
                        "Sent Email", "Email Failed", "Sending...");
                }
            } ]
        };
    }

    renderHeader() {
        return (
            <header><Mesg text="We will mail you a login link"/></header>
        );
    }

    validateInput(data, errFlags) {
        return LoginLayout.validateEmail(data, errFlags);
    }

    submitNotif(store, result, status) {
        this.emailSent =
            LoginLayout.authResult(this.getFormId(), this.emailSent, result, status);

        if (0 < this.emailSent && this.emailSent < 9) {
            this.changeSubmitState("saved", false,
                "Sent Email " + this.emailSent, false);
        } else {
            if (this.emailSent < 0) {
                this.emailSent = 0;
            }
            this.changeSubmitState("failure", false);
        }
    }

    render(onBlur, onSubmit) {
        return LoginLayout.renderForm(this, onBlur, onSubmit);
    }
}

class LoginForm extends React.Component
{
    constructor(props) {
        super(props);

        this.data  = new LoginLayout(props, props.suffix);
        this.email = new EmailLayout(props, props.suffix);
        this.defValue = {
            remember: true
        };
    }

    componentWillMount() {
        let start = this.props.startUrl || "/public/vietnam";

        if (UserStore.isLogin()) {
            this.data.clearData();
            this.email.clearData();
            History.pushState(null, start);
        }
    }

    render() {
        let clsName = this.props.className || "well no-padding";
        return (
            <div>
                <div className={clsName}>
                    <ProcessForm form={this.data}
                        defValue={this.defValue} store={UserStore}/>
                </div>
                <h4 className="text-center">
                    <Mesg text="Or Sign In By Email"/>
                </h4>
                <br/>
                <div className={clsName}>
                    <ProcessForm form={this.email} store={UserStore}/>
                </div>
            </div>
        );
    }
}

class Login extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="extr-page" >
                <LoginHeader/>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <div className="col-md-7 col-lg-8 hidden-xs hidden-sm">
                                <LoginAbout/>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <LoginForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export { Login, LoginForm, LoginAbout, LoginHeader, LoginSocial, LoginLayout }
