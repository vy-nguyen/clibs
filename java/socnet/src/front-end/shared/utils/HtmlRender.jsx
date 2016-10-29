'use strict';

import React from 'react-mod'

class HtmlRender extends React.Component
{
    constructor(props) {
        super(props);
        this.rawMarkup = this.rawMarkup.bind(this);
    }

    rawMarkup() {
        return { __html: this.props.html }
    }

    render() {
        return (
            this.props.html ? <div {...this.props} dangerouslySetInnerHTML={this.rawMarkup()}></div> : null
        )
    }
}

export default HtmlRender;
