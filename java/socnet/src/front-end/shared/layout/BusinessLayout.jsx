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

class BusinessLayout extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
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
        );
    }
}

/*
            
*/

export default BusinessLayout;
