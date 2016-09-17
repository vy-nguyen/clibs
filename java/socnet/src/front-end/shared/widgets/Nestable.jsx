/**
 * Vy Nguyen (2016)
 */
'use strict';

import React         from 'react-mod'
import {findDOMNode} from 'react-dom'

let Nestable = React.createClass({

    componentDidMount: function () {
        let element = $(findDOMNode(this));
        let options = {};
        if (this.props.group){
            options.group = this.props.group;
        }
        element.nestable(options);

        if (this.props.onChange) {
            element.on('change', function() {
                this.props.onChange(element.nestable('serialize'))
            }.bind(this));
            this.props.onChange(element.nestable('serialize'))
        }
    },

    render: function() {
        return (
            this.props.children
        )
    }
});

export default Nestable
