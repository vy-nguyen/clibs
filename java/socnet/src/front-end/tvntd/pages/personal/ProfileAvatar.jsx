/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';

import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import SubHeader         from 'vntd-root/pages/layout/SubHeader.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';

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
        let self = UserStore.getUserByUuid(this.props.userUuid)
        if (self === null) {
            return null;
        }
        let fileImg = (
            <div className="col-sm-3 col-md-3 col-lg-2 profile-pic">
                <img src={self.userImgUrl}/>
            </div>
        );
        return (
            <div className="row">
                {fileImg}
                <div className="col-sm-2 col-md-2 col-lg-2">
                    <h1 className="profile-username">
                        {self.lastName} <span className="semi-bold">{self.firstName}</span>
                    </h1>
                    <div className="padding-10">
                        <h4 className="font-md"><strong>{self.connections}</strong>
                            <br/><small><Mesg text="Connections"/></small>
                        </h4>
                        <br/>
                        <h4 className="font-md"><strong>{self.followers}</strong>
                            <br/><small><Mesg text="Followers"/></small>
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserAvatar;

