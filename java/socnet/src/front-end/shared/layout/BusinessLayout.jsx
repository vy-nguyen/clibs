/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React             from 'react-mod';
import Nav               from 'bootstrap-lib/Nav.js';
import Navbar            from 'bootstrap-lib/Navbar.js';
import NavItem           from 'bootstrap-lib/NavItem.js';
import NavDropdown       from 'bootstrap-lib/NavDropdown.js';
import MenuItem          from 'bootstrap-lib/MenuItem.js';

import Actions           from 'vntd-root/actions/BusinessActions.jsx';
import BusinessStore     from 'vntd-root/stores/BusinessStore.jsx';
import ComponentBase     from 'vntd-shared/layout/ComponentBase.jsx';
import BoostNavbar       from 'vntd-shared/component/BoostNavbar.jsx';
import BoostSidebar      from 'vntd-shared/component/BoostSidebar.jsx';
import BoostFooter       from 'vntd-shared/component/BoostFooter.jsx';
import SmallBreadcrumbs  from 'vntd-shared/layout/SmallBreadcrumbs.jsx';

class BusinessLayout extends ComponentBase
{
    constructor(props) {
        super(props, null, [BusinessStore]);
        this.state = {
            brand   : null,
            navLeft : null,
            navRight: null
        };
    }

    componentWillMount() {
        Actions.startupLayout(this.props.route.url);
    }


    _updateState(store, data, item, code) {
        this.setState({
            brand   : store.getBranchInfo(),
            navLeft : store.getNavbarLeft(),
            navRight: store.getNavbarRight(),
            sideNav : store.getSideNav(),
            footer  : store.getFooter()
        });
    }

    render() {
        console.log("----------" + this.props.location.pathname);
        console.log(this.props);
        return (
            <div>
                <BoostNavbar {...this.state}/>
                <SmallBreadcrumbs id="route-map" crumb="Home" route="/"/>
                <div className="row">
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                        <BoostSidebar sideNav={this.state.sideNav}/>
                    </div>
                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9">
                        <div id="main" role="main">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <hr/>
                <BoostFooter footer={this.state.footer}/>
            </div>
        );
    }
}

export default BusinessLayout;
