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
            this.setState(data.userSelf);
        }
    }

    render() {
		return (
            <div className="login-info">
	            <span>
                    <ToggleShortcut>
                        <img src={this.state.userImgUrl} alt="Menu" className="online"/>;
		            </ToggleShortcut>
	            </span>
            </div>
		)
    }
}

export default LoginInfo
