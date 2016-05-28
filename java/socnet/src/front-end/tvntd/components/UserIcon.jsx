/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React     from 'react-mod';
import {Link}    from 'react-router';
import UserStore from 'vntd-shared/stores/UserStore.jsx';

let UserIcon = React.createClass({
    render: function() {
        let user   = UserStore.getUserByUuid(this.props.userUuid);
        let width  = this.props.width === undefined ? "40" : this.props.width;
        let height = this.props.height === undefined ? "40" : this.props.height;

        if (user === null) {
            return null;
        }
        let url = (user === UserStore.getSelf()) ? "/#/user" : "/#/user/" + user.userUuid;
        return (
            <a href={url} className={this.props.className}>
                <img width={width} height={height} src={user.userImgUrl}/>
            </a>
        )
    }
});

export default UserIcon;
