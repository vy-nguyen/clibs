'use strict';

import React         from 'react-mod';
import ReactDOM      from 'react-dom'
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx'
import ElementHolder from 'vntd-shared/utils/mixins/ElementHolder.jsx'

let Select2 = React.createClass({
    mixins: [ScriptLoader, ElementHolder],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(this.getHold()).select2()
        }.bind(this))
    },

    componentWillUnmount: function() {
        $(this.getHold()).select2('destroy');
    },

    render: function() {
        let {children, ...props} = this.props;
        return (
            <select {...props}>
                {children}
            </select>
        )
    }

});

export default Select2
