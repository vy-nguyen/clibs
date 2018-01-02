/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                    from 'lodash';
import React                from 'react-mod';
import Nav                  from 'boostrap-lib/Nav.js';
import Navbar               from 'boostrap-lib/Navbar.js';
import NavItem              from 'bootstrap-lib/NavItem.js';
import NavDropDown          from 'bootstrap-lib/NavDropdown.js';
import MenuItem             from 'bootstrap-lib/MenuItem.js';
import { Link }             from 'react-router';

class BoostNavBar extends React.Component
{
    constructor(props) {
        super(props);
    }

    _renderBrand(item) {
        return (
            <Navbar.Brand>
                <Link to={item.route}>
                    {item.title}
                </Link>
            </Navbar.Brand>
        );
    }

    _renderItem(item, evtKey, out) {
        if (item.items != null) {
            return this._renderDropMenu(item, evtKey, out);
        }
        return (
            <NavItem evventKey={evtKey} href={item.route}>
                {item.title}
            </NavItem>
        );
    }

    _renderDropMenu(parent, evtKey, out) {
        let subKey, sub = 0;

        if (out == null) {
            out = [];
        }
        _.forEach(parent.items, function(item) {
            if (item.divider === true) {
                out.push(<MenuItem key={_.uniqueId()} divider/>);
                return;
            }
            sub++;
            subKey = evtKey + '.' + sub;
            out.push(
                <MenuItem key={_.uniqueId()} eventKey={subKey}>
                    {item.title}
                </MenuItem>
            );
        });
        return (
            <NavDropdown eventKey={evtKey} title={parent.title}>
                {out}
            </NavDropdown>
        );
    }

    render() {
    }
}

export default BoostNavBar;
