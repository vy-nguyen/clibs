/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React        from 'react-mod';
import Header       from './Header.jsx';
import Footer       from './Footer.jsx';
import Shortcut     from './Shortcut.jsx';
import Navigation   from './Navigation.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import NavStoreBase from 'vntd-shared/layout/NavStoreBase.jsx';
import ErrorNotify  from '../public/ErrorNotify.jsx';

require('vntd-shared/less/layout.less');

class Layout extends NavStoreBase
{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Actions.startup(UserStore.isLogin() ? "/api/user" : this.props.route.url);
    }

    render() {
        let nav = null, fmt = "";

        if (this.state.sideBar === true) {
            nav = <Navigation/>;
            fmt = "minified fixed-navigation";
        }
        return (
            <div className={"fixed-header " + fmt}>
                <Header/>
                {nav}
                <ErrorNotify errorId="main-error"/>
                <Shortcut/>
                <div id="main" role="main">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Layout;
