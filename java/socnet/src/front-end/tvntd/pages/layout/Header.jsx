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
import SmallBreadcrumbs   from 'vntd-shared/layout/SmallBreadcrumbs.jsx';
import LoginInfo          from 'vntd-shared/layout/LoginInfo.jsx';
import ActivitiesDropdown from 'vntd-shared/activities/ActivitiesDropdown.jsx';
import AboutUsStore       from 'vntd-root/stores/AboutUsStore.jsx';
import LanguageStore      from 'vntd-root/stores/LanguageStore.jsx';
import LangMenu           from 'vntd-root/components/LangMenu.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';

class LogoMenu extends React.Component
{
    constructor(props) {
        super(props);
    }

    _renderBtnRow(btnRow) {
        let elm, key, rows = [];

        _.forEach(btnRow, function(btn) {
            key = _.uniqueId('hr-');
            if (btn.dropMenu != null) {
                elm = btn.dropMenu;
            } else if (btn.tooltip != null) {
                elm = (
                    <span key={key} id="activity" title={btn.tooltip}
                        className="activity-dropdown"
                        data-original-title={btn.tooltip}
                        data-toggle="tooltip" data-placement="right">
                        <Link to={btn.linkTo}><i className={btn.icon}/></Link>
                    </span>
                );
            } else if (btn.badge != null) {
                elm = (
                    <span key={key} id="activity" className="activity-dropdown">
                        <Link to={btn.linkTo}>
                            <i className={btn.icon}/>
                            <b className="badge"><Mesg text={btn.badge}/></b>
                        </Link>
                    </span>
                );
            } else if (btn.spanId != null) {
                elm = (
                    //<span id={btn.spanId} className={btn.className}>
                    <span key={key} id={btn.spanId} className="activity-dropdown">
                        <Link to={btn.linkTo}>
                            <span><b><Mesg text={btn.title}/></b></span>
                        </Link>
                    </span>
                );
            } else {
                elm = (
                    <span key={key} id="activity" className="activity-dropdown">
                        <Link to={btn.linkTo}>
                            <span><b><Mesg text={btn.title}/></b></span>
                        </Link>
                    </span>
                );
            }
            rows.push(elm);
        });
        return rows;
    }

    render() {
        let login, btnRow, logoText = AboutUsStore.getData().login,
            titleText = logoText ? logoText.headerBar : "TDVN";

        if (UserStore.isLogin()) {
            login  = (
                <span>
                    <ActivitiesDropdown url={'api/user-notification'}/>
                </span>
            );
        } else {
            login = (
                <span id="activity" className="activity-dropdown">
                    <Link to="/login">
                        <i className="fa fa-user"/>
                        <b className="badge"><Mesg text="Login"/></b>
                    </Link>
                </span>
            );
        }
        btnRow = this._renderBtnRow(this.props.btnRow);
        return (
            <div id="logo-group">
                <LoginInfo/>
                {login}
                {btnRow}
            </div>
        );
    }
}

class HeaderSearch extends React.Component
{
    constructor(props) {
        super(props);
        this._updateLang = this._updateLang.bind(this);

        this.state = {
            searchText: "Search"
        };
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

    _updateLang(data) {
        this.setState({
            searchText: LanguageStore.translate("Search")
        });
    }

    render() {
        let mode = NavigationStore.getViewMode();

        if (mode == 'xs' || mode == 'sm') {
            return <SearchMobile className="btn-header transparent pull-right"/>;
        }
        return (
            <div className="header-search pull-right">
                <input id="search-fld" type="text"
                    name="param" className="input-lg"
                    placeholder={this.state.searchText} data-autocomplete='[]'/>
                <button><i className="fa fa-lg fa-search"/></button>
            </div>
        );
    }
}

class Header extends React.Component
{
    constructor(props) {
        super(props);
        this.btnHeader =  [ {
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

    _updateLang(data) {
        _.forEach(this.btnHeader, function(btn) {
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
    }

    render() {
        let logout = null

        if (UserStore.isLogin()) { 
            logout = (
                <div id="logout" className="btn-header transparent pull-right">
                    <span>
                        <a href="/login/logout" title="Sign Out"
                            data-logout-msg="Close this browser window">
                            <i className="fa fa-sign-out"/>
                        </a>
                    </span> 
                </div>
            );
        }
        return (
            <header id="header">
                <LogoMenu btnRow={this.btnHeader}/>
                <div className="pull-right">
                    <LangMenu/>
                    {logout}
                    <HeaderSearch/>
                </div>
            </header>
        );
    }
}

export default Header;
export { HeaderSearch };

