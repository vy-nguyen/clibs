/**
 * Created by griga on 11/17/15.
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React  from 'react-mod';
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

class Header extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            searchText: "Search"
        };
        this._updateLang = this._updateLang.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateState);
        this.unsubLang = LanguageStore.listen(this._updateLang);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsubLang();
            this.unsub = null;
            this.unsubLang = null;
        }
    }

    _updateState(data) {
        if (this.state.login === false && UserStore.isLogin()) {
            this.setState({
                login: true,
                searchText: LanguageStore.translate("Search")
            });
        }
    }

    _updateLang(data) {
        this.setState({
            searchText: LanguageStore.translate("Search")
        });
    }

    render() {
        let loginMenu, logoutMenu = null;
        let logoText = AboutUsStore.getData().login;
        let titleText = logoText ? logoText.headerBar : "Vietnam Tu Do";

        if (this.state.login === true) {
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
        return (
            <header id="header">
                {logoBlock}
                <HeaderBtn linkTo="/public/blog" icon="fa fa-book" text={LanguageStore.translate("Read Blogs")}/>
                <HeaderBtn linkTo="/public/edu" icon="fa fa-users" text={LanguageStore.translate("Education")}/>
                <HeaderBtn linkTo="/public/ads" icon="fa fa-money" text={LanguageStore.translate("View Ads")}/>
                <HeaderBtn linkTo="/public/estore" icon="fa fa-shopping-cart" text={LanguageStore.translate("Shop E-Store")}/>

                <div className="pull-right">
                    <ToggleMenu className="btn-header pull-right"/>
                    <LangMenu/>
                    {logoutMenu}
                    <SearchMobile className="btn-header transparent pull-right"/>

                    <form action="#/misc/search.html" className="header-search pull-right">
                        <input id="search-fld" type="text" name="param"
                            placeholder={this.state.searchText} data-autocomplete='[]' />
                        <button type="submit"><i className="fa fa-search"/></button>
                        <a href="$" id="cancel-search-js" title="Cancel Search"><i className="fa fa-times"/></a>
                    </form>
                </div>
            </header>
        );
    }
}

export default Header;
