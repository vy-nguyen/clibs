/**
 * Copyright Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React      from 'react';
import Reflux     from 'reflux';
import Actions    from 'vntd-root/actions/Actions.jsx';
import UserStore  from 'vntd-shared/stores/UserStore.jsx';
import { LoginAbout, LoginHeader, LoginSocial } from './Login.jsx';

let Forgot = React.createClass({

    mixins: [
        Reflux.connect(UserStore)
    ],

    componentDidMount: function() {
        this.listenTo(UserStore, this._submitResult);
    },

    render: function () {
        return (
<div id="extr-page">
    <LoginHeader/> 
    <div id="main" role="main" className="animated fadeInDown">
        <div id="content" className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-8 hidden-xs hidden-sm">
                    <LoginAbout/>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                    <div className="well no-padding">
                        <form onSubmit={this._submitForm} id="login-form" className="smart-form client-form">
                            <header>Forgot Password</header>

                            <fieldset>
                                <section>
                                    <div className="form-group alert alert-info" id="id-acct-info" style={{display:"none"}}>
                                        <a className="close" data-dismiss="alert" aria-label="close">x</a>
                                        <div id="id-acct-reset-info"></div>
                                    </div>
                                </section>
                                <section>
                                    <label className="label">Enter your email address</label>
                                    <label className="input"> <i className="icon-append fa fa-envelope"/>
                                        <input type="email" name="email" ref="email"/>
                                        <b className="tooltip tooltip-top-right">
                                            <i className="fa fa-envelope txt-color-teal"/>
                                            Please enter email address for password reset
                                        </b>
                                    </label>
                                </section>
                                {/*
                                <section>
                                    <span className="timeline-seperator text-center text-primary">
                                        <span className="font-sm">OR</span>
                                    </span>
                                </section>
                                <section>
                                    <label className="label">Your Username</label>
                                    <label className="input"> <i className="icon-append fa fa-user"/>
                                        <input type="text" name="username"/>
                                        <b className="tooltip tooltip-top-right">
                                            <i className="fa fa-user txt-color-teal"/> Enter your username
                                        </b>
                                    </label>
                                    <div className="note">
                                        <a href="#/login">I remembered my password!</a>
                                    </div>
                                </section>
                                */}
                            </fieldset>
                            <footer>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fa fa-refresh"/> Reset Password
                                </button>
                            </footer>
                        </form>
                    </div>
                    <h5 className="text-center"> - Or sign in using -</h5>
                    <LoginSocial/> 
                </div>
            </div>
        </div>
    </div>
</div>
        );
    },

    _submitResult: function(data) {
        console.log("Reset result");
        console.log(data);
    },

    _submitForm: function(event) {
        event.preventDefault();
        let data = {
            email: this.refs.email.getDOMNode().value
        };
        Actions.resetPassword(data);

        let form = $('#login-form');
        form.find('input').prop('disabled', true);
        $('#id-acct-info').show();
        $('#id-acct-reset-info').empty().html("We sent reset password to email " + data.email);
    }
});

export default Forgot
