/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'uses strict';

import React         from 'react-mod';
import { Link }      from 'react-router';

import {htmlCodes}   from 'vntd-root/config/constants.js';
import Actions       from 'vntd-root/actions/Actions.jsx';
import AboutUsStore  from 'vntd-root/stores/AboutUsStore.jsx';
import Lang          from 'vntd-root/stores/LanguageStore.jsx';
import Mesg          from 'vntd-root/components/Mesg.jsx';
import UserStore     from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';
import UiValidate    from 'vntd-shared/forms/validation/UiValidate.jsx';
import History       from 'vntd-shared/utils/History.jsx';
import ErrorView     from 'vntd-shared/layout/ErrorView.jsx';

import { validateEmail } from './Register.jsx';

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

class LoginForm extends React.Component
{
    constructor(props) {
        super(props);

        this._onFocus      = this._onFocus.bind(this);
        this._clearRefs    = this._clearRefs.bind(this);
        this._onAuthChange = this._onAuthChange.bind(this);
        this._submitLogin  = this._submitLogin.bind(this);
        this._emailLogin   = this._emailLogin.bind(this);
        this._loginByEmail = this._loginByEmail.bind(this);

        this.state = {
            emailSent: 0
        };
    }

    componentWillMount() {
        if (UserStore.isLogin()) {
            this._clearRefs();
            History.pushState(null, "/public/vietnam");
        }
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._onAuthChange);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _onAuthChange(data, startPage) {
        let form = $('#login-form'), retry = this.state.emailSent;
        form.find('input').prop('disabled', false);

        if (data.authCode === "failure") {
            ErrorStore.triggerError("login-err", data.authError);
            return;
        }
        if (data.authCode === "reg-email-sent") {
            let hdr, style, text;
            
            if (retry < 8) {
                hdr   = "Notification";
                style = "alert alert-success";
                text  = [
                    "We sent login link to your email:",
                    this.refs.email != null ? this.refs.email.value : "",
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
            ErrorStore.reportMesg("login-err", hdr, style, text);
            this.setState({
                emailSent: retry + 1
            });
            return;
        };
        this._clearRefs();
        console.log("Auth change " + startPage);
    }

    _clearRefs() {
        if (this.refs != null && this.refs.email != null) {
            this.refs.email.value    = '';
            this.refs.password.value = '';
            this.refs.remember.value = '';
        }
    }

    _onFocus() {
        $('#id-login-error').hide();
        ErrorStore.clearError("login-err");
    }

    _submitLogin(event) {
        let form = $('#login-form');
        let formData = form.serialize();
        $('#id-login-error').hide();
        form.find('input').prop('disabled', true);
        event.preventDefault();

        Actions.login({
            email   : this.refs.email.value,
            password: this.refs.password.value,
            remember: this.refs.remember.value
        }, formData);
    }

    _emailLogin() {
        let email = this.refs.email.value;
        if (_.isEmpty(email) || validateEmail(email) == false) {
            ErrorStore.reportErrMesg("login-err", "Please enter valid email");
            this.refs.email.value = "";
        } else {
            Actions.loginEmail({
                email   : email,
                password: null,
                remember: null
            });
        }
    }

    _loginByEmail() {
        let emailBtn = null, sent = this.state.emailSent,
            btnText = <Mesg text="Email Login Link"/>;

        if (sent > 0) {
            btnText = (
                <span>
                    <Mesg text="Email Login Link Again"/> ({sent} retries)
                </span>
            );
        }
        if (sent < 10) {
            emailBtn = (
                <footer>
                    <button className="btn btn-primary" onClick={this._emailLogin}>
                        {btnText}
                    </button>
                </footer>
            );
        }
        return (
            <div className="well no-padding">
                <div id="smart-form-register" className="smart-form client-form">
                    <header>
                        <Mesg text="Email Sign In"/>
                    </header>
                    <fieldset>
                        <section>
                            <label className="label"><Mesg text="E-mail"/></label>
                            <label className="input">
                                <i className="icon-append fa fa-user"/>
                                <input type="email" name="email" ref="email"
                                    placeholder={Lang.translate("Your email address")}
                                    onFocus={this._onFocus}/>
                                <b className="tooltip tooltip-bottom-right">
                                    <Mesg text="We will send login link to your email"/>
                                </b>
                            </label>
                        </section>
                    </fieldset>
                    {emailBtn}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="well no-padding">
                    <form id="login-form" className="smart-form client-form">
                        <header> <Mesg text="Sign In"/> </header>
                        <ErrorView errorId={"login-err"} className="alert alert-danger"/>
                        <fieldset>
                            <section>
                                <label className="label"><Mesg text="E-mail"/></label>
                                <label className="input">
                                    <i className="icon-append fa fa-user"/>
                                    <input type="email" name="email" ref="email"
                                        placeholder={Lang.translate("Your email address")}
                                        onFocus={this._onFocus}/>
                                    <b className="tooltip tooltip-top-right">
                                        <i className="fa fa-user txt-color-teal"/>
                                        <Mesg text="Please enter your email address"/>
                                    </b>
                                </label>
                            </section>
                            <section>
                                <label className="label"><Mesg text="Password"/></label>
                                <label className="input">
                                    <i className="icon-append fa fa-lock"/>
                                    <input type="password" name="password" ref="password"
                                        placeholder={Lang.translate("Your password")}
                                        onFocus={this._onFocus}/>
                                    <b className="tooltip tooltip-top-right">
                                        <i className="fa fa-lock txt-color-teal"/>
                                        <Mesg text="Enter your password"/>
                                    </b>
                                </label>
                                <div className="note">
                                    <Link to="/register/recover">
                                        <Mesg text="Forgot Password"/>?
                                    </Link>
                                </div>
                            </section>
                            <section>
                                <label className="checkbox">
                                    <input type="checkbox" ref="remember"
                                        name="remember" defaultChecked={true}/>
                                    <i/><Mesg text="Stay signed in"/>
                                </label>
                            </section>
                        </fieldset>
                        <footer>
                            <button className="btn btn-primary"
                                onClick={this._submitLogin}>
                                <Mesg text="Sign in"/>
                            </button>
                        </footer>
                    </form>
                </div>
                <h4 className="text-center">
                    <Mesg text="Or Sign In By Email"/>
                </h4>
                <br/>
                {this._loginByEmail()}
                {/*
                <h4 className="text-center">
                    <Mesg text="Or Sign In Using"/>
                </h4>
                <br/>
                <LoginSocial/>    
                */}
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

export { Login, LoginForm, LoginAbout, LoginHeader, LoginSocial }
