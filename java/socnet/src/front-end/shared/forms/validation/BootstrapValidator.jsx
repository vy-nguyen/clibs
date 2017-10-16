/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import React         from 'react-mod';
import ReactDOM      from 'react-dom';

import asyncLoader   from 'vntd-shared/lib/AsyncLoader.jsx';
import Colorpicker   from 'vntd-shared/forms/inputs/Colorpicker.jsx';

class BootstrapValidator extends Colorpicker
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let element = this._getElement();
        this.element.bootstrapValidator(this.props.options || {});
    }

    render() {
        return (
            this.props.children
        );
    }
}

export default asyncLoader("tvntd-ui", "/rs/client/vendor.ui.js")(BootstrapValidator);
