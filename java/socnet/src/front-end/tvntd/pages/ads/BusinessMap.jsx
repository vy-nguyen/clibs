/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import Mesg            from 'vntd-root/components/Mesg.jsx';

class BusinessMap extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            userUuid = this.props.userUuid;

        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                <div className="row">
                    <h1>Map for {ads.busName}</h1>
                </div>
            </WidgetGrid>
        )
    }
}

export default BusinessMap;
