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
import { VntdGlob }       from 'vntd-root/config/constants.js';

class AboutUs extends InputBase
{
    constructor(props) {
        let userUuid;

        super(props, _.uniqueId(), [BusinessStore]);
        this.style = {
            width  : "100%",
            height : "auto"
        };
    }

    render() {
        return (
            <div id="content">
                <img src="/rs/img/logo/quynh.png" style={this.style}/>
            </div>
        );
    }
}

export default AboutUs;
