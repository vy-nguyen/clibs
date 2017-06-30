/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React from 'react-mod';

import ElementHolder         from 'vntd-root/components/utils/mixins/ElementHolder.jsx';
import jarvisWidgetsDefaults from 'vntd-root/components/layout/widgets/WidgetDefaults' ;
import BigBreadcrumbs        from 'vntd-root/components/layout/navigation/components/BigBreadcrumbs.jsx';
import EasyPieChartContainer from 'vntd-root/components/graphs/inline/EasyPieChartContainer.jsx';
import SubHeader             from '../SubHeader.jsx';

let StaticPageLoader = React.createClass({
    mixins: [ElementHolder],

    componentWillMount: function () {
        this._process(this.props.location.pathname)
    },
    componentWillReceiveProps: function (nextProps, nextState) {
        if (nextProps.location.pathname != this.props.location.pathname) {
            this._process(nextProps.location.pathname)
        }
    },
    render: function () {
        return (
            <div id="content">
                {(this.props.route.subHeader == false ? null :
                    <div className="row">
                        <BigBreadcrumbs className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                        <SubHeader />
                    </div>)}

                <div className="row">
                    <div>
                        <EasyPieChartContainer>
                        <div className="col-sm-12" ref="viewport">
                        </div>
                        </EasyPieChartContainer>
                    </div>
                </div>
            </div>
        )
    },
    _process: function (url) {
        $.get('html/' + url).then(function (res) {
            $(this.refs.viewport).html(res);
            let $container = $(this.getHold());
            $('#widget-grid', $container).jarvisWidgets(jarvisWidgetsDefaults);
            $('.dropdown-toggle', $container).dropdown()
        }.bind(this))
    }
});

export default StaticPageLoader
