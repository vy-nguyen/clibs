/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import $             from 'jquery';
import _             from 'lodash';
import React         from 'react-mod';
import {Link}        from 'react-router';

import LoadHtml      from 'vntd-shared/utils/LoadHtml.jsx';
import {htmlCodes}   from 'vntd-root/config/constants.js';
import Mesg          from 'vntd-root/components/Mesg.jsx';
import BoostRegister from 'vntd-shared/component/BoostRegister.jsx';

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
        let aboutFmt = "col-md-4 col-lg-4 hidden-xs hidden-sm";
        return (
            <div id="extr-page" >
                <RegisterHeader/>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <div className={aboutFmt}>
                                <LoginAbout logoImg={false}/>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                <BoostRegister/>
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
