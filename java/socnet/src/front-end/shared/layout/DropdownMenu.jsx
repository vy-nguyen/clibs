/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                    from 'lodash';
import React                from 'react-mod';
import {Dropdown, MenuItem} from 'react-bootstrap';

class DropdownMenu extends React.Component
{
    render() {
        let menu = this.props.context;
        if (menu == null) {
            return null;
        }
        let menuItems = menu.menuItems.map(function(item, idx) {
            return (
                <MenuItem key={_.uniqueId('dropdown-menu-')} eventKey={idx} onClick={item.itemHandler}>
                    <i className={item.itemFmt}/>{item.itemText}
                </MenuItem>
            )
        }.bind(this));

        return (
            <Dropdown id={menu.domId}>
                <Dropdown.Toggle className={menu.iconFmt}>{menu.titleText}</Dropdown.Toggle>
                <Dropdown.Menu className={menu.itemFmt}>
                    {menuItems}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownMenu;
