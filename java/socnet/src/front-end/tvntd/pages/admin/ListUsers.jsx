/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';
import Actions        from 'vntd-root/actions/Actions.jsx';
import AdminStore     from 'vntd-root/stores/AdminStore.jsx';

let ListUsers = React.createClass({
    mixins: [Reflux.connect(AdminStore)],

    render: function() {
        console.log("Invoke action list users");
        Actions.listUsers(); 
        return (
            <div>
                <h1>List admin users</h1>
            </div>
        );
    }
});

export default ListUsers;
