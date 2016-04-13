/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React   from 'react-mod';
import Actions from 'vntd-root/actions/Actions.jsx';

let Logout = React.createClass({
    render: function() {
        Actions.logout();
        return <div></div>;
    }
});

export default Logout;
