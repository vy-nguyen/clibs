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

export class UserSection extends React.Component
{
    render() {
        let style, user = UserStore.getUserByUuid(this.props.userUuid);

        if (user == null) {
            return null;
        }
        style = user.getCoverImgStyle();
        return (
            <div className="row">
                <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12" style={style}>
                    <div className="col-sm-5 col-xs-5 col-md-3 col-lg-3 profile-pic">
                        <UserIcon userUuid={user.userUuid} width="100" height="100"/>
                    </div>
                    <div className="col-sm-7 col-xs-7 col-md-9 col-lg-9">
                        <h1 className="profile-username text-center">
                            {user.lastName} {user.firstName}
                        </h1>
                        <small>{self.userStatus}</small>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserIcon;
