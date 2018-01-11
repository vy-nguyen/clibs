/**
 * Written by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';
import {Link}         from 'react-router';

import ComponentBase  from 'vntd-shared/layout/ComponentBase.jsx';
import BusinessStore  from 'vntd-root/stores/BusinessStore.jsx';

class ShowCase extends ComponentBase
{
    constructor(props) {
        super(props, null, [BusinessStore]);
        this.state = null;
    }

    _updateState(store, data, item, code) {
    }

    render() {
        return (
            <div className="custom-showcase custom-showcase__1">
                    <div className="thumbnail">
                        <img src="//cdn.shopify.com/s/files/1/0637/5285/t/2/assets/custom_showcase1_img.png" alt=""/>
                        <h2>Free</h2>
                        <h4>Shipping</h4>
                        <h6>on orders over $99</h6>
                    </div>
            </div>
        );
    }
}

export default ShowCase;
