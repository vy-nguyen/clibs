/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React                from 'react-mod';
import classnames           from 'classnames';
import {Dropdown, MenuItem} from 'react-bootstrap';

import {LoginForm}          from '../login/Login.jsx';
import {RegisterForm}       from '../login/Register.jsx';

let Components = {
    Login:    <LoginForm/>,
    Register: <RegisterForm/>
};

let LoginRegDropDown = React.createClass({
    _active: false,
    _menuInfo: [
        {
            title: "Sign In",
            name : "Login"
        }, {
            title: "Sign Up",
            name : "Register"
        }, {
            title: "Help",
            name : "Recover"
        }
    ],
    getInitialState: function() {
        return {
            current: this._menuInfo[0]
        };
    },
    render: function () {
        var current = this.state.current,
            menu_header = this._menuInfo.map(function(it, idx) {
                var cls_name = classnames(['btn', 'btn-default', { active: it.name == current.name }]);
                return (
                    <label className={cls_name} key={idx} onClick={this._setMenuPane.bind(this, it)}>
                        <input type='radio' name='activity'/>{it.title}
                    </label>
                )
            }.bind(this));

        return (
            <div>
                <span id="activity" onClick={this._toggleDropdown} ref="dropdownToggle" className="activity-dropdown">
                    <i className="fa fa-user"/>
                    <b className="badge">Login</b>
                </span>
                <div className="ajax-dropdown" ref="dropdown">
                    <div className="btn-group btn-group-justified" data-toggle="buttons">
                        {menu_header}
                    </div>
                    {Components[current.name]}
                </div>
            </div>
        )
    },

    _setMenuPane: function(select_item) {
        this.setState({
            current: select_item
        })
    },

    _toggleDropdown: function (e) {
        e.preventDefault();
        let $dropdown = $(this.refs.dropdown);
        let $dropdownToggle = $(this.refs.dropdownToggle);

        if (this._active) {
            $dropdown.fadeOut(150)
        } else {
            $dropdown.fadeIn(150)
        }
        this._active = !this._active;
        $dropdownToggle.toggleClass('active', this._active)
    },
});

export default LoginRegDropDown;
