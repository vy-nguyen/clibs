'use strict';

import React         from 'react-mod';
import ReactDOM      from 'react-dom';

import asyncLoader   from 'vntd-shared/lib/AsyncLoader.jsx';
import Colorpicker   from 'vntd-shared/forms/inputs/Colorpicker.jsx';

class Clockpicker extends Colorpicker
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._getElement();
        this.element.clockpicker({
            placement: 'top',
            donetext : 'Done'
        });
    }
}

export default asyncLoader("tvntd-ui", "/rs/client/vendor.ui.js")(Clockpicker);
