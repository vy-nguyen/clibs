/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';

import UserBase          from 'vntd-shared/layout/UserBase.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import UserIcon          from 'vntd-root/components/UserIcon.jsx';

class UserAvatar extends UserBase
{
    constructor(props) {
        super(props);
    }

    render() {
        let icon, userUuid = this.props.userUuid, self = this.state.self,
            imgUrl = self != null ? self.userImgUrl : "";

        if (self == null) {
            return null;
        }
        icon = (
            <div className="col-xs-3 col-sm-3 col-md-2 col-lg-2">
                <UserIcon width="80" height="80"
                    className="profile-pic" userUuid={userUuid}/>
            </div>
        );
        return (
            <div className="row">
                {icon}
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <h1 className="profile-username">
                        {self.lastName} <span className="bold">{self.firstName}</span>
                    </h1>
                </div>
            </div>
        );
    }
}

export default UserAvatar;

