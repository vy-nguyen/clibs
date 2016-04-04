/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';

let UserTransaction = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    render: function() {
        return (
            <ProfileCover/>
        )
    }
});

export default UserTransaction;
