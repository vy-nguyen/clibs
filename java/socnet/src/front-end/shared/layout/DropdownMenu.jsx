/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React                from 'react-mod';
import {Dropdown, MenuItem} from 'react-bootstrap';
import MenuStore            from 'vntd-shared/stores/DropdownMenuStore.jsx';

let DropdownMenu = React.createClass({
    getInitialState: function() {
        return MenuStore.getDropdownMenu(this.props.reactId);
    },

    render: function() {
        let menu = MenuStore.getDropdownMenu(this.props.reactId);
        if (menu == null || menu == undefined) {
            return null;
        }
        let menu_items = menu.menuItems.map(function(item, idx) {
            return (
                <MenuItem key={idx} eventKey={idx} onClick={item.itemHandler}>
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
