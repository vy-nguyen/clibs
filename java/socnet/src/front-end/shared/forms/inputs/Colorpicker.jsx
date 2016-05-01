'use strict';

import React         from 'react-mod';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';
import {findDOMNode} from 'react-dom';

let Colorpicker = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            let element = $(findDOMNode(this));
            element.colorpicker();
        }.bind(this))
    },

    render: function() {
        return (
            <input type="text" {...this.props}/>
        )
    }
});

export default Colorpicker
