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
import UserStore     from 'vntd-shared/stores/UserStore.jsx';
import UiValidate    from 'vntd-shared/forms/validation/UiValidate.jsx';
import History       from 'vntd-shared/utils/History.jsx';
import ErrorView     from 'vntd-shared/layout/ErrorView.jsx';

class LoginHeader extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header id="header" className="animated fadeInDown">
                <div id="logo-group">
                    <span id="logo"> <img src="/rs/img/logo/flag.png" style={{height:'40px'}} alt="Viet Nam"/></span>
                </div>
                <span id="extr-page-header-space">
                    <span className="hidden-mobile hiddex-xs">Need an account?</span>{htmlCodes.spaceNoBreak}
                    <Link to="/register/form" className="btn btn-danger">Create Account</Link>
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
        let login = this.state.login;
        let loginBox = login || { header: "Viet Nam Tu Do" };

        if (login == null) {
            return null;
        }
        return (
            <div>
                <h1 className="txt-color-red login-header-big">{loginBox.headerBar}</h1>
                <div className="hero">
                    <div className="pull-left login-desc-box-l">
                        <h4 className="paragraph-header">{loginBox.headerText}</h4>
                        <div className="login-app-icons">
                            <a href="#" className="btn btn-danger btn-sm">{loginBox.tourButton}</a>
                            <span> </span>
                            <Link to="/public/aboutus" className="btn btn-danger btn-sm">{loginBox.aboutButton}</Link>
                        </div>
                    </div>
                    <img src="/rs/img/logo/flag.png" className="pull-right display-image" alt="" style={{width:'210px'}}/>
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
                    <a href-void="" className="btn btn-primary btn-circle"><i className="fa fa-facebook"/></a>
                </li>
                <li>
                    <a href-void="" className="btn btn-info btn-circle"><i className="fa fa-twitter"/></a>
                </li>
                <li>
                    <a href-void="" className="btn btn-warning btn-circle"><i className="fa fa-linkedin"/></a>
                </li>
            </ul>
        );
    }
}

class LoginForm extends React.Component
{
    constructor(props) {
        super(props);

        this._onFocus = this._onFocus.bind(this);
        this._clearRefs = this._clearRefs.bind(this);
        this._onAuthChange = this._onAuthChange.bind(this);
        this._submitLogin = this._submitLogin.bind(this);
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

    _onAuthChange(data) {
        let form = $('#login-form');
        form.find('input').prop('disabled', false);

        this._clearRefs();
        if (data.authError == null) {
            Actions.startup("/api/user");
            History.pushState(null, "/public/vietnam");
        }
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

    render() {
        return (
            <div>
                <div className="well no-padding">
                    <UiValidate>
                        <form id="login-form" className="smart-form client-form">
                            <header> Sign In </header>
                            <ErrorView className="alert alert-danger"/>
                            <fieldset>
                                <section>
                                    <label className="label">E-mail</label>
                                    <label className="input"> <i className="icon-append fa fa-user"/>
                                    <input type="email" name="email" ref="email"
                                        onFocus={this._onFocus} 
                                        data-smart-validate-input=""
                                        data-required="" data-email=""
                                        data-message-required="Please enter your email address"
                                        data-message-email="Account is your email address"/>
                                        <b className="tooltip tooltip-top-right">
                                            <i className="fa fa-user txt-color-teal"/>Please enter email address/username
                                        </b>
                                    </label>
                                </section>
                                <section>
                                    <label className="label">Password</label>
                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                    <input type="password" name="password" ref="password"
                                        onFocus={this._onFocus} 
                                        data-smart-validate-input="" data-required=""
                                        data-minlength="3" data-maxnlength="20"
                                        data-message="Please enter your account password"/>
                                        <b className="tooltip tooltip-top-right">
                                            <i className="fa fa-lock txt-color-teal"/> Enter your password
                                        </b>
                                    </label>
                                    <div className="note">
                                        <Link to="/register/recover">Forgot password?</Link>
                                    </div>
                                </section>
                                <section>
                                    <label className="checkbox">
                                        <input type="checkbox" ref="remember" name="remember" defaultChecked={true}/>
                                        <i/>Stay signed in
                                    </label>
                                </section>
                            </fieldset>
                            <footer>
                                <button className="btn btn-primary" onClick={this._submitLogin}>Sign in</button>
                            </footer>
                        </form>
                    </UiValidate>
                </div>
                <h5 className="text-center"> - Or sign in using -</h5>
                    <LoginSocial />    
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
                            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-8 hidden-xs hidden-sm">
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
