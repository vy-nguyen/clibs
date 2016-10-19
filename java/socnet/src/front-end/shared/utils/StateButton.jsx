/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import Reflux           from 'reflux';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';

let StateButton = React.createClass({
    /*
    mixins: [
        Reflux.connect(StateButtonStore)
    ],
     */
    _btnClick: function(event) {
        event.preventDefault();
        this.props.onClick();
    },

    render: function() {
        let btnState = StateButtonStore.getButtonState(this.props.btnId);
        let className = btnState.getClassFmt();
        return (
            <button className={className} onClick={this._btnClick} disabled={btnState.isDisabled()}>
                {btnState.getText()}
            </button>
        );
    }
});

export default StateButton;
