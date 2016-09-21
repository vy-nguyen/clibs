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
        this.setState({
            changeId: this.props.btnId
        });
        console.log("handle btn click " + this.props.btnId);
        this.props.onClick();
    },

    render: function() {
        let newState = StateButtonStore.getButtonState(this.props.btnId);
        console.log(this.state);
        let className = this.props.className;
        if (newState.success === false) {
            className = "btn btn-danger";
        }
        if (newState.disabled === true) {
            className += " disabled";
        }
        return (
            <button className={className} onClick={this._btnClick} disabled={newState.disabled}>
                {newState.buttonText}
            </button>
        );
    }
});

export default StateButton;
