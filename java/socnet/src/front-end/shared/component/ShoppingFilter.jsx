/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React          from 'react-mod';
import PropTypes      from 'prop-types';

import BoostFilter    from 'vntd-shared/component/BoostFilter.jsx';

let sampleData = [ {
    title : 'Woman',
    selKey: 'shop-woman',
    filter: [ {
        title : 'Jackets',
        selKey: 'woman-jacket'
    }, {
        title : 'Blazers',
        selKey: 'woman-blazer'
    }, {
        title : 'Suits',
        selKey: 'woman-suits'
    }, {
        title : 'Trousers',
        selKey: 'woman-trousers'
    }, {
        title : 'Jeans',
        selKey: 'woman-jeans'
    } ]
}, {
    title : 'Man',
    selKey: 'shop-man',
    filter: [ {
        title : 'Jackets',
        selKey: 'man-jacket'
    }, {
        title : 'Blazers',
        selKey: 'man-blazer'
    }, {
        title : 'Suits',
        selKey: 'man-suits'
    }, {
        title : 'Trousers',
        selKey: 'man-trousers'
    }, {
        title : 'Jeans',
        selKey: 'man-jeans'
    } ]
}, {
    title : 'Kids',
    selKey: 'shop-kids',
    filter: [ {
        title : 'Jackets',
        selKey: 'kids-jacket'
    }, {
        title : 'Blazers',
        selKey: 'kids-blazer'
    }, {
        title : 'Suits',
        selKey: 'kids-suits'
    }, {
        title : 'Trousers',
        selKey: 'kids-trousers'
    }, {
        title : 'Jeans',
        selKey: 'kids-jeans'
    } ]
} ];

class ShoppingFilter extends BoostFilter
{
    constructor(props) {
        super(props);
    }

    _getChildren(item) {
        return item.filter;
    }

    _getItemAttr(item) {
        return {
            keyId : item.selKey,
            viewId: item.selKey,
            text  : item.title
        };
    }

    _renderItem(item) {
        return <span>{item.title}</span>;
    }
}

ShoppingFilter.defaultProps = {
    items: sampleData
};

ShoppingFilter.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        title : PropTypes.string.isRequired,
        selKey: PropTypes.string.isRequired,
        filter: PropTypes.arrayOf(PropTypes.object)
    }))
};

export default ShoppingFilter;
