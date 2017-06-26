require("script-loader!jquery");
require("script-loader!flot")
require("script-loader!flot-resize")
require("script-loader!flot-fillbetween")
require("script-loader!flot-orderBar")
require("script-loader!flot-pie")
require("script-loader!flot-time")
require("script-loader!flot-tooltip")

import React from 'react-mod'
import _ from 'lodash'
import ElementHolder from '../utils/mixins/ElementHolder.jsx'

let FlotChart = React.createClass({
    mixins: [
        ElementHolder
    ],
    componentDidMount: function() {
        this._renderChart(this.props.data);
    },
    componentWillReceiveProps: function (nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            this._renderChart(nextProps.data);
        }
    },
    _renderChart: function (data) {
        if (data) {
            // $.plot(this.getHold(), data, this.props.options);
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)
    },
    render: function () {
        let className = this.props.className || 'chart';
        return (
            <div className={className}/>
        )
    }
});

export default FlotChart
