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
        prodCat    : PropTypes.string,
        prodPrice  : PropTypes.string,
        prodName   : PropTypes.string
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
