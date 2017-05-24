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
import ErrorNotify from '../public/ErrorNotify.jsx';

require('vntd-shared/less/layout.less');

class Layout extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Actions.startup(UserStore.isLogin() ? "/api/user" : this.props.route.url);
    }

    render() {
        return (
            <div className="minified fixed-navigation fixed-header">
                <Header/>
                <Navigation/>
                <ErrorNotify errorId="main-error"/>
                {/*<Shortcut/>*/}
                <div className="container" id="main" role="main">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
};

export default Layout;
