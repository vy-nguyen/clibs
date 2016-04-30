/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';

let UserAccount = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    render: function() {
        let { userUuid } = this.props.params;
        let self = UserStore.getUserByUuid(userUuid);

        if (self === null) {
            return null;
        }
        return (
            <ProfileCover userUuid={self.userUuid}/>
        )
    }
});

export default UserAccount;
