/**
 * Modified by Vy Nguyen (2016)
 */
import React  from 'react-mod'
import {Link} from 'react-router'
import Mesg   from 'vntd-root/components/Mesg.jsx';

class Shortcut extends React.Component
{
	render() {
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
                        <Link to="/user/domain"
                            className="jarvismetro-tile bg-color-orangeDark">
                            <span className="iconbox">
                                <i className="fa fa-money fa-2x" />
                                <span><Mesg text='Transactions'/> </span>
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
}

// className="jarvismetro-tile selected bg-color-pinkDark">

export default Shortcut
