/**
 * Copyright by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import PropTypes   from 'prop-types';

const GlobProps = {
    product: PropTypes.shape({
        prodTitle  : PropTypes.string.isRequired,
        prodDesc   : PropTypes.string.isRequired,
        articleUuid: PropTypes.string.isRequired,
        pictureUrl : PropTypes.arrayOf(PropTypes.string).isRequired,
        priceNotice: PropTypes.string,
        prodCat    : PropTypes.string,
        prodSpec   : PropTypes.string,
        prodPrice  : PropTypes.string,
        prodName   : PropTypes.string,
        prodDetail : PropTypes.string,
        prodTags   : PropTypes.arrayOf(PropTypes.string)
    }),
    prodBrief: PropTypes.shape({
        logoImg    : PropTypes.string.isRequired,
        logoWidth  : PropTypes.number,
        logoHeight : PropTypes.number,
        logoTag    : PropTypes.string,
        likeStat   : PropTypes.object,
        articleUuid: PropTypes.string,
        prodPrice  : PropTypes.string.isRequired,
        rating     : PropTypes.number,
        prodName   : PropTypes.string.isRequired,
        prodCat    : PropTypes.string,
        prodDesc   : PropTypes.string.isRequired
    }),
    treeItem: PropTypes.shape({
        children : PropTypes.arrayOf(PropTypes.object),
        defLabel : PropTypes.bool,
        renderFn : PropTypes.func,
        itemCount: PropTypes.bool,
        expanded : PropTypes.bool
    })
};

export default GlobProps;
