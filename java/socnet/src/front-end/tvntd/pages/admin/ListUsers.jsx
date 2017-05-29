/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Actions        from 'vntd-root/actions/Actions.jsx';

class ListUsers extends React.Component
{
    render() {
        Actions.listUsers(); 
        return (
            <div>
                <h1>List admin users</h1>
            </div>
        );
    }
}

export default ListUsers;
