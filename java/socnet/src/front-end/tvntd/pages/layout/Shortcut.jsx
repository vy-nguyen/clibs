/**
 * Modified by Vy Nguyen (2016)
 */
import React      from 'react-mod'
import {Link}     from 'react-router'
import Mesg       from 'vntd-root/components/Mesg.jsx';
import UserStore  from 'vntd-shared/stores/UserStore.jsx';

class Shortcut extends React.Component
{
    constructor(props) {
        super(props);
    }

	_renderLogin() {
		return (
            <div id="shortcut">
                <ul>
                    <li>
                        <Link to="/user/profile" title="My Profile"
                            className="jarvismetro-tile bg-color-blue">
                            <span className="iconbox">
                                <i className="fa fa-user-circle fa-2x" />
                                <span><Mesg text='My Profile'/></span>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/app"
                            className="jarvismetro-tile bg-color-orangeDark">
                            <span className="iconbox">
                                <i className="fa fa-home fa-2x" />
                                <span><Mesg text='Front Page'/> </span>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/user/account"
                            className="jarvismetro-tile bg-color-purple">
                            <span className="iconbox">
                                <i className="fa fa-suitcase fa-2x" />
                                <span><Mesg text='Maps'/> </span>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/public"
                            className="jarvismetro-tile bg-color-pinkDark">
                            <span className="iconbox">
                                <i className="fa fa-user fa-2x" />
                                <span><Mesg text='NewsFeed'/> </span>
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    _renderPublic() {
        return (
            <div id="shortcut">
                <ul>
                    <li>
                        <Link to="/app" title="Main App"
                            className="jarvismetro-tile bg-color-blue">
                            <span className="iconbox">
                                <i className="fa fa-home fa-2x"/>
                                <span><Mesg text="Main App"/></span>
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }

    render() {
        if (UserStore.isLogin()) {
            return this._renderLogin();
        }
        return this._renderPublic();
    }
}

// className="jarvismetro-tile selected bg-color-pinkDark">

export default Shortcut
