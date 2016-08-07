'use strict';
import React         from 'react-mod';
import {findDOMNode} from 'react-dom';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';
import ElementHolder from 'vntd-shared/utils/mixins/ElementHolder.jsx';

let Summernote = React.createClass({
    componentDidMount: function() {
        ScriptLoader.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(findDOMNode(this)).summernote({
                height: this.props.height || 270
            })
        }.bind(this))
    },

    componentWillUnmount: function() {
        $(findDOMNode(this)).summernote('destroy');
    },

    render: function() {
        let {children, ...props} = this.props;
        return (
            <div {...props}>
                {children}
            </div>
        )
    }
});

export default Summernote
