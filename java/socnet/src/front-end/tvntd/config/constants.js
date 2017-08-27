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
    publicUuid: "00000000-ffff-0000-ffff-00ff00ff00ff",
    styleFit: {
        width    : "100%",
        height   : "auto",
        maxHeight: "200px"
    },
    styleLogo: {
        width : "30px",
        height: "30px"
    },
    logoSpan: {
        width     : "40px",
        marginTop : "9px",
        marginLeft: "9px"
    },
    styleContent: {
        margin  : "10px 10px 10px 10px",
        fontSize: "130%"
    },
    styleImg: {
        float  : "left",
        width  : "50%",
        height : "50%",
        padding: "5px"
    },
    styleWhiteOpaque: {
        background: "#ffffff",
        opacity   : "0.9"
    },
    styleFrame: {
        position: "absolute",
        top     : 0,
        left    : 0,
        border  : "none",
        width   : "100%",
        height  : "100%"
    },
    smallBox: {
        width : "60px",
        height: "60px"
    },
    spinner: {
        top   : "10%",
        width : 5,
        radius: 30,
        length: 20,
        color : "black"
    }
};
