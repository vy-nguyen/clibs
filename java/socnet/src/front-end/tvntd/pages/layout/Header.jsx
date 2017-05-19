/**
 * Created by griga on 11/17/15.
 * Modified Vy Nguyen (2016)
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';
import {Link} from 'react-router';
import {Dropdown, MenuItem} from 'react-bootstrap';

import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import NavigationStore    from 'vntd-shared/stores/NavigationStore.jsx';
import ToggleMenu         from 'vntd-shared/layout/ToggleMenu.jsx';
import SearchMobile       from 'vntd-shared/layout/SearchMobile.jsx';
import ActivitiesDropdown from 'vntd-shared/activities/ActivitiesDropdown.jsx';
import AboutUsStore       from 'vntd-root/stores/AboutUsStore.jsx';
import LanguageStore      from 'vntd-root/stores/LanguageStore.jsx';
import LangMenu           from 'vntd-root/components/LangMenu.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import Startup            from 'vntd-root/pages/login/Startup.jsx';
import LoginRegDropDown   from './LoginRegDropDown.jsx';

class HeaderBtn extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            text: LanguageStore.translate(this.props.text)
        }
        this._updateLang = this._updateLang.bind(this);
    }

    componentDidMount() {
        this.unsub = LanguageStore.listen(this._updateLang);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateLang() {
        this.setState({
            text: LanguageStore.translate(this.props.text)
        });
    }

    render() {
        return (
            <div id="logo-group">
                <span id="activity" className="activity-dropdown"
                    data-original-title={this.state.text}
                    data-toggle="tooltip" data-placement="right" title={this.state.text}>
                    <Link to={this.props.linkTo}>
                        <i className={this.props.icon}/>
                    </Link>
                </span>
            </div>
        )
    }
};

class HeaderBtnRow extends React.Component
{
    constructor(props) {
        super(props);
        this._updateLang = this._updateLang.bind(this);
        this._transText  = this._transText.bind(this);

        this.state = {
            buttons: this._transText(props)
        }
    }

    componentDidMount() {
        this.unsub = LanguageStore.listen(this._updateLang);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateLang() {
        this.setState({
            buttons: this._transText(this.props)
        });
    }

    _transText(props) {
        _.forEach(props.buttons, function(btn) {
            if (btn.tooltip != null) {
                btn.tooltip = LanguageStore.translate(btn.tooltip);
            }
            if (btn.title != null) {
                btn.title = LanguageStore.translate(btn.title);
            }
            if (btn.badge != null) {
                btn.badge = LanguageStore.translate(btn.badge);
            }
        });
        return props.buttons;
    }

    render() {
        let elm, rows = [];

        _.forEach(this.state.buttons, function(btn) {
            if (btn.dropMenu != null) {
                elm = btn.dropMenu;
            } else if (btn.tooltip != null) {
                elm = (
                    <span id="activity" className="activity-dropdown"
                        data-original-title={btn.tooltip}
                        data-toggle="tooltip" data-placement="right" title={btn.tooltip}>
                        <Link to={btn.linkTo}><i className={btn.icon}/></Link>
                    </span>
                );
            } else if (btn.badge != null) {
                elm = (
                    <span id="activity" className="activity-dropdown">
                        <Link to={btn.linkTo}>
                            <i className={btn.icon}/>
                            <b className="badge"><Mesg text={btn.badge}/></b>
                        </Link>
                    </span>
                );
            } else if (btn.spanId != null) {
                elm = (
                    //<span id={btn.spanId} className={btn.className}>
                    <span id={btn.spanId} className="activity-dropdown">
                        <Link to={btn.linkTo}>
                            <span><b><Mesg text={btn.title}/></b></span>
                        </Link>
                    </span>
                );
            } else {
                elm = (
                    <span id="activity" className="activity-dropdown">
                        <Link to={btn.linkTo}>
                            <span><b><Mesg text={btn.title}/></b></span>
                        </Link>
                    </span>
                );
            }
            rows.push(elm);
        });
        return (
            <div id="logo-group">
                {rows}
            </div>
        );
    }
}

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

    _updateState(data, startPage) {
        if (this.state.login === false && UserStore.isLogin()) {
            this.setState({
                login     : true,
                searchText: LanguageStore.translate("Search")
            });
        }
        Startup.mainStartup();
    }

    _updateLang(data) {
        this.setState({
            searchText: LanguageStore.translate("Search")
        });
    }

    render() {
        let loginMenu, logoBlock, search, btnRow, logoutMenu = null,
            mode = NavigationStore.getViewMode(),
            logoText = AboutUsStore.getData().login,
            titleText = logoText ? logoText.headerBar : "Vietnam Tu Do",
                /*
            btnHeader = [ {
                linkTo  : "/",
                icon    : null,
                spanId  : "logo",
                title   : logoText ? logoText.headerBar : "Vietnam Tu Do",
                className: "pull-left"
            }, {
                linkTo  : "/login",
                icon    : "fa fa-user",
                badge   : "Login",
                dropMenu: null
            }, {
                 */
            btnHeader = [ {
                linkTo  : "/public/blog",
                icon    : "fa fa-users",
                tooltip : "Read Blogs"
            }, {
                linkTo  : "/public/edu",
                icon    : "fa fa-book",
                tooltip : "Education"
            }, {
                linkTo  : "/public/ads",
                icon    : "fa fa-money",
                tooltip : "View Ads"
            }, {
                linkTo  : "/public/estore",
                icon    : "fa fa-shopping-cart",
                tooltip : "Shop E-Store"
            } ];

        if (this.state.login === true) {
            loginMenu = <ActivitiesDropdown url={'api/user-notification'}/>;
            logoutMenu = (
                <div id="logout" className="btn-header transparent pull-right">
                    <span>
                        <a href="/login/logout" title="Sign Out"
                            data-logout-msg="Close this browser window">
                            <i className="fa fa-sign-out"/>
                        </a>
                    </span>
                </div>
            );
        } else {
            loginMenu = (
                <span id="activity" className="activity-dropdown">
                    <Link to="/login">
                        <i className="fa fa-user"/>
                        <b className="badge"><Mesg text="Login"/></b>
                    </Link>
                </span>
            );
        }
        logoBlock = (
            <div id="logo-group">
                <span id="logo" className="pull-left">
                    <Link to="/public/aboutus" title={titleText}>
                        <span><b>{titleText}</b></span>
                    </Link>
                </span>
                {loginMenu}
            </div>
        );
        if (mode == 'xs' || mode == 'sm') {
            btnRow = null;
            search = <SearchMobile className="btn-header transparent pull-right"/>
        } else {
            search = (
                <form action="#/misc/search.html" className="header-search pull-right">
                    <input id="search-fld" type="text" name="param"
                        placeholder={this.state.searchText} data-autocomplete='[]' />
                    <button type="submit"><i className="fa fa-search"/></button>
                    <a href="$" id="cancel-search-js" title="Cancel Search">
                        <i className="fa fa-times"/>
                    </a>
                </form>
            );
            btnRow = <HeaderBtnRow buttons={btnHeader}/>
        }
        return (
            <header id="header">
                {logoBlock}
                {btnRow}
                <div className="pull-right">
                    <ToggleMenu className="btn-header pull-right"/>
                    <LangMenu/>
                    {logoutMenu}
                    {search}
                </div>
            </header>
        );
    }
}

export default Header;
