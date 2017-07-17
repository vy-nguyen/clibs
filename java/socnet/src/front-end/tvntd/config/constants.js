/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

export const htmlCodes = {
    spaceNoBreak: String.fromCharCode('\u00A0'),
    ocrCheck    : String.fromCharCode('\u2447')
};

export const errMesg = {
    loginRequired: 'You have to login to do that.',
    generic      : 'Something went wrong.',

    getErrorMsg: function(code) {
        return this[code] || this.generic;
    }
};

export const VntdGlob = {
    publicUuid: "00000000-ffff-0000-ffff-00ff00ff00ff"
};
