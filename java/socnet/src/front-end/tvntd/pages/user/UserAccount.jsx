/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';

class UserAccount extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState = this._updateState.bind(this);

        let { userUuid } = this.props.params;
        this.state = {
            myUuid: userUuid,
            self  : UserStore.getUserByUuid(userUuid)
        };
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
        this.setState({
            self: UserStore.getUserByUuid(this.state.myUuid)
        });
    }

    render() {
        let self = this.state.self;
        if (self == null) {
            return null;
        }
        return (
            <ProfileCover userUuid={self.userUuid}/>
        )
    }
}

export default UserAccount;
