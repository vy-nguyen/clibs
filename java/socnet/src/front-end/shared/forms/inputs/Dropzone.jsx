'use strict';

import React         from 'react-mod';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';
import {findDOMNode} from 'react-dom';

let Dropzone = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function () {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            let element = $(findDOMNode(this));
            let options = this.props.options || {};
            element.dropzone(options)
        }.bind(this))
    },

    render: function() {
        return (
           this.props.children
        )
    }
});

export default Dropzone
