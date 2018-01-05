/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                    from 'lodash';
import React                from 'react-mod';
import { Link }             from 'react-router';

import Nav                  from 'bootstrap-lib/Nav.js';
import Navbar               from 'bootstrap-lib/Navbar.js';
import NavItem              from 'bootstrap-lib/NavItem.js';
import NavDropdown          from 'bootstrap-lib/NavDropdown.js';
import MenuItem             from 'bootstrap-lib/MenuItem.js';

import History              from 'vntd-shared/utils/History.jsx';

class BoostNavbar extends React.Component
{
    constructor(props) {
        super(props);
    }

    _onClickItem(item) {
        History.pushState(null, item.route);
    }

    _renderBrand(items, render) {
        let out = [];
        _.forEach(items, function(item) {
            out.push(
                <Link to={item.route} key={_.uniqueId()}>
                    {item.title}
                </Link>
            );
        });
        render.push(
            <Navbar.Brand>
                {out}
            </Navbar.Brand>
        );
    }

    _renderItem(item, render) {
        if (item.items != null) {
            this._renderDropMenu(item, render);
            return;
        }
        render.push(
            <NavItem evventKey={item}
                onClick={this._onClickItem.bind(this, item)}>
                {item.title}
            </NavItem>
        );
    }

    _renderDropMenu(parent, render) {
        let out = [];

        _.forEach(parent.items, function(item) {
            if (item.divider === true) {
                out.push(<MenuItem key={_.uniqueId()} divider/>);
                return;
            }
            if (item.items != null) {
                this._renderDropMenu(item, render);
                return;
            }
            out.push(
                <MenuItem key={_.uniqueId()}
                    onClick={this._onClickItem.bind(this, item)}>
                    {item.title}
                </MenuItem>
            );
        }.bind(this));

        render.push(
            <NavDropdown title={parent.title}>
                {out}
            </NavDropdown>
        );
    }

    _renderHeader(render) {
        let out = [];

        this._renderBrand(this.props.brand, out);
        render.push(
            <Navbar.Header>
                {out}
                <Navbar.Toggle/>
            </Navbar.Header>
        );
    }

    _renderNavMenu(items, render, right) {
        let out = [];

        _.forEach(items, function(item) {
            this._renderItem(item, out);
        }.bind(this));

        render.push(
            <Nav pullRight={right}>
                {out}
            </Nav>
        );
    }

    render() {
        let out = [], left = [], right = [],
            { navLeft, navRight, navFormat } = this.props;

        this._renderHeader(out);
        this._renderNavMenu(navLeft, left, false);
        this._renderNavMenu(navRight, right, true);
        out.push(
            <Navbar.Collapse>
                {left}
                {right}
            </Navbar.Collapse>
        );
        return (
            <Navbar collapseOnSelect style={navFormat}>
                {out}
            </Navbar>
        );
    }
}

export default BoostNavbar;
