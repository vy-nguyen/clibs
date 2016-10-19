/**
 * Created by griga on 11/17/15.
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';
import {Link} from 'react-router';
import {Dropdown, MenuItem} from 'react-bootstrap';

import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ToggleMenu         from 'vntd-shared/layout/ToggleMenu.jsx';
import SearchMobile       from 'vntd-shared/layout/SearchMobile.jsx';
import ActivitiesDropdown from 'vntd-shared/activities/ActivitiesDropdown.jsx';
import AboutUsStore       from 'vntd-root/stores/AboutUsStore.jsx';
import LanguageStore      from 'vntd-root/stores/LanguageStore.jsx';
import LangMenu           from 'vntd-root/components/LangMenu.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import LoginRegDropDown   from './LoginRegDropDown.jsx';

/*
let BlogMenu = React.createClass({

    render: function() {
        return (
            <Dropdown className="dropdown" id="header-blog">
                <Dropdown.Toggle className="dropdown-toggle bg-color-blue txt-color-white">
                    <span className="activity-dropdown">
                        <i className="fa fa-lg fa-fw fa-book"/><b className="badge">Blog</b>
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu pull-right text-left">
                    <MenuItem><p className="txt-color-darken no-margin">Chinh Tri</p></MenuItem>
                    <MenuItem><p className="txt-color-darken no-margin">Kinh Te</p></MenuItem>
                    <MenuItem><p className="txt-color-darken no-margin">Giao Duc</p></MenuItem>
                    <MenuItem><p className="txt-color-darken no-margin">Ky Thuat</p></MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
});
*/

class HeaderBtn extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="logo-group">
                <span id="activity" className="activity-dropdown"
                    data-toggle="tooltip" data-placement="right" title={this.props.text}>
                    <Link to={this.props.linkTo}>
                        <i className={this.props.icon}/>
                    </Link>
                </span>
            </div>
        )
    }
};

let Header = React.createClass({

    mixins: [
        Reflux.connect(UserStore),
        Reflux.connect(AboutUsStore),
        Reflux.connect(LanguageStore)
    ],

    render: function() {
        let loginMenu, logoutMenu = null;
        let logoText = AboutUsStore.getData().login;
        let titleText = logoText ? logoText.headerBar : "Vietnam Tu Do";

        if (UserStore.isLogin()) {
            loginMenu = <ActivitiesDropdown url={'api/user-notification'}/>;
            logoutMenu = (
                <div id="logout" className="btn-header transparent pull-right">
                    <span>
                        <a href="/login/logout" title="Sign Out" data-logout-msg="Close this browser window">
                            <i className="fa fa-sign-out"/>
                        </a>
                    </span>
                </div>
            );
        } else {
            loginMenu = (
                <span id="activity" className="activity-dropdown">
                    <Link to="/login"><i className="fa fa-user"/><b className="badge"><Mesg text="Login"/></b></Link>
                </span>
            );
        }
        let logoBlock = (
            <div id="logo-group">
                <span id="logo" className="pull-left">
                    <Link to="/" title={titleText}><span><b>{titleText}</b></span></Link>
                </span>
                {loginMenu}
            </div>
        );
        let searchText = LanguageStore.translate("Search");
        return (
            <header id="header">
                {logoBlock}
                <HeaderBtn linkTo="/public/blogs" icon="fa fa-book" text="Read Blogs"/>
                <HeaderBtn linkTo="/public/ads" icon="fa fa-money" text="View Ads"/>
                <HeaderBtn linkTo="/public/estore" icon="fa fa-shopping-cart" text="Shop E-Store"/>

                <div className="pull-right">
                    <ToggleMenu className="btn-header pull-right"/>
                    <LangMenu/>
                    {logoutMenu}
                    <SearchMobile className="btn-header transparent pull-right"/>

                    <form action="#/misc/search.html" className="header-search pull-right">
                        <input id="search-fld" type="text" name="param" placeholder={searchText} data-autocomplete='[]' />
                        <button type="submit"><i className="fa fa-search"/></button>
                        <a href="$" id="cancel-search-js" title="Cancel Search"><i className="fa fa-times"/></a>
                    </form>
                </div>
            </header>
        );
    }
});

export default Header
