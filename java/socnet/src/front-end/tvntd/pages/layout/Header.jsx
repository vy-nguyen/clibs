/**
 * Created by griga on 11/17/15.
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';
import {Link} from 'react-router';
/*
import FullScreen from '../../components/layout/actions/FullScreen.jsx'
import SpeechButton from '../../components/layout/actions/SpeechButton.jsx'
import SearchMobile from '../../components/layout/actions/SearchMobile.jsx'

import DeviceDetect from '../../components/layout/tools/DeviceDetect.jsx'
 */
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ToggleMenu         from 'vntd-shared/layout/ToggleMenu.jsx';
import SearchMobile       from 'vntd-shared/layout/SearchMobile.jsx';
import LanguageSelector   from 'vntd-shared/i18n/LanguageSelector.jsx';
import ActivitiesDropdown from 'vntd-shared/activities/ActivitiesDropdown.jsx';
import LoginRegDropDown   from './LoginRegDropDown.jsx';

let Header = React.createClass({

    mixins: [
        Reflux.connect(UserStore)
    ],

    getInitialState: function() {
        return UserStore.getSelf();
    },

    render: function () {
        let login_menu, logout_menu, logo_block;

        if (UserStore.isLogin()) {
            login_menu = <ActivitiesDropdown url={'api/user-notification'}/>;
            logout_menu = (
                <div id="logout" className="btn-header transparent pull-right">
                    <span>
                        <a href="/login/logout" title="Sign Out" data-logout-msg="Close this browser window">
                            <i className="fa fa-sign-out"/>
                        </a>
                    </span>
                </div>
            );
        } else {
            login_menu = (
                <span id="activity" className="activity-dropdown">
                    <Link to="/login"><i className="fa fa-user"/><b className="badge">Login</b></Link>
                </span>
            );
        }
        logo_block = (
            <div id="logo-group">
                <span id="logo">
                    <Link to="/" title="Vietnam Tu Do">
                        <span><b>Viet Nam Tu Do</b></span>
                    </Link>
                </span>
                {login_menu}
            </div>
        );
        return (
<header id="header">
    {logo_block}
    <div className="pull-right">
        <ToggleMenu className="btn-header pull-right"/>
        {logout_menu}
        <SearchMobile className="btn-header transparent pull-right"/>

        <form action="#/misc/search.html" className="header-search pull-right">
            <input id="search-fld" type="text" name="param" placeholder="Find reports and more" data-autocomplete='[]' />
            <button type="submit"><i className="fa fa-search"/></button>
            <a href="$" id="cancel-search-js" title="Cancel Search"><i className="fa fa-times"/></a>
        </form>
    </div>
</header>
        );
    }
});

export default Header
