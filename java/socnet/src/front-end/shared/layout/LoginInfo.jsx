import React          from 'react-mod'
import UserStore      from 'vntd-shared/stores/UserStore.jsx'
import ToggleShortcut from './ToggleShortcut.jsx'

let LoginInfo = React.createClass({
    getInitialState: function () {
        return {}
    },

    componentWillMount: function() {
        UserStore.listen(function(data) {
            if (data.authError == null) {
                this.setState(data.userSelf);
            }
        }.bind(this));
    },

	render: function() {
		return (
            <div className="login-info">
	            <span>
		            <ToggleShortcut>
                        <img src={this.state.userImgUrl} alt="Menu" className="online"/>
                        <span>{ this.state.firstName}</span><i className="fa fa-angle-down"/>
		            </ToggleShortcut>
	            </span>
            </div>
		)
	}
});

export default LoginInfo
