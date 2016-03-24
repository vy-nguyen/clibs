/**
 * Modified by Vy Nguyen (2016)
 */
import React from 'react-mod'
import {Link} from 'react-router'

let Shortcut =  React.createClass({
	render: function() {
		return (
<div id="shortcut">
	<ul>
		<li>
			<Link to="/inbox" title="Inbox" className="jarvismetro-tile big-cubes bg-color-blue">
                <span className="iconbox">
                    <i className="fa fa-envelope fa-4x" />
                    <span>Inbox <span className="label pull-right bg-color-darken">14</span></span>
                </span>
			</Link>
		</li>
		<li>
            <Link to="/bank" className="jarvismetro-tile big-cubes bg-color-orangeDark">
                <span className="iconbox"> <i className="fa fa-money fa-4x" />
                    <span>Transactions </span>
                </span>
            </Link>
		</li>
		<li>
            <Link to="/project" className="jarvismetro-tile big-cubes bg-color-purple">
                <span className="iconbox"> <i className="fa fa-suitcase fa-4x" />
                    <span>Maps </span>
                </span>
            </Link>
		</li>
		<li>
            <Link to="/profile" className="jarvismetro-tile big-cubes selected bg-color-pinkDark">
                <span className="iconbox"><i className="fa fa-user fa-4x" />
                    <span>My Profile </span>
                </span>
            </Link>
		</li>
	</ul>
</div>
		)
	}
});

export default Shortcut
