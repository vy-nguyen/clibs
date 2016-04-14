import React from 'react-mod'
import ScriptLoader from '../../utils/mixins/ScriptLoader.jsx'
import {findDOMNode} from 'react-dom'

let SmartCKEditor = React.createClass({
    mixins: [ScriptLoader],
    componentDidMount: function () {
        this.loadScript('/rs/js/ckeditor/ckeditor.js').then(function() {
            let element = $(findDOMNode(this));

            this._editor = CKEDITOR.replace( this.props.container, this.props.options );
        }.bind(this))
    },

    componentWillUnmount: function() {
        this._editor.destroy();
    },
    render: function () {
        return (
            <textarea style={{opacity: 0}} id={this.props.container} {...this.props} />
        )
    }
});

export default SmartCKEditor
