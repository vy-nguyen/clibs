'use strict';

import React from 'react-mod'

class LoadHtml extends React.Component
{
    constructor(props) {
        super(props);
        this._process = this._process.bind(this);
    }

    componentDidMount() {
        this._process(this.props.url);
    }

    render() {
        return (
            <div ref="viewport" />
        )
    }

    _process(url) {
        $.get(url).then(function(res) {
            $(this.refs.viewport).html(res);
        }.bind(this));
    }
}

export default LoadHtml;
