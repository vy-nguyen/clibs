/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React       from 'react-mod';
import Header      from './Header.jsx';
import Footer      from './Footer.jsx';
import Shortcut    from './Shortcut.jsx';
import Navigation  from './Navigation.jsx';
import Actions     from 'vntd-root/actions/Actions.jsx';
import UserStore   from 'vntd-shared/stores/UserStore.jsx';

require('vntd-shared/less/layout.less');

let Layout = React.createClass({

    componentWillMount: function() {
        Actions.startup(UserStore.isLogin() ? "/api/user" : this.props.route.url);
        Actions.preload();
    },

    render: function() {
        return (
            <div className="minified fixed-navigation fixed-header">
                <Header/>
                <Navigation/>
                <Shortcut/>
                <div className="container" id="main" role="main">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
});

export default Layout
