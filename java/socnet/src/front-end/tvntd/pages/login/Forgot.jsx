/**
 * Copyright Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React      from 'react';
import Actions    from 'vntd-root/actions/Actions.jsx';
import History    from 'vntd-shared/utils/History.jsx';
import UserStore  from 'vntd-shared/stores/UserStore.jsx';
import { LoginAbout, LoginHeader, LoginSocial } from './Login.jsx';

class Forgot extends React.Component
{
    constructor(props) {
        super(props);
        this._submitResult = this._submitResult.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this.state = {
            display: 'none'
        };
    }

    componentWillMount() {
        if (UserStore.isLogin()) {
            History.pushState(null, "public/vietnam");
        }
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._submitResult);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _submitResult(data) {
        this.setState({
            display: 'none'
        });
    }

    _submitForm(event) {
        event.preventDefault();
        let data = {
            email: this.refs.email.value
        };
        Actions.resetPassword(data);
        this.setState({
            display: 'inline'
        });
    }

    render() {
        let style = { display: this.state.display };
        let mesg = "We sent reset password to your email";
        if (this.refs.email != null) {
            mesg = mesg + ": " + this.refs.email.value;
        }
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
                                    <form id="login-form" className="smart-form client-form">
                                        <header>Forgot Password</header>
                                        <fieldset>
                                            <section>
                                                <div className="form-group alert alert-info" id="id-acct-info" style={style}>
                                                    <a className="close" data-dismiss="alert" aria-label="close">x</a>
                                                    <b>{mesg}</b>
                                                </div>
                                            </section>
                                            <section>
                                                <label className="label">Enter your email address</label>
                                                <label className="input">
                                                    <i className="icon-append fa fa-envelope"/>
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
                                            <button type="button" className="btn btn-primary" onClick={this._submitForm}>
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
    }
}

export default Forgot
