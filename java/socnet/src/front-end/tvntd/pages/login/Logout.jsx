/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React   from 'react-mod';
import Actions from 'vntd-root/actions/Actions.jsx';

class Logout extends React.Component
{
    render() {
        Actions.logout();
        return <div></div>;
    }
}

export default Logout;
