/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React     from 'react-mod';
import {Link}    from 'react-router';
import UserStore from 'vntd-shared/stores/UserStore.jsx';

class UserIcon extends React.Component
{
    render() {
        let user   = UserStore.getUserByUuid(this.props.userUuid),
            width  = this.props.width || "40",
            height = this.props.height || "40", url;

        if (user == null) {
            return null;
        }
        url = (user == UserStore.getSelf()) ? "/#/user" : "/#/user/" + user.userUuid;
        return (
            <a href={url} className={this.props.className}>
                <img width={width} height={height} src={user.userImgUrl}/>
            </a>
        )
    }
}

export default UserIcon;
