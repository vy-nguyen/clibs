/**
 * Created by griga on 11/24/15.
 * Modified by Vy Nguyen (2016)
 */
import React from 'react-mod'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

import ResetWidgets     from '../../../shared/actions/ResetWidgets.jsx'
import SmallBreadcrumbs from '../../../shared/layout/SmallBreadcrumbs.jsx'

let Ribbon = React.createClass({
    render: function() {
        var tooltip = (
            <Tooltip id="reset-widgets-suggestion">
                <i className='text-warning fa fa-warning' /> Warning! This will reset all your widget settings.
            </Tooltip>
        );
        return (
            <div id="ribbon">
                <span className="ribbon-button-alignment">
                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                        <ResetWidgets />
                    </OverlayTrigger>
                </span>
                <SmallBreadcrumbs />
            </div>
        )
    }
});

export default Ribbon
