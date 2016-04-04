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
        let self = UserStore.getSelf();
        return (
            <ProfileCover data={{imageId: self._id, imageList: []}}/>
        )
    }
});

export default UserAccount;
