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

export const VConst = {
    ads  : 'sortedAds',
    blogs: 'sortedArticles',
    prods: 'sortedProducts',

    ad    : 'ads',
    blog  : 'blog',
    estore: 'estore',
};

Object.freeze(VConst);

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
    styleModal: {
        content: {
            top        : '50%',
            left       : '50%',
            right      : 'auto',
            bottom     : 'auto',
            marginRight: '-50%',
            transform  : 'translate(-50%, -50%)',
            overflowX  : 'auto',
            overflowY  : 'scroll',
            overflow   : 'scroll'
        }
    },
    styleMarker: {
        content: {
            top        : '50%',
            left       : '50%',
            right      : 'auto',
            bottom     : 'auto',
            marginRight: '-10%',
            transform  : 'translate(-50%, -50%)',
            overflowX  : 'auto',
            overflowY  : 'scroll',
            overflow   : 'scroll'
        }
    },
    styleBusMarker: {
        content: {
            top        : '30%',
            left       : '30%',
            right      : 'auto',
            bottom     : 'auto',
            marginRight: '-10%',
            transform  : 'translate(-30%, -30%)',
            overflow   : 'scroll',
            maxHeight  : '90vh'
        }
    },
    styleMap: {
        width   : '100vw',
        height  : '100vh',
        overflow: 'auto'
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

export const ColFmtMap = [
    "col-xs-12 col-sm-12 col-md-12 col-lg-12", // 0
    "col-xs-12 col-sm-12 col-md-12 col-lg-12", // 1
    "col-xs-6 col-sm-6 col-md-6 col-lg-6",     // 2
    "col-xs-4 col-sm-4 col-md-4 col-lg-4",     // 3
    "col-xs-3 col-sm-3 col-md-3 col-lg-3",     // 4
    "col-xs-2 col-sm-2 col-md-2 col-lg-2",     // 5
    "col-xs-2 col-sm-2 col-md-2 col-lg-2"      // 6
];
