/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import Reflux           from 'reflux';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';

let StateButton = React.createClass({

    mixins: [
        Reflux.connect(StateButtonStore)
    ],

    _btnClick: function(event) {
        event.preventDefault();
        this.props.onClick();
    },

    render: function() {
        let state = StateButtonStore.getButtonState(this.props.btnId);
        let className = this.props.className;
        if (state.success === false) {
            className = "btn btn-danger";
        }
        if (state.disabled === true) {
            className += " disabled";
        }
        return (
            <button className={className} onClick={this._btnClick} disabled={state.disabled}>
                {state.buttonText}
            </button>
        );
    }
});

export default StateButton;
