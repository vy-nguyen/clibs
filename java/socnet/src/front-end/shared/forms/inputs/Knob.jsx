'use strict';

import React         from 'react-mod';
import {findDOMNode} from 'react-dom';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';

let Timepicker = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function () {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            let element = $(findDOMNode(this));
            element.knob(this.props)
        }.bind(this))
    },
    render: function() {
        return (
            <input type="text" className={this.props.className} defaultValue={this.props.defaultValue}/>
        )
    }
});

export default Timepicker
