/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import BusinessStore      from 'vntd-root/stores/BusinessStore.jsx';
import BusinessMap        from 'vntd-root/pages/ads/BusinessMap.jsx';

class LocationMap extends BusinessMap
{
    constructor(props) {
        super(props);
    }
}

class Contact extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
    }

    _getBusinessInfo() {
        return BusinessStore.getBusinessInfo();
    }

    render() {
        let busInfo, select = this.props.params.name;

        if (select === "map") {
            busInfo = this._getBusinessInfo();
            if (busInfo == null) {
                return null;
            }
            return <LocationMap adsRec={busInfo}/>;
        }
        return (
            <div id="content">
                <h1>Contact</h1>
                <h5>Param {this.props.params.name}</h5>
            </div>
        );
    }
}

export default Contact;
