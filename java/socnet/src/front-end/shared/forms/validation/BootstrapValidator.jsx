import React from 'react-mod'
import _     from 'lodash'

import {findDOMNode} from 'react-dom'
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx'

let BootstrapValidator = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(findDOMNode(this)).bootstrapValidator(this.props.options || {})
        }.bind(this))
    },

    render: function() {
        return (
            this.props.children
        )
    }
});

export default BootstrapValidator
