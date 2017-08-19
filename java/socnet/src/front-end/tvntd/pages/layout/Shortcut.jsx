/**
 * Modified by Vy Nguyen (2016)
 */
import _          from 'lodash';
import React      from 'react-mod'
import {Link}     from 'react-router'
import {VntdGlob} from 'vntd-root/config/constants.js';
import Actions    from 'vntd-root/actions/Actions.jsx';
import Mesg       from 'vntd-root/components/Mesg.jsx';
import UserStore  from 'vntd-shared/stores/UserStore.jsx';

class Shortcut extends React.Component
{
    constructor(props) {
        super(props);
        this._toggleSideBar = this._toggleSideBar.bind(this);
        this.common = [ {
            routeTo: "/app",
            btnFmt : "btn-primary",
            icon   : "fa-home",
            text   : "Home"
        }, {
            onClick: this._toggleSideBar,
            btnFmt : "btn-success",
            icon   : "fa-window-restore",
            text   : "Side Menu"
        } ];
        this.login = [ {
            routeTo: "/user/profile",
            btnFmt : "btn-info",
            icon   : "fa-user",
            text   : "Profile"
        } ];
        this.public = [ {
            routeTo: "/public/ads",
            btnFmt : "btn-info",
            icon   : "fa-shopping-cart",
            text   : "Ads"
        } ];
    }

    _toggleSideBar() {
        Actions.toggleSideBar();
        console.log("toggle sidebar");
    }

    _renderEntry(entry) {
        let fmt = "btn " + entry.btnFmt;

        if (entry.onClick != null) {
            return (
                <li key={_.uniqueId('sc-')}>
                    <button className={fmt} onClick={entry.onClick}>
                        <i className={"fa fa-lg " + entry.icon}/>
                        <span> <Mesg text={entry.text}/></span>
                    </button>
                </li>
            );
        }
        return (
            <li key={_.uniqueId('sc-')}>
                <Link to={entry.routeTo}>
                    <button className={fmt}>
                        <i className={"fa fa-lg " + entry.icon}/>
                        <span> <Mesg text={entry.text}/></span>
                    </button>
                </Link>
            </li>
        );
    }

    _renderEntries(entries, out) {
        _.forEach(entries, function(entry) {
            out.push(this._renderEntry(entry));
        }.bind(this));
    }

    _renderLogin(out) {
        this._renderEntries(this.common, out);
        this._renderEntries(this.login, out);
    }

    _renderPublic(out) {
        this._renderEntries(this.common, out);
        this._renderEntries(this.public, out);
    }

    render() {
        let out = [];

        if (UserStore.isLogin()) {
            this._renderLogin(out);
        } else {
            this._renderPublic(out);
        }
        return (
            <div id="shortcut">
                <ul>
                    {out}
                </ul>
            </div>
        );
    }
}

// className="jarvismetro-tile selected bg-color-pinkDark">

export default Shortcut
