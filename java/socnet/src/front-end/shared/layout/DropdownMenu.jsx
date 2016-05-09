/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React                from 'react-mod';
import _                    from 'lodash';
import {Dropdown, MenuItem} from 'react-bootstrap';

let DropdownMenu = React.createClass({

    render: function() {
        let menu = this.props.context;
        if (menu === null || menu === undefined) {
            return null;
        }
        let menu_items = menu.menuItems.map(function(item, idx) {
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
                    {menu_items}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
});

export default DropdownMenu;
