'use strict';

import React         from 'react-mod';
import {findDOMNode} from 'react-dom';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';

let MaskedInput = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            var options = {};

            if (this.props.maskPlaceholder) {
                options.placeholder = this.props.maskPlaceholder;
            }
            $(findDOMNode(this)).mask(this.props.mask, options);
        }.bind(this))
    },
    render: function() {
        return (
            <input {...this.props}/>
        )
    }
});

export default MaskedInput
