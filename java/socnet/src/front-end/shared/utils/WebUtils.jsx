/*
 * Written by Vy Nguyen (2017)
 */
'use strict';

import React           from 'react-mod';
import Spinner         from 'react-spinjs';
import {VntdGlob}      from 'vntd-root/config/constants.js';

class WebUtils
{
    static spinner() {
        return <Spinner config={VntdGlob.spinner}/>;
    }
}

export default WebUtils;
export { WebUtils }
