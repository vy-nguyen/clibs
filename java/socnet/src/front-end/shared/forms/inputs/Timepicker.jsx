'use strict';

import React         from 'react-mod';
import ReactDOM      from 'react-dom';
import asyncLoader   from 'vntd-shared/lib/AsyncLoader.jsx';
import Colorpicker   from 'vntd-shared/forms/inputs/Colorpicker.jsx';

class Timepicker extends Colorpicker
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._getElement();
        this.element.timepicker();
    }
}

export default asyncLoader("tvntd-ui", "/rs/client/vendor.ui.js")(Timepicker);
