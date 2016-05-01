'use strict';

import React         from 'react-mod'
import {findDOMNode} from 'react-dom'
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx'

let Tagsinput = React.createClass({
    mixins: [ScriptLoader],
    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            let element = $(findDOMNode(this));
            element.tagsinput();
        }.bind(this))
    },
    render: function() {
        return (
            <input type="text" {...this.props}/>
        )
    }
});

export default Tagsinput
