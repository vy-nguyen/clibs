/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React     from 'react-mod';
import ReactDOM  from 'react-dom';

import jarvisWidgetsDefaults from 'vntd-root/components/layout/widgets/WidgetDefaults';

class StaticPageLoader extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this._process(this.props.location.pathname)
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.location.pathname != this.props.location.pathname) {
            this._process(nextProps.location.pathname)
        }
    }

    render() {
        return (
            <div id="content">
                <div className="row">
                    <div>
                        <div className="col-sm-12" ref="viewport">
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _process(url) {
        $.get('html/' + url).then(function(res) {
            $(this.refs.viewport).html(res);

            let container = $(ReactDOM.findDOMNode(this));
            $('#widget-grid', container).jarvisWidgets(jarvisWidgetsDefaults);
            $('.dropdown-toggle', container).dropdown()
        }.bind(this));
    }
}

export default StaticPageLoader
