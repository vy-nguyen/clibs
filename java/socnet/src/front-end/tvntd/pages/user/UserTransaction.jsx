/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';

class UserTransaction extends React.Component
{
    render() {
        return (
            <ProfileCover/>
        )
    }
}

export default UserTransaction;
