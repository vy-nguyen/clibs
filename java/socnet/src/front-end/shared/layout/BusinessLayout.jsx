/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React           from 'react-mod';
import Nav             from 'bootstrap-lib/Nav.js';
import Navbar          from 'bootstrap-lib/Navbar.js';
import NavItem         from 'bootstrap-lib/NavItem.js';
import NavDropdown     from 'bootstrap-lib/NavDropdown.js';
import MenuItem        from 'bootstrap-lib/MenuItem.js';

import Actions         from 'vntd-root/actions/BusinessActions.jsx';
import BusinessStore   from 'vntd-root/stores/BusinessStore.jsx';
import ComponentBase   from 'vntd-shared/layout/ComponentBase.jsx';

class BusinessLayout extends ComponentBase
{
    constructor(props) {
        super(props, null, [BusinessStore]);
    }

    componentWillMount() {
        console.log("will mount component");
        console.log(this.props.route);
        Actions.startupLayout(this.props.route.url);
    }


    _updateState(store, data, item, code) {
        console.log("update from store");
        console.log(store);
    }

    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">React-Bootstrap</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="#">Link</NavItem>
                        <NavItem eventKey={2} href="#">Link</NavItem>
                        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>Action</MenuItem>
                            <MenuItem eventKey={3.2}>Another action</MenuItem>
                            <MenuItem eventKey={3.3}>Something else here</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.3}>Separated link</MenuItem>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">Link Right</NavItem>
                        <NavItem eventKey={2} href="#">Link Right</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

/*
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">React-Bootstrap</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">Link</NavItem>
                    <NavItem eventKey={2} href="#">Link</NavItem>
                    <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>Action</MenuItem>
                        <MenuItem eventKey={3.2}>Another action</MenuItem>
                        <MenuItem eventKey={3.3}>Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={3.4}>Separated link</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
            
*/

export default BusinessLayout;
