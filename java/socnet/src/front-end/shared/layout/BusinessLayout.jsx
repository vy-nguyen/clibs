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

import {RouteSvc}        from 'vntd-root/app-main/business-router.jsx';
import Actions           from 'vntd-root/actions/BusinessActions.jsx';
import BusinessStore     from 'vntd-root/stores/BusinessStore.jsx';
import ComponentBase     from 'vntd-shared/layout/ComponentBase.jsx';
import BoostNavbar       from 'vntd-shared/component/BoostNavbar.jsx';
import BoostSidebar      from 'vntd-shared/component/BoostSidebar.jsx';
import BoostFooter       from 'vntd-shared/component/BoostFooter.jsx';
import BoostTopBanner    from 'vntd-shared/component/BoostTopBanner.jsx';
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
            footer  : store.getFooter(),

            copyright : store.getCopyright(),
            navFormat : store.getNavbarFormat(),
            sideFormat: store.getSideNavFormat()
        });
    }

    render() {
        let path  = this.props.location.pathname,
            crumb = RouteSvc.getRouteKey(path),
            {
                brand, navLeft, navRight, sideNav, footer, navFormat, sideFormat,
                copyright
            } = this.state;

        return (
            <div>
                <BoostNavbar brand={brand} navLeft={navLeft}
                    navRight={navRight} navFormat={navFormat}/>
                <BoostTopBanner/>
                <SmallBreadcrumbs id="route-map" crumb={crumb} route={path}/>
                <div className="row">
                    <div className="hidden-xs hidden-sm col-md-3 col-lg-3">
                        <BoostSidebar sideNav={sideNav} sideFormat={sideFormat}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                        <div id="main" role="main">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <hr/>
                <BoostFooter footer={footer} copyright={copyright}/>
            </div>
        );
    }
}

export default BusinessLayout;
