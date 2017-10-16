'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import ReactDOM      from 'react-dom';

import asyncLoader   from 'vntd-shared/lib/AsyncLoader.jsx';
import Colorpicker   from 'vntd-shared/forms/inputs/Colorpicker.jsx';

class Timepicker extends Colorpicker
{
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
    }

    componentDidUpdate() {
        this.xEditable()
    }

    xEditable() {
        this._getElement();
        let props = this.props, options = _.extend(props, {});

        this.element.editable('destroy');
        this.element.editable(options);

        this.element.on('save', function(e, params) {
            if(_.isFunction(props.onChange)) {
                props.onChange(params.newValue)
            }
        });
    }

    _onClick(e) {
        e.preventDefault();
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick();
        }
    }

    render() {
        let {children, ...props} = this.props;
        let id = props.id || _.uniqueId('x-editable');

        return (
            <a href="#" onClick={this._onClick} {...props} id={id}>
                {children}
            </a>
        )
    }
}

export default asyncLoader("tvntd-ui", "/rs/client/vendor.ui.js")(Timepicker);
