'use strict';

import React from 'react-mod'

class ResetWidgets extends React.Component
{
    constructor(props) {
        super(props);
        this.resetWidgets = this.resetWidgets.bind(this);
    }

    resetWidgets() {
        this.$.SmartMessageBox({
            title   : "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
            content : "Would you like to RESET all your saved widgets and clear LocalStorage?",
            buttons : '[No][Yes]'
        }, function(ButtonPressed) {
            if (ButtonPressed == "Yes" && localStorage) {
                localStorage.clear();
                location.reload()
            }
        });
    }

    render() {
        return (
            <span id="refresh" className="btn btn-ribbon" onClick={this.resetWidgets}>
                <i className="fa fa-refresh" />
            </span>
        )
    }
}

export default ResetWidgets;
