/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';

import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import SubHeader         from 'vntd-root/pages/layout/SubHeader.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import UserIcon          from 'vntd-root/components/UserIcon.jsx';

class UserAvatar extends React.Component
{
    constructor(props) {
        super(props);

        this._updateUser = this._updateUser.bind(this);
        this.state = {
            self: UserStore.getUserByUuid(props.userUuid)
        };
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateUser);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateUser(data) {
        this.setState({
            self: UserStore.getUserByUuid(this.props.userUuid)
        });
    }

    render() {
        let icon, userUuid = this.props.userUuid,
            self = UserStore.getUserByUuid(userUuid),
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

