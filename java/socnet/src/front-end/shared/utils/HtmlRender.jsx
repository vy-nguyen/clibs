'use strict';

import React from 'react-mod'

let HtmlRender = React.createClass({
    rawMarkup: function() {
        return { __html: this.props.html }
    },
    render: function() {
        return (
            this.props.html ? <div {...this.props} dangerouslySetInnerHTML={this.rawMarkup()}></div> : null
        )
    }
});

export default HtmlRender
