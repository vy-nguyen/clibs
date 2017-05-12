/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import GoogleMapReact  from 'google-map-react';

import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import Mesg            from 'vntd-root/components/Mesg.jsx';

const AnyReactComponent = function({ text }) {
    <div>{text}</div>;
}

class BusinessMap extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return null;

        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            userUuid = this.props.userUuid;

        const def = {
            center: {lat: 59.95, lng: 30.33},
            zoom: 11
        };
        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                <div className="row">
                    <h1>Map for {ads.busName}</h1>
                    <GoogleMapReact
                        bootstrapURLKeys={{key: "AIzaSyD2c0dE19Ubh3F5wgkuI-y_jnvKFAd2NDo" }}
                        defaultCenter={def.center} defaultZoom={def.zoom}>
                        <div>
                            lat={59.955413} lng={30.337844} text={'Kreyser Avrora'}
                        </div>
                    </GoogleMapReact>
                </div>
            </WidgetGrid>
        )
    }
}

export default BusinessMap;
