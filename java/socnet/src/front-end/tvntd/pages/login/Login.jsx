/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'uses strict';

import React         from 'react-mod';
import { Link }      from 'react-router';
import Reflux        from 'reflux';

import {htmlCodes}   from 'vntd-root/config/constants.js';
import Actions       from 'vntd-root/actions/Actions.jsx';
import UserStore     from 'vntd-shared/stores/UserStore.jsx';
import UiValidate    from 'vntd-shared/forms/validation/UiValidate.jsx';
import History       from 'vntd-shared/utils/History.jsx';
import ErrorDispatch from 'vntd-shared/actions/ErrorDispatch.jsx';

let LoginHeader = React.createClass({
    render: function() {
        return (
<header id="header" className="animated fadeInDown">
    <div id="logo-group">
        <span id="logo"> <img src="/rs/img/logo.png" alt="SmartAdmin"/></span>
    </div>
    <span id="extr-page-header-space">
        <span className="hidden-mobile hiddex-xs">Need an account?</span>{htmlCodes.spaceNoBreak}
        <Link to="/register" className="btn btn-danger">Create Account</Link>
    </span>
</header>
        );
    }
});

let LoginAbout = React.createClass({

    render: function() {
        return (
<div>
    <h1 className="txt-color-red login-header-big">Tien Viet Nam Tu Do</h1>
    <div className="hero">
        <div className="pull-left login-desc-box-l">
            <h4 className="paragraph-header">
                Something here...
            </h4>
            <div className="login-app-icons">
                <a href="#/dashboard" className="btn btn-danger btn-sm">How does it work</a>
                <span> </span>
                <a href="#/smartadmin/different-versions.html" className="btn btn-danger btn-sm">About us</a>
            </div>
        </div>
        <img src="/rs/img/demo/iphoneview.png" className="pull-right display-image" alt="" style={{width:'210px'}}/>
    </div>
    <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <h5 className="about-heading">About Viet Nam Tu Do</h5>
            <p>
                Something about us
            </p>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <h5 className="about-heading">Not just ordinary social platform!</h5>
            <p>
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                nobis est eligendi voluptatem accusantium!
            </p>
        </div>
    </div>
</div>
        );
    }
});

let LoginSocial = React.createClass({
    render: function() {
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
});

class ErrorHandler extends ErrorDispatch
{
    handle401Error(xhdr, text, cbArg) {
        cbArg.authError = xhdr.responseJSON.message;
    }
}

let LoginForm = React.createClass({
    mixins: [
        Reflux.connect(UserStore)
    ],

    componentWillMount: function() {
        if (UserStore.isLogin()) {
            History.pushState(null, "/public/vietnam");
        }
    },

    componentDidMount: function() {
        this.listenTo(UserStore, this._onAuthChange);
    },

    _onAuthChange: function(data) {
        let form = $('#login-form');
        form.find('input').prop('disabled', false);

        if (data.authError == null) {
            History.pushState(null, "/public/vietnam");
            return;
        }
        let error = new ErrorHandler(data.authError, data.authMesg);
        error.dispatch(data);
        error = null;

        $('#id-login-error-text').empty().html(data.authError);
        $('#id-login-error').show();
    },

    _onFocus: function() {
        $('#id-login-error').hide();
    },

    _submitLogin: function(event) {
        let form = $('#login-form');
        let formData = form.serialize();
        $('#id-login-error').hide();
        form.find('input').prop('disabled', true);
        event.preventDefault();

        Actions.login({
            email: this.refs.email.getDOMNode().value,
            password: this.refs.password.getDOMNode().value,
            remember: this.refs.remember.getDOMNode().value
        }, formData);
    },

    render: function() {
        return (
<div>
    <div className="well no-padding">
        <UiValidate>
        <form id="login-form" onSubmit={this._submitLogin} className="smart-form client-form">
            <header> Sign In </header>
            <fieldset>
                <section>
                    <div className="form-group alert alert-danger" id="id-login-error" style={{display:"none"}}>
                        <a className="close" data-dismiss="alert" aria-label="close">x</a>
                        <div id="id-login-error-text"></div>
                    </div>
                </section>
            </fieldset>
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
                        <Link to="/recover">Forgot password?</Link>
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
                <button type="submit" className="btn btn-primary">Sign in</button>
            </footer>
        </form></UiValidate>
    </div>
    <h5 className="text-center"> - Or sign in using -</h5>
    <LoginSocial />    
</div>
        );
    }
});

let Login = React.createClass({
    render: function () {
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
});

export { Login }
export { LoginForm }
export { LoginAbout }
export { LoginHeader }
export { LoginSocial }
