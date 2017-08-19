/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React          from 'react-mod';
import {Link}         from 'react-router';
import Mesg           from 'vntd-root/components/Mesg.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import UserBase       from 'vntd-shared/layout/UserBase.jsx';
import {VntdGlob}     from 'vntd-root/config/constants.js';
import LanguageStore  from 'vntd-root/stores/LanguageStore.jsx';
import ToggleShortcut from './ToggleShortcut.jsx';

class LoginInfo extends UserBase
{
    constructor(props) {
        super(props);
    }

    // @Override
    //
    _updateUser(data) {
        if (data.authError == null && data.userSelf) {
            let user = data.userSelf;

            if (!UserStore.isLogin()) {
                user.userImgUrl = "/rs/img/logo/logo.jpg";
            }
            this.setState(user);
        }
    }

    render() {
		return (
            <span style={VntdGlob.logoSpan}>
                <ToggleShortcut>
                    <img style={VntdGlob.styleLogo}
                        src={this.state.userImgUrl} alt="Menu"/>
		        </ToggleShortcut>
            </span>
		)
    }
}

export default LoginInfo
