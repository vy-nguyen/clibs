'use strict';

import React         from 'react-mod';
import {findDOMNode} from 'react-dom';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';

let IonSlider = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(findDOMNode(this)).ionRangeSlider();
        }.bind(this))
    },
    render: function() {
        return (
            <input {...this.props}/>
        )
    }
});

export default IonSlider
