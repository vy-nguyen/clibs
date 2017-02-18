/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react-mod';
import {Link}       from 'react-router';

import UiValidate   from 'vntd-shared/forms/validation/UiValidate.jsx';
import LoadHtml     from 'vntd-shared/utils/LoadHtml.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import History      from 'vntd-shared/utils/History.jsx';
import {htmlCodes}  from 'vntd-root/config/constants.js';
import Mesg         from 'vntd-root/components/Mesg.jsx';
import Lang         from 'vntd-root/stores/LanguageStore.jsx';

import {LoginAbout, LoginSocial} from './Login.jsx';

class RegisterHeader extends React.Component
{
    render() {
        return (
            <header id="header" className="animated fadeInDown">
                <div id="logo-group">
                    <span id="logo"> <img src="/rs/img/logo/flag.png" alt="Viet Nam"/> </span>
                </div>
                <span id="extr-page-header-space">
                    <span className="hidden-mobile hiddex-xs"><Mesg text="Already registered?"/></span>{htmlCodes.spaceNoBreak}
                    <Link to="/login" className="btn btn-danger"><Mesg text="Sign In"/></Link>
                </span>
            </header>
        );
    }
}

class RegisterForm extends React.Component
{
    constructor(props) {
        super(props);
        this._onFocus = this._onFocus.bind(this);
        this._resetRefs = this._resetRefs.bind(this);
        this._submitRegister = this._submitRegister.bind(this);
        this._registerResult = this._registerResult.bind(this);
    }

    componentWillMount() {
        if (UserStore.isLogin()) {
            History.pushState(null, "/public/vietnam");
        }
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._registerResult);
        if (UserStore.getAuthCode() == "register-done") {
            $('#id-register-info').show();
        }
    }

    componentWillMount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    render() {
        return (
            <div>
                <div className="well no-padding">
                    <UiValidate>
                        <form onSubmit={this._submitRegister} id="smart-form-register" className="smart-form client-form">
                            <header><Mesg text="Register to open your account"/></header>
                            <fieldset>
                                <section>
                                    <div className="form-group alert alert-danger" id="id-register-error" style={{display:"none"}}>
                                        <a className="close" data-dismiss="alert" aria-label="close">x</a>
                                        <div id="id-register-error-text"></div>
                                    </div>
                                    <div className="form-group alert alert-info" id="id-register-info" style={{display:"none"}}>
                                        <a className="close" data-dismiss="alert" aria-label="close">x</a>
                                        <Mesg text="Success, sign in to your "/>
                                        <Link to="/login" className="btn btn-info"><Mesg text="account"/></Link>
                                    </div>
                                </section>
                            </fieldset>
                            <fieldset>
                                <section>
                                    <label className="input">
                                        <i className="icon-append fa fa-envelope"/>
                                        <input type="email" name="email" ref="email" placeholder={Lang.translate("Email address")}
                                                onFocus={this._onFocus}
                                                data-smart-validate-input="" data-required="" data-email=""
                                                data-message-required={Lang.translate("Please enter your email address")}
                                                data-message-email={Lang.translate("Account is your email address")}/>
                                        <b className="tooltip tooltip-bottom-right"><Mesg text="Needed to verify your account"/></b>
                                    </label>
                                </section>

                                <section>
                                    <label className="input">
                                        <i className="icon-append fa fa-lock"/>
                                        <input type="password" name="password" ref="password0" placeholder={Lang.translate("Password")}
                                                id="password"
                                                onFocus={this._onFocus}
                                                data-smart-validate-input="" data-required=""
                                                data-minlength="3" data-maxnlength="20"
                                                data-message={Lang.translate("You need a password")}/>
                                        <b className="tooltip tooltip-bottom-right"><Mesg text="Don't forget your password"/></b>
                                    </label>
                                </section>

                                <section>
                                    <label className="input">
                                        <i className="icon-append fa fa-lock"/>
                                        <input type="password" name="passwordConfirm" ref="password1"
                                                placeholder={Lang.translate("Confirm password")}
                                                onFocus={this._onFocus}
                                                data-smart-validate-input="" data-required=""
                                                data-minlength="3" data-maxnlength="20"
                                                data-message={Lang.translate("Password verification failed")}/> 
                                        <b className="tooltip tooltip-bottom-right"><Mesg text="Don't forget your password"/></b>
                                    </label>
                                </section>
                            </fieldset>
                            <fieldset>
                                <div className="row">
                                    <section className="col col-6">
                                        <label className="input">
                                            <input type="text" name="firstname" ref="firstName"
                                                placeholder={Lang.translate("First name")} onFocus={this._onFocus}/>
                                        </label>
                                    </section>
                                    <section className="col col-6">
                                        <label className="input">
                                            <input type="text" name="lastname" ref="lastName"
                                                placeholder={Lang.translate("Last name")} onFocus={this._onFocus}/>
                                        </label>
                                    </section>
                                </div>
                                <div className="row">
                                    <section className="col col-6">
                                        <label className="select">
                                            <select name="gender" ref="gender" defaultValue={"0"}>
                                                <option value="0" disabled={true}><Mesg text="Gender"/></option>
                                                <option value="1"><Mesg text="Male"/></option>
                                                <option value="2"><Mesg text="Female"/></option>
                                                <option value="3"><Mesg text="Prefer not to answer"/></option>
                                            </select> <i/>
                                        </label>
                                    </section>
                                    <section className="col col-6"></section>
                                </div>
                                <section>
                                    <label className="checkbox">
                                        <input type="checkbox" name="terms" ref="terms" id="terms"/>
                                        <i/><Mesg text="I agree with the"/>
                                        <a href="#" data-toggle="modal" data-target="#id-reg-modal"><Mesg text=" Terms and Conditions "/></a>
                                    </label>
                                </section>
                            </fieldset>
                            <footer>
                                <button type="submit" className="btn btn-primary"><Mesg text="Register"/></button>
                            </footer>

                            <div className="message">
                                <i className="fa fa-check"/>
                                <p><Mesg text="Thank you for your registration!"/></p>
                            </div>
                        </form>
                    </UiValidate>
                </div>
                <p className="note text-center"><Mesg text="Welcome to ..."/></p>
                <h5 className="text-center"><Mesg text="- Or sign in using -"/></h5>
                <LoginSocial/>
            </div>
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

        if (data.authCode == "register-done") {
            $('#id-register-info').show();

        } else if (data.authCode == "register-verify") {
            Actions.verifyAccount({
                type: data.authCode,
                authVerifToken: data.authVerifToken
            });
        } else if ((data.authCode == "failure") || (data.authError)) {
            data.authError.dispatchDefault("#id-register-error-text", "#id-register-error");
        } else {
        }
        this._resetRefs();
    }

    _onFocus() {
        $('#id-register-error').hide();
    }

    _submitRegister(event) {
        event.preventDefault();
        let data = {
            email    : this.refs.email.value,
            password0: this.refs.password0.value,
            password1: this.refs.password1.value,
            firstName: this.refs.firstName.value,
            lastName : this.refs.lastName.value,
            gender   : this.refs.gender.value,
            checkTerms: this.refs.terms.value
        };
        let form = $('#smart-form-register');
        form.find('input').prop('disabled', true);
        $('#id-register-error').hide();
        $('#id-register-info').hide();
        Actions.register(data);
    }
}

class RegisterTos extends React.Component
{
    render() {
        return (
            <div className="modal fade"
                id="id-reg-modal" tabIndex="-1" role="dialog" aria-labelledby="id-reg-modal-label" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="id-reg-modal-label"><Mesg text=" Terms & Conditions "/></h4>
                        </div>
                        <div className="modal-body custom-scroll terms-body">
                            <LoadHtml url="/public/terms-and-conditions" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal"><Mesg text="Cancel"/></button>
                            <button type="button" className="btn btn-primary" id="i-agree">
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
        return (
            <div id="extr-page" >
                <RegisterHeader/>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
                                <LoginAbout />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                                <RegisterForm />
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
export { RegisterForm }
