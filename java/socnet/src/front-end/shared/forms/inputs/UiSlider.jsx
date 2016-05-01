'use strict';

import React    from 'react-mod';
import ReactDOM from 'react-dom';

import ScriptLoader from 'vntd-shared/utils/mixins/ScriptLoader.jsx';

let UiSlider = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(ReactDOM.findDOMNode(this)).bootstrapSlider();

        }.bind(this))
    },
    render: function() {
        return <input type="text" {...this.props} />
    }
});

export default UiSlider
