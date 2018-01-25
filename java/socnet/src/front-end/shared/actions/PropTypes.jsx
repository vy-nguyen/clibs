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
    })
};

export default GlobProps;
