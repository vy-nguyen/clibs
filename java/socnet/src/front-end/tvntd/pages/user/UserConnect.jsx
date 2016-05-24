/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import UserFriends    from './UserFriends.jsx';

let UserConnect = React.createClass({
    render: function() {
        return (
            <UserFriends userList={this.props.userList} tableType="all-user"/>
        );
    }
});

export default UserConnect
