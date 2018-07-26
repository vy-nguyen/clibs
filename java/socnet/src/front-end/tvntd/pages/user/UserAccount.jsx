/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import UserBase           from 'vntd-shared/layout/UserBase.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';

class UserAccount extends UserBase
{
    constructor(props) {
        super(props);

        this.state = _.merge(this.state, {
            myUuid: props.params.userUuid
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
