'use strict';

import React         from 'react-mod';
import ReactDOM      from 'react-dom';
import asyncLoader   from 'vntd-shared/lib/AsyncLoader.jsx';

class Colorpicker extends React.Component
{
    constructor(props) {
        super(props);
    }

    _getElement() {
        if (this.element != null) {
            return;
        }
        this.element = $(ReactDOM.findDOMNode(this));
        return this.element;
    }

    componentDidMount() {
        this._getElement();
        this.element.colorpicker();
    }

    render() {
        return (
            <input type="text" {...this.props}/>
        );
    }
};

export default asyncLoader("tvntd-ui", "/rs/client/vendor.ui.js")(Colorpicker);
