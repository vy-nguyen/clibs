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
import BoostFooter       from 'vntd-shared/component/BoostFooter.jsx';
import BoostTopBanner    from 'vntd-shared/component/BoostTopBanner.jsx';

class BizNavLayout extends ComponentBase
{
    constructor(props) {
        super(props, "bizLayout", [BusinessStore]);
        this.state = this._getState(BusinessStore);
    }

    _getState(store) {
        if (store.hasData() === false) {
            return null;
        }
        return {
            brand   : store.getBranchInfo(),
            navLeft : store.getNavbarLeft(),
            navRight: store.getNavbarRight(),
            footer  : store.getFooter(),

            copyright : store.getCopyright(),
            navFormat : store.getNavbarFormat()
        };
    }

    render() {
        if (this.state == null) {
            return null;
        }
        let { brand, navLeft, navRight, footer, navFormat, copyright } = this.state;
        return (
            <div>
                <BoostNavbar brand={brand} navLeft={navLeft}
                    navRight={navRight} navFormat={navFormat}/>
                <div id="main" role="main">
                    {this.props.children}
                </div>
                <hr/>
                <BoostFooter footer={footer} copyright={copyright}/>
            </div>
        );
    }
}

export default BizNavLayout;
