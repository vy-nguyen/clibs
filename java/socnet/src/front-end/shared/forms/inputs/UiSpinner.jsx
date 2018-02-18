'use strict';

import React         from 'react-mod'
import ReactDOM      from 'react-dom'
import Colorpicker   from 'vntd-shared/forms/inputs/Colorpicker.jsx';

class UiSpinner extends Colorpicker
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let options = {}, props = this.props;

        this._getElement();
        if (props.spinnerType == 'decimal') {
            options = {
                step: 0.01,
                numberFormat: "n"
            };
        } else if (props.spinnerType == 'currency') {
            options = {
                min: 5,
                max: 2500,
                step: 25,
                start: 1000,
                numberFormat: "C"
            };
        }
        this.element.spinner(options);
    }
}

export default UiSpinner;
