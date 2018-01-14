/**
 * Copyright by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import React             from 'react-mod';
import PropTypes         from 'prop-types';

import ModalConfirm      from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import {LoginForm}       from 'vntd-root/pages/login/Login.jsx';

class BoostLogin extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="hidden-xs hidden-sm col-md-6 col-lg-6">
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <LoginForm className="no-padding" suffix="login"/>
                </div>
            </div>
        );
    }
}

BoostLogin.propTypes = {
};

export default BoostLogin;
