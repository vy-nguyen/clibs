/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import { EProductStore } from 'vntd-root/stores/ArticleStore.jsx';

class ProductBase extends React.Component
{
    constructor(props) {
        super(props);
        this._updateProd = this._updateProd.bind(this);
        this.state = {
            products: EProductStore.getProductsByAuthor(props.userUuid)
        };
    }

    componentDidMount() {
        this.unsub = EProductStore.listen(this._updateProd);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateProd(store, data, status, update) {
        let products, userUuid = this.props.userUuid;

        if (data == null || _.isEmpty(data) || !Array.isArray(data)) {
            return;
        }
        products = EProductStore.getProductsByAuthor(userUuid);
        if (products == null) {
            return;
        }
        if (this.state.products == null || products.length != this.state.products.length) {
            this.setState({
                products: products
            });
        }
    }
}

export default ProductBase;
